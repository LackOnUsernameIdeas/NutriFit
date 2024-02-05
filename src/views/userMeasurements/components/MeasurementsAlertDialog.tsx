import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton
} from "@chakra-ui/react";
import { useDisclosure, Button } from "@chakra-ui/react";

import { UserData } from "../../../types/weightStats";

function MeasurementsAlertDialog(props: {
  handleSubmit: (event: React.FormEvent) => void;
  userData: UserData;
  checkUpdate: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [valuesToCheck, setValuesToCheck] = React.useState({
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0
  });
  const [buttonText, setButtonText] = React.useState<string>(
    props.checkUpdate ? "Актуализирайте" : "Изпратете"
  );

  React.useEffect(() => {
    // Зарежда последно запазените данни от Local Storage
    const storedValues = JSON.parse(
      localStorage.getItem("lastTypedValues") || "{}"
    );

    // Check if stored values are different from current valuesToCheck
    if (
      !Object.keys(storedValues).every(
        (key) =>
          storedValues[key] === valuesToCheck[key as keyof typeof valuesToCheck]
      )
    ) {
      // If they are different, update the values to check
      setValuesToCheck(storedValues as typeof valuesToCheck);
    }
  }, [props.userData]);

  React.useEffect(() => {
    console.log("checkUpdate value:", props.checkUpdate);

    if (props.checkUpdate) {
      setButtonText("Актуализирайте");
    } else {
      setButtonText("Изпратете");
    }
  }, [props.checkUpdate]);
  const translateKey = (key: any) => {
    // Replace this logic with your actual translation logic
    // For simplicity, let's assume a simple translation for demonstration purposes
    switch (key) {
      case "height":
        return "Височина";
      case "age":
        return "Възраст";
      case "weight":
        return "Тегло";
      case "neck":
        return "Обиколка на врат";
      case "waist":
        return "Обиколка на талия";
      case "hip":
        return "Oбиколка на таз";
      default:
        return key;
    }
  };

  const handleOpen = () => {
    onOpen();
  };

  const handleConfirm = (event: React.FormEvent) => {
    props.handleSubmit(event);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="100%"
        h="50"
        mb="24px"
      >
        {buttonText}
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Потвърждение
            </AlertDialogHeader>

            <AlertDialogCloseButton />

            <AlertDialogBody>
              Моля, проверете дали сте на път да регистрирате правилните си
              данни:
            </AlertDialogBody>

            <AlertDialogBody>
              {Object.entries(valuesToCheck).map(([key, value]) => (
                <p key={key}>
                  {translateKey(key as any)}: {value}
                </p>
              ))}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={handleClose}
                fontSize="sm"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
              >
                Назад
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirm}
                ml={3}
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
              >
                Потвърждение
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default MeasurementsAlertDialog;
