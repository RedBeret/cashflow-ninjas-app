import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../store/actions/authActions";

export default function Register() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const initialValues = {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        username: Yup.string().required("Required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
    });

    const onSubmit = (values, { setSubmitting }) => {
        setError("");
        setSuccess("");

        dispatch(registerUser(values, setError, setSuccess)).then(() => {
            if (!error) {
                history.push("/login");
            }
            setSubmitting(false);
        });
    };

    return (
        <main className="w-full max-w-md mx-auto p-6 bg-magnetic-grey rounded mb-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    {success}
                </div>
            )}
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="font-headline text-h2 text-forest-green">
                            Sign up
                        </h1>
                        <p className="font-body text-body-md text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/auth/login"
                                className="text-mint-green hover:underline font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="mt-5">
                                <div className="mb-4">
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-mint-green focus:border-mint-green"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Field
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-mint-green focus:border-mint-green"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-mint-green focus:border-mint-green"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <div className="mb-6">
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-mint-green focus:border-mint-green"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="font-body text-body-md w-full py-3 px-4 text-white rounded-lg bg-money-green hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-money-green"
                                >
                                    Sign up
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </main>
    );
}
