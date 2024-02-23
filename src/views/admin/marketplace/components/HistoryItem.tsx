import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  Box,
  Icon,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
  SimpleGrid,
  Button
} from "@chakra-ui/react";
import { FaFireAlt, FaAngleRight, FaAngleDown } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import { ColumnChart } from "components/charts/BarCharts";

export default function NFT(props: {
  image: string;
  name: string;
  count: string;
  instructions: string[];
  ingredients: string[];
  totals: any;
}) {
  const { image, name, count, instructions, ingredients, totals } = props;
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
  const chartsColor = useColorModeValue("brand.500", "white");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);
  const borderColor = useColorModeValue("secondaryGray.200", "whiteAlpha.200");
  const cancelRefBMIAlert = React.useRef();
  const {
    isOpen: isOpenBMIAlert,
    onOpen: onOpenBMIAlert,
    onClose: onCloseBMIAlert
  } = useDisclosure();

  const cancelRefIngredients = React.useRef();
  const {
    isOpen: isOpenIngredients,
    onOpen: onOpenIngredients,
    onClose: onCloseIngredients
  } = useDisclosure();

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
      cursor="pointer"
      overflow="visible"
    >
      <Flex direction={{ base: "column" }} justify="center">
        <Flex
          position="relative"
          align="center"
          zIndex="1"
          onClick={handleDropdownToggle}
        >
          <Icon
            as={renderDropdown ? FaAngleDown : FaAngleRight} // Conditionally render the arrow based on the dropdown state
            mr={renderDropdown ? "auto" : undefined} // If dropdown is rendered, set margin-right to auto to push the arrow to the left
            ml={renderDropdown ? undefined : "auto"} // If dropdown is not rendered, set margin-left to auto to push the arrow to the right
            mt={renderDropdown ? "25px" : undefined} // If dropdown is not rendered, set margin-left to auto to push the arrow to the right
            fontSize="lg"
            color={textColorDate}
          />
          {!renderDropdown && (
            <>
              <Image
                src={image}
                w="66px"
                h="66px"
                borderRadius="20px"
                borderColor={boxBg}
                mx="16px"
                style={{ border: "4px solid #fff" }}
              />
              <Flex
                direction="column"
                w={{ base: "70%", md: "100%" }}
                me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }}
              >
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
                  {count}
                </Text>
              </Flex>
            </>
          )}
        </Flex>
        {renderDropdown && (
          <animated.div style={{ ...slideAnimationDrop, position: "relative" }}>
            <Card
              bg="transparent"
              minH={{ base: "800px", md: "300px", xl: "180px" }}
            >
              <SimpleGrid
                columns={{ base: 1, md: 4, xl: 4 }}
                mt="30px"
                gap="20px"
              >
                <Flex direction="column">
                  <Image
                    src={image}
                    maxW="600px"
                    h="400px"
                    borderRadius="20px"
                    borderColor={boxBg}
                    mx="16px"
                    style={{ border: "4px solid #fff" }}
                  />
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
                  <Flex
                    direction="column"
                    w={{ base: "70%", md: "100%" }}
                    me={{
                      base: "4px",
                      md: "32px",
                      xl: "10px",
                      "3xl": "32px"
                    }}
                  >
                    <Text
                      color={textColor}
                      fontSize={{
                        base: "3xl"
                      }}
                      mb="5px"
                      fontWeight="bold"
                      me="14px"
                      maxW="400px"
                    >
                      {name}
                    </Text>
                    <Text
                      color="secondaryGray.600"
                      fontSize={{
                        base: "xl"
                      }}
                      fontWeight="400"
                      me="14px"
                      mb="100px"
                    >
                      {count}
                    </Text>
                    <Text
                      color="secondaryGray.600"
                      fontSize={{
                        base: "xl"
                      }}
                      fontWeight="400"
                      me="14px"
                      mb="20px"
                    >
                      Грамаж за една порция: {totals.calories}
                    </Text>
                    <Button
                      onClick={onOpenIngredients}
                      borderRadius="20px"
                      size="lg"
                      bg="#7c6bff"
                      color="white"
                      maxW="250px"
                      mb="20px"
                    >
                      <Text fontSize="1xl" fontWeight="400">
                        Вижте продукти
                      </Text>
                    </Button>
                    <AlertDialog
                      isOpen={isOpenIngredients}
                      leastDestructiveRef={cancelRefIngredients}
                      onClose={onCloseIngredients}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Продукти
                          </AlertDialogHeader>

                          <AlertDialogCloseButton borderRadius="20px" />

                          <AlertDialogBody>{ingredients}</AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                    <Button
                      onClick={onOpenBMIAlert}
                      borderRadius="20px"
                      size="lg"
                      bg="#7c6bff"
                      color="white"
                      maxW="250px"
                    >
                      <Text fontSize="1xl" fontWeight="400">
                        Вижте рецепта
                      </Text>
                    </Button>
                    <AlertDialog
                      isOpen={isOpenBMIAlert}
                      leastDestructiveRef={cancelRefBMIAlert}
                      onClose={onCloseBMIAlert}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Стъпки за приготвяне
                          </AlertDialogHeader>

                          <AlertDialogCloseButton borderRadius="20px" />
                          <AlertDialogBody>{instructions}</AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                  </Flex>
                </SimpleGrid>
                <Box>
                  <Box mb="110px">
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={FaFireAlt}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Калории"
                      value={totals.calories}
                      backgroundColor={boxBg}
                    />
                  </Box>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
                    gap="20px"
                    mt="20px"
                  >
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={FaFireAlt}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Въглехидрати"
                      value={totals.carbohydrates}
                      backgroundColor={boxBg}
                    />
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={FaFireAlt}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Мазнини"
                      value={totals.fat}
                      backgroundColor={boxBg}
                    />
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={FaFireAlt}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Протеин"
                      value={totals.protein}
                      backgroundColor={boxBg}
                    />
                  </SimpleGrid>
                </Box>
                <Box>
                  <Box>
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={FaFireAlt}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Грамаж"
                      value={totals.grams}
                      backgroundColor={boxBg}
                    />
                  </Box>
                  <Card
                    alignItems="center"
                    flexDirection="column"
                    minH={{ sm: "150px", md: "300px", lg: "270px" }}
                    minW={{ sm: "150px", md: "200px", lg: "100%" }}
                    backgroundColor={boxBg}
                    maxH="400px"
                    mt="40px"
                  >
                    <ColumnChart
                      chartData={[
                        totals.protein,
                        totals.fat,
                        totals.carbohydrates
                      ]}
                      chartLabels={["Протеин", "Мазнини", "Въглехидрати"]}
                      chartLabelName={"Нутриенти"}
                      textColor={chartsColor}
                    />
                  </Card>
                </Box>
              </SimpleGrid>
            </Card>
          </animated.div>
        )}
      </Flex>
    </Card>
  );
}
