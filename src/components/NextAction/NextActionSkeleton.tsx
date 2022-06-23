import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';
const NextActionSkeleton = () => {
  return (
    <Flex
      flexDir="column"
      marginTop="1"
      padding="2"
      fontSize="1rem"
      backgroundColor="whiteAlpha.200"
    >
      <Flex alignItems="center" justifyContent="center" gap="2">
        <Text>Loading || Performing action</Text>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#5D6AA2"
          size="md"
        />
      </Flex>
    </Flex>
  );
};

export default NextActionSkeleton;
