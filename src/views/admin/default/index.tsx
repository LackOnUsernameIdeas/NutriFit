/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  Text,
  Link
} from "@chakra-ui/react";
// Assets
import Bulgaria from "assets/img/dashboards/bulgaria.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy
} from "react-icons/md";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import {
  getTotalUsers,
  getAverageWeightOfAllUsers
} from "database/getMeanUsersData";

interface LinearGradientTextProps {
  text: any;
  gradient: string;
  fontSize?: string;
  fontFamily?: string;
  mr?: string;
}

const LinearGradientText: React.FC<LinearGradientTextProps> = ({
  text,
  gradient,
  fontSize,
  fontFamily,
  mr
}) => (
  <Text
    as="span"
    fontSize={fontSize}
    fontFamily={fontFamily}
    fontWeight="bold"
    mr={mr}
    style={{
      backgroundImage: gradient,
      WebkitBackgroundClip: "text",
      color: "transparent"
    }}
  >
    {text}
  </Text>
);

export default function UserReports() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const brandColor = useColorModeValue("brand.500", "white");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const fontWeight = useColorModeValue("500", "100");
  const bgHover = useColorModeValue("secondaryGray.200", "secondaryGray.900");
  const bgFocus = { bg: "brand.200" };
  const [totalUsers, setTotalUsers] = React.useState<number | null>(null);
  const [averageWeight, setAverageWeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Fetch the total number of users when the component mounts
    getTotalUsers()
      .then((users) => {
        setTotalUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
    getAverageWeightOfAllUsers()
      .then((weight) => {
        setAverageWeight(weight);
        console.log("WEIGHT ->>>", weight);
      })
      .catch((error) => {
        console.error("Error fetching average weight:", error);
      });
  }, []); // Run this effect only once when the component mounts

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card>
          <Flex justify="left" alignItems="center">
            <Text fontSize="5xl" mr="2">
              Добре дошли в{" "}
            </Text>
            <LinearGradientText
              text={<b>Nutri</b>}
              gradient={gradientNutri}
              fontSize="5xl"
              fontFamily="DM Sans"
            />
            <LinearGradientText
              text={<b>Fit⠀</b>}
              gradient={gradientFit}
              fontFamily="Leckerli One"
              fontSize="5xl"
              mr="2px"
            />
          </Flex>
        </Card>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card>
          <Flex justify="left">
            <Text fontSize="2xl">
              Нашата цел е да помогнем на нашите потребители да поддържат
              перфектното тегло с помощта на статистики и диаграми.
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Total Users"
          value={totalUsers !== null ? totalUsers.toString() : "Loading..."}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Spend this month"
          value={
            averageWeight !== null
              ? `${averageWeight.toFixed(2)}`
              : "Loading..."
          }
        />
        <MiniStatistics
          growth="+23%"
          name="Sales"
          subtext="since last month"
          value="$574.34"
        />
        <MiniStatistics
          endContent={
            <Flex me="-16px" mt="10px">
              <FormLabel htmlFor="balance">
                <Avatar src={Bulgaria} />
              </FormLabel>
              <Select
                id="balance"
                variant="mini"
                mt="5px"
                me="0px"
                defaultValue="usd"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gba">GBA</option>
              </Select>
            </Flex>
          }
          name="Your balance"
          value="$1,000"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="Tasks"
          value="210"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Total Projects"
          value="2935"
        />
      </SimpleGrid>
      <Card
        minH="285px"
        backgroundImage={`url(${backgroundImage})`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
        transition="background-image 0.5s ease-in-out"
        mb="20px"
      >
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
          <Link href="#/admin/weight">
            <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
              <Flex pt="5px" w="100%">
                <LinearGradientText
                  text={<b>Калкулации за теглото ви ↪</b>}
                  gradient={gradientNutri}
                  fontSize="2xl"
                  mr="2"
                />
              </Flex>
              <Flex justify="center" mt="1%" pt="10px">
                <Text fontWeight={fontWeight}>
                  Посетете нашата страница с калкулатор за тегло! Предлагаме
                  интерактивни диаграми и статистики, създадени за вас!
                </Text>
              </Flex>
            </Card>
          </Link>
          <Link href="#/admin/mealplan">
            <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
              <Flex pt="5px" w="100%">
                <LinearGradientText
                  text={<b>Хранителен план ↪</b>}
                  gradient={gradientNutri}
                  fontSize="2xl"
                  mr="2"
                />
              </Flex>
              <Flex justify="center" mt="1%" pt="10px">
                <Text fontWeight={fontWeight}>
                  Посетете нашата страница за създаване на хранителен план!
                  Имаме обширна база данни със рецепти, която използваме да
                  създадем хранителен режим с вашите предпочитания!
                </Text>
              </Flex>
            </Card>
          </Link>
          <Link href="#/admin/mealplan">
            <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
              <Flex pt="5px" w="100%">
                <LinearGradientText
                  text={<b>Пример ↪</b>}
                  gradient={gradientNutri}
                  fontSize="2xl"
                  mr="2"
                />
              </Flex>
              <Flex justify="center" mt="1%" pt="10px">
                <Text fontWeight={fontWeight}>
                  Посетете нашата страница за създаване на хранителен план!
                  Имаме обширна база данни със рецепти, която използваме да
                  създадем хранителен режим с вашите предпочитания!
                </Text>
              </Flex>
            </Card>
          </Link>
          <Link href="#/admin/mealplan">
            <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
              <Flex pt="5px" w="100%">
                <LinearGradientText
                  text={<b>Пример ↪</b>}
                  gradient={gradientNutri}
                  fontSize="2xl"
                  mr="2"
                />
              </Flex>
              <Flex justify="center" mt="1%" pt="10px">
                <Text fontWeight={fontWeight}>
                  Посетете нашата страница за създаване на хранителен план!
                  Имаме обширна база данни със рецепти, която използваме да
                  създадем хранителен режим с вашите предпочитания!
                </Text>
              </Flex>
            </Card>
          </Link>
        </SimpleGrid>
      </Card>
    </Box>
  );
}
