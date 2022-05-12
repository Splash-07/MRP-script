import React, { FC, useEffect, useState } from "react";
import { GridItem, Image, Text } from "@chakra-ui/react";
import restaurantManager from "../../services/restaurantManager.service";
import { Character, Restaurant } from "../../types";
import Countdown from "../Countdown";
import { isCharacter, isRestaurant } from "../../types/typeguards";
import config from "../../configs/gameConfig";

interface StatusInfoRowProps {
  content: Restaurant | Character;
}

const StatusInfoRow: FC<StatusInfoRowProps> = ({ content }) => {
  const additionalTime = 60000;
  const templateId = content.atomichub_template_id;
  const src: string = (config.templateImages as { [key: number]: string })[templateId];
  const name: string = (config.templateIdNames as { [key: number]: string })[templateId];
  const [timer, setTimer] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isRestaurant(content)) {
      const { openTime, currentTime } = restaurantManager.getRestaurantTimerInfo(content);
      const timer = openTime - currentTime + additionalTime;
      setTimer(timer);
    }

    if (isCharacter(content)) {
      const { getCharacterTimerInfo, hasContract } = restaurantManager;
      const { cookEnd, currentTime, isRestaurantOpened } = getCharacterTimerInfo(content);
      if (hasContract(content) && isRestaurantOpened) {
        const timer = cookEnd - currentTime + additionalTime;
        setTimer(timer);
      }
    }
  }, []);

  return (
    <>
      <GridItem colSpan={2}>
        <Image src={src} alt={name} h="100px" />
      </GridItem>
      <GridItem colSpan={3} textAlign="center">
        <Text>{name}</Text>
      </GridItem>
      <GridItem colSpan={2} textAlign="center">
        {timer && <Countdown timer={timer} />}
      </GridItem>
    </>
  );
};

export default StatusInfoRow;
