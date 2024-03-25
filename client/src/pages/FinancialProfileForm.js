import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const FinancialProfileSchema = Yup.object().shape({
    annual_income: Yup.number()
        .required("Annual income is required")
        .positive("Income must be positive"),
    monthly_income: Yup.number()
        .required("Monthly income is required")
        .positive("Income must be positive"),
    savings_goal: Yup.number()
        .required("Savings goal is required")
        .positive("Goal must be positive"),
    current_savings: Yup.number()
        .required("Current savings is required")
        .positive("Savings must be positive"),
    savings_goal_deadline: Yup.date().required("Deadline is required"),
    age: Yup.string().required("Age range is required"),
    income: Yup.string().required("Income range is required"),
});

const FinancialProfileForm = () => {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(
                "/api/financial_profiles",
                values // Sending form values directly to Flask route
            );
            console.log(response.data);
        } catch (error) {
            console.error("Error submitting form data:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-headline text-forest-green">
                Financial Profile
            </h2>
            <Formik
                initialValues={{
                    name: "",
                    annual_income: "",
                    monthly_income: "",
                    savings_goal: "",
                    current_savings: "",
                    savings_goal_deadline: "",
                    age: "",
                    income: "",
                }}
                validationSchema={FinancialProfileSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <div>
                            <label
                                htmlFor="annual_income"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Annual Income
                            </label>
                            <Field
                                name="annual_income"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-money-green focus:ring focus:ring-money-green focus:ring-opacity-50"
                                placeholder="Annual Income"
                            />
                            <ErrorMessage
                                name="annual_income"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="monthly_income"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Monthly Income
                            </label>
                            <Field
                                name="monthly_income"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-money-green focus:ring focus:ring-money-green focus:ring-opacity-50"
                                placeholder="Monthly Income"
                            />
                            <ErrorMessage
                                name="monthly_income"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="savings_goal"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Savings Goal
                            </label>
                            <Field
                                name="savings_goal"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-money-green focus:ring focus:ring-money-green focus:ring-opacity-50"
                                placeholder="Savings Goal"
                            />
                            <ErrorMessage
                                name="savings_goal"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="current_savings"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Current Savings
                            </label>
                            <Field
                                name="current_savings"
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-money-green focus:ring focus:ring-money-green focus:ring-opacity-50"
                                placeholder="Current Savings"
                            />
                            <ErrorMessage
                                name="current_savings"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="savings_goal_deadline"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Savings Goal Deadline
                            </label>
                            <Field
                                name="savings_goal_deadline"
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-money-green focus:ring focus:ring-money-green focus:ring-opacity-50"
                            />
                            <ErrorMessage
                                name="savings_goal_deadline"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-money-green hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-money-green"
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FinancialProfileForm;
