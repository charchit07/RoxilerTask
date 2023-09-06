
import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Select,
  Input,
  Button,
  Center
} from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `https://red-crow-tie.cyclic.app/transactions?month=${selectedMonth}&search=${searchText}&page=${page}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Center>
      <Box>
        <h1 style={{ fontSize: '24px', marginBottom: '20px',textAlign:"center"}}>Transactions Dashboard</h1>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          mb={4}
          size="md"
        >
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </Select>

        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          mb={4}
          size="md"
        />

        <Table variant="simple" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <Thead>
            <Tr>
              <Th style={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold', padding: '10px' }}>Title</Th>
              <Th style={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold', padding: '10px' }}>Description</Th>
              <Th style={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold', padding: '10px' }}>Price</Th>
              <Th style={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold', padding: '10px' }}>Month</Th>
              <Th style={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold', padding: '10px' }}>Image</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction._id}>
                <Td style={{ border: '1px solid #ccc', padding: '10px' }}>{transaction.title}</Td>
                <Td style={{ border: '1px solid #ccc', padding: '10px', fontSize: '14px' }}>{transaction.description}</Td>
                <Td style={{ border: '1px solid #ccc', padding: '10px' }}>{transaction.price}</Td>
                <Td style={{ border: '1px solid #ccc', padding: '10px' }}>{transaction.month}</Td>
                <Td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    style={{ maxWidth: '100px', height: 'auto' }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Center style={{ marginTop: '20px' }}>
          <Button
            isDisabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            style={{ margin: '0 5px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Previous
          </Button>
          <span>Page {page}</span>
          <Button
            onClick={() => handlePageChange(page + 1)}
            style={{ margin: '0 5px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Next
          </Button>
        </Center>
      </Box>
    </Center>
  );
}

export default App;

