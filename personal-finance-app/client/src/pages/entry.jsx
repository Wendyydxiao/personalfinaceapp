import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_ENTRIES } from "../utils/queries";
import { ADD_TRANSACTION, DELETE_TRANSACTION } from "../utils/mutations";

const Entry = () => {
    const [newEntry, setNewEntry] = useState({
        type: "Expense",
        category: "",
        amount: "",
        date: "",
        description: "",
    });

    const { data, loading, error, refetch } = useQuery(GET_USER_ENTRIES);
    const [addTransaction] = useMutation(ADD_TRANSACTION);
    const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

    const toast = useToast();
    const navigate = useNavigate();

    const handleAddEntry = async () => {
        try {
            await addTransaction({
                variables: {
                    input: {
                        type: newEntry.type,
                        amount: parseFloat(newEntry.amount),
                        category: newEntry.category,
                        date: newEntry.date,
                        description: newEntry.description,
                    },
                },
            });
            refetch();
            toast({
                title: "Transaction added",
                description: "Your transaction has been successfully added.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error adding transaction:", err);
        }
    };

    const handleDeleteEntry = async (id) => {
        try {
            await deleteTransaction({ variables: { id } });
            refetch();
            toast({
                title: "Transaction deleted",
                description: "Your transaction has been successfully deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error deleting transaction:", err);
        }
    };

    if (loading) return <Spinner size="xl" />;
    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching entries
            </Alert>
        );

    return (
        <Box>
            <Heading>Add a New Entry</Heading>
            <VStack>
                {/* Add Entry Form */}
                <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                        name="type"
                        onChange={(e) =>
                            setNewEntry({ ...newEntry, type: e.target.value })
                        }
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </Select>
                </FormControl>
                <Button onClick={handleAddEntry}>Add Entry</Button>
            </VStack>

            {/* List Transactions */}
            {data?.getTransactions.map((transaction) => (
                <Box key={transaction._id}>
                    <p>{transaction.type}</p>
                    <Button onClick={() => handleDeleteEntry(transaction._id)}>
                        Delete
                    </Button>
                </Box>
            ))}

            {/* Dashboard Button */}
            <Link to="/dashboard">
                <Button colorScheme="blue">Go to Dashboard</Button>
            </Link>
        </Box>
    );
};

export default Entry;
