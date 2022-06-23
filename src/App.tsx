import React, { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from './hooks/store.hooks';
import {
  setLoading,
  setNextActionAllowance,
  update,
} from './store/slices/restaurant.slice';
import logger from './services/logger.service';
import { msToTime, sleep } from './utils';
import restaurantManager from './services/restaurantManager.service';
import Banner from './components/Banner';
import Header from './components/Header';
import ExpandButton from './components/ExpandButton';
import NextAction from './components/NextAction';
import Settings from './components/Settings';
import StartButton from './components/StartButton';
import StatusTable from './components/StatusTable';
import { setGameConfig } from './store/slices/config.slice';

const App = () => {
  // const config = useAppSelector((state) => state.config.game);
  const expanded = useAppSelector((state) => state.app.expanded);
  const isInitialized = useAppSelector(
    (state) => state.restaurant.isInitialized
  );

  const isNextActionAllowed = useAppSelector(
    (state) => state.restaurant.isNextActionAllowed
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGameConfig());

    async function initNextAction() {
      dispatch(setLoading(true));
      await sleep(2000);
      const { restaurants, characters, timeToNextAction } =
        await restaurantManager.manageRestaurants();

      const payload = {
        restaurants,
        characters,
        timeToNextAction:
          timeToNextAction && timeToNextAction > -60000
            ? timeToNextAction
            : 10000,
      };

      dispatch(update(payload));
      dispatch(setLoading(false));
      logger(
        `Next action will be performed in ${
          payload.timeToNextAction
            ? msToTime(payload.timeToNextAction)
            : 'Never'
        }`
      );
      dispatch(setNextActionAllowance(false));
    }

    if (isNextActionAllowed) {
      initNextAction();
    }
  }, [isNextActionAllowed]);

  return (
    <Flex
      position="fixed"
      zIndex="10000"
      top="90px"
      right={expanded ? '0px' : '-420px'}
      w="350px"
      bg="#6A78B5"
      transition="right 0.2s ease 0s"
      color="whiteAlpha.900"
      fontFamily="inherit"
      flexDir="column"
      boxShadow="md"
      borderWidth="1px 0px 1px 1px"
      borderStyle="solid"
      borderTopRightRadius="0"
      borderBottomRightRadius="0"
      borderColor="whiteAlpha.400"
    >
      <ExpandButton />
      <Flex flexDir="column" zIndex="10001">
        <Banner />
        <Header />
      </Flex>
      <StartButton />
      <Settings />
      {isInitialized && (
        <Flex backgroundColor="#6A78B5" flexDir="column" padding="2" gap="3">
          <NextAction />
          <StatusTable />
        </Flex>
      )}
    </Flex>
  );
};

export default App;
