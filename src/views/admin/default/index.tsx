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

// Chakra imports
import {
  Avatar,
  Button,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Text,
  Link,
  LinkBox,
  LinkOverlay,
  Heading
} from "@chakra-ui/react";
// Assets
import Bulgaria from "assets/img/dashboards/bulgaria.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns";
import tableDataComplex from "views/admin/default/variables/tableDataComplex";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const fontWeight = useColorModeValue("500", "100");
  const bgHover = useColorModeValue("secondaryGray.200", "secondaryGray.900");
  const bgFocus = { bg: "brand.200" };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card>
          <Flex justify="left" w="100%">
            <Text fontSize="5xl">Добре дошли в NutriFit!</Text>
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
          name="Earnings"
          value="$350.4"
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
          value="$642.39"
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
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
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
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        <Link href="#/admin/weight">
          <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
            <Flex pt="5px" w="100%">
              <Text fontSize="xl" mr="2">
                <b>Калкулации за теглото ви ↪</b>
              </Text>
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
              <Text fontSize="xl" mr="2">
                <b>Хранителен план ↪</b>
              </Text>
            </Flex>
            <Flex justify="center" mt="1%" pt="10px">
              <Text fontWeight={fontWeight}>
                Посетете нашата страница за създаване на хранителен план! Имаме
                обширна база данни със рецепти, която използваме да създадем
                хранителен режим с вашите предпочитания!
              </Text>
            </Flex>
          </Card>
        </Link>
        <Link href="#/admin/mealplan">
          <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
            <Flex pt="5px" w="100%">
              <Text fontSize="xl" mr="2">
                <b>Пример ↪</b>
              </Text>
            </Flex>
            <Flex justify="center" mt="1%" pt="10px">
              <Text fontWeight={fontWeight}>
                Посетете нашата страница за създаване на хранителен план! Имаме
                обширна база данни със рецепти, която използваме да създадем
                хранителен режим с вашите предпочитания!
              </Text>
            </Flex>
          </Card>
        </Link>
        <Link href="#/admin/mealplan">
          <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
            <Flex pt="5px" w="100%">
              <Text fontSize="xl" mr="2">
                <b>Пример ↪</b>
              </Text>
            </Flex>
            <Flex justify="center" mt="1%" pt="10px">
              <Text fontWeight={fontWeight}>
                Посетете нашата страница за създаване на хранителен план! Имаме
                обширна база данни със рецепти, която използваме да създадем
                хранителен режим с вашите предпочитания!
              </Text>
            </Flex>
          </Card>
        </Link>
      </SimpleGrid>
    </Box>
  );
}
