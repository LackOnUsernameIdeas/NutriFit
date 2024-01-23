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

function MeasurementsAlertDialog(props: {
  handleSubmit: (event: React.FormEvent) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [valuesToCheck, setValuesToCheck] = React.useState({});

  const handleOpen = () => {
    onOpen();
  };

  const handleConfirm = (event: React.FormEvent) => {
    props.handleSubmit(event);
    setValuesToCheck(localStorage.getItem("lastTypedValues"));
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
        Изпрати
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
              {/* {Object.keys(valuesToCheck).forEach((key) => {})} */}
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
