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
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { FaFireAlt, FaAngleRight, FaAngleDown } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import { ColumnChart } from "components/charts/BarCharts";
import { Meal } from "types/weightStats";
export default function NFT(props: {
  image: string;
  name: string;
  count: string;
  instructions: string[];
  ingredients: string[];
  totals: any;
  topMeals: Meal[];
}) {
  const { image, name, count, instructions, ingredients, totals, topMeals } =
    props;
  const boxBg = useColorModeValue("secondaryGray.300", "#263363");
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
  console.log("topMeals:", topMeals);

  const rank = topMeals
    ? topMeals.findIndex((meal) => {
        console.log("meal.name:", meal.name);
        console.log("name:", name);
        return meal.name === name;
      }) + 1
    : null;

  console.log("rank:", rank);
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
    <FadeInWrapper>
      <Card
        _hover={bgItem}
        bg="transparent"
        boxShadow="unset"
        px="24px"
        py="21px"
        transition="0.2s linear"
        cursor="pointer"
        onClick={handleDropdownToggle}
        overflow="visible"
      >
        <Flex direction={{ base: "column" }} justify="center">
          <Flex position="relative" align="center" zIndex="1">
            <Icon
              as={renderDropdown ? FaAngleDown : FaAngleRight}
              mr={renderDropdown ? "auto" : undefined}
              ml={renderDropdown ? undefined : "auto"}
              mt={renderDropdown ? "25px" : undefined}
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
                  mx="16px"
                />
                <Flex
                  direction="column"
                  w={{ base: "70%", md: "100%" }}
                  me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }}
                >
                  <Flex>
                    {rank && (
                      <Text
                        fontSize="2xl"
                        mr="5px"
                        color={
                          rank === 1
                            ? "gold"
                            : rank === 2
                            ? "silver"
                            : rank === 3
                            ? "#cd7f32"
                            : textColor
                        }
                      >
                        <b>#{rank}</b>
                      </Text>
                    )}
                    <Text
                      color={textColor}
                      fontSize={{
                        base: "lg"
                      }}
                      mb="5px"
                      fontWeight="bold"
                      me="14px"
                      mt="5px"
                    >
                      {name}
                    </Text>
                  </Flex>
                  <Text
                    color="secondaryGray.600"
                    fontSize={{
                      base: "md"
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
            <animated.div
              style={{ ...slideAnimationDrop, position: "relative" }}
            >
              <Card
                bg="transparent"
                minH={{ base: "800px", md: "300px", xl: "180px" }}
              >
                <SimpleGrid
                  columns={{ base: 1, md: 2, xl: 2 }}
                  mt="60px"
                  gap="20px"
                >
                  <Flex>
                    <Flex direction="column" onClick={handleDropdownToggle}>
                      <Image
                        src={image}
                        maxW="400px"
                        h="400px"
                        borderRadius="20px"
                        backgroundColor={boxBg}
                        mx="16px"
                        mr="20px"
                      />
                    </Flex>
                    <Flex
                      minW="100%"
                      direction="column"
                      w={{ base: "70%", md: "100%" }}
                      me={{
                        base: "4px",
                        md: "32px",
                        xl: "10px",
                        "3xl": "32px"
                      }}
                    >
                      {rank && (
                        <Text
                          fontSize="5xl"
                          mb="0px"
                          color={
                            rank === 1
                              ? "gold"
                              : rank === 2
                              ? "silver"
                              : rank === 3
                              ? "#cd7f32"
                              : textColor
                          }
                        >
                          <b>#{rank}</b>
                        </Text>
                      )}
                      <Text
                        color={textColor}
                        fontSize={{ base: "3xl" }}
                        mb="5px"
                        fontWeight="bold"
                        me="14px"
                        maxW="300px"
                      >
                        {name}
                      </Text>
                      <Text
                        color="secondaryGray.600"
                        fontSize={{ base: "xl" }}
                        fontWeight="400"
                        me="14px"
                      >
                        {count}
                      </Text>
                      <SimpleGrid
                        mt="auto"
                        mb="25px"
                        columns={{ base: 1, md: 1, xl: 1 }}
                      >
                        <Text
                          color="secondaryGray.600"
                          fontSize={{
                            base: "xl"
                          }}
                          fontWeight="400"
                          me="14px"
                          mb="20px"
                        >
                          Грамаж за една порция: {totals.calories}g
                        </Text>
                        <Button
                          onClick={(event) => {
                            onOpenIngredients();
                            event.stopPropagation();
                          }}
                          borderRadius="20px"
                          zIndex="2"
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
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Продукти
                              </AlertDialogHeader>

                              <AlertDialogCloseButton borderRadius="20px" />

                              <AlertDialogBody>
                                {ingredients.map((ingredient, index) => (
                                  <Text key={index}>{ingredient}</Text>
                                ))}
                              </AlertDialogBody>
                              <AlertDialogFooter></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>
                        <Button
                          onClick={(event) => {
                            onOpenBMIAlert();
                            event.stopPropagation();
                          }}
                          borderRadius="20px"
                          size="lg"
                          zIndex="2"
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
                              <AlertDialogHeader
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Стъпки за приготвяне
                              </AlertDialogHeader>

                              <AlertDialogCloseButton borderRadius="20px" />
                              <AlertDialogBody>
                                {instructions.map((instruction, index) => (
                                  <Text key={index}>{instruction}</Text>
                                ))}
                              </AlertDialogBody>
                              <AlertDialogFooter></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog>
                      </SimpleGrid>
                    </Flex>
                  </Flex>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, xl: 2 }}
                    gap="20px"
                    onClick={handleDropdownToggle}
                  >
                    <Box mb="20px">
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
                        value={totals.calories + " kCal"}
                        backgroundColor={boxBg}
                      />
                      <SimpleGrid
                        columns={{ base: 1, md: 1, lg: 1, "2xl": 1 }}
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
                          value={totals.carbohydrates + " g"}
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
                          value={totals.fat + " g"}
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
                          value={totals.protein + " g"}
                          backgroundColor={boxBg}
                        />
                      </SimpleGrid>
                    </Box>
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
                        value={totals.grams + " g"}
                        backgroundColor={boxBg}
                      />

                      <Card
                        alignItems="center"
                        flexDirection="column"
                        minH={{ sm: "150px", md: "300px", lg: "300px" }}
                        minW={{ sm: "150px", md: "200px", lg: "100%" }}
                        backgroundColor={boxBg}
                        maxH="400px"
                        mt="20px"
                      >
                        <ColumnChart
                          chartData={[
                            totals.protein,
                            totals.fat,
                            totals.carbohydrates
                          ]}
                          chartLabels={["Протеин", "Мазнини", "Въглехидрати"]}
                          chartLabelName={"Нутриенти (g.)"}
                          textColor={chartsColor}
                        />
                      </Card>
                    </Box>
                  </SimpleGrid>
                </SimpleGrid>
              </Card>
            </animated.div>
          )}
        </Flex>
      </Card>
    </FadeInWrapper>
  );
}
