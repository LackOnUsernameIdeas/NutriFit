/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, ChangeEvent } from "react";

// Chakra UI components
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import Card from "components/card/Card";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import Loading from "views/admin/weightStats/components/Loading";
import { HSeparator } from "components/separator/Separator";
interface LinearGradientTextProps {
  text: any;
  gradient: string;
  fontSize?: string;
  fontFamily?: string;
  mr?: string;
}

interface TimestampedObject {
  date: string;
  weight?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  bodyFatPercentage?: number;
}

const LinearGradientText: React.FC<LinearGradientTextProps> = ({
  text,
  gradient,
  fontSize,
  fontFamily,
  mr
}) => (
  <Text
    as="span"
    fontSize={fontSize}
    fontFamily={fontFamily}
    fontWeight="bold"
    mr={mr}
    style={{
      backgroundImage: gradient,
      WebkitBackgroundClip: "text",
      color: "transparent"
    }}
  >
    {text}
  </Text>
);

export default function UserReports() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const brandColor = useColorModeValue("brand.500", "white");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const fontWeight = useColorModeValue("500", "100");
  const bgHover = useColorModeValue("secondaryGray.200", "secondaryGray.900");
  const bgFocus = { bg: "brand.200" };
  const [isLoading, setIsLoading] = useState(false); //set to true if loading implements
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const handleRememberMeChange = async () => {
    setRememberMe(!rememberMe); // Toggle the rememberMe state
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    // Set a character limit, in this case, 200 characters
    if (inputValue.length <= 2000) {
      setMessage(inputValue);
    }
  };

  return (
    <FadeInWrapper>
      <Box
        pt={{ base: "130px", md: "80px", xl: "80px" }}
        style={{ overflow: "hidden" }}
      >
        {isLoading ? (
          <Box
            mt="37vh"
            minH="600px"
            opacity={isLoading ? 1 : 0}
            transition="opacity 0.5s ease-in-out"
          >
            <Loading />
          </Box>
        ) : (
          <Box transition="0.2s ease-in-out">
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
              mb="20px"
            >
              <Text textAlign="start" fontSize="4xl" mb="10px">
                В тази страница имате възможността да направите обратна връзка!
              </Text>
              <HSeparator />
              <Text textAlign="start" fontSize="1xl" mt="20px">
                Ако намерите някакъв проблем в нашето приложение или имате
                препоръки, напишете ни и ние ще отговорим възможно най-бързо!
              </Text>
            </Card>
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
              mb="20px"
            >
              <Flex boxSize="75%">
                <FormControl>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Email<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    type="email"
                    placeholder="example@noit.eu..."
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    backgroundColor={boxBg}
                    // onChange={(email) => setEmail(email.target.value)}
                  />
                  <FormLabel
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    Вашето име<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    type="email"
                    placeholder="Моля напишете вашето име тук..."
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    backgroundColor={boxBg}
                    // onChange={(email) => setEmail(email.target.value)}
                  />
                  <FormLabel
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    Вашето съобщение<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Textarea
                    isRequired={true}
                    variant="auth"
                    borderRadius="20px"
                    borderWidth="2px"
                    fontSize="sm"
                    placeholder="Моля напишете вашето съобщение тук..."
                    _placeholder={{
                      verticalAlign: "top" // Align placeholder text to the top
                    }}
                    value={message}
                    onChange={handleInputChange}
                    backgroundColor={boxBg}
                    mb="24px"
                    fontWeight="500"
                    minHeight="200px"
                    size="lg"
                    maxLength={2000} // Set the maximum number of characters
                    resize="none" // Disable textarea resizing
                  />
                  <Button
                    // onClick={handleSignIn}
                    fontSize="sm"
                    variant="brand"
                    _hover={{ bg: "secondaryGray.900" }}
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                  >
                    Изпратете съобщение
                  </Button>
                </FormControl>
              </Flex>
            </Card>
          </Box>
        )}
      </Box>
    </FadeInWrapper>
  );
}
