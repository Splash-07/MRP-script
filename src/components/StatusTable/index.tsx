import React from "react";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/store.hooks";
import StatusInfoRow from "./StatusInfoRow";
import StatusInfoSkeletonRow from "./StatusInfoSkeletonRow";

const StatusTable = () => {
  const isLoading = useAppSelector((state) => state.restaurant.isLoading);
  const restaurants = useAppSelector((state) => state.restaurant.data.restaurants);
  const characters = useAppSelector((state) => state.restaurant.data.characters);

  return (
    <Flex
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "white",
          borderRadius: "24px",
        },
      }}
      maxH="300px"
      backgroundColor="whiteAlpha.200"
      flexDir="column"
      padding="2"
      borderRadius="5px"
      overflowY="auto"
    >
      <Grid templateColumns="repeat(7, 1fr)" gap="3" alignItems="center">
        <GridItem colSpan={2}></GridItem>
        <GridItem colSpan={3} textAlign="center">
          <Text>Name</Text>
        </GridItem>
        <GridItem colSpan={2} textAlign="center">
          Timer
        </GridItem>
        {isLoading ? (
          Array.from({ length: 2 }).map((item, index) => <StatusInfoSkeletonRow key={index} />)
        ) : (
          <>
            {restaurants?.map((restaurant) => (
              <StatusInfoRow key={restaurant.card_id} content={restaurant} />
            ))}
            {characters?.map((character) => (
              <StatusInfoRow key={character.card_id} content={character} />
            ))}
          </>
        )}
      </Grid>
    </Flex>
  );
};

export default StatusTable;
