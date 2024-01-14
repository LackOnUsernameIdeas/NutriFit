// Import necessary dependencies
import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Radio,
  Input,
  Button,
  Stack,
  useColorModeValue
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
  "oбиколка на таз",
  "цел"
];

// Define the UserForm component
const UserPersonalData: React.FC<UserPersonalDataProps> = ({
  userData,
  handleInputChange,
  handleRadioChange,
  generateStats
}) => {
  const textColor = useColorModeValue("#1a202c", "white");
  const bgButton = useColorModeValue("secondaryGray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "white");
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
      errors.height = "Височината трябва да бъде между 130 и 230 см.";
    }

    if (userData.height == 0) {
      errors.height = "Моля въведете височина.";
    }

    if (userData.age < 1 || userData.age > 80) {
      errors.age = "Възрастта трябва да е между 1 и 80 години.";
    }

    if (userData.age == 0) {
      errors.age = "Моля въведете възраст.";
    }

    if (userData.weight < 40 || userData.weight > 160) {
      errors.weight = "Теглото трябва да бъде между 40 и 160 кг.";
    }

    if (userData.weight == 0) {
      errors.weight = "Моля въведете тегло.";
    }

    if (userData.neck < 20 || userData.neck > 60) {
      errors.neck = "Обиколката на врата трябва да бъде между 20 и 60 cm.";
    }

    if (userData.neck == 0) {
      errors.neck = "Моля въведете обиколка на врат.";
    }

    if (userData.waist < 40 || userData.waist > 130) {
      errors.waist = "Обиколката на талията трябва да бъде между 40 и 130 cm.";
    }

    if (userData.waist == 0) {
      errors.waist = "Моля въведете обиколка на талия.";
    }

    if (userData.hip < 40 || userData.hip > 130) {
      errors.hip = "Обиколката на таза трябва да бъде между 40 и 130 cm.";
    }

    if (userData.hip == 0) {
      errors.hip = "Моля въведете обиколка на таз.";
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
                  color={textColor}
                  focusBorderColor="#7551ff"
                  type="number"
                  name={key}
                  value={value || ""}
                  placeholder={
                    "Въведете " + userDataPropertiesTranslated[index]
                  }
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  onChange={(e) => handleInputChangeWithMemory(e)}
                />
              ) : (
                <Input
                  color={textColor}
                  focusBorderColor="#7551ff"
                  type="number"
                  name={key}
                  value={""}
                  placeholder={
                    "Въведете " + userDataPropertiesTranslated[index]
                  }
                  _placeholder={{ opacity: 1, color: "gray.500" }}
                  onChange={(e) => handleInputChangeWithMemory(e)}
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
        <Button
          type="submit"
          onClick={handleSubmit}
          backgroundColor={bgButton}
          color={brandColor}
        >
          Изпрати
        </Button>
      </Box>
    </Card>
  );
};

export default UserPersonalData;
