import React, { ComponentType, useState } from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  RouteProps
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import Landing from "views/test/default";

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const key = sessionStorage.key(0);
  const userData = sessionStorage.getItem(key);
  return (
    <Route
      {...rest}
      render={(props) =>
        userData ? <Component {...props} /> : <Redirect to="/auth/sign-in" />
      }
    />
  );
};

const LandingRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const key = sessionStorage.key(0);
  const userData = sessionStorage.getItem(key);
  return (
    <Route
      {...rest}
      render={(props) =>
        userData ? <Redirect to="/admin/default" /> : <Component {...props} />
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
          <LandingRoute path="/" component={Landing} />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
