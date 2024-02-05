import {
  Button,
  Flex,
  Icon,
  useColorModeValue,
  useColorMode,
  Menu,
  MenuList,
  MenuButton,
  Box,
  Avatar
} from "@chakra-ui/react";

import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import routes from "routes";
import letterLogo from "assets/img/layout/letterLogo.png";
export default function LandingLinks(props: { secondary: boolean }) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  return (
    <Flex
      ml={{ sm: "70%", md: "0" }}
      w={{ sm: "34%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Button
        bg={bgButton}
        variant="no-effects"
        border="1px solid"
        borderColor="#6A53FF"
        borderRadius="50px"
        onClick={toggleColorMode}
        display="flex"
        p="0px"
        alignItems="center"
        justifyContent="center"
      >
        <Icon
          h="24px"
          w="24px"
          color="white"
          as={colorMode === "light" ? IoMdMoon : IoMdSunny}
        />
      </Button>
    </Flex>
  );
  // return (
  //   <Flex
  //     w={{ sm: "auto", md: "auto" }}
  //     alignItems="center"
  //     flexDirection="row"
  //     bg={menuBg}
  //     flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
  //     p="10px"
  //     borderRadius="30px"
  //     boxShadow={shadow}
  //   >
  //     <Box ml={{ base: "10px", lg: "0", md: "0" }}>
  //       <SidebarResponsive routes={routes} />
  //     </Box>
  //     <Button
  //       variant="no-hover"
  //       bg="transparent"
  //       p="0px"
  //       minW="unset"
  //       minH="unset"
  //       h="18px"
  //       w="max-content"
  //       ml={{ base: "20px", lg: "0", md: "0" }}
  //       onClick={toggleColorMode}
  //     >
  //       <Icon
  //         me="10px"
  //         h="18px"
  //         w="18px"
  //         color={navbarIcon}
  //         as={colorMode === "light" ? IoMdMoon : IoMdSunny}
  //       />
  //     </Button>
  //     <Menu>
  //       <Link href="/#/auth/sign-in">
  //         <MenuItem
  //           _hover={bgHover}
  //           _focus={{ bg: "none" }}
  //           backgroundColor={bgButton}
  //           color={buttonColor}
  //           borderRadius="20px"
  //           px="14px"
  //           onClick={handleLogOut}
  //           ml={{ base: "70px", lg: "0", md: "0" }}
  //         >
  //           <Text fontSize="sm">Излизане</Text>
  //         </MenuItem>
  //       </Link>
  //     </Menu>
  //   </Flex>
  // );
}

LandingLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func
};
