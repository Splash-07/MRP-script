import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useAppSelector } from '../../hooks/store.hooks';
import { MemoisedCountdown } from '../CountdownTimer';

const NextActionDefault = () => {
  const next = useAppSelector((state) => state.restaurant.next);

  return (
    <Flex
      flexDir="column"
      marginTop="1"
      padding="2"
      fontSize="1rem"
      backgroundColor="whiteAlpha.200"
      borderRadius="5px"
    >
      <Flex alignItems="center" gap="1.5">
        {next ? (
          <>
            <Text>Next action will be performed in </Text>
            <MemoisedCountdown type="trigger" timeInMs={next} />
          </>
        ) : (
          <Box color="tomato">
            Next action will not be performed (check your options)
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default NextActionDefault;
