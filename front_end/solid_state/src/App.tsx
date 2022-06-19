import { useEffect } from 'react';

import { DAppProvider, Kovan, Localhost, Mainnet, } from '@usedapp/core';
import { Header } from "./components/header/Header"
import Container from "@mui/material/Container"
import { Main } from "./Main"
import { AppStateProvider } from "./contexts/SolidStateContext"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useIpfsConnect, useIpfsWebConnect } from "./hooks/ipfs"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

darkTheme.typography.h1 = {
  fontSize: '1.3rem',
  fontWeight: '200',
  '@media (min-width:530px)': {
    fontSize: '2rem',
  },
  [darkTheme.breakpoints.up('md')]: {
    fontSize: '2.6rem',

  },
}

darkTheme.typography.h3 = {
  fontSize: '1rem',
  fontWeight: '200',
  '@media (min-width:530px)': {
    fontSize: '1.2em',
  },
  [darkTheme.breakpoints.up('md')]: {
    fontSize: '1.7rem',

  },
}

darkTheme.typography.body1 = {
  fontSize: '0.8rem',
  fontWeight: '200',
  '@media (min-width:530px)': {
    fontSize: '1.1rem',
  },
  [darkTheme.breakpoints.up('md')]: {
    fontSize: '1.2rem',

  },
}
darkTheme.typography.body2 = {
  fontSize: '0.8rem',
  fontWeight: '100',
  '@media (min-width:530px)': {
    fontSize: '0.9rem',
  },
  [darkTheme.breakpoints.up('md')]: {
    fontSize: '0.9rem',

  },
}
darkTheme.typography.subtitle2 = {
  fontWeight: '100',
  fontSize: '0.8rem',

}


function App() {
  const multicallAddress = process.env.REACT_APP_MULTICALL_LOCAL || "0xdaD1D7faDfEa239EC826bC52Da6D42Ac15a9D06b"
  let { ipfs } = useIpfsWebConnect() //useIpfsConnect()
  useEffect(() => {
    if (!ipfs) return

  }, [ipfs])

  return (
    <DAppProvider config={{
      networks: [Kovan, Localhost, Mainnet],
      readOnlyChainId: Kovan.chainId,
      readOnlyUrls: {
        // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/' + process.env.REACT_APP_WEB3_INFURA_PROJECT_ID,
        [Kovan.chainId]: 'https://kovan.infura.io/v3/' + process.env.REACT_APP_WEB3_INFURA_PROJECT_ID,
        // [1337]: 'http://127.0.0.1:8545',
      }, multicallAddresses: {
        1337: multicallAddress,
        [Mainnet.chainId]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
        [Kovan.chainId]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
      },
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