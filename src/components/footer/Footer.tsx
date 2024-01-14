import {
  Box,
  Heading,
  Flex,
  List,
  ListItem,
  Link,
  Text,
  SimpleGrid,
  useColorModeValue,
  Image
} from "@chakra-ui/react";

const Footer = () => {
  const footerColor = useColorModeValue("white", "#111c44");
  const brandColor = useColorModeValue("brand.500", "white");

  return (
    <Box
      as="footer"
      bg={footerColor}
      borderTop="1px solid"
      borderColor={footerColor}
      py="2.5rem"
      fontSize="0.875rem"
    >
      <Box maxW="64rem" pb="2rem" mx="auto">
        <Flex flexWrap="wrap" alignItems="start" justifyContent="space-between">
          <Box
            w={{ base: "100%", sm: "50%", md: "max-content" }}
            mb={{ base: "1.5rem", lg: "0" }}
          >
            <Text
              color="gray.700"
              mb="0.5rem"
              fontSize="1.5rem"
              fontWeight="600"
              fontFamily="DM Sans"
              display="inline"
              mr="1px"
            >
              Nutri
            </Text>
            <Text
              color="gray.700"
              mb="0.5rem"
              fontSize="1.5rem"
              fontWeight="600"
              fontFamily="Leckerli One"
              display="inline"
            >
              Fit
            </Text>
            <List lineHeight="2" justifyContent="center">
              <LinkItem
                text="НОИТ 2024"
                href="https://edusoft.fmi.uni-sofia.bg/"
              />
              <Text color="rgba(113, 128, 150, 1)" fontWeight="600">
                Проект 249
              </Text>
              <Text color="rgba(113, 128, 150, 1)" fontWeight="600">
                Калоян Костадинов
              </Text>
              <Text color="rgba(113, 128, 150, 1)" fontWeight="600">
                Ивайло Здравков
              </Text>
              <LinkItem
                text="ПГИ Перник"
                href="https://pgi-pernik.bg-schools.com/"
              />
            </List>
          </Box>
          <Box
            w={{ base: "100%", sm: "50%", md: "max-content" }}
            mb={{ base: "1.5rem", lg: "0" }}
          >
            <Text
              color="gray.700"
              mb="0.5rem"
              fontSize="1.5rem"
              fontWeight="600"
              display="inline"
            >
              Бързи Връзки
            </Text>
            <List lineHeight="2">
              <LinkItem text="Статистики за Тегло" href="/#/admin/weight" />
            </List>
          </Box>
          <Box
            w={{ base: "100%", sm: "50%", md: "max-content" }}
            mb={{ base: "1.5rem", lg: "0" }}
          >
            <Text
              color="gray.700"
              mb="0.5rem"
              fontSize="1.5rem"
              fontWeight="600"
              display="inline"
            >
              Източници
            </Text>
            <List lineHeight="2">
              <LinkItem
                text="Nutritionix API"
                href="https://www.nutritionix.com/business/api"
              />
            </List>
          </Box>
          <Box
            w={{ base: "100%", sm: "50%", md: "max-content" }}
            mb={{ base: "1.5rem", lg: "0" }}
          >
            <Box boxSize="170px">
              <Image
                src="https://tubefeel.noit.eu/static/media/footer_technologies.e02131cc1165be88341a.png"
                alt="Dan Abramov"
              />
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

type LinkItemProps = {
  text?: string;
  isTag?: boolean;
  tagText?: string;
  href?: string;
};

const LinkItem = ({ text, isTag = false, tagText, href }: LinkItemProps) => {
  return (
    <ListItem display="flex">
      <Link
        fontWeight="600"
        href={href}
        target="_blank"
        color="rgba(113, 128, 150, 1)"
        _hover={{ color: "brand.500" }}
      >
        {text}
      </Link>
      {isTag && (
        <Text
          as="span"
          bg="#008F94"
          px="0.25rem"
          display="inline-flex"
          alignItems="center"
          color="#fff"
          height="1.25rem"
          borderRadius="0.25rem"
          ml="0.25rem"
          mt="0.25rem"
          fontSize="0.75rem"
        >
          {tagText}
        </Text>
      )}
    </ListItem>
  );
};

export default Footer;
