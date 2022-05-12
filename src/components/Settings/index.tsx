import React from "react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react";
import SettingBar from "./SettingBox";
import { useAppSelector } from "../../hooks/store.hooks";
import { toggleFindContractForCook } from "../../store/slices/settings.slice";

const Settings = () => {
  const findContractForCookIsEnabled = useAppSelector((state) => state.settings.findContractForCookIsEnabled);

  return (
    <Accordion allowMultiple defaultIndex={[1, 2]} gap="3" display="flex" flexDir="column">
      <AccordionItem border="0px" background="#6A78B5" boxShadow="md">
        <AccordionButton boxShadow="md" background="#5D6AA2" fontSize="1.3rem" display="flex" justifyContent="space-between">
          <Box fontSize="1.1rem" fontWeight="500">
            Settings
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb="2" background="#6A78B5">
          <SettingBar isEnabled={findContractForCookIsEnabled} dispatchedAction={toggleFindContractForCook}>
            Automatically find contract for cook
          </SettingBar>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default Settings;
