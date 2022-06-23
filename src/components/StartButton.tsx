import { Button, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/store.hooks';
import {
  setInitialize,
  setNextActionAllowance,
} from '../store/slices/restaurant.slice';

const StartButton = () => {
  const isInitialized = useAppSelector(
    (state) => state.restaurant.isInitialized
  );
  const isStartButtonDisabled = useAppSelector(
    (state) => state.restaurant.isStartButtonDisabled
  );
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (isStartButtonDisabled) return;

    const boolean = isInitialized ? false : true;
    dispatch(setInitialize(boolean));
  };

  useEffect(() => {
    if (isInitialized) dispatch(setNextActionAllowance(true));
  }, [isInitialized]);
  return (
    <Flex justifyContent="center">
      <Button
        cursor="pointer"
        color="whiteAlpha.900"
        backgroundColor={isInitialized ? 'whiteAlpha.400' : '#5D6AA2'}
        disabled={isStartButtonDisabled}
        fontSize="1.1rem"
        letterSpacing="1px"
        padding="5px 10px"
        boxShadow="md"
        justifySelf="center"
        _hover={{ backgroundColor: 'whiteAlpha.100' }}
        onClick={handleClick}
        margin="4"
      >
        {isInitialized ? 'Stop Script' : 'Start Script'}
      </Button>
    </Flex>
  );
};

export default StartButton;
