import React from "react";

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  useMediaQuery,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import {
  renderThumb,
  renderTrack,
  renderView
} from "components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import wavesDark from "../../assets/img/layout/layered-waves-haikei-sidebar-dark.svg";
import wavesLight from "../../assets/img/layout/layered-waves-haikei-sidebar-light.svg";
import wavesLightSmall from "../../assets/img/layout/layered-waves-haikei-light-small.svg";
import wavesDarkSmall from "../../assets/img/layout/layered-waves-haikei-dark-small.svg";
// Assets
import { IoMenuOutline } from "react-icons/io5";

function Sidebar({ routes }: { routes: RoutesType[] }) {
  const visibleRoutes = routes.filter((route) => !route.hideInSidebar);

  let variantChange = "0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  // Chakra Color Mode
  const sidebarImageBig = useColorModeValue(wavesLight, wavesDark);
  const sidebarImageSmall = useColorModeValue(wavesLightSmall, wavesDarkSmall);
  const sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";
  const [isSmallHeight] = useMediaQuery("(max-height: 769px)");
  const sidebarImage = isSmallHeight ? sidebarImageSmall : sidebarImageBig;
  // SIDEBAR
  return (
    <Box display={{ sm: "none", xl: "block" }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        backgroundImage={sidebarImage}
        backgroundPosition="bottom"
        backgroundRepeat="no-repeat"
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content routes={visibleRoutes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive({ routes }: { routes: RoutesType[] }) {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  let variantChange = "0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
  const visibleRoutes = routes.filter((route) => !route.hideInSidebar);
  // let isWindows = navigator.platform.startsWith("Win");
  const sidebarImageBig = useColorModeValue(wavesLight, wavesDark);
  const sidebarImageSmall = useColorModeValue(wavesLightSmall, wavesDarkSmall);
  const sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";
  const [isSmallHeight] = useMediaQuery("(max-height: 769px)");
  const sidebarImage = isSmallHeight ? sidebarImageSmall : sidebarImageBig;

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="285px"
          maxW="285px"
          bg={sidebarBg}
          backgroundImage={sidebarImage}
          backgroundPosition="bottom"
          backgroundRepeat="no-repeat"
          transition={variantChange}
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={visibleRoutes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

export default Sidebar;
