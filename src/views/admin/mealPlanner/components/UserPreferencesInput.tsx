// UserPreferencesInput.tsx
import React from 'react';
import { Input, VStack, Button } from "@chakra-ui/react";
import { UserPreferences } from "../variables/mealPlaner";


interface UserPreferencesInputProps {
  userPreferences: UserPreferences;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generatePlan: () => void;
}

const UserPreferencesInput: React.FC<UserPreferencesInputProps> = ({ userPreferences, handleInputChange, generatePlan }) => {
  return (
    <VStack spacing={4} align="stretch">
      {Object.entries(userPreferences).map(([key, value]) => (
        <label key={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:
          <Input type="number" name={key} value={value} onChange={handleInputChange} />
        </label>
      ))}
      <Button onClick={generatePlan}>Generate Meal Plan</Button>
    </VStack>
  );
};

export default UserPreferencesInput;