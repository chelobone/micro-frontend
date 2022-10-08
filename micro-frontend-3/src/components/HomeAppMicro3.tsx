import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

const HomeAppMicro3 = () => {

  return (
    <Flex gap="1rem" direction="column">
      <Text>
        Estamos en la aplicación <strong>APP-2</strong>
      </Text>
      <Text>Esto podría ser un módulo de algun sistema </Text>
    </Flex>
  );
};

export default HomeAppMicro3;