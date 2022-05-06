import { Params } from "../types";

const Helper = {
  queryParamsToString: (params: Params): string => {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  },

  sleep: async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

export default Helper;
