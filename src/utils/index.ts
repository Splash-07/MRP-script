import { Params } from "../types";

export const queryParamsToString = (params: Params): string => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const msToTime = (ms: number) => {
  if (ms < 0) return "00:00:00";
  let seconds = ms / 1000;
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${
    hours >= 10 ? hours : hours < 10 && hours > 0 ? `0${hours}` : "00"
  }:${
    minutes >= 10 ? minutes : minutes < 10 && minutes > 0 ? `0${minutes}` : "00"
  }:${
    seconds >= 10 ? seconds : seconds < 10 && seconds > 0 ? `0${seconds}` : "00"
  }`;
};
