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
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Text,
  Link,
  Button,
  chakra,
  shouldForwardProp
} from "@chakra-ui/react";
// Animations
import { motion, isValidMotionProp } from "framer-motion";
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

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop)
});

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "150px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
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
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name="Spend this month"
            value="$642.39"
          />
          <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
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
        <Card minH="200px">
          <Flex justify="left" pt="5px" w="100%">
            <Text fontSize="6xl" fontStyle="italic">
              Добре дошли в NutriFit!
            </Text>
          </Flex>
          <HSeparator />
          <Flex justify="left" mt="1%" pt="10px">
            <Text fontSize="3xl">
              Нашата цел е да помогнем на нашите потребители да поддържат
              перфектното тегло с помощта на статистики и диаграми.
            </Text>
          </Flex>
          <Flex justify="left" mt="1%" pt="10px">
            <ChakraBox
              animate={{
                scale: [1.2, 1.4, 1.2],
                rotate: [0, 0, 0],
                borderRadius: ["20%", "20%", "20%"]
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                // @ts-ignore
                repeat: Infinity,
                repeatType: "loop"
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100px"
              height="100px"
            >
              <Link href="/#/auth/sign-in">
                <Button
                  _hover={{ bg: "transparent" }}
                  _focus={{ bg: "none" }}
                  color="red.400"
                  borderRadius="8px"
                  px="14px"
                  ml="1%"
                >
                  <Text fontSize="sm">Влезте!</Text>
                </Button>
              </Link>
            </ChakraBox>
          </Flex>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
