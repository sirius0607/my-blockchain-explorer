import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box, Card, CardBody, CardHeader, Grid, GridItem,
  Heading, IconButton, Input, Table, TableContainer, Tbody,
  Td, Th, Thead, Tr, VStack, Text, InputRightElement, InputGroup, Spinner
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import './App.css';


// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);
function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [inputValue, setInputValue] = useState('')
  const [selectedBlock, setSelectedBlock] = useState({})
  const [lastTransactions, setLastTransactions] = useState([])
  const [lastBlocks, setLastBlocks] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleSaveClick = () => {
    getBlockByNumber(inputValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      getBlockByNumber(inputValue);
    }
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  useEffect(() => {
    // get last five blocks
    async function getLastsNBlocks(blockNumber, num = 5) {
      const blocks = [];
      for (let i = 0; i < num; i++) {
        const prevBlock = await alchemy.core.getBlockWithTransactions(blockNumber - i);
        let block = getBlockData(prevBlock);
        blocks.push(block);
      }
      return blocks;
    }

    async function getLastsNTransactions(blockNumber, num = 5) {
      const lastBlockInfo = await alchemy.core.getBlockWithTransactions(blockNumber);
      const transactions = lastBlockInfo.transactions.slice(0, num);
      return transactions;
    }

    // update screen with blocks and transactions data
    async function fetchData() {
      const lastBlock = await alchemy.core.getBlock();
      const blocks = await getLastsNBlocks(lastBlock.number);
      setLastBlocks(blocks);
      const transactions = await getLastsNTransactions(lastBlock.number);
      setBlockNumber(lastBlock.number);
      setLastTransactions(transactions);
    }
    fetchData();
  });

  // ger block data by number
  const getBlockByNumber = async (blockNumber) => {
    if (blockNumber > 0) {
      setIsLoading(true);
      //async function getBlockByNumber(blockNumber) {
      // block number example : string 0x15221026 ou int 15221026
      const block = await alchemy.core.getBlock(blockNumber.startsWith('0x') ? blockNumber : parseInt(blockNumber), true);
      let selectedBlock = getBlockData(block);
      setSelectedBlock(selectedBlock);
      setIsLoading(false);
    }
  };

  function getBlockData(block) {
    let selectedBlock = {};
    selectedBlock.number = block.number;
    selectedBlock.transactionNb = block.transactions.length;
    selectedBlock.gasUsed = block.gasUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    selectedBlock.gasLimit = block.gasLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //selectedBlock.baseFeePerGas = convertToEth(selectedBlock.baseFeePerGas);
    selectedBlock.timestamp = new Date(block.timestamp * 1000).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return selectedBlock;
  }

  return (
    <>

      {/* Header */}
      <Box bg="blue.200" color="white" p={4}>
        <Heading size="lg">My Ethereum Block Explorer</Heading>
      </Box>

      <Card bg="gray.200" p={4} mt={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <InputGroup>
            <Input
              bg="white"
              _focus={{ bg: 'white' }}
              _hover={{ bg: 'white' }}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter block number ..."
              size="md"
              variant="filled"
              pr="4.5rem"
              onKeyPress={handleKeyPress}
            />
            {inputValue && (
              <InputRightElement width="4.5rem">
                <IconButton
                  bg="white"
                  aria-label="Clear input"
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={handleClearInput}
                />
              </InputRightElement>
            )}
          </InputGroup>
          <IconButton aria-label='Search blockchain' icon={<SearchIcon />} onClick={handleSaveClick} disabled={isLoading} />
        </Box>
      </Card>
      {isLoading ? <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.200'
        size='xl'
        mt='3'
      /> : ''}
      {!isLoading && selectedBlock.number && (
        <Card bg="gray.200" p={4} mt={4}>
          <TableContainer>
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th>Block number</Th>
                  <Th>Number of transactions</Th>
                  <Th>timestamp</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{selectedBlock.number}</Td>
                  <Td>{selectedBlock.transactionNb}</Td>
                  <Td>{selectedBlock.timestamp}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      )}
      <Card bg="gray.200" p={4} mt={4}>
        <Heading size='sm'>Last 5 blocks</Heading>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Block number</Th>
                <Th>Number of transactions</Th>
                <Th>timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lastBlocks.map((item, index) => {
                return (
                  <Tr>
                    <Td>{item.number}</Td>
                    <Td>{item.transactionNb}</Td>
                    <Td>{item.timestamp}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>

      <Card bg="green.100" p={4} mt={4}>
        <Heading size='sm'>Last 5 transactions from block {blockNumber}</Heading>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Transaction hash</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lastTransactions.map((item, index) => {
                return (
                  <Tr>
                    <Td maxW="100px" overflow="hidden" textOverflow="ellipsis">{item.hash}</Td>
                    <Td>{item.from}</Td>
                    <Td>{item.to}</Td>
                    <Td>{Utils.formatUnits(item.value, 'ether')} ETH</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}

export default App
