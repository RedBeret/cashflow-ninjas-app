import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route /*, Redirect*/,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import AuthPages from "./pages/Auth";
import Contact from "./pages/Contact";
import NavbarMenu from "./components/NavbarMenu";
import Footer from "./components/Footer";
import FinancialProfileForm from "./pages/FinancialProfileForm";
//  commented out for future use
/*
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/auth/login" />
                )
            }
        />
    );
};
*/

export default function App() {
    return (
        <Router>
            <NavbarMenu />
            <Switch>
                <Route exact path="/cashflow-ninjas-app" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/auth" component={AuthPages} />
                <Route path="/contact" component={Contact} />
                <Route
                    path="/FinancialProfileForm"
                    component={FinancialProfileForm}
                />
                {/* <ProtectedRoute path="/dashboard" component={dashboard} /> */}
            </Switch>
            <Footer />
        </Router>
    );
}
