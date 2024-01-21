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
import LandingLayout from "./layouts/landing";
import MeasurementsLayout from "./layouts/measurements";
import Landing from "views/landing";
import Cookies from "js-cookie";

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

interface AdminRouteProps extends RouteProps {
  component: ComponentType<any>;
}
const AdminRoute: React.FC<AdminRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const key = sessionStorage.key(0);
  const userData = sessionStorage.getItem(key);
  const rememberedUser = Cookies.get("remember");
  const userFilledOut = Cookies.get("userFilledOut");

  return (
    <Route
      {...rest}
      render={(props) =>
        (userData || rememberedUser) && userFilledOut === "true" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/sign-in" />
        )
      }
    />
  );
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const key = sessionStorage.key(0);
  const userData = sessionStorage.getItem(key);
  const RememberedUser = Cookies.get("remember");

  return (
    <Route
      {...rest}
      render={(props) =>
        userData || RememberedUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/sign-in" />
        )
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
  const RememberedUser = Cookies.get("remember");
  return (
    <Route
      {...rest}
      render={(props) =>
        userData || RememberedUser ? (
          <Redirect to="/admin/default" />
        ) : (
          <Component {...props} />
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
          <AdminRoute path="/admin" component={AdminLayout} />
          <PrivateRoute path="/measurements" component={MeasurementsLayout} />
          <Route path="/auth" component={AuthLayout} />
          <LandingRoute path="/" component={LandingLayout} />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
