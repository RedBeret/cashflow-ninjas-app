import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory, Link } from "react-router-dom";
import { deleteUser } from "../store/actions/authActions";

export default function CloseAccount() {
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const onSubmit = (values, { setSubmitting }) => {
        const { username, password } = values;
        dispatch(
            deleteUser(username, password, setError, setSuccess, () =>
                history.push("/")
            )
        );
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
                            Delete Account
                        </h1>
                        <p className="font-body text-body-md text-gray-600">
                            Are you sure you want to delete your account?{" "}
                            <Link
                                to="/"
                                className="text-mint-green hover:underline font-medium"
                            >
                                Cancel
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
                                    <label
                                        htmlFor="username"
                                        className="font-body text-body-md text-gray-700"
                                    >
                                        Username
                                    </label>
                                    <Field
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-money-green focus:border-money-green"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="password"
                                        className="font-body text-body-md text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="font-body text-body-md mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-money-green focus:border-money-green"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="font-body text-body-md w-full py-3 px-4 text-white rounded-lg bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete Account
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </main>
    );
}
