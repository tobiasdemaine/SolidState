import { useEffect } from 'react';

import { DAppProvider, Kovan } from '@usedapp/core';
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

  let { ipfs } = useIpfsConnect()
  useEffect(() => {
    if (!ipfs) return

  }, [ipfs])

  return (
    <DAppProvider config={{
      networks: [Kovan],
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