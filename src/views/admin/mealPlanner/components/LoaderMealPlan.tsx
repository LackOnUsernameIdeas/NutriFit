import { Spinner, Box, Text } from "@chakra-ui/react";

const MealLoading = () => {
  return (
    <Box
      textAlign="center"
      mt="10"
      backgroundImage="none"
      transition="background-image 0.2s ease-in-out"
    >
      <Spinner size="xl" color="brand.500" />
      <Text mt="4" fontSize="3xl" color="gray.600">
        Генерирането на хранителния режим от AI може да отнеме около минута...
      </Text>
    </Box>
  );
};

export default MealLoading;
