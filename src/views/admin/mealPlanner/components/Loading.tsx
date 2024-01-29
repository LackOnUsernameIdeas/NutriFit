import { Spinner, Box, Text } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // This ensures that the loading component takes up the full height of the viewport
    >
      <Spinner size="xl" color="brand.500" />
      <Text mt="4" fontSize="lg" color="gray.600">
        Зареждане...
      </Text>
    </Box>
  );
};

export default Loading;
