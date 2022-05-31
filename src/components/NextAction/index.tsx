import React from "react";
import { useAppSelector } from "../../hooks/store.hooks";
import NextActionSkeleton from "./NextActionSkeleton";
import NextActionDefault from "./NextActionDefault";

const NextAction = () => {
  const isLoading = useAppSelector((state) => state.restaurant.isLoading);

  return isLoading ? <NextActionSkeleton /> : <NextActionDefault />;
};

export default NextAction;
