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
} from "../../hooks/ArtworkViewByAddress"

import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import useSolidStateContexts from "../../hooks/useSolidStateContext"
import { CollectionsOverviewArtwork } from '../collection/CollectionOverviewArtwork'
import { useEthers, useNotifications } from "@usedapp/core"
import { GalleryArtworkListMetaLoad } from './GalleryArtworkListMetaLoad';
export interface Props {
    ipfs: any,
    id: any,
    count: any,
    visibility: any,
    galleryOwner: any,
}
export const GalleryArtworkList = ({ ipfs, id, count, visibility, galleryOwner }: Props) => {

    const { account } = useEthers()
    const address = id
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: "", mediaDataPackURI: null }
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
    const cardId = "artwork_" + id
    return (
        <>
            {(visibility || account === galleryOwner || account === artWorkOwner[artWorkOwner.length - 1]) &&
                <Grid item xs={12} sm={6} md={4}>
                    <Card id={cardId} sx={{ maxWidth: 390, mt: 2 }} onClick={() => {
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

                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">{artWorkMeta.artist}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">{artWorkMeta.medium}, {artWorkMeta.year}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">Share Name : {artWorkTokenName}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">Symbol : {artWorkTokenSymbol}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">{Number(artWorkTokenBalance)} of {Number(artWorkTotalSupply)} Shares Available</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">{address}</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">Artwork Price : {Number(artWorkContractPrice) / 1e18}  ETH</Typography></Grid>
                                    <Grid sx={{ mb: 0.4 }}><Typography variant="subtitle2" color="text.secondary">Share Price : {Number(artWorkSharePrice) / 1e18} ETH</Typography></Grid>

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