// Chakra imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
// @
import NutriFitLogo from "assets/img/layout/NutriFitLogo.png";
import { HSeparator } from "components/separator/Separator";
export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <img src={NutriFitLogo} />
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <HSeparator mb="10px" size="3px" />
    </Flex>
  );
}

export default SidebarBrand;
