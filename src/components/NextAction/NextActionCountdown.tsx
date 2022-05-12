import React, { memo, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/store.hooks";

import { Box } from "@chakra-ui/react";
import { msToTime } from "../../utils";
import { setNextActionAllowance } from "../../store/slices/restaurant.slice";

const NextActionCountdown = ({ timer }: { timer: number }) => {
  const [ms, setMs] = useState(timer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMs(timer);
  }, [timer]);

  useEffect(() => {
    if (ms < 0) {
      dispatch(setNextActionAllowance(true));
    } else {
      const interval = setInterval(() => setMs(ms - 1000), 1000);
      return () => clearInterval(interval);
    }
  }, [ms, dispatch]);

  return <Box color={ms < 0 ? "tomato" : "whiteAlpha.900"}>{msToTime(ms)}</Box>;
};
export default NextActionCountdown;
// memoised component, cuz of needles rerender, when clicking in sequences (that trigger next action)
export const MemoisedNextActionCountdown = memo(NextActionCountdown);
