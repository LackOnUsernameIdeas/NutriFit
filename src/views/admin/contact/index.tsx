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
import React, { useState } from "react";

// Chakra UI components
import { Box, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import Card from "components/card/Card";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import Loading from "views/admin/weightStats/components/Loading";
interface LinearGradientTextProps {
  text: any;
  gradient: string;
  fontSize?: string;
  fontFamily?: string;
  mr?: string;
}

interface TimestampedObject {
  date: string;
  weight?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  bodyFatPercentage?: number;
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
  const [isLoading, setIsLoading] = useState(true);

  function maikaTi() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
  React.useEffect(() => {
    maikaTi();
  }, []);
  return (
    <FadeInWrapper>
      <Box
        pt={{ base: "130px", md: "80px", xl: "80px" }}
        style={{ overflow: "hidden" }}
      >
        {isLoading ? (
          <Box
            mt="37vh"
            minH="600px"
            opacity={isLoading ? 1 : 0}
            transition="opacity 0.5s ease-in-out"
          >
            <Loading />
          </Box>
        ) : (
          <Box transition="0.2s ease-in-out">
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
              mb="20px"
              backgroundImage={`url(${backgroundImage})`}
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              backgroundPosition="center"
              transition="background-image 0.25s ease-in-out"
            >
              maika ti
            </Card>
          </Box>
        )}
      </Box>
    </FadeInWrapper>
  );
}
