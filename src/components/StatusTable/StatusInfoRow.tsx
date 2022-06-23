import React, { FC, useEffect, useState } from 'react';
import { GridItem, Image, Text } from '@chakra-ui/react';
import restaurantManager from '../../services/restaurantManager.service';
import { isCharacter, isRestaurant } from '../../types/typeguards';
import { Character, Restaurant } from '../../types';
import { useAppSelector } from '../../hooks/store.hooks';

interface StatusInfoRowProps {
  content: Restaurant | Character;
}

const StatusInfoRow: FC<StatusInfoRowProps> = ({ content }) => {
  const templateId = content.atomichub_template_id;
  const internalConfig = useAppSelector((state) => state.config.internal);
  const src: string = (
    internalConfig.templateImages as { [key: number]: string }
  )[templateId];
  const name: string = (
    internalConfig.templateIdNames as { [key: number]: string }
  )[templateId];
  const [status, setStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isRestaurant(content)) {
      const { isRestaurantOpened } =
        restaurantManager.getRestaurantTimerInfo(content);
      setStatus(isRestaurantOpened ? 'Opened' : 'Closed');
    }

    if (isCharacter(content)) {
      const { getCharacterTimerInfo, hasContract } = restaurantManager;
      const { isCharacterResting, isRestaurantOpened, cookEnd } =
        getCharacterTimerInfo(content);

      if (isCharacterResting) {
        setStatus('Resting');
      } else if (hasContract(content) && isRestaurantOpened) {
        const currentTime = Date.now();
        if (currentTime < cookEnd) {
          setStatus('Working');
        } else {
          setStatus('Waiting');
        }
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
        {status}
      </GridItem>
    </>
  );
};

export default StatusInfoRow;
