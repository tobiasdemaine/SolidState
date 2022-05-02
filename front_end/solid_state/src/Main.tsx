import React, { useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Collections } from './components/Collections';
import useSolidStateContexts from "./hooks/useSolidStateContext"
import { Gallery } from "./components/Gallery"
import { GalleryCollections } from "./components/GalleryCollections"

import { Button, Input, Switch, CircularProgress, Snackbar, Backdrop, Paper, Alert } from "@mui/material"
import { MyArtworks } from './components/MyArtworks';
import { MyShares } from './components/MyShares';
export interface MainProps {
    ipfs: any,

}

export const Main = ({ ipfs }: MainProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress, setIpfs } = useSolidStateContexts()

    const pathname = window.location.pathname

    useEffect(() => {


        if (Boolean(ipfs)) {
            setIpfs(ipfs)
        }
    }, [ipfs]);
    return (
        <>
            {!Boolean(ipfs) ? (
                <>
                    <Paper elevation={20} sx={{ p: 1, mt: 2, }}><Typography variant="h6" component="div"   >
                        Waiting for IPFS to connect
                    </Typography>
                        Maybe there should be a splash screen here
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


        </>
    )
}