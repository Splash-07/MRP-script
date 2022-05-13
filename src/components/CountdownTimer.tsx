import React, { FC } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import Countdown from "react-countdown";
import { useAppDispatch } from "../hooks/store.hooks";
import { Box } from "@chakra-ui/react";

interface CountdownTimerProps {
  time: number;
  triggerAction?: ActionCreatorWithPayload<boolean, string>;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ time, triggerAction }) => {
  const dispatch = useAppDispatch();
  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (triggerAction && completed) {
      // Render a completed state
      dispatch(triggerAction(true));
      return <Box color="tomato">00:00:00</Box>;
    } else {
      // Render a countdown
      const msToHours = hours < 10 ? "0" + hours : hours;
      const msToMinutes = minutes < 10 ? "0" + minutes : minutes;
      const msToSeconds = seconds < 10 ? "0" + seconds : seconds;
      return (
        <Box color="whiteAlpha.900">
          {msToHours}:{msToMinutes}:{msToSeconds}
        </Box>
      );
    }
  };
  return <Countdown date={Date.now() + time} renderer={renderer} />;
};

export default CountdownTimer;
