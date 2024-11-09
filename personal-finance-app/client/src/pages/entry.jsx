import React, { useState, useEffect } from "react";
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
    Spinner,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_ENTRIES } from "../utils/queries";
import { ADD_ENTRY, DELETE_ENTRY } from "../utils/mutations";

const Entry = () => {
    const [newEntry, setNewEntry] = useState({
        type: "Expense",
        category: "",
        amount: "",
        date: "",
        notes: "",
    });

    // const { data, loading, error, refetch } = useQuery(GET_USER_ENTRIES);
    const { data, loading, error, refetch } = useQuery(GET_USER_ENTRIES, {
        variables: {
            userId: JSON.parse(localStorage.getItem("user")).user._id,
        },
    });

    // console.log(JSON.parse(localStorage.getItem('user')).user);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const [addEntry] = useMutation(ADD_ENTRY);
    const [deleteEntry] = useMutation(DELETE_ENTRY);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleAddEntry = async () => {
        try {
            await addEntry({
                variables: {
                    input: {
                        type: newEntry.type,
                        amount: parseFloat(newEntry.amount),
                        date: newEntry.date,
                        description: newEntry.notes,
                        category: newEntry.category,
                    },
                },
            });
            setNewEntry({
                type: "Expense",
                category: "",
                amount: "",
                date: "",
                notes: "",
            });
            refetch();
        } catch (err) {
            console.error("Error adding transcation:", err);
        }
    };

    const handleDeleteEntry = async (id) => {
        try {
            await deleteEntry({ variables: { id } });
            refetch();
        } catch (err) {
            console.error("Error deleting transcation:", err);
        }
    };

    const incomeCategories = ["Salary", "Investment", "Freelancing", "Others"];
    const expenseCategories = [
        "Rent/Mortgage",
        "Utilities",
        "Groceries",
        "Dining Out",
        "Transportation",
        "Healthcare",
        "Insurance",
        "Debt Payments",
        "Education",
        "Personal Care",
        "Entertainment",
        "Clothing",
        "Savings/Investments",
        "Gifts/Donations",
        "Travel/Vacation",
        "Miscellaneous",
    ];

    if (loading) return <Spinner size="xl" />;
    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching entries
            </Alert>
        );

    return (
        <Box minH="100vh" bgGradient="linear(to-r, purple.500, blue.500)" p={6}>
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
                            value={newEntry.type}
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
                            value={newEntry.category}
                            onChange={handleInputChange}
                        >
                            {(newEntry.type === "Income"
                                ? incomeCategories
                                : expenseCategories
                            ).map((category) => (
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
                            value={newEntry.amount}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <FormControl id="date">
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            name="date"
                            value={newEntry.date}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <FormControl id="notes">
                        <FormLabel>Notes</FormLabel>
                        <Input
                            type="text"
                            placeholder="Optional notes"
                            name="description"
                            value={newEntry.notes}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <Button
                        colorScheme="purple"
                        onClick={handleAddEntry}
                        width="full"
                    >
                        {newEntry.id ? "Update Entry" : "Add Entry"}
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
                <Heading fontSize="lg" color="purple.600" mb={6}>
                    Your Entries
                </Heading>

                {/* {(data||[])?.userEntries?.length > 0 ? ( */}
                {data?.getTransactions?.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                        {data.getTransactions.map((entry) => (
                            <Box
                                key={entry._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                bg="gray.50"
                            >
                                <HStack justify="space-between">
                                    <Box>
                                        <Text fontWeight="bold">
                                            {entry.type}: {entry.category}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            ${entry.amount} on{" "}
                                            {new Date(
                                                entry.date
                                            ).toLocaleDateString()}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {entry.description || "N/A"}
                                        </Text>
                                    </Box>
                                    <HStack>
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            colorScheme="red"
                                            onClick={() =>
                                                handleDeleteEntry(entry._id)
                                            }
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
