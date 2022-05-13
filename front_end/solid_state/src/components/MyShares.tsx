import React, { useState, useEffect } from "react";
import {
    GalleryViewAll
} from "../hooks/GalleryView"
import { MySharesList } from "./MySharesList";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
export interface Props {

    ipfs: any
}
export const MyShares = ({ ipfs }: Props) => {
    const artWorks = GalleryViewAll() || []
    const _artwork = []
    for (var i in artWorks[0]) {
        _artwork.push({ address: artWorks[0][i], visibility: artWorks[1][i] })
    }

    const myData = new Array()
    const [artworkData, setArtworkData] = useState(myData)

    const setProps = (data: any) => {
        myData.push(data)
        setArtworkData(myData)
    }
    const [shares, setShares] = useState(0)
    const [totalShareValue, setTotalShareValue] = useState(0)
    useEffect(() => {
        var p = 0
        var s = 0
        for (i in artworkData) {
            p += artworkData[i].value.price
            s += artworkData[i].value.shares
        }
        setShares(s)
        setTotalShareValue(p)
    }, [artworkData])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    return (
        <>
            <Typography gutterBottom variant="h5" color="common.white" component="div" sx={{ p: 2, mt: 2 }}>
                You Own {shares} Shares in {artworkData.length} Artworks with a total value of {totalShareValue / 1e18} ETH
            </Typography>
            <Grid container spacing={.5} alignItems="stretch">
                <Grid item xs={4}>
                    <Item>Name</Item>
                </Grid>
                <Grid item xs={2}>
                    <Item>Sym</Item>
                </Grid>
                <Grid item xs={2}>
                    <Item>Qty</Item>
                </Grid>
                <Grid item xs={2}>
                    <Item>Unit</Item>
                </Grid>
                <Grid item xs={2}>
                    <Item>ETH</Item>
                </Grid>

                {_artwork.map((data: any, index: any) => (
                    <React.Fragment key={index}>
                        <MySharesList ipfs={ipfs} id={data.address} data={artworkData} setProps={setProps} />
                    </React.Fragment>
                ))}
            </Grid>


        </>
    )

}