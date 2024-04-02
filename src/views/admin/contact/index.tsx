import { useState, ChangeEvent } from "react";

// Chakra UI components
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useColorModeValue
} from "@chakra-ui/react";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";

export default function UserReports() {
  // Chakra Color Mode
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "secondaryGray.500";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [message, setMessage] = useState("");

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
                  borderWidth="1px"
                  fontSize="sm"
                  placeholder="Моля напишете вашето съобщение тук..."
                  _placeholder={{
                    verticalAlign: "top",
                    color: `${textColorSecondary}` // Align placeholder text to the top
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
                  bgColor="#5D4BD7"
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
      </Box>
    </FadeInWrapper>
  );
}
