import React from "react";
import "../index.css";

function InfoSection() {
    const staticFeatures = [
        {
            title: "User-Friendly Design",
            description:
                "Designed with the user in mind, our platform offers an intuitive interface that simplifies your financial management.",
        },
        {
            title: "Sustainable Solutions",
            description:
                "We're committed to enhancing financial literacy and empowerment with innovative, sustainable solutions.",
        },
        {
            title: "Cutting-Edge Performance",
            description:
                "Experience unparalleled insights and performance with the latest technology integrated into our services.",
        },
    ];

    return (
        <div className="bg-magnetic-grey py-16">
            {" "}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {staticFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="lg:col-span-1 p-6 rounded-lg shadow-md bg-white"
                        >
                            {" "}
                            <h3 className="text-xl font-staatliches text-money-green mb-2">
                                {" "}
                                {feature.title}
                            </h3>
                            <p className="text-base font-rubik text-gray-600">
                                {" "}
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InfoSection;
