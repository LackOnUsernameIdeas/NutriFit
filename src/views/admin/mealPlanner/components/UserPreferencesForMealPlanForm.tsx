// UserPreferencesInput.tsx
import React from "react";
import {
  Input,
  Button,
  CheckboxGroup,
  Checkbox,
  HStack,
  Text,
  Flex,
  Icon,
  Box,
  Image,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { UserPreferencesForMealPlan } from "../../../../types/weightStats";
import { useSpring, animated } from "react-spring";
import Card from "components/card/Card";

interface UserPreferencesInputProps {
  userPreferences: UserPreferencesForMealPlan;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generatePlan: () => void;
}
const fieldName: string[] = [
  "калории",
  "протеин",
  "мазнини",
  "въглехидрати",
  "кухня",
  "какво да не се включва"
];

const UserPreferencesForMealPlanForm: React.FC<UserPreferencesInputProps> = ({
  userPreferences,
  handleInputChange,
  handleCheckboxChange,
  generatePlan
}) => {
  const textColor = useColorModeValue("#1a202c", "white");
  const bgButton = useColorModeValue("secondaryGray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string;
  }>({});

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -80}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const slideAnimation = useSpring({
    transform: `translateY(${dropdownVisible ? -10 : 0}px)`
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

  const isNutrientDataValid = () => {
    const errors: { [key: string]: string } = {};

    const validateNutrient = (
      value: number,
      fieldName: string,
      fieldNameBG: string
    ) => {
      if (value <= 0) {
        errors[
          fieldName
        ] = `Моля, въведете валидна стойност за ${fieldNameBG}.`;
      }
    };

    validateNutrient(userPreferences.Calories, "Calories", fieldName[0]);
    validateNutrient(
      userPreferences.Carbohydrates,
      "Carbohydrates",
      fieldName[3]
    );
    validateNutrient(userPreferences.Fat, "Fat", fieldName[2]);
    validateNutrient(userPreferences.Protein, "Protein", fieldName[1]);

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isNutrientDataValid()) {
      generatePlan();
    }
  };

  const englishCuisines = [
    "Bulgarian",
    "English",
    "Chinese",
    "Mexican",
    "Indian",
    "Spanish",
    "Italian",
    "French"
  ];

  const bulgarianCuisines = [
    "Българска",
    "Английска",
    "Китайска",
    "Мексиканска",
    "Индийска",
    "Испанска",
    "Италианска",
    "Френска"
  ];

  const countriesFlags = [
    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Bulgaria.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/800px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/1200px-Flag_of_Mexico.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1280px-Bandera_de_Espa%C3%B1a.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/800px-Flag_of_France.svg.png"
  ];
  return (
    <Card>
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: "10px", md: "20px" }}
      >
        {Object.entries(userPreferences).map(([key, value], index) => {
          if (key !== "Cuisine") {
            return (
              <Box key={key}>
                <Flex justify="center" pt="5px" w="100%" mt="5px">
                  <Text fontSize="2xl" mb="0px">
                    {fieldName[index].charAt(0).toUpperCase() +
                      fieldName[index].slice(1)}
                    :
                  </Text>
                </Flex>
                <Flex>
                  {value !== 0 && typeof value !== "string" ? (
                    <Input
                      variant="auth"
                      color={textColor}
                      focusBorderColor="#7551ff"
                      fontSize={{ base: "sm", md: "md" }}
                      ms={{ base: "0px", md: "0px" }}
                      placeholder={"Въведете " + fieldName[index]}
                      _placeholder={{ opacity: 1, color: "gray.500" }}
                      value={value || ""}
                      mt={{ base: "0", md: "1%", sm: "0" }}
                      mb={{ base: "1%", md: "2%", sm: "4%" }}
                      fontWeight="500"
                      size="lg"
                      type="number"
                      name={key}
                      onChange={handleInputChange}
                    />
                  ) : typeof value == "string" ? (
                    <Input
                      variant="auth"
                      color={textColor}
                      focusBorderColor="#7551ff"
                      fontSize={{ base: "sm", md: "md" }}
                      ms={{ base: "0px", md: "0px" }}
                      placeholder={"Въведете " + fieldName[index]}
                      _placeholder={{ opacity: 1, color: "gray.500" }}
                      value={value || ""}
                      mt={{ base: "0", md: "1%", sm: "0" }}
                      mb={{ base: "1%", md: "2%", sm: "4%" }}
                      fontWeight="500"
                      size="lg"
                      type="text"
                      name={key}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Input
                      variant="auth"
                      color={textColor}
                      focusBorderColor="#7551ff"
                      fontSize={{ base: "sm", md: "md" }}
                      ms={{ base: "0px", md: "0px" }}
                      placeholder={"Въведете " + fieldName[index]}
                      _placeholder={{ opacity: 1, color: "gray.500" }}
                      value={""}
                      mt={{ base: "0", md: "1%", sm: "0" }}
                      mb={{ base: "1%", md: "2%", sm: "4%" }}
                      fontWeight="500"
                      size="lg"
                      type="number"
                      name={key}
                      onChange={handleInputChange}
                    />
                  )}
                </Flex>
                {validationErrors[key] && (
                  <Text color="red" fontSize="sm">
                    {validationErrors[key]}
                  </Text>
                )}
              </Box>
            );
          }
        })}
        <Box mt="20px">
          <Card
            onClick={handleDropdownToggle}
            cursor="pointer"
            zIndex="1"
            position="relative"
            bg={dropdownVisible ? dropdownActiveBoxBg : dropdownBoxBg}
            transition="background-image 0.5s ease-in-out"
            style={{ height: "80px" }}
          >
            <Flex justify="space-between" alignItems="center" mt="3px">
              <Text
                fontSize="2xl"
                style={
                  dropdownVisible
                    ? {
                        backgroundImage: gradient,
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                      }
                    : {}
                }
                userSelect="none"
              >
                {dropdownVisible ? <b>Изберете кухня:</b> : "Изберете кухня:"}
              </Text>
              <Icon
                as={dropdownVisible ? FaAngleUp : FaAngleDown}
                boxSize={6}
                color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
              />
            </Flex>
          </Card>
          {renderDropdown && (
            <animated.div
              style={{ ...slideAnimationDrop, position: "relative" }}
            >
              <Card
                bg={boxBg}
                minH={{ base: "800px", md: "300px", xl: "100px" }}
              >
                <SimpleGrid mt="50px" columns={{ base: 2, md: 3 }}>
                  {englishCuisines.map((cuisine, index) => (
                    <Checkbox
                      key={cuisine}
                      name={cuisine}
                      isChecked={
                        Array.isArray(userPreferences.Cuisine)
                          ? userPreferences.Cuisine.includes(cuisine)
                          : userPreferences.Cuisine === cuisine
                      }
                      onChange={handleCheckboxChange}
                    >
                      <Flex alignItems="center" gap="3px">
                        {bulgarianCuisines[index]}
                        <Image src={`${countriesFlags[index]}`} maxW="20px" />
                      </Flex>
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </Card>
            </animated.div>
          )}
        </Box>
      </SimpleGrid>
      <animated.div style={{ ...slideAnimation, position: "relative" }}>
        <Button
          onClick={handleSubmit}
          mt={dropdownVisible ? {} : { base: "10%", lg: "5%" }}
          minH="60px"
          minW="100%"
          backgroundColor={bgButton}
          color={brandColor}
        >
          Създайте хранителен план
        </Button>
      </animated.div>
    </Card>
  );
};

export default UserPreferencesForMealPlanForm;
