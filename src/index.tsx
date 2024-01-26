import React, { ComponentType, useState, useRef } from "react";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchAdditionalUserData } from "database/getAdditionalUserData";

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
  const key = Object.keys(sessionStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );
  const userData = sessionStorage.getItem(key[0]);
  console.log(key, userData, "userData");

  const rememberedKey = Object.keys(localStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );
  const rememberedUser = localStorage.getItem(rememberedKey[0]);
  console.log(rememberedKey, rememberedUser, "remember");
  const [user, setUser] = useState(null);
  const [userDataForToday, setUserDataForToday] = useState(null);
  const isMounted = useRef(true);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted.current) {
        setUser(user);
      }

      if (user) {
        try {
          const timestampKey = new Date().toISOString().slice(0, 10);

          const additionalData = await fetchAdditionalUserData(user.uid);
          const userDataForToday = additionalData[timestampKey];
          if (isMounted.current) {
            setUserDataForToday(userDataForToday);
          }
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        (userData !== null || rememberedUser !== null) &&
        userDataForToday !== undefined ? (
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
  const key = Object.keys(sessionStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );

  const userData = sessionStorage.getItem(key[0]);
  console.log(key, userData, "userData");

  const rememberedKey = Object.keys(localStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );
  const rememberedUser = localStorage.getItem(rememberedKey[0]);
  const [user, setUser] = useState(null);
  const [userDataForToday, setUserDataForToday] = useState(null);
  const isMounted = useRef(true);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted.current) {
        setUser(user);
      }

      if (user) {
        try {
          const timestampKey = new Date().toISOString().slice(0, 10);

          const additionalData = await fetchAdditionalUserData(user.uid);
          const userDataForToday = additionalData[timestampKey];
          if (isMounted.current) {
            setUserDataForToday(userDataForToday);
          }
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        (userData !== null || rememberedUser !== null) &&
        userDataForToday == undefined ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin/default" />
        )
      }
    />
  );
};

const LandingRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const key = Object.keys(sessionStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );
  const rememberedKey = Object.keys(localStorage).filter((obj) =>
    obj.startsWith("firebase:authUser")
  );
  const userData = sessionStorage.getItem(key[0]);
  const rememberedUser = localStorage.getItem(rememberedKey[0]);
  console.log(key, userData, "userData");
  return (
    <Route
      {...rest}
      render={(props) =>
        userData !== null || rememberedUser !== null ? (
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
