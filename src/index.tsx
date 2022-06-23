import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import { Provider } from 'react-redux';
import { presistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

const rootElement = document.getElementById('MRPHelper')!;
const root = createRoot(rootElement);
const theme = extendTheme({
  styles: {
    global: {
      img: {
        display: 'unset',
      },
    },
  },
});

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={presistor}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </PersistGate>
  </Provider>
);
