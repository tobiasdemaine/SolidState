import React, { useState, useEffect } from "react";
import { Card, CardActionArea, Grid } from "@mui/material"

import {
    ArtWorkViewById,
    ArtWorkViewPriceById,
    ArtWorkViewForSaleById,
    ArtWorkViewTokenBalanceById,
    ArtWorkPriceETHById,
    ArtWorkViewOwnersById,
    ArtworkTokenSymbol,
    ArtworkTokenName,
    ArtworkTokenTotalSupply
} from "../../hooks/ArtworkViewByAddress"

import CardContent from '@mui/material/CardContent'

import Typography from '@mui/material/Typography'
import useSolidStateContexts from "../../hooks/useSolidStateContext"

import { useEthers, useNotifications } from "@usedapp/core"
import { GalleryArtworkListMetaLoad } from '../gallery/GalleryArtworkListMetaLoad';

export interface Props {
    ipfs: any,
    id: any,
    data: any,
    setProps: Function
}
export const MyArtworksList = ({ ipfs, id, data, setProps }: Props) => {


    const [artworkData, setArtworkData] = useState(data)
    const { account } = useEthers()
    const address = id
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: { _hex: '' }, mediaDataPackURI: null }
    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkTokenBalance = ArtWorkViewTokenBalanceById(address)
    const artWorkTokenSymbol = ArtworkTokenSymbol(address)
    const artWorkTokenName = ArtworkTokenName(address)
    const artWorkTotalSupply = ArtworkTokenTotalSupply(address)
    const artWorkOwner = ArtWorkViewOwnersById(address) || []

    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()

    useEffect(() => {
        if (account === artWorkOwner[artWorkOwner.length - 1]) {
            if (artWorkMeta.artist != "") {
                setProps({
                    id: artworkData.length,
                    value: {
                        "meta": artWorkMeta,
                        "price": artWorkPrice,

                    }
                })
            }
        }


    }, [artWorkMeta])


    return (
        <>
            {(account === artWorkOwner[artWorkOwner.length - 1]) &&
                <Grid item xs={12} sm={6} md={4} >
                    <Card sx={{ maxWidth: 390, mt: 2 }} onClick={() => {
                        setMainSection({ section: "artwork", value: id, title: id })
                    }}>
                        <CardActionArea>
                            {artWorkMeta.mediaDataPackURI != null &&
                                <GalleryArtworkListMetaLoad ipfsHash={artWorkMeta.mediaDataPackURI} ipfs={ipfs} />
                            }

                            <CardContent>
                                {artWorkMeta.title != "" ? (<>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {artWorkMeta.title}
                                    </Typography>

                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">{artWorkMeta.artist}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">{artWorkMeta.medium}, {artWorkMeta.year}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">Share Name : {artWorkTokenName}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">Symbol : {artWorkTokenSymbol}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">{Number(artWorkTokenBalance)} of {Number(artWorkTotalSupply)} Shares Available</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">{address}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">Artwork Price : {Number(artWorkPrice) / 1e18} ETH</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" sx={{ fontWeight: 100 }} color="text.secondary">Share Price : {(Number(artWorkPrice) / Number(artWorkTotalSupply) / 1e18)}  ETH</Typography></Grid>

                                </>) : (
                                    <Typography gutterBottom variant="h5" component="div">
                                        Loading
                                    </Typography>
                                )}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
        </>
    );
}