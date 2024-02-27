// Chakra imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
// @
import NutriFitLogo from "assets/img/layout/NutriFitLogo.png";
import { HSeparator } from "components/separator/Separator";
export function SidebarBrand() {
  return (
    <Flex alignItems="center" flexDirection="column">
      <img src={NutriFitLogo} style={{ marginTop: "0" }} />
      <HSeparator mb="10px" size="3px" color="rgba(0, 0, 0, 0.3)" />
    </Flex>
  );
}

export default SidebarBrand;
