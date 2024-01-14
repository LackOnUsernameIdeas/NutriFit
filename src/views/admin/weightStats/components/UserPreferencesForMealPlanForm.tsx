// UserPreferencesInput.tsx
import React from "react";
import {
  Input,
  Button,
  Text,
  Flex,
  Box,
  SimpleGrid,
  useColorModeValue
} from "@chakra-ui/react";
import { UserPreferencesForMealPlan } from "../../../../types/weightStats";
import Card from "components/card/Card";

interface UserPreferencesInputProps {
  userPreferences: UserPreferencesForMealPlan;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generatePlan: () => void;
}
const fieldName: string[] = ["калории", "протеин", "мазнини", "въглехидрати"];

const UserPreferencesForMealPlanForm: React.FC<UserPreferencesInputProps> = ({
  userPreferences,
  handleInputChange,
  generatePlan
}) => {
  const textColor = useColorModeValue("#1a202c", "white");
  const bgButton = useColorModeValue("secondaryGray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "white");
  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string;
  }>({});

  const isNutrientDataValid = () => {
    const errors: { [key: string]: string } = {};

    if (userPreferences.Calories <= 0) {
      errors.Calories = "Моля въведете валидна стойност за калории.";
    }

    if (userPreferences.Carbohydrates <= 0) {
      errors.Carbohydrates = "Моля въведете валидна стойност за въглехидрати.";
    }

    if (userPreferences.Fat <= 0) {
      errors.Fat = "Моля въведете валидна стойност за мазнини.";
    }

    if (userPreferences.Protein <= 0) {
      errors.Protein = "Моля въведете валидна стойност за протеин.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isNutrientDataValid()) {
      generatePlan();
    }
  };

  return (
    <Card>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={{ base: "10px", md: "20px" }}
      >
        {Object.entries(userPreferences).map(([key, value], index) => (
          <Box key={key}>
            <Flex justify="center" pt="5px" w="100%" mt="5px">
              <Text fontSize="2xl">
                {fieldName[index].charAt(0).toUpperCase() +
                  fieldName[index].slice(1)}
                :
              </Text>
            </Flex>
            <Flex>
              {value !== 0 ? (
                <Input
                  color={textColor}
                  focusBorderColor="#7551ff"
                  fontSize={{ base: "sm", md: "md" }}
                  ms={{ base: "0px", md: "0px" }}
                  placeholder={"Въведете " + fieldName[index]}
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  value={value || ""}
                  mt={{ base: "1%", md: "2%" }}
                  fontWeight="500"
                  size="lg"
                  type="number"
                  name={key}
                  onChange={handleInputChange}
                />
              ) : (
                <Input
                  color={textColor}
                  focusBorderColor="#7551ff"
                  fontSize={{ base: "sm", md: "md" }}
                  ms={{ base: "0px", md: "0px" }}
                  placeholder={"Въведете " + fieldName[index]}
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  value={""}
                  mt={{ base: "1%", md: "2%" }}
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
        ))}
      </SimpleGrid>
      <Button
        onClick={handleSubmit}
        mt={{ base: "10%", lg: "2%" }}
        mb={{ base: "15%", lg: "0%" }}
        minH="15%"
        backgroundColor={bgButton}
        color={brandColor}
      >
        Създайте хранителен план
      </Button>
    </Card>
  );
};

export default UserPreferencesForMealPlanForm;
