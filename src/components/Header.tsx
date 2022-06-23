import React from 'react';
import { Button, Flex, Heading, Icon, Image, Link } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { BsGithub } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../hooks/store.hooks';
import { toggleMenuExpand } from '../store/slices/app.slice';

const Header = () => {
  const internalConfig = useAppSelector((state) => state.config.internal);

  const logotypeId = 101;
  const dispatch = useAppDispatch();

  const handleMenuExpand = () => {
    dispatch(toggleMenuExpand());
  };
  return (
    <Flex justifyContent="space-between" alignItems="center" padding="2">
      <Button
        display="flex"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        w="25px"
        h="25px"
        background="0px 0px"
        margin="0px"
        p="0px"
        _hover={{ background: '0px 0px' }}
        onClick={handleMenuExpand}
      >
        <ChevronRightIcon w="22px" h="22px" />
      </Button>
      <Flex alignItems="center" gap="2">
        <Image src={internalConfig.templateImages[logotypeId]} h="40px" />
        <Heading fontSize="1.2rem" fontFamily="inherit">
          MRP Script
        </Heading>
      </Flex>
      <Link
        href="https://github.com/Splash-07/MRP-script"
        display="inline-block"
      >
        <Icon
          as={BsGithub}
          display="block"
          h="30px"
          w="30px"
          transition="color .2s ease"
          color="whiteAlpha.500"
          _hover={{ color: 'whiteAlpha.800' }}
        />
      </Link>
    </Flex>
  );
};

export default Header;
