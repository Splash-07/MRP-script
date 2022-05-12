import React, { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
import { msToTime } from "../utils";

const Countdown = ({ timer }: { timer: number }) => {
  const [ms, setMs] = useState(timer);

  useEffect(() => {
    setMs(timer);
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => setMs(ms - 1000), 1000);
    return () => clearInterval(interval);
  }, [ms]);

  return <Box color={ms < 0 ? "tomato" : "whiteAlpha.900"}>{msToTime(ms)}</Box>;
};
export default Countdown;
