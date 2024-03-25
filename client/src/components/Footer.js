import React from "react";
import logo from "../assets/img/moneymagnet-logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-magnetic-grey text-gray-900">
            <div className="container px-6 py-12 mx-auto">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Support Section */}
                    <div>
                        <p className="font-semibold text-gray-800">Support</p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    to="/support/faq"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/support/ai-advisor"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    AI Advisor Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <p className="font-semibold text-gray-800">
                            Quick Links
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    to="/cashflow-ninjas-app"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/goals"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Goals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/budgets"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Budgets
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us Section */}
                    <div>
                        <p className="font-semibold text-gray-800">Follow Us</p>
                    </div>

                    {/* User Management Section */}
                    <div>
                        <p className="font-semibold text-gray-800">
                            User Management
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    to="/auth/login"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/auth/register"
                                    className="text-gray-600 hover:text-money-green"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="flex items-center justify-between">
                    {/* Company Logo and Name */}
                    <a className="flex items-center" href="/">
                        <img
                            className="w-auto h-8"
                            src={logo}
                            alt="Money Magnet Logo"
                        />
                        <span className="ml-3 text-xl font-semibold text-gray-800">
                            Money Magnet
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
