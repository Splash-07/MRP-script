import React from "react";
import { Flex } from "@chakra-ui/react";
import { version } from "../../package.json";

const Banner = () => {
  return (
    <Flex
      alignItems="center"
      backgroundColor="#5D6AA2"
      padding="2"
      border="1px solid blue.900"
      boxShadow="sm"
    >
      Version {version}
    </Flex>
  );
};

export default Banner;
