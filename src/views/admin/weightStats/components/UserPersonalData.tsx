// Import necessary dependencies
import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Radio,
  Input,
  Button,
  Stack
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { UserData, HealthInfo, BodyMass } from "../../../../types/weightStats";

interface UserPersonalDataProps {
  userData: UserData;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRadioChange: (key: string, value: string) => void;
  generateStats: () => void;
}

const userDataPropertiesTranslated = [
  "пол",
  "ръст",
  "възраст",
  "тегло",
  "обиколка на врат",
  "обиколка на талия",
  "oбиколка на бедро",
  "цел"
];

// Define the UserForm component
const UserPersonalData: React.FC<UserPersonalDataProps> = ({
  userData,
  handleInputChange,
  handleRadioChange,
  generateStats
}) => {
  const isUserDataValid = () => {
    // Validation logic goes here
    // Example: Numerical values should be greater than zero
    return (
      userData.height > 0 &&
      userData.age > 0 &&
      userData.weight > 0 &&
      userData.neck > 0 &&
      userData.waist > 0 &&
      userData.hip > 0
    );
  };

  const handleSubmit = () => {
    if (isUserDataValid()) {
      generateStats();
    } else {
      // Handle invalid data, you can show an error message or take any other appropriate action
      alert("Please provide valid values for all fields before submitting.");
      // Or you can use a state to manage and display an error message in your UI
      // setError('Please provide valid values for all fields before submitting.');
    }
  };

  return (
    <Card
      overflowX={{ base: "scroll", md: "hidden" }}
      p="20px"
      alignItems="center"
      flexDirection="column"
      w="100%"
      mb="20px"
      maxW="100%"
    >
      <Box gap="10px" mb="20px">
        {Object.entries(userData).map(([key, value], index) => (
          <label key={key}>
            {userDataPropertiesTranslated[index].charAt(0).toUpperCase() +
              userDataPropertiesTranslated[index].slice(1)}
            :
            {typeof value === "number" ? (
              value !== 0 ? (
                <Input
                  variant="auth"
                  type="number"
                  name={key}
                  value={value || ""}
                  placeholder={
                    "Въведете " + userDataPropertiesTranslated[index]
                  }
                  autoComplete="on"
                  onChange={(e) => handleInputChange(e)}
                />
              ) : (
                <Input
                  variant="auth"
                  type="number"
                  name={key}
                  value={""}
                  placeholder={
                    "Въведете " + userDataPropertiesTranslated[index]
                  }
                  autoComplete="on"
                  onChange={(e) => handleInputChange(e)}
                />
              )
            ) : key === "gender" ? (
              <Stack direction="row">
                <Radio
                  value="male"
                  onChange={() => handleRadioChange(key, "male")}
                  isChecked={value === "male"}
                >
                  Мъж
                </Radio>
                <Radio
                  value="female"
                  onChange={() => handleRadioChange(key, "female")}
                  isChecked={value === "female"}
                >
                  Жена
                </Radio>
              </Stack>
            ) : key === "goal" ? (
              <Stack direction="row" alignContent="center" justify="center">
                <SimpleGrid
                  columns={{ base: 3, md: 1, lg: 7 }}
                  spacing="10px"
                  alignItems="center"
                  mb="10px"
                >
                  <Radio
                    value="maintain"
                    onChange={() => handleRadioChange(key, "maintain")}
                    isChecked={value === "maintain"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    ml={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Запази тегло
                  </Radio>
                  <Radio
                    value="mildlose"
                    onChange={() => handleRadioChange(key, "mildlose")}
                    isChecked={value === "mildlose"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Леко сваляне на тегло
                  </Radio>
                  <Radio
                    value="weightlose"
                    onChange={() => handleRadioChange(key, "weightlose")}
                    isChecked={value === "weightlose"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Сваляне на тегло
                  </Radio>
                  <Radio
                    value="extremelose"
                    onChange={() => handleRadioChange(key, "extremelose")}
                    isChecked={value === "extremelose"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Екстремно сваляне на тегло
                  </Radio>
                  <Radio
                    value="mildgain"
                    onChange={() => handleRadioChange(key, "mildgain")}
                    isChecked={value === "mildgain"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Леко качване на тегло
                  </Radio>
                  <Radio
                    value="weightgain"
                    onChange={() => handleRadioChange(key, "weightgain")}
                    isChecked={value === "weightgain"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Качване на тегло
                  </Radio>
                  <Radio
                    value="extremegain"
                    onChange={() => handleRadioChange(key, "extremegain")}
                    isChecked={value === "extremegain"}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Adjust the sizes based on your designfontSize={{ base: "sm", md: "md", lg: "lg" }}  // Adjust the sizes based on your design
                    mr={{ base: "3%", md: "3%", lg: "3%" }}
                  >
                    Екстремно качване на тегло
                  </Radio>
                </SimpleGrid>
              </Stack>
            ) : (
              <Input
                type="radio"
                id={value}
                name="goal"
                value={value}
                onChange={(e) => handleInputChange(e)}
              />
            )}
          </label>
        ))}
        <Button type="submit" onClick={handleSubmit}>
          Изпрати
        </Button>
      </Box>
    </Card>
  );
};

export default UserPersonalData;
