// Chakra imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
// @
import logo from "assets/img/layout/logo.png";
import { HSeparator } from "components/separator/Separator";
export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <img src={logo} />
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
