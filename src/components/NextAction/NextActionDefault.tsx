import React from "react";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/store.hooks";
import { msToTime } from "../../utils";
import { MemoisedNextActionCountdown } from "./NextActionCountdown";

const NextActionDefault = () => {
  const next = useAppSelector((state) => state.restaurant.next);

  return (
    <Flex flexDir="column" marginTop="1" padding="2" fontSize="1rem" backgroundColor="whiteAlpha.200" borderRadius="5px">
      <Flex alignItems="center" gap="1.5">
        <Text>Next action will be performed in </Text>
        <MemoisedNextActionCountdown timer={next!} />
      </Flex>
    </Flex>
  );
};

export default NextActionDefault;
