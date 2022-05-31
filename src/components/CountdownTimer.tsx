import React, { FC, memo, useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/store.hooks";
import { Box } from "@chakra-ui/react";
import { msToTime } from "../utils";
import { setNextActionAllowance } from "../store/slices/restaurant.slice";

interface CountdownTimerProps {
  timeInMs: number;
  type?: "trigger";
}

const CountdownTimer: FC<CountdownTimerProps> = ({ timeInMs, type }) => {
  const [futureDate, setFutureDate] = useState(new Date().getTime() + timeInMs);
  const [ms, setMs] = useState(timeInMs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setFutureDate(new Date().getTime() + timeInMs);
    console.log(new Date(futureDate));
  }, [timeInMs]);

  useEffect(() => {
    const currentDate = new Date().getTime();
    if (type === "trigger" && currentDate > futureDate) {
      dispatch(setNextActionAllowance(true));
    } else {
      const interval = setInterval(() => setMs(futureDate - currentDate), 1000);
      return () => clearInterval(interval);
    }
  }, [ms, dispatch]);

  return <Box color={ms < 0 ? "tomato" : "whiteAlpha.900"}>{msToTime(ms)}</Box>;
};
export default CountdownTimer;
export const MemoisedCountdown = memo(CountdownTimer);
