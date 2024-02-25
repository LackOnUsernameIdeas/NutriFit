import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Button,
  Collapse,
  Icon
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons"; // Import arrow icons

type RouteType = {
  name: string;
  layout: string;
  path: string;
  icon: JSX.Element;
  component?: () => JSX.Element;
  collapseRoutes?: RouteType[];
};

export function SidebarLinks(props: {
  routes: RouteType[];
  withCollapse?: boolean;
}) {
  const location = useLocation();
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  const activeIcon = "#7c23b2";
  const textColor = useColorModeValue("secondaryGray.500", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  const { routes, withCollapse = true } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName);
  };

  // Function to create a single link
  const createLink = (route: RouteType) => {
    if (route.collapseRoutes) {
      return (
        <Button
          key={route.path}
          variant="unstyled"
          textAlign="left"
          onClick={handleToggle}
          w="100%"
        >
          <Flex justify="space-between" alignItems="center">
            <Box>
              <HStack
                spacing={
                  activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                }
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeIcon
                        : textColor
                    }
                    me="18px"
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : textColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {route.name}
                  </Text>
                </Flex>
                <Box
                  h="36px"
                  w="4px"
                  bg={
                    activeRoute(route.path.toLowerCase())
                      ? activeIcon
                      : "transparent"
                  }
                  borderRadius="5px"
                />
              </HStack>
            </Box>
            {/* Conditional rendering of arrow icon */}
            {show ? (
              <ChevronDownIcon color={textColor} boxSize={5} mr="3px" />
            ) : (
              <ChevronRightIcon color={textColor} boxSize={5} mr="3px" />
            )}
          </Flex>
        </Button>
      );
    } else {
      return (
        <NavLink key={route.path} to={route.layout + route.path}>
          <Box>
            <HStack
              spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
              py="5px"
              ps="10px"
            >
              <Flex w="100%" alignItems="center" justifyContent="center">
                <Box
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeIcon
                      : textColor
                  }
                  me="18px"
                >
                  {route.icon}
                </Box>
                <Text
                  me="auto"
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeColor
                      : textColor
                  }
                  fontWeight={
                    activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                  }
                >
                  {route.name}
                </Text>
              </Flex>
              <Box
                h="36px"
                w="4px"
                bg={
                  activeRoute(route.path.toLowerCase())
                    ? activeIcon
                    : "transparent"
                }
                borderRadius="5px"
              />
            </HStack>
          </Box>
        </NavLink>
      );
    }
  };

  // Function to create links based on withCollapse prop
  const createLinks = (routes: RouteType[]) => {
    return routes.map((route) => {
      return (
        <Box key={route.path}>
          {createLink(route)}
          {route.collapseRoutes && (
            <Collapse in={show} animateOpacity>
              {route.collapseRoutes.map((subRoute, index) => {
                return (
                  <>
                    {index == 0 ? <Box mt="5px"></Box> : <></>}
                    <Box ml={4} key={subRoute.path}>
                      {createLink(subRoute)}
                    </Box>
                  </>
                );
              })}
            </Collapse>
          )}
        </Box>
      );
    });
  };

  // Render the links
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
