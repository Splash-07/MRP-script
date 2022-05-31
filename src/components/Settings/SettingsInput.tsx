import React, { FC, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store.hooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import debounce from "lodash.debounce";

import { Flex, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";

interface SettingsInputInterface {
  initialValue: string;
  isEnabled: boolean;
  dispatchAction: ActionCreatorWithPayload<any, string>;
  name: string;
}

const SettingsInput: FC<SettingsInputInterface> = ({
  name,
  isEnabled,
  initialValue,
  dispatchAction,
}) => {
  const isInitialized = useAppSelector(
    (state) => state.restaurant.isInitialized
  );
  const [value, setValue] = useState<string>(initialValue.toString());
  const dispatch = useAppDispatch();

  const dispatchValue = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(dispatchAction(value));
      }, 1000),
    []
  );

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (isInitialized) return alert("Turn off script, before change settings");
    const value = e.target.value;
    setValue(value);
    dispatchValue(value.trim());
  }
  return (
    <Flex width="100%" alignItems="center" gap="10px">
      <InputGroup size="sm" fontSize="14px">
        <InputLeftAddon
          backdropBlur="lg"
          backgroundColor="whiteAlpha.300"
          borderColor="whiteAlpha.300"
          boxShadow="md"
          fontWeight="medium"
          color="whiteAlpha.900"
          fontSize="14px"
        >
          {name}
        </InputLeftAddon>
        <Input
          focusBorderColor="orange.100"
          borderColor="whiteAlpha.200"
          boxShadow="md"
          type="string"
          placeholder="xxxxxxx-xxxx-xxxxxx-xxxxx"
          isDisabled={!isEnabled}
          value={value}
          onChange={(e) => handleInput(e)}
        />
      </InputGroup>
    </Flex>
  );
};

export default SettingsInput;
