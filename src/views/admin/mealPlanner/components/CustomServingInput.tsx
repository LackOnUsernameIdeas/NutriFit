import React from "react";
// Chakra imports
import { 
    Input,
    Button
  } from "@chakra-ui/react";
import { CustomServingInputProps } from "../variables/mealPlaner"

export const CustomServingInput: React.FC<CustomServingInputProps> = ({
    value,
    onIncrement,
    onDecrement
}) => {
    return (
      <>
        <Button onClick={onDecrement}>-</Button>
        <Input
          type="number"
          placeholder="Custom Serving"
          value={value}
          readOnly
        />
        <Button onClick={onIncrement}>+</Button>
      </>
    );
};