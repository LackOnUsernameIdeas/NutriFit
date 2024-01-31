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

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop)
});

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt="80px">
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card mb="20px">
          <Flex justify="left" pt="5px" w="100%">
            <Text fontSize="4xl" fontWeight="bold">
              Добре дошли в NutriFit!
            </Text>
          </Flex>
        </Card>
        <Card>
          <Flex justify="left" mt="1%" pt="10px">
            <Text fontSize="2xl">
              Нашата цел е да помогнем на нашите потребители да поддържат
              перфектното тегло с помощта на статистики и диаграми.
            </Text>
          </Flex>
          <Flex justify="left" mt="1%" pt="10px">
            <ChakraBox
              animate={{
                scale: [1.15, 1.2, 1.15],
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
                  className="glowing-button"
                  color="white"
                  variant="brand"
                  _hover={{ bg: "secondaryGray.900" }}
                  borderRadius="8px"
                  px="14px"
                  ml="30%"
                  fontSize="sm"
                  fontWeight="500"
                >
                  <Text fontSize="sm">Влезте в профила си!</Text>
                </Button>
              </Link>
            </ChakraBox>
          </Flex>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
