import { Box, Center, Flex, Heading, Spinner, Image, Link, Text } from '@chakra-ui/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
const CounterAppOne = React.lazy(() => import('app1/CounterAppOne'));
const CounterAppTwo = React.lazy(() => import('app2/CounterAppTwo'));

const App = () => (
  <>

    <Center
      height="100vh"
      width="100%"
      backgroundColor="#1B1A29"
      margin="0"
      p="0"
      flexDirection="column"
    >
      <Flex
        border="1px solid #151421"
        borderRadius="1rem"
        height="50vh"
        justifyContent="space-around"
        alignItems="center"
        flexDirection="column"
        padding="5rem"
        backgroundColor="#6F60EA"
      >
        <Heading color="#fff">Aplicación contenedora</Heading>
        <Flex direction="row" justifyContent="space-around">
        <ErrorBoundary>
          <React.Suspense fallback={<Spinner size="xl" />}>
            <Box
              p="2rem"
              mr="2rem"
              border="1px solid #aeaeae"
              borderRadius="1rem"
              backgroundColor="#fff"
            >
              <Heading color="#6F60EA" mb="1rem">
                APP-1
              </Heading>
              <CounterAppOne />
            </Box>
          </React.Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <React.Suspense fallback={<Spinner size="xl" />}>
              <Box p="2rem" border="1px solid #aeaeae" borderRadius="1rem" backgroundColor="#fff">
                <Heading color="#6F60EA" mb="1rem">
                  APP-2
                </Heading>
                <CounterAppTwo />
              </Box>
            </React.Suspense>
          </ErrorBoundary>
        </Flex>
      </Flex>
    </Center>
  </>
);

export default App;