import React, { useContext, useState, useEffect } from 'react';

import { DAppProvider, ChainId } from '@usedapp/core';
import { Header } from "./components/Header"
import Container from "@mui/material/Container"
import { Main } from "./Main"
import { AppStateProvider } from "./contexts/SolidStateContext"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useIpfsConnect } from "./hooks/ipfs"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {

  let { ipfs, isIpfsReady } = useIpfsConnect()
  useEffect(() => {
    if (!ipfs) return;

    console.log(ipfs)
    //setIpfs(ipfs)

  }, [ipfs])

  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Localhost, ChainId.Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      },
    }}>
      <AppStateProvider>
        <ThemeProvider theme={darkTheme}>
          <Header ipfs={ipfs} />
          <Container maxWidth="lg">
            <Main ipfs={ipfs} />
          </Container>
        </ThemeProvider>
      </AppStateProvider>
    </DAppProvider>
  );
}

export default App;