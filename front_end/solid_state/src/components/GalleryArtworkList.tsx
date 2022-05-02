import * as React from 'react';
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
    ArtworkTokenTotalSupply,
    ArtWorkGetSharePrice,
    ArtWorkGetContractPrice
} from "../hooks/ArtworkViewByAddress"

import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { CollectionsOverviewArtwork } from './CollectionOverviewArtwork'
import { useEthers, useNotifications } from "@usedapp/core"
import { GalleryArtworkListMetaLoad } from './GalleryArtworkListMetaLoad';
export interface Props {
    ipfs: any,
    id: any,
    visibility: any,
    galleryOwner: any,
}
export const GalleryArtworkList = ({ ipfs, id, visibility, galleryOwner }: Props) => {

    const { account } = useEthers()
    const address = id
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: { _hex: '' }, mediaDataPackURI: null }
    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkForSale = ArtWorkViewForSaleById(address)
    const artWorkTokenBalance = ArtWorkViewTokenBalanceById(address)
    //const artWorkPriceETH = ArtWorkPriceETHById(address) * (10 ** 10) / (10 ** 18)
    const artWorkTokenSymbol = ArtworkTokenSymbol(address)
    const artWorkTokenName = ArtworkTokenName(address)
    const artWorkTotalSupply = ArtworkTokenTotalSupply(address)
    const artWorkOwner = ArtWorkViewOwnersById(address) || []
    const artWorkSharePrice = ArtWorkGetSharePrice(address)
    const artWorkContractPrice = ArtWorkGetContractPrice(address)
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()
    return (
        <>
            {(visibility || account === galleryOwner || account === artWorkOwner[artWorkOwner.length - 1]) &&
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ maxWidth: 390, mt: 2 }} onClick={() => {
                        setMainSection({ section: "artwork", value: id, title: artWorkMeta.title })
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
                                    <Typography variant="body2" color="text.secondary">
                                        <div><small>{artWorkMeta.artist}</small></div>
                                        <div><small>{artWorkMeta.medium}, {Number(artWorkMeta.year)}</small></div>
                                        <div><small>Share Name : {artWorkTokenName}</small></div>
                                        <div><small>Symbol : {artWorkTokenSymbol}</small></div>
                                        <div><small>{Number(artWorkTokenBalance)} of {Number(artWorkTotalSupply)} Shares Available</small></div>
                                        <div><small>{address}</small></div>
                                        <div><small>Artwork Price : {Number(artWorkContractPrice) / 1e18}  ETH</small></div>
                                        <div><small>Share Price : {Number(artWorkSharePrice) / 1e18} ETH</small></div>
                                    </Typography>
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