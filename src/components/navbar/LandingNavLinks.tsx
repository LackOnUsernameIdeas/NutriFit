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
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Box ml={{ base: "10px", lg: "0", md: "0" }}>
        <SidebarResponsive routes={routes} />
      </Box>
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        ml={{ base: "20px", lg: "0", md: "0" }}
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === "light" ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            src={letterLogo}
            name="test test"
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
            ml={{ base: "20px", lg: "0", md: "0" }}
          />
        </MenuButton>
      </Menu>
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
