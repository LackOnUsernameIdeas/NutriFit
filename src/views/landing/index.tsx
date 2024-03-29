// Chakra imports
import {
  Box,
  Flex,
  useMediaQuery,
  SimpleGrid,
  useColorModeValue,
  Text,
  Link,
  Button
} from "@chakra-ui/react";
// Animations
import Card from "components/card/Card";

interface LinearGradientTextProps {
  text: any;
  gradient: string;
  fontSize?: string;
  fontFamily?: string;
  mr?: string;
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
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);

  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <Box pt="80px" mx="auto">
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card>
          <Flex
            justify={isSmallScreen && "center"}
            w="100%"
            mb="5px"
            flexWrap="wrap"
            textAlign={isSmallScreen ? "center" : "start"}
          >
            <Text fontSize="5xl" mr="2">
              Добре дошли в{" "}
            </Text>
            <LinearGradientText
              text={<b>Nutri</b>}
              gradient={gradientNutri}
              fontSize="5xl"
              fontFamily="DM Sans"
            />
            <LinearGradientText
              text={<b>Fit⠀</b>}
              gradient={gradientFit}
              fontFamily="Leckerli One"
              fontSize="5xl"
              mr="2px"
            />
          </Flex>
        </Card>
        <Card>
          <Flex justify="left">
            <Text fontSize="2xl">
              Бъдете винаги във форма и в оптимално здравословно състояние с
              помощта на изкуствен интелект!
            </Text>
          </Flex>
          <Flex
            flexDir={{ base: "column", md: "row" }} // Flex direction changes to column on small screens
            justify={{ base: "center", md: "left" }} // Align items to the center on small screens
            pt="20px"
            gap={{ base: "10px", md: "20px" }} // Adjust gap between buttons based on screen size
            mt={{ base: "30px", md: 0 }} // Adjust margin top based on screen size
          >
            <Link href="/#/auth/sign-in">
              <Button
                color="white"
                bgColor="#5D4BD7"
                variant="brand"
                _hover={{ bg: "secondaryGray.900" }}
                borderRadius="15px"
                px="14px"
                fontWeight="500"
                h={{ base: "50px", md: "50px" }} // Ensure button height remains 50px on larger screens
                mb={{ sm: "10px", md: 0 }} // Add margin bottom to separate buttons on small screens
                textAlign="center" // Center align text on small screens
                width={{ base: "100%", md: "auto" }} // Make button full width on small screens
              >
                <Text fontSize="lg">Влезте в профила си!</Text>
              </Button>
            </Link>
            <Link href="/#/auth/sign-up">
              <Button
                color="white"
                bgColor="#5D4BD7"
                variant="brand"
                _hover={{ bg: "secondaryGray.900" }}
                borderRadius="15px"
                px="14px"
                fontWeight="500"
                h={{ base: "50px", md: "50px" }} // Ensure button height remains 50px on larger screens
                mb={{ base: 0, md: 0 }} // Add margin bottom to separate buttons on small screens
                textAlign="center" // Center align text on small screens
                width={{ base: "100%", md: "auto" }} // Make button full width on small screens
              >
                <Text fontSize="lg">Нова регистрация!</Text>
              </Button>
            </Link>
          </Flex>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
