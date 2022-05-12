import React from "react";
import { Flex, Skeleton, Text } from "@chakra-ui/react";

const NextActionSkeleton = () => {
  return (
    <Flex flexDir="column" marginTop="1" padding="2" fontSize="1rem" backgroundColor="whiteAlpha.200">
      <Flex alignItems="center" gap="2">
        <Text>Next action will be performed in</Text>
        <Skeleton>
          <Text>00:00:00</Text>
        </Skeleton>
      </Flex>
      {/* <Skeleton>
        <Text alignSelf="center">Sign contract for cook</Text>
      </Skeleton> */}
    </Flex>
  );
};

export default NextActionSkeleton;
