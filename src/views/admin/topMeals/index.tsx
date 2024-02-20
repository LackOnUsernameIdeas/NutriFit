import React from "react";
// Chakra imports
import {
  Avatar,
  Button,
  Box,
  Center,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Text,
  Link
} from "@chakra-ui/react";
// Assets
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { orderMealsByFrequency } from "database/getAdditionalUserData";

export default function TopMeals() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    orderMealsByFrequency().then((sortedMeals) => {
      console.log("Sorted meals by frequency:", sortedMeals);
    });
    setLoading(false);
  }, []);

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}></Box>
    </FadeInWrapper>
  );
}
