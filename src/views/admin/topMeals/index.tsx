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

// Custom components
import Loading from "views/admin/weightStats/components/Loading";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import Card from "components/card/Card";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";

interface Meal {
  name: string;
  count: number;
  image: string;
}

export default function TopMeals() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const [loading, setLoading] = React.useState(true);
  const [allMeals, setAllMeals] = React.useState<Meal[]>([]);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

  React.useEffect(() => {
    setLoading(true);
    orderMealsByFrequency().then((sortedMeals) => {
      console.log("Sorted meals by frequency:", sortedMeals);
      setAllMeals(sortedMeals);
      setLoading(false);
    });
  }, []);

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {loading ? (
          <Box mt="37vh" minH="600px" opacity={loading ? 1 : 0}>
            <Loading />
          </Box>
        ) : (
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
            mb="20px"
          >
            <Card p="0px">
              <Flex
                align={{ sm: "flex-start", lg: "center" }}
                justify="space-between"
                w="100%"
                px="22px"
                py="18px"
              >
                <Text color={textColor} fontSize="xl" fontWeight="600">
                  History
                </Text>
                <Button variant="action">See all</Button>
              </Flex>

              {/* Map over allMeals and render HistoryItem for each meal */}
              {allMeals.map((meal, index) => (
                <HistoryItem
                  key={index}
                  name={meal.name}
                  // Set author, date, image, and price according to your data structure
                  author={"Брой: " + meal.count.toString()}
                  date="Date"
                  image={meal.image} // You may want to update this based on the meal data
                  price="Price"
                />
              ))}
            </Card>
          </Flex>
        )}
      </Box>
    </FadeInWrapper>
  );
}
