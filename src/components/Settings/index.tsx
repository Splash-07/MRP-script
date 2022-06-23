import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { useAppSelector } from '../../hooks/store.hooks';
import { toggleFindContractForCook } from '../../store/slices/settings.slice';
import SettingsCheckBox from './SettingsCheckBox';

const Settings = () => {
  const findContractForCookIsEnabled = useAppSelector(
    (state) => state.settings.findContractForCookIsEnabled
  );

  return (
    <Accordion
      allowMultiple
      defaultIndex={[1, 2]}
      gap="3"
      display="flex"
      flexDir="column"
    >
      <AccordionItem border="0px" background="#6A78B5" boxShadow="md">
        <AccordionButton
          boxShadow="md"
          background="#5D6AA2"
          fontSize="1.3rem"
          display="flex"
          justifyContent="space-between"
        >
          <Box fontSize="1.1rem" fontWeight="500">
            Settings
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          display="flex"
          flexDir="column"
          pb="2"
          background="#6A78B5"
          gap="3"
        >
          <SettingsCheckBox
            isEnabled={findContractForCookIsEnabled}
            dispatchedAction={toggleFindContractForCook}
          >
            <Box
              backgroundColor={
                findContractForCookIsEnabled
                  ? 'whiteAlpha.300'
                  : 'whiteAlpha.200'
              }
              color="whiteAlpha.900"
              padding="0 12px"
              border="1px solid"
              backdropBlur="lg"
              borderColor={
                findContractForCookIsEnabled
                  ? 'whiteAlpha.900'
                  : 'whiteAlpha.400'
              }
              boxShadow="md"
              lineHeight="30px"
              fontWeight="medium"
              fontSize="14px"
              w="100%"
            >
              Automatically find contract for cook
            </Box>
          </SettingsCheckBox>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default Settings;
