// UserPreferencesInput.tsx
import React from 'react';
import { Input, VStack, Button, Text, Flex, Box, SimpleGrid} from "@chakra-ui/react";
import { UserPreferences } from "../variables/mealPlaner";
import { HSeparator } from "components/separator/Separator";
import Card from "components/card/Card";

interface UserPreferencesInputProps {
  userPreferences: UserPreferences;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generatePlan: () => void;
}
const placeholders: string[] = ["2000","150","70","200"];

const UserPreferencesInput: React.FC<UserPreferencesInputProps> = ({ userPreferences, handleInputChange, generatePlan }) => {
  return (
    <Card>
      <Flex justify="center" w="100%" mb="1%">
        <Text fontSize="4xl">
          Input Desired Values
        </Text>
      </Flex>
      <HSeparator />
      <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px'>
        {Object.entries(userPreferences).map(([key], index) => (
          <Box>
            <Flex justify="center" pt="5px" w="100%" mt="5px">
              <Text fontSize="2xl" key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
            </Flex>
            <Flex>
              <Input 
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                placeholder={placeholders[index]}
                value={(userPreferences as any)[key]}
                mt="1%"
                fontWeight='500'
                size='lg'
                type="number" 
                name={key} 
                onChange={handleInputChange} />
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
      <Button onClick={generatePlan} mt="2%" minH="15%" mb="1%">Generate Meal Plan</Button>
    </Card>
  );
};

export default UserPreferencesInput;