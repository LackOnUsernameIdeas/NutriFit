import React from "react";
// Chakra imports
import { 
    Input,
    Button,
    Flex
  } from "@chakra-ui/react";
import { CustomServingInputProps } from "../../../../types/weightStats"

export const CustomServingInput: React.FC<CustomServingInputProps> = ({
    value,
    onIncrement,
    onDecrement
}) => {
    return (
      <Flex>
        <Button size='lg' onClick={onDecrement}>-</Button>
        <Input
          type="number"
          placeholder="Custom Serving"
          value={value}
          readOnly={true}
          cursor="default"
          variant='auth'
          fontSize='sm'
          ms={{ base: "0px", md: "0px" }}
          fontWeight='500'
          mb="2px"
          size='lg'
        />
        <Button size='lg' onClick={onIncrement}>+</Button>
      </Flex>
    );
};