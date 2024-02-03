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
  useColorModeValue,
  useBreakpointValue,
  SimpleGrid
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AdminNavbarLinks from "components/navbar/NavbarLinksAdmin";
import { HSeparator } from "components/separator/Separator";

export default function AdminNavbar(props: {
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
  const isMobile = useBreakpointValue({ base: true, md: false });
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
    <Flex
      direction="column"
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
      justifyContent={{ sm: "flex-start", md: "center", xl: "center" }}
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
      pt="6px"
      top={{ base: "12px", md: "16px", xl: "18px" }}
      w={{
        base: "calc(100vw - 6%)",
        md: "calc(100vw - 8%)",
        lg: "calc(100vw - 6%)",
        xl: "calc(100vw - 350px)",
        "2xl": "calc(100vw - 365px)"
      }}
    >
      {isMobile ? (
        <Flex
          w="100%"
          direction={{ sm: "column", md: "row" }}
          alignItems={{ sm: "flex-start", md: "center", xl: "center" }}
          mb={gap}
        >
          <Flex
            ml={{ sm: "0", lg: "auto" }}
            mb={{ sm: "12px", md: "0px" }}
            w={{ sm: "130%", md: "unset" }}
            justifySelf="center"
          >
            <Box mr="20px" mt="8px">
              <Text
                color={mainText}
                bg="inherit"
                borderRadius="inherit"
                fontFamily="DM Sans"
                fontWeight="bold"
                fontSize="30px"
                display="inline"
                position="relative"
                top="10px" // Adjust this value to set the desired gap
              >
                Nutri
              </Text>{" "}
              <Text
                color={mainText}
                bg="inherit"
                borderRadius="inherit"
                fontFamily="Leckerli One"
                fontWeight="bold"
                fontSize="30px"
                display="inline"
                position="relative"
                top="10px" // Adjust this value to set the desired gap
              >
                Fit
              </Text>
            </Box>
            <AdminNavbarLinks
              onOpen={props.onOpen}
              secondary={props.secondary}
              fixed={props.fixed}
            />
          </Flex>
          <HSeparator />
          <Box mt={{ sm: "12px", md: "0px" }}>
            <Breadcrumb>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="6px">
                <BreadcrumbLink href="#" color={secondaryText}>
                  Страници
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem color={secondaryText} fontSize="sm">
                <BreadcrumbLink href="#" color={secondaryText}>
                  {brandText}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Link
              color={mainText}
              href="#"
              bg="inherit"
              borderRadius="inherit"
              fontWeight="bold"
              fontSize="34px"
              textOverflow="ellipsis"
              _hover={{ color: { mainText } }}
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent"
              }}
              _focus={{
                boxShadow: "none"
              }}
            >
              {brandText}
            </Link>
          </Box>
        </Flex>
      ) : (
        <Flex
          w="100%"
          direction={{ sm: "column", md: "row" }}
          alignItems={{ sm: "flex-start", md: "center", xl: "center" }}
          justifyContent="space-between" // Add this line
          mb={gap}
        >
          <Box mb={{ sm: "12px", md: "0px" }}>
            <Breadcrumb>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="6px">
                <BreadcrumbLink href="#" color={secondaryText}>
                  Страници
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem color={secondaryText} fontSize="sm">
                <BreadcrumbLink href="#" color={secondaryText}>
                  {brandText}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Link
              color={mainText}
              href="#"
              bg="inherit"
              borderRadius="inherit"
              fontWeight="bold"
              fontSize="34px"
              textOverflow="ellipsis"
              _hover={{ color: { mainText } }}
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent"
              }}
              _focus={{
                boxShadow: "none"
              }}
            >
              {brandText}
            </Link>
          </Box>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Flex>
      )}
    </Flex>
  );
}
