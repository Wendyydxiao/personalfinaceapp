import React from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const LoginSignup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      bg="gray.50"
      p={4}
    >
      <Box
        maxW="md"
        w="full"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold">
          Your Personal Finance App
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Manage your expenses effortlessly.
        </Text>
        <Button colorScheme="purple" mb={6} w="full">
          Explore Now
        </Button>

        <VStack spacing={6} mb={8}>
          <Box textAlign="center">
            <Text fontWeight="medium">Start with step one</Text>
            <Text fontSize="sm" color="gray.500">
              Nunc mattis feugiat ex scelerisque congue.
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontWeight="medium">Keep it easy to scan</Text>
            <Text fontSize="sm" color="gray.500">
              Nam ut justo placerat, eleifend sem at, finibus velit.
            </Text>
          </Box>
        </VStack>

        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="name@example.com" />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={handlePasswordVisibility}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Flex justify="space-between" mt={4}>
            <Button colorScheme="blue" variant="outline" width="48%">
              Log-In
            </Button>
            <Button colorScheme="purple" width="48%">
              Sign-Up
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};

export default LoginSignup;
