import { Box } from '@chakra-ui/react';
import React from 'react';
import CounterAppTwo from './components/HomeAppMicro3';

const App = () => (
  <Box margin="1.2rem">
    <Box>APP-2</Box>
    <Box>
      <CounterAppTwo />
    </Box>
  </Box>
);

export default App;