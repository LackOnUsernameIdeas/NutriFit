import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect, RouteProps } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import Cookies from 'js-cookie';
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!Cookies.get('uid');

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
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
          <Redirect from="/" to="/admin" />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);