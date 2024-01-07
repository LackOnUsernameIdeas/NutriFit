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
        <Button size='lg' onClick={onDecrement}>-</Button>
        <Input
          type="number"
          placeholder="Custom Serving"
          value={value}
          readOnly
          variant='auth'
          fontSize='sm'
          ms={{ base: "0px", md: "0px" }}
          fontWeight='500'
          mb="2px"
          size='lg'
        />
        <Button size='lg' onClick={onIncrement}>+</Button>
      </>
    );
};