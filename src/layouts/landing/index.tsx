// Chakra imports
import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Footer from "components/footer/Footer";
// Layout components
import Navbar from "components/navbar/LandingNav";
import { SidebarContext } from "contexts/SidebarContext";
import { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes";

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const getRoute = () => {
    return window.location.pathname !== "/full-screen-maps";
  };
  // functions for changing the states from components
  const getActiveRoute = (routes: RoutesType[]): string => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((route: RoutesType, key: any) => {
      if (route.layout === "/") {
        return (
          <Route
            path={route.layout + route.path}
            component={route.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Portal>
        <Box>
          <Navbar
            onOpen={onOpen}
            logoText={"Horizon UI Dashboard PRO"}
            brandText={getActiveRoute(routes)}
            secondary={getActiveNavbar(routes)}
            message={getActiveNavbarText(routes)}
            fixed={fixed}
            {...rest}
          />
        </Box>
      </Portal>
      {getRoute() ? (
        <Box p={{ base: "20px", md: "40px" }} pe="20px">
          <Switch>{getRoutes(routes)}</Switch>
        </Box>
      ) : null}
      <Footer />
    </Box>
  );
}
