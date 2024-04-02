import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
  Text,
  useColorModeValue,
  useColorMode
} from "@chakra-ui/react";
// Custom Components
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import routes from "routes";
import Cookies from "js-cookie";
import { getAuth, signOut } from "firebase/auth";

export default function HeaderLinks(props: { secondary: boolean }) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const bgButton = useColorModeValue("secondaryGray.200", "whiteAlpha.50");
  const buttonColor = useColorModeValue("secondaryGray.900", "white");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.600" },
    { bg: "whiteAlpha.200" }
  );

  const handleLogOut = async () => {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    Cookies.remove(btoa(uid));
    await signOut(auth);
  };

  return (
    <Flex
      w={{ sm: "auto", md: "auto" }}
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
      <Link href="/#/auth/sign-in">
        <Button
          _hover={bgHover}
          _focus={{ bg: "none" }}
          backgroundColor={bgButton}
          color={buttonColor}
          borderRadius="20px"
          maxW={{ sm: "100px", lg: "100px" }}
          px="14px"
          onClick={handleLogOut}
          ml={{ base: "20px", lg: "0", md: "0" }} // Adjusted margin
        >
          <Text fontSize="sm">Излизане</Text>
        </Button>
      </Link>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func
};
