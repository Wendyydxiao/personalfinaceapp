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
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../utils/queries';
import AuthService from '../utils/auth';

const Profile = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  const redirectToStripe = async () => {
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const session = await response.json();

      if (session.id) {
        // Redirect to Stripe's checkout page
        window.location.href = session.url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading profile information
      </Alert>
    );

  const { username, email } = data.getUser;

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
              value={username}
              isReadOnly
              _focus={{ boxShadow: 'none' }}
              _hover={{ cursor: 'not-allowed' }}
            />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
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
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </FormControl>

          <Box
            bgColor="orange.400"
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

          <Button colorScheme="purple" width="full">
            Save Changes
          </Button>

          <Button
            colorScheme="purple"
            variant="outline"
            onClick={handleLogout}
            width="full"
            mt={2}
          >
            Log Out
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Profile;
