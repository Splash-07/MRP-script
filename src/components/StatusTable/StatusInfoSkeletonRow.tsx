import React from 'react';
import { Box, GridItem, Skeleton, Text } from '@chakra-ui/react';

const StatusInfoSkeletonRow = () => {
  return (
    <>
      <GridItem colSpan={2}>
        <Skeleton>
          <Box h="100px" />
        </Skeleton>
      </GridItem>
      <GridItem colSpan={3} textAlign="center">
        <Skeleton>
          <Text>Restaurant Raw</Text>
        </Skeleton>
      </GridItem>
      <GridItem colSpan={2} textAlign="center">
        <Skeleton>00:00:00</Skeleton>
      </GridItem>
    </>
  );
};

export default StatusInfoSkeletonRow;
