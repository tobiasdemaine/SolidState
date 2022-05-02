import React, { useState, useEffect } from "react";
import {
    GalleryViewAll
} from "../hooks/GalleryView"
import { useEthers } from "@usedapp/core"
import { MyArtworksList } from "./MyArtworksList"
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import useSolidStateContexts from "../hooks/useSolidStateContext"
export interface Props {

    ipfs: any
}
export const MyArtworks = ({ ipfs }: Props) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const artWorks = GalleryViewAll() || []
    console.log(artWorks)
    const _artwork = []
    for (var i in artWorks[0]) {
        _artwork.push({ address: artWorks[0][i], visibility: artWorks[1][i] })
    }
    const myData = new Array()
    //  console.log(APPSTATE)
    const [artworkData, setArtworkData] = useState(myData)
    const [Price, setPrice] = useState(0)
    const setProps = (data: any) => {
        myData.push(data)
        setArtworkData(myData)
    }
    useEffect(() => {
        console.log(artworkData)
        var p = 0
        for (i in artworkData) {
            p += Number(artworkData[i].value.price._hex)

        }
        setPrice(p)
    }, [artworkData])
    return (
        <>
            <Typography gutterBottom variant="h5" color="common.white" component="div" sx={{ p: 2, mt: 2 }}>
                You Own {artworkData.length} Artworks with a total value of {Price / 1e18} ETH
            </Typography>
            <Grid container spacing={1} alignItems="stretch">
                {_artwork.map((data: any, index: any) => (
                    <>
                        <MyArtworksList ipfs={ipfs} id={data.address} data={artworkData} setProps={setProps} />
                    </>
                ))}
            </Grid>


        </>
    )

}