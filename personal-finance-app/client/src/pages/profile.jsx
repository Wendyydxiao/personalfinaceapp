import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box p={6}>
      <Heading>Profile</Heading>
      <VStack spacing={4} mt={4}>
        <Text>User Name</Text>
        <Button colorScheme="red" onClick={handleLogout}>
          Log Out
        </Button>
      </VStack>
    </Box>
  );
}

export default Profile;
