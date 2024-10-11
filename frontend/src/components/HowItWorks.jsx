import { HOW_IT_WORKS_CONTENT } from "../constants"
import { KEY_FEATURES_CONTENT } from "../constants"


const HowItWorks = () => {
  return (
    <section id="works">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 border-t border-neutral-800">
                <h2 className="text-3xl lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
                    {HOW_IT_WORKS_CONTENT.sectionTitle}
                </h2>
                <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
                    {HOW_IT_WORKS_CONTENT.sectionDescription}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOW_IT_WORKS_CONTENT.steps.map((step, index) => (
                    <div key={index} className="bg-neutral-900 p-6 rounded-xl shadow-lg flex flex-xol justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                            <p className="text-neutral-400 mb-4">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20">
            <div className="text-center mb-12 border-t border-neutral-800">
                <h2 className="lg:text-5xl mt-20 tracking-tighter bg-gradient-to-t from-neutral-50 via-neutral-300 to-neutral-600 bg-clip-text text-transparent">
                    {KEY_FEATURES_CONTENT.sectionTitle}
                </h2>
                <p className="mt-4">
                    {KEY_FEATURES_CONTENT.sectionDescription}
                </p>
            </div>
            <div className="flex flex-wrap justify-between">
                {KEY_FEATURES_CONTENT.features.map((feature)=> (
                    <div key={feature.id} className="flex flex-col items-center text-center w-full md:w-1/2 lg:w-1/3 p-6">
                            <div className="flex justify-center items-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl">{feature.title}</h3>
                            <p className="mt-2 text-neutral-400">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default HowItWorks