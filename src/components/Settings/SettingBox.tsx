import React from "react";
import { FC, ReactNode } from "react";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/store.hooks";

interface CustomSettingBoxInterface {
  isEnabled?: boolean;
  dispatchedAction: ActionCreatorWithoutPayload<string>;
  children: ReactNode;
}
const SettingBox: FC<CustomSettingBoxInterface> = ({ isEnabled, dispatchedAction, children }) => {
  const isInitialized = useAppSelector((state) => state.restaurant.isInitialized);
  const dispatch = useAppDispatch();

  function handleClick() {
    if (isInitialized) return alert("Turn off script, before change settings");
    dispatch(dispatchedAction());
  }

  return (
    <Flex alignItems="center" gap="10px">
      <IconButton
        size="sm"
        backdropBlur="lg"
        backgroundColor="whiteAlpha.300"
        borderColor="whiteAlpha.300"
        _hover={{ bg: "whiteAlpha.500" }}
        _focus={{ outlineColor: "orange.50", outlineWidth: "1px" }}
        boxShadow="md"
        aria-label="check"
        icon={isEnabled ? <CheckIcon color="whiteAlpha.900" /> : undefined}
        onClick={handleClick}
      />
      <Box
        backgroundColor={isEnabled ? "whiteAlpha.300" : "whiteAlpha.200"}
        color="whiteAlpha.900"
        padding="0 12px"
        border="1px solid"
        backdropBlur="lg"
        borderColor={isEnabled ? "whiteAlpha.900" : "whiteAlpha.400"}
        boxShadow="md"
        lineHeight="30px"
        fontSize="14px"
        minW="175px"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default SettingBox;
