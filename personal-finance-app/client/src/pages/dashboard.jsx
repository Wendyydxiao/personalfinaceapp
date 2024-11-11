const Dashboard = () => {
    const [barChartData, setBarChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [monthlyExpensesData, setMonthlyExpensesData] = useState(null);

    const { data, loading, error } = useQuery(GET_USER_ENTRIES);

    const getMonthYear = (dateString) => {
        if (!dateString) return null; // Skip if no date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null; // Skip invalid date
        return date.toLocaleString("default", {
            month: "long",
            year: "numeric",
        }); // e.g., "January 2024"
    };

    useEffect(() => {
        if (data?.getTransactions) {
            const transactions = data.getTransactions;

            // Group transactions by type and category
            const categoryData = transactions.reduce((acc, transaction) => {
                const category = transaction.category.name;
                const type = transaction.type;

                if (!acc[category]) {
                    acc[category] = { income: 0, expense: 0 };
                }
                acc[category][type] += transaction.amount;

                return acc;
            }, {});

            const incomeTotal = transactions
                .filter((transaction) => transaction.type === "income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            const expenseTotal = transactions
                .filter((transaction) => transaction.type === "expense")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            // Group expenses by month (include year)
            const monthlyExpenses = transactions
                .filter(
                    (transaction) =>
                        transaction.type === "expense" && transaction.date
                )
                .reduce((acc, transaction) => {
                    const monthYear = getMonthYear(transaction.date);
                    if (!monthYear) return acc; // Skip invalid dates
                    if (!acc[monthYear]) {
                        acc[monthYear] = 0;
                    }
                    acc[monthYear] += transaction.amount;
                    return acc;
                }, {});

            // Prepare Bar Chart Data
            setBarChartData({
                labels: Object.keys(categoryData),
                datasets: [
                    {
                        label: "Income",
                        data: Object.keys(categoryData).map(
                            (category) => categoryData[category].income
                        ),
                        backgroundColor: "rgba(131, 56, 236, 0.7)", // Purple
                        borderColor: "rgba(131, 56, 236, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Expense",
                        data: Object.keys(categoryData).map(
                            (category) => categoryData[category].expense
                        ),
                        backgroundColor: "rgba(56, 163, 236, 0.7)", // Blue
                        borderColor: "rgba(56, 163, 236, 1)",
                        borderWidth: 1,
                    },
                ],
            });

            // Prepare Pie Chart Data
            setPieChartData({
                labels: ["Income", "Expense"],
                datasets: [
                    {
                        data: [incomeTotal, expenseTotal],
                        backgroundColor: [
                            "rgba(131, 56, 236, 0.7)", // Purple
                            "rgba(56, 163, 236, 0.7)", // Blue
                        ],
                        borderColor: [
                            "rgba(131, 56, 236, 1)", // Purple border
                            "rgba(56, 163, 236, 1)", // Blue border
                        ],
                        borderWidth: 1,
                    },
                ],
            });

            // Prepare Monthly Expenses Data
            setMonthlyExpensesData({
                labels: Object.keys(monthlyExpenses),
                datasets: [
                    {
                        label: "Expenses by Month",
                        data: Object.values(monthlyExpenses),
                        backgroundColor: "rgba(255, 99, 132, 0.7)", // Red
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [data]);

    if (loading) return <Spinner size="xl" />;
    if (error) return <Box>Error loading dashboard data</Box>;

    return (
        <Box p={6} bgGradient="linear(to-r, purple.600, blue.500)" minH="100vh">
            <Box
                maxW="4xl"
                mx="auto"
                bg="white"
                p={8}
                borderRadius="lg"
                boxShadow="2xl"
                textAlign="center"
            >
                <Heading fontSize="3xl" mb={6} color="purple.700">
                    Dashboard Overview
                </Heading>

                {/* Navigation Buttons */}
                <Flex justifyContent="space-between" mb={6}>
                    <Link to="/profile">
                        <Button colorScheme="purple">Go to Profile</Button>
                    </Link>
                    <Link to="/entry">
                        <Button colorScheme="teal">Add New Entry</Button>
                    </Link>
                </Flex>

                <VStack spacing={12} align="stretch">
                    {barChartData && (
                        <Box>
                            <Heading fontSize="xl" mb={4} color="purple.700">
                                Income and Expense Breakdown by Category
                            </Heading>
                            <Box
                                style={{ maxWidth: "700px", margin: "0 auto" }}
                            >
                                <Bar
                                    data={barChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: "top",
                                                labels: {
                                                    color: "purple.600",
                                                },
                                            },
                                            title: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            x: {
                                                ticks: { color: "gray" },
                                                grid: {
                                                    color: "rgba(200, 200, 200, 0.2)",
                                                },
                                            },
                                            y: {
                                                ticks: { color: "gray" },
                                                grid: {
                                                    color: "rgba(200, 200, 200, 0.2)",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    {pieChartData && (
                        <Box maxW="md" mx="auto">
                            <Heading fontSize="xl" mb={4} color="purple.700">
                                Income vs. Expense Overview
                            </Heading>
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                            labels: { color: "purple.600" },
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Divider />

                    {monthlyExpensesData && (
                        <Box>
                            <Heading fontSize="xl" mb={4} color="purple.700">
                                Expenses by Month
                            </Heading>
                            <Box
                                style={{ maxWidth: "700px", margin: "0 auto" }}
                            >
                                <Bar
                                    data={monthlyExpensesData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: "top",
                                                labels: {
                                                    color: "purple.600",
                                                },
                                            },
                                            title: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            x: {
                                                ticks: { color: "gray" },
                                                grid: {
                                                    color: "rgba(200, 200, 200, 0.2)",
                                                },
                                            },
                                            y: {
                                                ticks: { color: "gray" },
                                                grid: {
                                                    color: "rgba(200, 200, 200, 0.2)",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default Dashboard;
