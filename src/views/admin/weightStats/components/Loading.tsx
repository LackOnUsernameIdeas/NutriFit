import { Spinner, Box, Text } from "@chakra-ui/react";

const Loading = () => {
    return (
        <Box textAlign="center" mt="10">
            <Spinner size="xl" color="brand.500" />
            <Text mt="4" fontSize="lg" color="gray.600">
                Loading...
            </Text>
        </Box>
    );
};

export default Loading;