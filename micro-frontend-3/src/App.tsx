import { Box } from '@chakra-ui/react';
import React from 'react';
import CounterAppOne from './components/HomeAppMicro3';

const App = () => (
  <Box margin="1.2rem">
    <Box>APP-1</Box>
    <Box>
      <CounterAppOne />
    </Box>
  </Box>
);

export default App;