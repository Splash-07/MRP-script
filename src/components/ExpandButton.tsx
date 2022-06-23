import React from 'react';
import { Button, Image } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../hooks/store.hooks';
import { toggleMenuExpand } from '../store/slices/app.slice';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const ExpandButton = () => {
  const internalConfig = useAppSelector((state) => state.config.internal);

  const logotypeId = 101;
  const expanded = useAppSelector((state) => state.app.expanded);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(toggleMenuExpand());
  };

  return (
    <Button
      onClick={handleClick}
      display="flex"
      position="fixed"
      top="140px"
      right="0px"
      opacity={expanded ? 0 : 1}
      cursor="pointer"
      pointerEvents={expanded ? 'none' : 'all'}
      alignItems="center"
      color="whiteAlpha.900"
      backgroundColor="#5D6AA2"
      fontSize="1.2rem"
      padding="5px 10px"
      boxShadow="md"
      borderWidth="1px 0px 1px 1px"
      borderStyle="solid"
      borderTopRightRadius="0"
      borderBottomRightRadius="0"
      borderColor="whiteAlpha.400"
      zIndex="10000"
      _hover={{ backgroundColor: '#6A78B5' }}
    >
      <ChevronLeftIcon w="20px" h="20px" />
      <Image src={internalConfig.templateImages[logotypeId]} h="30px" />
    </Button>
  );
};

export default ExpandButton;
