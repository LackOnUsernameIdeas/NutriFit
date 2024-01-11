// Chakra imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <Text fontSize="6xl" fontWeight="bold" mb="7%" mr="2%">
        NutriFit
      </Text>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
