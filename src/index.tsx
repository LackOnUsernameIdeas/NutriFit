import React, { ComponentType, useState } from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect, RouteProps } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import TestLayout from "./layouts/test";

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}
// let loggedIn: boolean;
// let key = sessionStorage.key(0);

// const userData = sessionStorage.getItem(key);
// let jsonUserData = JSON.parse(userData)
// let tokenExists = jsonUserData
// if (tokenExists){
//   loggedIn = true;
//   // let token = tokenExists.accessToken
// } else {
//   loggedIn = false;
// }

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const key = sessionStorage.key(0);
  const userData = sessionStorage.getItem(key);
  return (
    <Route
      {...rest}
      render={(props) =>
        userData ? (
          // Render the component if the user is authenticated
          <Component {...props} />
        ) : (
          // Redirect to the sign-in page if the user is not authenticated
          <Redirect to="/auth/sign-in" />
        )
      }
    />
  );
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <HashRouter>
        <Switch>
          {/* Use PrivateRoute for the /admin route */}
          <PrivateRoute path="/admin" component={AdminLayout} />
          <Route path="/auth" component={AuthLayout} />
          <Route path="/test" component={TestLayout} />
          <Redirect from="/" to="/admin" />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);