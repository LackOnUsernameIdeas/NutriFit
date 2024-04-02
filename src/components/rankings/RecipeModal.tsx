import { FC, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text
} from "@chakra-ui/react";

interface CustomModalProps {
  title: string;
  ingredients: string[];
  instructions: string[];
  recipeQuantity: number;
}

const CustomModal: FC<CustomModalProps> = ({
  title,
  ingredients,
  instructions,
  recipeQuantity
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <>
      <Button size="lg" bg="#7c6bff" color="white" onClick={onOpen}>
        Начин на приготвяне
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="20px">
          <ModalHeader fontSize="2xl">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <b>Съставки:</b>
            {ingredients.map((step, index) => (
              <Text key={index}>{step}</Text>
            ))}
            <br />
            <b>Инструкции:</b>
            {instructions.map((step, index) => (
              <Text key={index}>{step}</Text>
            ))}
            <br />
            <b>Крайно количество: </b>
            {recipeQuantity}
          </ModalBody>
          <ModalFooter>
            <Button bg="#7c6bff" color="white" mr={3} onClick={onClose}>
              Излез
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
