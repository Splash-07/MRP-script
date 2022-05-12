import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

const rootElement = document.getElementById("MRPHelper")!;
const root = createRoot(rootElement);
const theme = extendTheme({
  styles: {
    global: {
      img: {
        display: "unset",
      },
    },
  },
});

root.render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>
);
