import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const Entry = () => {
  const [expenses, setExpenses] = useState([]);

  const [newExpense, setNewExpense] = useState({
    type: 'Expense',
    category: '',
    amount: '',
    date: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = () => {
    const newEntry = { ...newExpense, id: Date.now() };
    setExpenses([...expenses, newEntry]);
    setNewExpense({ type: 'Expense', category: '', amount: '', date: '', notes: '' });
  };


  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };


//HARDCODE TEST DATA, RMB TO REMOVE
  const incomeCategories = ['Salary', 'Investment', 'Freelancing', 'Others'];
  const expenseCategories = [
    'Rent/Mortgage',
    'Utilities',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Healthcare',
    'Insurance',
    'Debt Payments',
    'Education',
    'Personal Care',
    'Entertainment',
    'Clothing',
    'Savings/Investments',
    'Gifts/Donations',
    'Travel/Vacation',
    'Miscellaneous'];

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-r, purple.500, blue.500)"
      p={6}
    >
      <Box
        maxW="lg"
        w="full"
        bg="white"
        p={10}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
        mb={10}
        mx="auto"
      >
        <Heading fontSize="2xl" color="purple.600" mb={6}>
          Manage Expenses & Income
        </Heading>

        <VStack spacing={4} align="stretch">
          <FormControl id="type">
            <FormLabel>Entry Type</FormLabel>
            <Select
              name="type"
              value={newExpense.type}
              onChange={handleInputChange}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Select>
          </FormControl>

          <FormControl id="category">
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select category"
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
            >
              {(newExpense.type === 'Income' ? incomeCategories : expenseCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="amount">
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={newExpense.amount}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="date">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="notes">
            <FormLabel>Notes</FormLabel>
            <Input
              type="text"
              placeholder="Optional notes"
              name="notes"
              value={newExpense.notes}
              onChange={handleInputChange}
            />
          </FormControl>

          <Button colorScheme="purple" onClick={handleAddExpense} width="full">
            {newExpense.id ? 'Update Entry' : 'Add Entry'}
          </Button>
        </VStack>
      </Box>

      <Box
        maxW="lg"
        w="full"
        bg="white"
        p={10}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
        mx="auto"
      >
        <Heading fontSize="lg" color="purple.700" mb={6}>
          Your Entries
        </Heading>

        {expenses.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {expenses.map((expense) => (
              <Box
                key={expense.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg="gray.50"
              >
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold">{expense.type}: {expense.category}</Text>
                    <Text fontSize="sm" color="gray.600">
                      ${expense.amount} on {expense.date}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {expense.notes}
                    </Text>
                  </Box>
                  <HStack>

                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeleteExpense(expense.id)}
                      aria-label="Delete entry"
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color="gray.500">No entries added yet.</Text>
        )}

      </Box>
    </Box>
  );
};

export default Entry;
