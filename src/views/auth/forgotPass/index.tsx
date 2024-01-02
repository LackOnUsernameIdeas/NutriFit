import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { getAuth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, verifyPasswordResetCode, confirmPasswordReset, setPersistence, browserSessionPersistence, sendPasswordResetEmail, onAuthStateChanged, User } from 'firebase/auth';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken'

function ForgotPass() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForgotPass = async () => {
    try {
        const auth = getAuth();
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length === 0) {
            // Email is not registered
            setError('Email is not registered. Create an account using the button below.');
            return;
        }
        await sendPasswordResetEmail(auth, email);
        // Password reset email sent successfully
        setSuccessMessage('Password reset email sent successfully! Check your inbox.');
        setTimeout(()=> {
            history.push('auth/sign-in')
        }, 5000)
    } catch (error) {
        if (error instanceof Error) {
          switch(error.message){
            case 'auth/invalid-email':
              setError('An invalid email has been provided.');
              break;
            case 'auth/invalid-password':
              setError('Password should be at least 6 characters long.');
              break;
            case 'auth/invalid-credential':
              setError('Could not sign in, please try again.');
              break;
            case 'auth/user-not-found':
              setError('Could not sign in, please try again.');
              break;
            default:
              setError('An error has occurred while signing in: ' + error.message)
          }
        } else {
          setError('An error has occurred while signing in.');
        }
      }
  };  
  //Use useEffect to monitor authentication state changes and manage cookies
  useEffect(() => {
    const auth = getAuth();

    // Set up an authentication state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //Set a cookie with user UID
        Cookies.set('uid', user.uid, { expires: 1 }); // Set cookie to expire in certain amount of days (1)
      } else {
        // User is signed out, clear the cookie
        Cookies.remove('uid');
      }
    });
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once after the initial render
  
  //TODO: make the dumb fucking jwt tokens work

  // const getUserUID = (user: User) => user.uid;

  // const generateToken = (user: User) => {
  //   const uid = getUserUID(user);
    
  //   const payload = {
  //     uid
  //   };
  //   const secretKey = process.env.REACT_APP_ACCESS_TOKEN_SECRET as string;
  //   const options = { 
  //     expiresIn: '1d',
  //   };

  //   return jwt.sign(payload, secretKey, options);
  // };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='center'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Forgot Password?
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Please provide your email and we'll send a password reset.
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <Flex align='center' mb='25px'>
                <HSeparator />
            </Flex>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='example@noit.eu'
              mb='24px'
              fontWeight='500'
              size='lg'
              onChange={(email) => setEmail(email.target.value)}
            />
            <Button
              onClick={handleForgotPass}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Send email
            </Button>
            {successMessage && (
                <Text color='green' fontSize='sm' mb='8px'>
                {successMessage}
                </Text>
            )}
            {error && (
                <Text color='red' fontSize='sm' mb='8px'>
                {error}
                </Text>
            )}
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
export default ForgotPass;