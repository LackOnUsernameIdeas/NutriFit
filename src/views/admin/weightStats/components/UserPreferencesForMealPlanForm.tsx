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

  return (
    <Card>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={{ base: "10px", md: "20px" }}
      >
        {Object.entries(userPreferences).map(([key, value], index) => (
          <Box key={key}>
            <Flex justify="center" pt="5px" w="100%" mt="5px">
              <Text fontSize="2xl" mb="0px">
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
                  mt={{ base: "0", md: "1%", sm: "0"}}
                  mb={{ base: "1%", md: "2%", sm: "4%"}}
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
                  mt={{ base: "0", md: "1%", sm: "0"}}
                  mb={{ base: "1%", md: "2%", sm: "4%"}}
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
        mt={{ base: "10%", lg: "5%" }}
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
