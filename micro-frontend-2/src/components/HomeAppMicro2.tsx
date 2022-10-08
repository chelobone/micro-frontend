import { Text, Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

const HomeAppMicro2 = () => {
  const [count, setCount] = useState(0);

  return (
    <Flex gap="1rem" direction="column">
      <Text>
        Estamos en la aplicación <strong>APP-1</strong>
      </Text>
      <Text>Esto podría ser un módulo de algun sistema </Text>
    </Flex>
  );
};

export default HomeAppMicro2;