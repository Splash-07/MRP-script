import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/store.hooks";
import CountdownTimer from "../CountdownTimer";
import { setNextActionAllowance } from "../../store/slices/restaurant.slice";

const NextActionDefault = () => {
  const next = useAppSelector((state) => state.restaurant.next);

  return (
    <Flex flexDir="column" marginTop="1" padding="2" fontSize="1rem" backgroundColor="whiteAlpha.200" borderRadius="5px">
      <Flex alignItems="center" gap="1.5">
        <Text>Next action will be performed in </Text>
        {next && <CountdownTimer time={next} triggerAction={setNextActionAllowance} />}
      </Flex>
    </Flex>
  );
};

export default NextActionDefault;
