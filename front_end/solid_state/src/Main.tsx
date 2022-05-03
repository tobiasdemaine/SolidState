import { useEffect } from 'react';
import { Collections } from './components/Collections';
import useSolidStateContexts from "./hooks/useSolidStateContext"
import { Gallery } from "./components/Gallery"
import { GalleryCollections } from "./components/GalleryCollections"
import { useEthers } from "@usedapp/core";
import { Typography, Grid, Paper } from "@mui/material"
import { MyArtworks } from './components/MyArtworks';
import { MyShares } from './components/MyShares';


import { Welcome } from "./components/Welcome"
export interface MainProps {
    ipfs: any,

}

export const Main = ({ ipfs }: MainProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress, setIpfs } = useSolidStateContexts()
    const { account } = useEthers()
    const isConnected = account !== undefined
    useEffect(() => {


        if (Boolean(ipfs)) {
            setIpfs(ipfs)
        }
    }, [ipfs]);
    return (
        <>
            {
                !isConnected &&
                <>
                    <Welcome />


                </>

            }
            {
                !Boolean(ipfs) ? (
                    <>
                        <Paper elevation={0} sx={{ p: 2, mt: 2, mb: 4 }}><Typography component="div"   >
                            Waiting for IPFS to connect
                        </Typography>

                        </Paper>
                    </>
                ) : (
                    <>
                        {
                            APPSTATE.mainsection.section == "enter" &&
                            <>

                                <Collections ipfs={ipfs} />
                            </>
                        }
                        {
                            APPSTATE.mainsection.section == "collection" &&
                            <>
                                <GalleryCollections ipfs={ipfs} collection={APPSTATE.mainsection.value} />
                            </>
                        }
                        {
                            APPSTATE.mainsection.section == "artwork" &&
                            <>
                                <Gallery ipfs={ipfs} address={APPSTATE.mainsection.value} />
                            </>
                        }
                        {
                            APPSTATE.mainsection.section == "myArtworks" &&
                            <>
                                <MyArtworks ipfs={ipfs} />
                            </>
                        }
                        {
                            APPSTATE.mainsection.section == "myShares" &&
                            <>
                                <MyShares ipfs={ipfs} />
                            </>
                        }


                    </>
                )

            }

            <Grid sx={{ mt: 6 }} />
        </>
    )
}