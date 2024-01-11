// UserPreferencesInput.tsx
import React from "react";
import { Input, Button, Text, Flex, Box, SimpleGrid } from "@chakra-ui/react";
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
  const isUserDataValid = () => {
    // Validation logic goes here
    // Example: Numerical values should be greater than zero
    return (
      userPreferences.Calories > 0 &&
      userPreferences.Fat > 0 &&
      userPreferences.Protein > 0 &&
      userPreferences.Carbohydrates > 0
    );
  };

  const handleSubmit = () => {
    if (isUserDataValid()) {
      generatePlan();
    } else {
      // Handle invalid data, you can show an error message or take any other appropriate action
      alert("Please provide valid values for all fields before submitting.");
      // Or you can use a state to manage and display an error message in your UI
      // setError('Please provide valid values for all fields before submitting.');
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
                  isRequired={true}
                  variant="auth"
                  fontSize={{ base: "sm", md: "md" }}
                  ms={{ base: "0px", md: "0px" }}
                  placeholder={"Въведете " + fieldName[index]}
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
                  isRequired={true}
                  variant="auth"
                  fontSize={{ base: "sm", md: "md" }}
                  ms={{ base: "0px", md: "0px" }}
                  placeholder={"Въведете " + fieldName[index]}
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
          </Box>
        ))}
      </SimpleGrid>
      <Button
        onClick={handleSubmit}
        mt={{ base: "10%", lg: "2%" }}
        mb={{ base: "15%", lg: "0%" }}
        minH="15%"
      >
        Създайте хранителен план
      </Button>
    </Card>
  );
};

export default UserPreferencesForMealPlanForm;
