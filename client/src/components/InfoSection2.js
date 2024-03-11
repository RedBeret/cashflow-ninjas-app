import React from "react";
import moneyMagnetImage from "../assets/img/moneymagnet-logo.png";

const features = [
    {
        name: "Accessibility",
        description: "24/7 access to your financial dashboard from any device.",
    },
    {
        name: "Security",
        description:
            "Top-tier encryption and secure processes to protect your data.",
    },
    {
        name: "Customization",
        description:
            "Personalized insights and recommendations to enhance your financial health.",
    },
    {
        name: "Integration",
        description:
            "Seamless connection with your existing bank accounts and financial services.",
    },
    {
        name: "Support",
        description:
            "Dedicated support team focused on empowering your financial journey.",
    },
    {
        name: "Innovation",
        description:
            "Continuously updated features based on cutting-edge financial technology research.",
    },
];

export default function InfoSection2() {
    return (
        <div className="bg-magnetic-grey">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div>
                    <h2 className="text-3xl font-staatliches tracking-tight text-money-green sm:text-4xl">
                        Empower Your Finance
                    </h2>
                    <p className="mt-4 text-gray-500">
                        Discover how Money Magnet is revolutionizing the way
                        individuals manage and interact with their finances,
                        enabling smarter decisions and a healthier financial
                        future.
                    </p>

                    <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="border-t border-gray-200 pt-4"
                            >
                                <dt className="font-bold text-gray-900">
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-sm font-rubik text-gray-500">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div>
                    <img
                        src={moneyMagnetImage}
                        alt="Money Magnet showcasing innovative financial management."
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}
