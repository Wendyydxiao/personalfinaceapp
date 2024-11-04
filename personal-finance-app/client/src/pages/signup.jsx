import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../utils/mutations';

function Signup() {
  const navigate = useNavigate();
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [signupUser, { loading }] = useMutation(SIGNUP_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      navigate('/dashboard');
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSignup = async () => {
    console.log('Signup:', username, email, password);
    try {
      await signupUser({
        variables: {
          username,
          email,
          password,
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient="linear(to-r, purple.500, blue.500)"
      p={4}
    >
      <Box
        maxW="lg"
        w="full"
        bg="white"
        p={10}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
      >
        <Heading fontSize="2xl" mb={6} color="purple.600">
          Create Your Account
        </Heading>

        <VStack spacing={5}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Your name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {errorMessage && <Text color="red.500">{errorMessage}</Text>}

          <Button
            colorScheme="purple"
            onClick={handleSignup}
            isLoading={loading}
            width="full"
          >
            Sign Up
          </Button>

          <Text mt={4} color="gray.600">
            Already have an account?{' '}
            <Button
              variant="link"
              colorScheme="purple"
              onClick={() => navigate('/')}
            >
              Log In
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}

export default Signup;


