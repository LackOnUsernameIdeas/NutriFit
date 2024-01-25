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
  Link
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
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.200" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card minH="200px">
          <Flex justify="center" pt="5px" w="100%">
            <Text fontSize="5xl" fontStyle="italic" mr="2">
              Добре дошли в
            </Text>
            <Text fontSize="5xl" fontStyle="italic" fontFamily="DM Sans">
              Nutri
            </Text>
            <Text fontSize="5xl" fontFamily="Leckerli One" mr="1.5">
              Fit
            </Text>
            <Text fontSize="5xl" fontStyle="italic">
              !
            </Text>
          </Flex>
          <HSeparator />
          <Flex justify="center" mt="1%" pt="10px">
            <Text fontSize="3xl">
              Нашата цел е да помогнем на нашите потребители да поддържат
              перфектното тегло с помощта на статистики и диаграми.
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <Link href="/#/admin/weight">
          <Card
            minH="200px"
            _hover={bgHover}
            _focus={bgFocus}
            backgroundColor="brand.500"
          >
            <Flex pt="5px" w="100%" mb="10px">
              <Text fontSize="3xl" fontStyle="italic">
                Калкулации за теглото ви ↪
              </Text>
            </Flex>
            <Flex pt="5px" w="100%" mb="5px">
              <Text fontSize="xl">
                Посетете нашата страница с калкулатор за тегло! Предлагаме
                интерактивни диаграми и статистики, създадени за вас!
              </Text>
            </Flex>
          </Card>
        </Link>
        <Link href="/#/admin/mealplan">
          <Card minH="200px" _hover={bgHover} _focus={bgFocus}>
            <Flex pt="5px" w="100%" mb="10px">
              <Text fontSize="3xl" fontStyle="italic">
                Хранителен план ↪
              </Text>
            </Flex>
            <Flex pt="5px" w="100%" mb="5px">
              <Text fontSize="xl">
                Посетете нашата страница за създаване на хранителен план! Имаме
                обширна база данни със рецепти, която използваме да създадем
                хранителен режим с вашите предпочитания!
              </Text>
            </Flex>
          </Card>
        </Link>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <DailyTraffic />
        <ComplexTable tableData={tableDataComplex} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <PieCard />
          <Tasks />
        </SimpleGrid>
        <ColumnsTable
          tableName="Macro Nutrients"
          tableData={tableDataColumns}
          columnsData={[
            { name: "name", label: "Diet type" },
            { name: "quantity", label: "Protein" },
            { name: "progress", label: "Fat" },
            { name: "date", label: "Carbohydrates" }
          ]}
        />
      </SimpleGrid>
    </Box>
  );
}
