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
    }, [ipfs])
    useEffect(() => {

        var currentSection = "";
        setInterval(function () {
            if (currentSection != window.location.pathname) {
                currentSection = window.location.pathname
                const section = window.location.pathname.toLowerCase().split('/')
                if (section.length == 2) {
                    if (section[1] == "collections") {
                        setMainSection({ section: "enter", value: 0, title: "Solid State" })
                    }
                    if (section[1] == "myartworks") {
                        setMainSection({ section: "myArtworks", value: 0, title: "My Artworks" })
                    }
                    if (section[1] == "myshares") {
                        setMainSection({ section: "myShares", value: 0, title: "My Shares" })
                    }
                }
                if (section.length == 4) {
                    if (section[1] == "collection") {
                        setMainSection({ section: "collection", value: Number(section[2]), title: toCamelCase(section[3]) })
                    }
                }
                if (section.length == 3) {
                    if (section[1] == "artwork") {
                        setMainSection({ section: "artwork", value: Number(section[2]), title: "" })
                    }
                }
            }
        }, 500);
    }, [])
    useEffect(() => {
        if (APPSTATE.mainsection.section == "enter") {
            window.history.pushState("", "", '/collections');
        }
        if (APPSTATE.mainsection.section == "myArtworks") {
            window.history.pushState("", "", '/myartworks');
        }
        if (APPSTATE.mainsection.section == "myShares") {
            window.history.pushState("", "", '/myshares');
        }
        if (APPSTATE.mainsection.section == "collection") {
            window.history.pushState("", "", '/collection/' + APPSTATE.mainsection.value + '/' + APPSTATE.mainsection.title);
        }
        if (APPSTATE.mainsection.section == "artwork") {
            window.history.pushState("", "", '/artwork/' + APPSTATE.mainsection.value);
        }

    }, [APPSTATE.mainsection.section])
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

export const toCamelCase = (text: string): string => {

    return text

        .replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim: string, index: number) =>

            index === 0 ? leftTrim.toLowerCase() : leftTrim.toUpperCase(),

        )
        .replace(/\s+/g, "")

}
