import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  Box,
  Flex,
  Text,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogFooter,
  useColorModeValue
} from "@chakra-ui/react"; // Import necessary Chakra UI components
import { MdOutlineInfo } from "react-icons/md";

interface InfoBoxProps {
  buttonText: string;
  infoText: string[];
}

const InfoBox: React.FC<InfoBoxProps> = ({ buttonText, infoText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const infoBoxIconColor = useColorModeValue("black", "white");
  const bgList = useColorModeValue("secondaryGray.150", "whiteAlpha.100");
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("secondaryGray.200", "whiteAlpha.200");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHoverInfoBox = useColorModeValue(
    { bg: "#C6C7D4" },
    { bg: "whiteAlpha.100" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const cancelRef = React.useRef();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuButton
        alignItems="center"
        justifyContent="center"
        bg={bgButton}
        _hover={bgHoverInfoBox}
        _focus={bgFocus}
        _active={bgFocus}
        w="30px"
        h="30px"
        lineHeight="50%"
        onClick={onOpen}
        borderRadius="20px"
      >
        <Icon as={MdOutlineInfo} color={infoBoxIconColor} w="24px" h="24px" />
      </MenuButton>
      <MenuList
        w="100%"
        minW="unset"
        ml={{ base: "2%", lg: 0 }}
        mr={{ base: "2%", lg: 0 }}
        maxW={{ base: "70%", lg: "80%" }}
        border="transparent"
        backdropFilter="blur(100px)"
        bg={bgList}
        borderRadius="20px"
        p="15px"
      >
        <Box
          transition="0.2s linear"
          color={textColor}
          p="0px"
          maxW={{ base: "80%", lg: "100%" }}
          borderRadius="8px"
        >
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent
                border="2px"
                borderRadius="25px"
                borderColor={borderColor}
              >
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {buttonText}
                </AlertDialogHeader>
                <AlertDialogCloseButton borderRadius="20px" />
                <AlertDialogBody>
                  {infoText.map((text, index) => (
                    <Flex align="center" key={index}>
                      <Text
                        fontSize="sm"
                        fontWeight="400"
                        mt="10px"
                        mb="5px"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    </Flex>
                  ))}
                </AlertDialogBody>
                <AlertDialogFooter></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </MenuList>
    </Menu>
  );
};

export default InfoBox;
