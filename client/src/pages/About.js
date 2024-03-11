import React from "react";
import MoneyMagnetLogo from "../assets/img/moneymagnet-logo.png";

function About() {
    return (
        <div className="bg-white text-gray-900">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center">
                    <img
                        src={MoneyMagnetLogo}
                        alt="Money Magnet logo"
                        className="mx-auto h-24 w-24"
                    />
                    <h1 className="mt-4 text-3xl font-staatliches tracking-tight text-money-green sm:text-4xl">
                        About Money Magnet
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg font-rubik text-magnetic-grey">
                        Empowering Your Financial Journey with Innovation and
                        Security.
                    </p>
                </div>

                {/* Content */}
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Mission Statement */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-staatliches text-forest-green">
                            Our Mission
                        </h2>
                        <p className="font-rubik text-gray-600">
                            At Money Magnet, we're dedicated to simplifying
                            financial management through innovative technology,
                            providing you with the tools to achieve financial
                            well-being.
                        </p>
                    </div>

                    {/* Vision Statement */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-staatliches text-forest-green">
                            Our Vision
                        </h2>
                        <p className="font-rubik text-gray-600">
                            Our vision is to become a leading force in financial
                            technology by creating accessible, user-friendly
                            solutions that empower individuals and businesses to
                            thrive.
                        </p>
                    </div>

                    {/* Values */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-staatliches text-forest-green">
                            Our Values
                        </h2>
                        <ul className="list-disc pl-5 font-rubik text-gray-600">
                            <li>Innovation and Excellence</li>
                            <li>Customer-Centricity</li>
                            <li>Integrity and Transparency</li>
                            <li>Commitment to Accessibility</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
