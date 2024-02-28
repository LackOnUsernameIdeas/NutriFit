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
  const brandColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);
  return (
    <Box pt="80px">
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
        <Card>
          <Flex justify="left" mt="1%">
            <Text fontSize="2xl">
              Бъдете винаги във форма и в оптимално здравословно състояние с
              помощта на изкуствен интелект!
            </Text>
          </Flex>
          <Flex justify="left" pt="10px" gap="20px" mt="30px">
            <Link href="/#/auth/sign-in">
              <Button
                color="white"
                bgColor="#5D4BD7"
                variant="brand"
                _hover={{ bg: "secondaryGray.900" }}
                borderRadius="15px"
                px="14px"
                fontWeight="500"
                h="50px"
              >
                <Text fontSize="lg">Влезте в профила си!</Text>
              </Button>
            </Link>
            <Link href="/#/auth/sign-up">
              <Button
                color="white"
                bgColor="#5D4BD7"
                variant="brand"
                _hover={{ bg: "secondaryGray.900" }}
                borderRadius="15px"
                px="14px"
                fontWeight="500"
                h="50px"
              >
                <Text fontSize="lg">Нова регистрация!</Text>
              </Button>
            </Link>
          </Flex>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
