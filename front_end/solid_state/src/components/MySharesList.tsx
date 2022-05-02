import React, { useState, useEffect } from "react";


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
} from "../hooks/ArtworkViewByAddress"

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles';
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { CollectionsOverviewArtwork } from './CollectionOverviewArtwork'
import { useEthers, useNotifications } from "@usedapp/core"
import { GalleryArtworkListMetaLoad } from './GalleryArtworkListMetaLoad';
import ArtworkTokenOwnerBalance from "../hooks/ArtWorkToken";

export interface Props {
    ipfs: any,
    id: any,
    data: any,
    setProps: Function
}
export const MySharesList = ({ ipfs, id, data, setProps }: Props) => {


    const [artworkData, setArtworkData] = useState(data)
    const { account } = useEthers()
    const address = id
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: { _hex: '' }, mediaDataPackURI: null }
    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkForSale = ArtWorkViewForSaleById(address)
    const artWorkTokenBalance = ArtWorkViewTokenBalanceById(address)
    const artWorkTokenSymbol = ArtworkTokenSymbol(address)
    const artWorkTokenName = ArtworkTokenName(address)
    const artWorkTotalSupply = ArtworkTokenTotalSupply(address)
    const artWorkOwner = ArtWorkViewOwnersById(address) || []
    const artWorkTokenOwnerBalance = ArtworkTokenOwnerBalance(address, account) || { _hex: '' }
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    useEffect(() => {
        if (Number(artWorkTokenOwnerBalance._hex) !== 0) {
            if (artWorkMeta.artist != "") {
                setProps({
                    id: artworkData.length,
                    value: {
                        "meta": artWorkMeta,
                        "price": ((artWorkPrice / artWorkTotalSupply) * Number(artWorkTokenOwnerBalance._hex)),
                        "shares": Number(artWorkTokenOwnerBalance._hex)
                    }
                })

            }
        }


    }, [artWorkMeta])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <>
            {Number(artWorkTokenOwnerBalance._hex) !== 0 &&
                <>
                    <Grid item xs={4} >
                        <Item style={{ "cursor": "pointer" }} onClick={() => {
                            setMainSection({ section: "artwork", value: id, title: artWorkMeta.title })
                        }}>{artWorkTokenName}</Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>{artWorkTokenSymbol}</Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>{Number(artWorkTokenOwnerBalance._hex)}</Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>{(artWorkPrice / artWorkTotalSupply) / 1e18}</Item>
                    </Grid>
                    <Grid item xs={2}>
                        <Item>{((artWorkPrice / artWorkTotalSupply) * Number(artWorkTokenOwnerBalance._hex)) / 1e18}</Item>
                    </Grid>

                </>
            }
        </>
    );
}