import { useEffect } from 'react';
import { Collections } from './components/collection/Collections';
import useSolidStateContexts from "./hooks/useSolidStateContext"
import { Gallery } from "./components/gallery/Gallery"
import { GalleryCollections } from "./components/gallery/GalleryCollections"
import { useEthers } from "@usedapp/core";
import { Typography, Grid, Paper } from "@mui/material"
import { MyArtworks } from './components/my/MyArtworks';
import { AddArtWork } from './components/admin/AddArtwork';
import { MyShares } from './components/my/MyShares';
import { AddCollection } from './components/admin/AddCollection';

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

    var currentSection = "";
    const checkPath = () => {
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
                if (section[1] == "add") {
                    setMainSection({ section: "addArtwork", value: 0, title: "Add" })
                }
                if (section[1] == "addcollection") {
                    setMainSection({ section: "addCollection", value: 0, title: "Add Collection" })
                }
            }
            if (section.length == 4) {
                if (section[1] == "collection") {
                    setMainSection({ section: "collection", value: section[2], title: toFirstCapital(section[3]) })
                }
            }
            if (section.length == 3) {
                if (section[1] == "artwork") {
                    setMainSection({ section: "artwork", value: Number(section[2]), title: section[2] })
                }
            }
        }
    }
    useEffect(() => {

        checkPath()
        setInterval(checkPath, 500);
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
        if (APPSTATE.mainsection.section == "addArtwork") {
            window.history.pushState("", "", '/add');
        }
        if (APPSTATE.mainsection.section == "addCollection") {
            window.history.pushState("", "", '/addcollection');
        }
        if (APPSTATE.mainsection.section == "collection") {
            window.history.pushState("", "", '/collection/' + APPSTATE.mainsection.value + '/' + APPSTATE.mainsection.title);
        }
        if (APPSTATE.mainsection.section == "artwork") {
            window.history.pushState("", "", '/artwork/' + APPSTATE.mainsection.title.toString());
        }
    }, [APPSTATE])
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
                        {
                            APPSTATE.mainsection.section == "addArtwork" &&
                            <>
                                <AddArtWork ipfs={ipfs} />
                            </>
                        }
                        {
                            APPSTATE.mainsection.section == "addCollection" &&
                            <>
                                <AddCollection ipfs={ipfs} />
                            </>
                        }



                    </>
                )

            }

            <Grid sx={{ mt: 6 }} />
        </>
    )
}

export const toFirstCapital = (text: string): string => {

    return text.charAt(0).toUpperCase() + text.slice(1)

}
