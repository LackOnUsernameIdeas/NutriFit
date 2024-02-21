import React, { useState } from "react";
import { Flex, Icon, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { FaEthereum, FaAngleRight, FaAngleDown } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import Card from "components/card/Card";

export default function NFT(props: {
  image: string;
  name: string;
  author: string;
  date: string;
  price: string | number;
}) {
  const { image, name, author, date, price } = props;
  const [expanded, setExpanded] = useState(false);

  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const textColor = useColorModeValue("brands.900", "white");
  const bgItem = useColorModeValue(
    { bg: "white", boxShadow: "0px 40px 58px -20px rgba(112, 144, 176, 0.12)" },
    { bg: "navy.700", boxShadow: "unset" }
  );
  const textColorDate = useColorModeValue("secondaryGray.600", "white");

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -90}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  React.useEffect(() => {
    const handleRestSlidePositionChange = async () => {
      if (dropdownVisible) {
        setMiniStatisticsVisible(true);
        setRenderDropdown(true);
      } else {
        setMiniStatisticsVisible(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdown(false);
          }, 150)
        );
      }
    };

    handleRestSlidePositionChange();
  }, [dropdownVisible]);
  return (
    <Card
      _hover={bgItem}
      bg="transparent"
      boxShadow="unset"
      px="24px"
      py="21px"
      transition="0.2s linear"
      onClick={handleDropdownToggle}
      cursor="pointer"
    >
      <Flex direction={{ base: "column" }} justify="center">
        <Flex position="relative" align="center" zIndex="1">
          <Image src={image} w="66px" h="66px" borderRadius="20px" me="16px" />
          <Flex
            direction="column"
            w={{ base: "70%", md: "100%" }}
            me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }}
          >
            {expanded ? (
              <Icon
                as={FaAngleDown}
                ms="auto"
                fontSize="lg"
                color={textColorDate}
              />
            ) : (
              <Icon
                as={FaAngleRight}
                ms="auto"
                fontSize="lg"
                color={textColorDate}
              />
            )}
            <Text
              color={textColor}
              fontSize={{
                base: "md"
              }}
              mb="5px"
              fontWeight="bold"
              me="14px"
            >
              {name}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={{
                base: "sm"
              }}
              fontWeight="400"
              me="14px"
            >
              {author}
            </Text>
          </Flex>
          <Flex
            me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }}
            align="center"
          >
            <Icon as={FaEthereum} color={textColor} width="9px" me="7px" />
            <Text fontWeight="700" fontSize="md" color={textColor}>
              {price}
            </Text>
          </Flex>
        </Flex>
        {renderDropdown && (
          <animated.div style={{ ...slideAnimationDrop, position: "relative" }}>
            <Card
              bg="transparent"
              minH={{ base: "800px", md: "300px", xl: "180px" }}
            >
              <Flex direction="column" mt="50px">
                <Text fontWeight="700" fontSize="2xl" color="purple">
                  testing
                </Text>
              </Flex>
            </Card>
          </animated.div>
        )}
      </Flex>
    </Card>
  );
}
