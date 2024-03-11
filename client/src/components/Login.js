import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { authenticateUser } from "../store/actions/authActions";

export default function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
    });

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        setError("");

        const { username, password } = values;
        dispatch(
            authenticateUser(username, password, setError, setSuccess, history)
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (success) {
            resetForm();
        }

        setSubmitting(false);
    };

    return (
        <main className="w-full max-w-md mx-auto p-6 bg-magnetic-grey rounded mb-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="font-headline text-h2 text-forest-green">
                            Login
                        </h1>
                        <p className="font-body text-body-md text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="font-medium text-mint-green hover:underline"
                            >
                                Sign up here
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
                                <Field
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    className="font-body text-body-md py-3 px-4 block w-full border border-gray-200 rounded-lg"
                                />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />

                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="font-body text-body-md py-3 px-4 block w-full border border-gray-200 rounded-lg mt-4"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="font-body text-body-md w-full py-3 px-4 mt-6 text-white rounded-lg bg-money-green hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-money-green"
                                >
                                    Login
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <p className="font-body text-body-sm text-center mt-4">
                        Forgot Password?{" "}
                        <Link
                            to="/auth/updatepassword"
                            className="text-mint-green hover:underline"
                        >
                            Change Password
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
