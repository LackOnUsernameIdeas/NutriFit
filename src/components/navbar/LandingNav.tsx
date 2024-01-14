/* eslint-disable */
// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import LandingNavbarLinks from "components/navbar/LandingNavLinks";
import { NutriFitLogo } from "components/icons/Icons";

export default function LandingNavbar(props: {
  secondary: boolean;
  message: string | boolean;
  brandText: string;
  logoText: string;
  fixed: boolean;
  onOpen: (...args: any[]) => any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  });

  const { secondary, brandText } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("navy.700", "white");
  let secondaryText = useColorModeValue("gray.700", "white");
  let navbarPosition = "fixed" as const;
  let navbarFilter = "none";
  let navbarBackdrop = "blur(20px)";
  let navbarShadow = "none";
  let navbarBg = useColorModeValue(
    "rgba(244, 247, 254, 0.2)",
    "rgba(11,20,55,0.5)"
  );
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingX = "15px";
  let gap = "0px";
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: "12px", md: "30px", lg: "30px", xl: "30px" }}
      px={{
        sm: paddingX,
        md: "10px"
      }}
      ps={{
        xl: "12px"
      }}
      pt="8px"
      top={{ base: "12px", md: "16px", xl: "18px" }}
      w={{ base: "95%", md: "95%", xl: "97%" }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "row",
          md: "row"
        }}
        alignItems={{ xl: "center" }}
        justifyContent={{ sm: "center", md: "space-between" }}
        mb={gap}
      >
        <Box mb={{ sm: "8px", md: "0px" }} lineHeight="1">
          <Text
            color={mainText}
            bg="inherit"
            borderRadius="inherit"
            fontFamily="DM Sans"
            fontWeight="bold"
            fontSize="34px"
            display="inline"
          >
            Nutri
          </Text>{" "}
          <Text
            color={mainText}
            bg="inherit"
            borderRadius="inherit"
            fontFamily="Leckerli One"
            fontWeight="bold"
            fontSize="34px"
            display="inline"
          >
            Fit
          </Text>
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <LandingNavbarLinks
            onOpen={props.onOpen}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Box>
      </Flex>
    </Box>
  );
}
