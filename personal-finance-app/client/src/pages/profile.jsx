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
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE } from '../utils/queries';
// import { UPDATE_PASSWORD } from '../utils/mutations';
import AuthService from '../utils/auth';

const Profile = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  // const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [passwordData, setPasswordData] = useState({     
    newPassword: '',
    confirmPassword: '', });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData ({
      ...passwordData,
      [name]: value,
    });
  };

  // const handleUpdatePassword = async (e) => {
  //   e.preventDefault();

  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     setErrorMessage("Passwords do not match.");
  //     return;
  //   }
  //   try {
  //     await updatePassword({
  //       variables: { newPassword: passwordData.newPassword },
  //     });
  //     alert("Password updated successfully");
  //     setPasswordData({ newPassword: '', confirmPassword: '' });
  //   } catch (err) {
  //     console.error("Password update error:", err);
  //   }
  // };

  const handleLogout = () => {
    AuthService.logout();
  };

  const redirectToStripe = () => {
    window.location.href = 'https://stripe.com'; //UPDATE THIS URL
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return (
    <Alert status="error">
      <AlertIcon />
      Error loading profile information
    </Alert>
  );

  const { name, email } = data.userProfile;

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
              value={name}
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
              name="password"
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

          <Button colorScheme="purple" onClick={handleUpdatePassword} width="full">
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
