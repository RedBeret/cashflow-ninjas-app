import React from "react";

function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-magnetic-grey rounded-lg shadow-md mb-4">
            <h1 className="font-headline text-h1 text-money-green text-center mb-8">
                Contact Money Magnet
            </h1>
            <div className="mb-8 text-magnetic-plum">
                <h2 className="font-headline text-h2">Our Headquarters</h2>
                <p className="font-body text-body-md mt-2">
                    123 Wealth Boulevard, Finance City, FC 12345
                </p>
                <p className="font-body text-body-md mt-1">
                    Email: connect@money-magnet.com
                </p>
                <p className="font-body text-body-md">Phone: (800) 123-4567</p>
            </div>
            <div className="text-magnetic-plum">
                <h2 className="font-headline text-h2 mb-4">Reach Out to Us</h2>
                <form>
                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="block font-body text-body-md text-forest-green"
                        >
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 p-3 w-full border border-forest-green rounded-md shadow-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block font-body text-body-md text-forest-green"
                        >
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 p-3 w-full border border-forest-green rounded-md shadow-sm"
                            placeholder="john.doe@email.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="message"
                            className="block font-body text-body-md text-forest-green"
                        >
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="mt-1 p-3 w-full border border-forest-green rounded-md shadow-sm"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-money-green text-white font-bold rounded-md hover:bg-forest-green transition-colors duration-200 ease-in-out"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;
