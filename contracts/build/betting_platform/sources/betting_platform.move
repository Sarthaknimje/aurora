module betting_platform_addr::betting_platform {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use std::option::{Self, Option};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_ADMIN: u64 = 3;
    const E_EVENT_NOT_FOUND: u64 = 4;
    const E_INSUFFICIENT_BALANCE: u64 = 5;
    const E_EVENT_ALREADY_SETTLED: u64 = 6;
    const E_EVENT_NOT_ENDED: u64 = 7;

    // Constants
    const DEFAULT_ODDS: u64 = 188; // 1.88x
    const FEE_PERCENTAGE: u64 = 2; // 2%

    struct BettingPlatform has key {
        events: Table<u64, Event>,
        bets: Table<u64, Bet>,
        next_event_id: u64,
        next_bet_id: u64,
        admin: address,
    }

    struct UserWallet has key {
        virtual_balance: u64,
        real_balance: Coin<AptosCoin>,
    }

    struct Event has store, drop, copy {
        id: u64,
        description: vector<u8>,
        end_time: u64,
        outcome: Option<bool>,
        total_bets: u64,
        total_amount: u64,
    }

    struct Bet has store, drop, copy {
        id: u64,
        user: address,
        event_id: u64,
        amount: u64,
        prediction: bool,
        odds: u64,
        is_virtual: bool,
        settled: bool,
    }

   public fun initialize(account: &signer) {
    let account_addr = signer::address_of(account);
    assert!(account_addr == @betting_platform_addr, E_NOT_ADMIN);
    assert!(!exists<BettingPlatform>(@betting_platform_addr), E_ALREADY_INITIALIZED);

    move_to(account, BettingPlatform {
        events: table::new(),
        bets: table::new(),
        next_event_id: 0,
        next_bet_id: 0,
        admin: account_addr,
    });
}

    public entry fun create_wallet(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<UserWallet>(account_addr)) {
            move_to(account, UserWallet {
                virtual_balance: 1000000, // Start with 1000 virtual USDT
                real_balance: coin::zero<AptosCoin>(),
            });
        };
    }

    public entry fun create_event(
        account: &signer,
        description: vector<u8>,
        end_time: u64,
    ) acquires BettingPlatform {
        let account_addr = signer::address_of(account);
        let betting_platform = borrow_global_mut<BettingPlatform>(@betting_platform_addr);
        assert!(account_addr == betting_platform.admin, E_NOT_ADMIN);

        let event_id = betting_platform.next_event_id;
        table::add(&mut betting_platform.events, event_id, Event {
            id: event_id,
            description,
            end_time,
            outcome: option::none(),
            total_bets: 0,
            total_amount: 0,
        });
        betting_platform.next_event_id = event_id + 1;
    }

public entry fun place_bet(
    account: &signer,
    event_id: u64,
    amount: u64,
    prediction: bool,
    is_virtual: bool
) acquires BettingPlatform, UserWallet {
    let account_addr = signer::address_of(account);
    let betting_platform = borrow_global_mut<BettingPlatform>(@betting_platform_addr);
    // ... rest of the function remains the same

        assert!(table::contains(&betting_platform.events, event_id), E_EVENT_NOT_FOUND);

        let event = table::borrow_mut(&mut betting_platform.events, event_id);
        assert!(option::is_none(&event.outcome), E_EVENT_ALREADY_SETTLED);
        assert!(timestamp::now_seconds() < event.end_time, E_EVENT_ALREADY_SETTLED);

        let user_wallet = borrow_global_mut<UserWallet>(account_addr);
        let fee = (amount * FEE_PERCENTAGE) / 100;
        let bet_amount = amount - fee;

        if (is_virtual) {
            assert!(user_wallet.virtual_balance >= amount, E_INSUFFICIENT_BALANCE);
            user_wallet.virtual_balance = user_wallet.virtual_balance - amount;
        } else {
            assert!(coin::value(&user_wallet.real_balance) >= amount, E_INSUFFICIENT_BALANCE);
            let payment = coin::extract(&mut user_wallet.real_balance, amount);
            coin::deposit(account_addr, payment);
        };

        let bet_id = betting_platform.next_bet_id;
        table::add(&mut betting_platform.bets, bet_id, Bet {
            id: bet_id,
            user: account_addr,
            event_id,
            amount: bet_amount,
            prediction,
            odds: DEFAULT_ODDS,
            is_virtual,
            settled: false,
        });
        betting_platform.next_bet_id = bet_id + 1;

        event.total_bets = event.total_bets + 1;
        event.total_amount = event.total_amount + bet_amount;
    }

    public entry fun settle_event(
        account: &signer,
        event_id: u64,
        outcome: bool,
    ) acquires BettingPlatform, UserWallet {
        let account_addr = signer::address_of(account);
        let betting_platform = borrow_global_mut<BettingPlatform>(account_addr);
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

    #[view]
    public fun get_event(event_id: u64): Event acquires BettingPlatform {
        let betting_platform = borrow_global<BettingPlatform>(@betting_platform_addr);
        assert!(table::contains(&betting_platform.events, event_id), E_EVENT_NOT_FOUND);
        *table::borrow(&betting_platform.events, event_id)
    }

    #[view]
    public fun get_user_bets(user: address): vector<Bet> acquires BettingPlatform {
        let betting_platform = borrow_global<BettingPlatform>(@betting_platform_addr);
        let user_bets = vector::empty<Bet>();
        let i = 0;
        while (i < betting_platform.next_bet_id) {
            if (table::contains(&betting_platform.bets, i)) {
                let bet = table::borrow(&betting_platform.bets, i);
                if (bet.user == user) {
                    vector::push_back(&mut user_bets, *bet);
                };
            };
            i = i + 1;
        };
        user_bets
    }

    #[view]
    public fun get_user_wallet(user: address): (u64, u64) acquires UserWallet {
        let user_wallet = borrow_global<UserWallet>(user);
        (user_wallet.virtual_balance, coin::value(&user_wallet.real_balance))
    }

    #[test_only]
public fun initialize_for_testing(account: &signer) {
    initialize(account);
}
   #[test(betting_platform_addr = @betting_platform_addr, user = @0x123, aptos_framework = @aptos_framework)]
public entry fun test_betting_flow(betting_platform_addr: &signer, user: &signer, aptos_framework: &signer) acquires BettingPlatform, UserWallet {
    // Initialize the aptos_framework for testing
    timestamp::set_time_has_started_for_testing(aptos_framework);

    // Initialize the betting platform
    initialize(betting_platform_addr);

    // Create a wallet for the user
    create_wallet(user);

    // Create an event
    create_event(betting_platform_addr, b"Will Trump cross 1M YouTube subscribers?", 1000000000);

    // Place a bet
    place_bet(user, 0, 100, true, true);

    // ... rest of the test function remains the same


    // Verify the bet was placed correctly
    let user_bets = get_user_bets(signer::address_of(user));
    assert!(vector::length(&user_bets) == 1, 0);
    let bet = vector::borrow(&user_bets, 0);
    assert!(bet.amount == 98, 1); // 100 - 2% fee
    assert!(bet.prediction == true, 2);
    assert!(bet.is_virtual == true, 3);

    // Set the time to after the event end time
    timestamp::fast_forward_seconds(1000000001);

    // Settle the event
    settle_event(betting_platform_addr, 0, true);

    // Verify the user's wallet balance after winning
    let (virtual_balance, _) = get_user_wallet(signer::address_of(user));
    assert!(virtual_balance == 1000000 + (98 * 188 / 100) - 100, 4);

    // Verify the event is settled
    let event = get_event(0);
    assert!(option::is_some(&event.outcome), 5);
    assert!(*option::borrow(&event.outcome) == true, 6);
}}