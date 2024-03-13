import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import moneyMagnetImage from "../assets/img/moneymagnet-logo.png";

function HeroSection() {
    return (
        <div className="bg-magnetic-grey dark:bg-forest-green">
            <div className="border-b dark:border-gray-700">
                <div className="container m-auto px-6 pt-24 md:px-12 lg:pt-[4.8rem] lg:px-7">
                    <div className="grid lg:grid-cols-2 items-center gap-12 px-2 md:px-0">
                        <div className="col-span-1">
                            <div className="relative w-full">
                                <img
                                    src={moneyMagnetImage}
                                    alt="Empower Your Financial Journey"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="relative col-span-1">
                            <h1 className="font-staatliches text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-money-green dark:text-magnetic-plum">
                                Elevate Your
                            </h1>
                            <h1 className="font-staatliches text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-money-green dark:text-magnetic-plum">
                                <span className="inline-block text-mint-green">
                                    <Typewriter
                                        words={[
                                            "Finances",
                                            "Literacy",
                                            "Freedom",
                                            "Future",
                                        ]}
                                        loop={Infinity}
                                        cursor
                                        cursorStyle="|"
                                        typeSpeed={240}
                                        deleteSpeed={100}
                                        delaySpeed={1000}
                                    />
                                </span>
                            </h1>
                            <div className="mt-8 lg:mt-16 space-y-8">
                                <p className="text-gray-700 dark:text-gray-300">
                                    Experience the future of financial
                                    management with Money Magnet. Dive into a
                                    world where financial literacy and
                                    well-being are within everyone's reach.
                                </p>
                                <div className="flex space-x-4 mt-6">
                                    <Link
                                        to="/dashboard"
                                        className="w-full py-3 px-6 text-center rounded-full transition duration-300 bg-money-green hover:bg-forest-green active:bg-mint-green focus:bg-forest-green sm:w-max mb-4 text-white text-sm"
                                        title="Get Started"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="w-full py-3 px-6 text-center rounded-full transition border border-gray-200 dark:border-gray-700 sm:w-max mb-4 text-gray-800 text-sm dark:text-white"
                                        title="Learn More"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
// Fake comment for commit. 
export default HeroSection;
