module betting_platform {
    use std::vector;
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    // Error definitions
    const E_NOT_AUTHORIZED: u64 = 0;
    const E_INSUFFICIENT_FUNDS: u64 = 1;
    const E_EVENT_ALREADY_STARTED: u64 = 2;
    const E_EVENT_NOT_FINALIZED: u64 = 3;
    const E_BET_ALREADY_SETTLED: u64 = 4;
    const E_EVENT_NOT_FOUND: u64 = 5;
    const E_BET_NOT_FOUND: u64 = 6;

    struct Bet has store, drop {
        user: address,
        event_id: u64,
        amount: u64,
        prediction: bool,
        settled: bool,
    }

    struct Event has store, drop {
        id: u64,
        description: vector<u8>,
        start_time: u64,
        is_finalized: bool,
        result: bool,
    }

    struct EventStore has key {
        events: Table<u64, Event>,
        next_event_id: u64,
    }

    struct BetStore has key {
        bets: vector<Bet>,
    }

    struct PlatformConfig has key {
        admin: address,
        liquidity_pool: address,
        treasury: address,
    }

    public fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<EventStore>(account_addr), 0);
        assert!(!exists<BetStore>(account_addr), 0);
        assert!(!exists<PlatformConfig>(account_addr), 0);

        move_to(account, EventStore { 
            events: table::new(), 
            next_event_id: 0 
        });
        move_to(account, BetStore { bets: vector::empty() });
        move_to(account, PlatformConfig { 
            admin: account_addr,
            liquidity_pool: account_addr,
            treasury: account_addr,
        });
    }

    public fun add_liquidity(account: &signer, amount: u64) acquires PlatformConfig {
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(signer::address_of(account) == config.admin, E_NOT_AUTHORIZED);
        coin::transfer<coin::AptosCoin>(account, config.liquidity_pool, amount);
    }

    public fun withdraw_liquidity(account: &signer, amount: u64) acquires PlatformConfig {
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(signer::address_of(account) == config.admin, E_NOT_AUTHORIZED);
        coin::transfer<coin::AptosCoin>(account, config.admin, amount);
    }

    public fun place_bet(account: &signer, event_id: u64, bet_amount: u64, user_prediction: bool) 
    acquires EventStore, BetStore, PlatformConfig {
        let user = signer::address_of(account);
        let config = borrow_global<PlatformConfig>(@betting_platform);
        let fee = bet_amount * 2 / 100;
        let net_bet = bet_amount - fee;

        coin::transfer<coin::AptosCoin>(account, config.treasury, fee);
        coin::transfer<coin::AptosCoin>(account, config.liquidity_pool, net_bet);

        let bet = Bet {
            user,
            event_id,
            amount: net_bet,
            prediction: user_prediction,
            settled: false,
        };

        let bet_store = borrow_global_mut<BetStore>(@betting_platform);
        vector::push_back(&mut bet_store.bets, bet);
    }

    public entry fun settle_event(
    account: &signer,
    event_id: u64,
    outcome: bool,
) acquires BettingPlatform, UserWallet {
    let account_addr = signer::address_of(account);
    let betting_platform = borrow_global_mut<BettingPlatform>(@betting_platform_addr);
    assert!(account_addr == betting_platform.admin, E_NOT_ADMIN);
    assert!(table::contains(&betting_platform.events, event_id), E_EVENT_NOT_FOUND);

    let event = table::borrow_mut(&mut betting_platform.events, event_id);
    assert!(option::is_none(&event.outcome), E_EVENT_ALREADY_SETTLED);
    assert!(timestamp::now_seconds() >= event.end_time, E_EVENT_NOT_ENDED);

    event.outcome = option::some(outcome);

    let i = 0;
    while (i < betting_platform.next_bet_id) {
        if (table::contains(&betting_platform.bets, i)) {
            let bet = table::borrow_mut(&mut betting_platform.bets, i);
            if (bet.event_id == event_id && !bet.settled) {
                let user_wallet = borrow_global_mut<UserWallet>(bet.user);
                if (bet.prediction == outcome) {
                    let winnings = (bet.amount * bet.odds) / 100;
                    if (bet.is_virtual) {
                        user_wallet.virtual_balance = user_wallet.virtual_balance + winnings;
                    } else {
                        let payment = coin::withdraw<AptosCoin>(account, winnings);
                        coin::deposit(bet.user, payment);
                    };
                };
                bet.settled = true;
            };
        };
        i = i + 1;
    };
}

    public fun cancel_bet(account: &signer, bet_id: u64) acquires BetStore, EventStore, PlatformConfig {
        let user = signer::address_of(account);
        let bet_store = borrow_global_mut<BetStore>(@betting_platform);
        let bet = vector::borrow_mut(&mut bet_store.bets, bet_id);
        assert!(bet.user == user, E_NOT_AUTHORIZED);
        assert!(!bet.settled, E_BET_ALREADY_SETTLED);

        let event_store = borrow_global<EventStore>(@betting_platform);
        let event = table::borrow(&event_store.events, bet.event_id);
        assert!(event.start_time > timestamp::now_microseconds(), E_EVENT_ALREADY_STARTED);

        let config = borrow_global<PlatformConfig>(@betting_platform);
        coin::transfer<coin::AptosCoin>(account, user, bet.amount);

        bet.settled = true;
    }

    public fun settle_bet(account: &signer, bet_id: u64) acquires BetStore, EventStore, PlatformConfig {
        let bet_store = borrow_global_mut<BetStore>(@betting_platform);
        let bet = vector::borrow_mut(&mut bet_store.bets, bet_id);
        assert!(!bet.settled, E_BET_ALREADY_SETTLED);

        let event_store = borrow_global<EventStore>(@betting_platform);
        let event = table::borrow(&event_store.events, bet.event_id);
        assert!(event.is_finalized, E_EVENT_NOT_FINALIZED);

        let config = borrow_global<PlatformConfig>(@betting_platform);
        if (bet.prediction == event.result) {
            let winnings = bet.amount * 188 / 100;
            coin::transfer<coin::AptosCoin>(account, bet.user, winnings);
        };
        bet.settled = true;
    }

    public fun add_event(account: &signer, description: vector<u8>, start_time: u64) acquires EventStore, PlatformConfig {
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(signer::address_of(account) == config.admin, E_NOT_AUTHORIZED);
        
        let event_store = borrow_global_mut<EventStore>(@betting_platform);
        let event_id = event_store.next_event_id;
        event_store.next_event_id = event_id + 1;

        let event = Event {
            id: event_id,
            description,
            start_time,
            is_finalized: false,
            result: false,
        };

        table::add(&mut event_store.events, event_id, event);
    }

    public fun update_event(account: &signer, event_id: u64, new_description: vector<u8>) acquires EventStore, PlatformConfig {
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(signer::address_of(account) == config.admin, E_NOT_AUTHORIZED);
        
        let event_store = borrow_global_mut<EventStore>(@betting_platform);
        let event = table::borrow_mut(&mut event_store.events, event_id);
        event.description = new_description;
    }

    public fun finalize_event(account: &signer, event_id: u64, result: bool) acquires EventStore, PlatformConfig {
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(signer::address_of(account) == config.admin, E_NOT_AUTHORIZED);
        
        let event_store = borrow_global_mut<EventStore>(@betting_platform);
        let event = table::borrow_mut(&mut event_store.events, event_id);
        event.is_finalized = true;
        event.result = result;
    }

    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use aptos_framework::coin::{Self, create_fake_money};
    #[test_only]
    use aptos_framework::timestamp;

    #[test(admin = @0x123, user1 = @0x456, user2 = @0x789)]
    public fun test_betting_platform_full(admin: &signer, user1: &signer, user2: &signer) acquires EventStore, BetStore, PlatformConfig {
        // Setup
        create_account_for_test(signer::address_of(admin));
        create_account_for_test(signer::address_of(user1));
        create_account_for_test(signer::address_of(user2));
        timestamp::set_time_has_started_for_testing(admin);

        // Test initialization
        test_initialize(admin);

        // Test adding and withdrawing liquidity
        test_liquidity(admin);

        // Test adding and updating events
        test_events(admin);

        // Test placing bets
        test_place_bets(admin, user1, user2);

        // Test cancelling bets
        test_cancel_bet(admin, user1);

        // Test finalizing events and settling bets
        test_finalize_and_settle(admin, user1, user2);
    }

    #[test_only]
    fun test_initialize(admin: &signer) acquires EventStore, BetStore, PlatformConfig {
        initialize(admin);

        assert!(exists<EventStore>(@betting_platform), 1);
        assert!(exists<BetStore>(@betting_platform), 1);
        assert!(exists<PlatformConfig>(@betting_platform), 1);

        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(config.admin == signer::address_of(admin), 1);
        assert!(config.liquidity_pool == @betting_platform, 1);
        assert!(config.treasury == @betting_platform, 1);
    }

    #[test_only]
    fun test_liquidity(admin: &signer) acquires PlatformConfig {
        create_fake_money(admin, 1000000);

        // Test adding liquidity
        add_liquidity(admin, 500000);
        assert!(coin::balance<coin::AptosCoin>(@betting_platform) == 500000, 1);

        // Test withdrawing liquidity
        withdraw_liquidity(admin, 200000);
        assert!(coin::balance<coin::AptosCoin>(@betting_platform) == 300000, 1);

        // Test unauthorized liquidity operations
        let fake_admin = account::create_account_for_test(@0x999);
        assert!(!add_liquidity(&fake_admin, 100000), E_NOT_AUTHORIZED);
        assert!(!withdraw_liquidity(&fake_admin, 100000), E_NOT_AUTHORIZED);
    }

    #[test_only]
    fun test_events(admin: &signer) acquires EventStore, PlatformConfig {
        let current_time = timestamp::now_microseconds();

        // Test adding an event
        add_event(admin, b"Test Event 1", current_time + 3600000000);
        let event_store = borrow_global<EventStore>(@betting_platform);
        assert!(table::contains(&event_store.events, 0), 1);
        assert!(event_store.next_event_id == 1, 1);

        // Test updating an event
        update_event(admin, 0, b"Updated Test Event 1");
        let updated_event = table::borrow(&event_store.events, 0);
        assert!(updated_event.description == b"Updated Test Event 1", 1);

        // Test unauthorized event operations
        let fake_admin = account::create_account_for_test(@0x999);
        assert!(!add_event(&fake_admin, b"Unauthorized Event", current_time + 3600000000), E_NOT_AUTHORIZED);
        assert!(!update_event(&fake_admin, 0, b"Unauthorized Update"), E_NOT_AUTHORIZED);
    }

    #[test_only]
    fun test_place_bets(admin: &signer, user1: &signer, user2: &signer) acquires EventStore, BetStore, PlatformConfig {
        create_fake_money(user1, 100000);
        create_fake_money(user2, 100000);

        // Place bets
        place_bet(user1, 0, 10000, true);
        place_bet(user2, 0, 20000, false);

        let bet_store = borrow_global<BetStore>(@betting_platform);
        assert!(vector::length(&bet_store.bets) == 2, 1);

        let bet1 = vector::borrow(&bet_store.bets, 0);
        assert!(bet1.user == signer::address_of(user1), 1);
        assert!(bet1.amount == 9800, 1); // 10000 - 2% fee
        assert!(bet1.prediction == true, 1);

        let bet2 = vector::borrow(&bet_store.bets, 1);
        assert!(bet2.user == signer::address_of(user2), 1);
        assert!(bet2.amount == 19600, 1); // 20000 - 2% fee
        assert!(bet2.prediction == false, 1);

        // Check treasury and liquidity pool balances
        let config = borrow_global<PlatformConfig>(@betting_platform);
        assert!(coin::balance<coin::AptosCoin>(config.treasury) == 600, 1); // 2% of 30000
        assert!(coin::balance<coin::AptosCoin>(config.liquidity_pool) == 329400, 1); // 300000 (initial) + 29400 (bets)
    }

    #[test_only]
    fun test_cancel_bet(admin: &signer, user1: &signer) acquires EventStore, BetStore, PlatformConfig {
        // Try to cancel bet after event has started (should fail)
        timestamp::fast_forward_seconds(3601);
        assert!(!cancel_bet(user1, 0), E_EVENT_ALREADY_STARTED);

        // Reset time and try to cancel bet (should succeed)
        timestamp::set_time_has_started_for_testing(admin);
        cancel_bet(user1, 0);

        let bet_store = borrow_global<BetStore>(@betting_platform);
        let cancelled_bet = vector::borrow(&bet_store.bets, 0);
        assert!(cancelled_bet.settled == true, 1);

        // Try to cancel an already settled bet (should fail)
        assert!(!cancel_bet(user1, 0), E_BET_ALREADY_SETTLED);

        // Try to cancel another user's bet (should fail)
        let fake_user = account::create_account_for_test(@0x999);
        assert!(!cancel_bet(&fake_user, 1), E_NOT_AUTHORIZED);
    }

    #[test_only]
    fun test_finalize_and_settle(admin: &signer, user1: &signer, user2: &signer) acquires EventStore, BetStore, PlatformConfig {
        // Finalize event
        finalize_event(admin, 0, true);

        let event_store = borrow_global<EventStore>(@betting_platform);
        let finalized_event = table::borrow(&event_store.events, 0);
        assert!(finalized_event.is_finalized == true, 1);
        assert!(finalized_event.result == true, 1);

        // Settle bets
        settle_bet(admin, 1); // User2's bet (prediction: false)

        let bet_store = borrow_global<BetStore>(@betting_platform);
        let settled_bet = vector::borrow(&bet_store.bets, 1);
        assert!(settled_bet.settled == true, 1);

        // Check balances after settlement
        let config = borrow_global<PlatformConfig>(@betting_platform);
        let user2_balance = coin::balance<coin::AptosCoin>(signer::address_of(user2));
        assert!(user2_balance == 80000, 1); // Initial 100000 - 20000 (bet amount)

        // Try to settle an already settled bet (should fail)
        assert!(!settle_bet(admin, 1), E_BET_ALREADY_SETTLED);

        // Try to settle a bet for an unfinalized event (should fail)
        add_event(admin, b"Test Event 2", timestamp::now_microseconds() + 3600000000);
        place_bet(user1, 1, 5000, true);
        assert!(!settle_bet(admin, 2), E_EVENT_NOT_FINALIZED);
    }

    #[test(admin = @0x123)]
    #[expected_failure(abort_code = E_NOT_AUTHORIZED)]
    public fun test_unauthorized_liquidity_addition(admin: &signer) acquires PlatformConfig {
        initialize(admin);
        let fake_admin = account::create_account_for_test(@0x999);
        add_liquidity(&fake_admin, 100000);
    }

    #[test(admin = @0x123)]
    #[expected_failure(abort_code = E_INSUFFICIENT_FUNDS)]
    public fun test_insufficient_funds_liquidity_withdrawal(admin: &signer) acquires PlatformConfig {
        initialize(admin);
        create_fake_money(admin, 1000000);
        add_liquidity(admin, 500000);
        withdraw_liquidity(admin, 1000000); // Try to withdraw more than available
    }

    #[test(admin = @0x123, user = @0x456)]
    #[expected_failure(abort_code = E_EVENT_NOT_FOUND)]
    public fun test_bet_on_nonexistent_event(admin: &signer, user: &signer) acquires EventStore, BetStore, PlatformConfig {
        initialize(admin);
        create_fake_money(user, 100000);
        place_bet(user, 999, 10000, true); // Bet on non-existent event
    }

    #[test(admin = @0x123, user = @0x456)]
    #[expected_failure(abort_code = E_INSUFFICIENT_FUNDS)]
    public fun test_bet_with_insufficient_funds(admin: &signer, user: &signer) acquires EventStore, BetStore, PlatformConfig {
        initialize(admin);
        create_fake_money(user, 1000);
        add_event(admin, b"Test Event", timestamp::now_microseconds() + 3600000000);
        place_bet(user, 0, 10000, true); // Try to bet more than available balance
    }
}