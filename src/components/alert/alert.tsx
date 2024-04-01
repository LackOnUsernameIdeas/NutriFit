import React from "react";
import { Alert, AlertIcon, useColorModeValue } from "@chakra-ui/react";

interface AlertBoxProps {
  status: "success" | "error" | "warning" | "info";
  text: string;
}

const AlertBox: React.FC<AlertBoxProps> = ({ status, text }) => {
  const tipFontWeight = useColorModeValue("500", "100");
  return (
    <Alert
      status={status}
      borderRadius="20px"
      fontWeight={tipFontWeight}
      p="20px"
      w="100%"
      mb="20px"
    >
      <AlertIcon />
      {text}
    </Alert>
  );
};

export default AlertBox;
