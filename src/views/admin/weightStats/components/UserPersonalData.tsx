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
  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    // Load stored values from local storage when component mounts
    const storedValues = JSON.parse(
      localStorage.getItem("lastTypedValues") || "{}"
    );
    Object.keys(storedValues).forEach((key) => {
      handleInputChange({
        target: { name: key, value: storedValues[key] }
      } as React.ChangeEvent<HTMLInputElement>);
    });
  }, []);

  const isUserDataValid = () => {
    const errors: { [key: string]: string } = {};

    if (userData.height < 130 || userData.height > 230) {
      errors.height = "Height should be between 130 and 230 cm.";
    }

    if (userData.age < 1 || userData.age > 80) {
      errors.age = "Age should be between 1 and 80 years.";
    }

    if (userData.weight < 40 || userData.weight > 160) {
      errors.weight = "Weight should be between 40 and 160 kg.";
    }

    if (userData.neck < 20 || userData.neck > 60) {
      errors.neck = "Neck circumference should be between 20 and 60 cm.";
    }

    if (userData.waist < 40 || userData.waist > 130) {
      errors.waist = "Waist circumference should be between 40 and 130 cm.";
    }

    if (userData.hip < 40 || userData.hip > 130) {
      errors.hip = "Hip circumference should be between 40 and 130 cm.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChangeWithMemory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    handleInputChange(e);

    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Save the input value to local storage
    const storedValues = JSON.parse(
      localStorage.getItem("lastTypedValues") || "{}"
    );
    localStorage.setItem(
      "lastTypedValues",
      JSON.stringify({ ...storedValues, [name]: value })
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isUserDataValid()) {
      generateStats();
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
                  onChange={(e) => handleInputChangeWithMemory(e)}
                  required
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
                  onChange={(e) => handleInputChangeWithMemory(e)}
                  required
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
            {validationErrors[key] && (
              <Text color="red" fontSize="sm">
                {validationErrors[key]}
              </Text>
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
