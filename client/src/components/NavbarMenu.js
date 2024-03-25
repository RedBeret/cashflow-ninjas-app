import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { logoutUser } from "../store/actions/authActions";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import logos from "../assets/img/moneymagnet-logo.png";

// Main component
export default function NavbarMenu() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogout = () => {
        dispatch(logoutUser(history));
    };

    const handleCloseMenu = () => {
        setOpen(false);
    };

    return (
        <div className="bg-white text-gray-900">
            {/* Mobile menu */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-hidden"
                    onClose={setOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-md">
                            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Menu</h2>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setOpen(false)}
                                >
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <div className="py-4 px-4">
                                <nav className="space-y-4">
                                    <Link
                                        to="/cashflow-ninjas-app"
                                        onClick={handleCloseMenu}
                                        className="block text-gray-800 hover:text-gray-900"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/about"
                                        onClick={handleCloseMenu}
                                        className="block text-gray-800 hover:text-gray-900"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        onClick={handleCloseMenu}
                                        className="block text-gray-800 hover:text-gray-900"
                                    >
                                        Contact
                                    </Link>
                                    {isAuthenticated && (
                                        <Link
                                            to="/techsupport"
                                            onClick={handleCloseMenu}
                                            className="block text-gray-800 hover:text-gray-900"
                                        >
                                            Tech Support
                                        </Link>
                                    )}
                                    {isAuthenticated ? (
                                        <>
                                            <button
                                                onClick={handleLogout}
                                                className="block text-gray-800 hover:text-gray-900"
                                            >
                                                Log Out
                                            </button>
                                            <Link
                                                to="/auth/updatepassword"
                                                onClick={handleCloseMenu}
                                                className="block text-gray-800 hover:text-gray-900"
                                            >
                                                Change Password
                                            </Link>
                                            <Link
                                                to="/auth/closeaccount"
                                                onClick={handleCloseMenu}
                                                className="block text-gray-800 hover:text-gray-900"
                                            >
                                                Delete Account
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/auth/login"
                                                onClick={handleCloseMenu}
                                                className="block text-gray-800 hover:text-gray-900"
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                to="/auth/register"
                                                onClick={handleCloseMenu}
                                                className="block text-gray-800 hover:text-gray-900"
                                            >
                                                Create account
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>

            <header className="bg-coolGray">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <button
                            type="button"
                            className="rounded-md p-2 text-gray-400 lg:hidden"
                            onClick={() => setOpen(true)}
                        >
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="flex lg:ml-0">
                            <img
                                className="h-8 w-auto"
                                src={logos}
                                alt="Money Magnet logo"
                            />
                            <span className="ml-3 text-xl font-semibold">
                                Money Magnet
                            </span>
                        </div>
                        <div className="hidden lg:flex lg:space-x-8">
                            <Link
                                to="/cashflow-ninjas-app"
                                className="flex items-center text-sm font-medium text-black hover:text-gray-300 ml-4" // Added ml-4 for left margin
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className="flex items-center text-sm font-medium text-black hover:text-gray-300"
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="flex items-center text-sm font-medium text-black hover:text-gray-300"
                            >
                                Contact
                            </Link>
                        </div>

                        <div className="ml-auto flex items-center">
                            <div className="flex lg:ml-6">
                                <MagnifyingGlassIcon
                                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="hidden lg:flex lg:items-center lg:space-x-6">
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to="/auth/login"
                                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            to="/auth/register"
                                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                        >
                                            Create account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
