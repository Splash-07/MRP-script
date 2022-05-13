import React from "react";
import { FC, ReactNode } from "react";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

import { CheckIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/store.hooks";

interface SettingsCheckBoxInterface {
  isEnabled?: boolean;
  dispatchedAction: ActionCreatorWithoutPayload<string>;
  children: ReactNode;
}
const SettingsCheckBox: FC<SettingsCheckBoxInterface> = ({ isEnabled, dispatchedAction, children }) => {
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

      {children}
    </Flex>
  );
};

export default SettingsCheckBox;
