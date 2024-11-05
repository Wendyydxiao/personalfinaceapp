import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Center,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log('Password updated:', userData.password);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const redirectToStripe = () => {
    window.location.href = 'https://stripe.com'; //UPDATE THIS URL
  };

  return (
    <Center minH="100vh" bgGradient="linear(to-r, purple.500, blue.500)" p={4}>
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
          User Profile
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={userData.name}
              isReadOnly
              _focus={{ boxShadow: 'none' }}
              _hover={{ cursor: 'not-allowed' }}
            />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={userData.email}
              isReadOnly
              _focus={{ boxShadow: 'none' }}
              _hover={{ cursor: 'not-allowed' }}
            />
          </FormControl>


          <FormControl id="password">
            <FormLabel>Update Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleInputChange}
            />
          </FormControl>

          <Box
            bgColor = "orange.400"
            borderRadius="lg"
            p={6}
            color="white"
            textAlign="center"
            boxShadow="lg"
            my={6}
          >
            <Stack direction="row" spacing={4} align="center" justify="center">
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  Unlock Premium Features!
                </Text>
                <Text fontSize="sm">
                  Get access to advanced tools and insights to boost your experience at AUD$ 2.88 one-off fee only.
                </Text>
              </Box>
            </Stack>
          <Button
              colorScheme="green"
              bg="green.400"
              mt={4}
              _hover={{ bg: 'green.500' }}
              onClick={redirectToStripe}
            >
              Upgrade Now
            </Button>
          </Box>

          <Button colorScheme="purple" onClick={handleSaveChanges} width="full">
            Save Changes
          </Button>

          <Button colorScheme="purple"  variant="outline" onClick={handleLogout} width="full" mt={2}>
            Log Out
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Profile;
