
import React, { useState, useEffect } from "react";
import { Button, Input, Switch, CircularProgress, Snackbar, Backdrop, Paper, Alert, Grid, Typography, TextField } from "@mui/material"

import {
    ArtWorkViewPriceById,
    ArtWorkViewForSaleById,
    ArtWorkViewOwnersById,
} from "../hooks/ArtworkViewByAddress"
import { ArtWorkMakeOffer } from "../hooks/ArtWorkMakeOfferByAddress"
import {
    ArtWorkOwnerSetForSale,
    ArtWorkOwnerSetNotForSale,
    ArtworkReleaseTokens,
} from "../hooks/ArtWorkOwnerByAddress"



import { useEthers, useNotifications } from "@usedapp/core"

export interface ArtWorkContractProps {
    address: any,
}

export const ArtWorkContract = ({ address }: ArtWorkContractProps) => {
    const { account } = useEthers()
    const { notifications } = useNotifications()



    const { SetArtworkForSale, artworkSetForSaleState } = ArtWorkOwnerSetForSale(address)
    const { SetArtworkNotForSale, artworkSetNotForSaleState } = ArtWorkOwnerSetNotForSale(address)
    const { artworkReleaseTokens, artworkReleaseTokensState } = ArtworkReleaseTokens(address)

    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkForSale = ArtWorkViewForSaleById(address)
    const artWorkOwners = ArtWorkViewOwnersById(address) || []
    const artWorkPriceETH = artWorkPrice / 1e18
    const { artworkMakeOffer, artworkMakeOfferState } = ArtWorkMakeOffer(address)



    const [, setArtWorkOfferPriceInETH] = useState(artWorkPriceETH);
    const [artWorkReleaseTokensQty, setArtWorkReleaseTokenQty] = useState(0)
    const [artWorkReleaseTokensAddress, setArtWorkReleaseTokenAddress] = useState(account?.toString() || "")

    const [artWorkFORSALE, setArtWorkFORSALE] = useState(artWorkForSale)

    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)

    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    // snack bars
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {

        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Set FOR SALE").length > 0) {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "Set FOR SALE").length > 0) {
            setSnackbarErrorText("transaction failed")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (artworkSetForSaleState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(artworkSetForSaleState.errorMessage || "")
            setShowTransactionFail(true)
        }
        if (artworkSetNotForSaleState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(artworkSetNotForSaleState.errorMessage || "")
            setShowTransactionFail(true)
        }






        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Release Tokens").length > 0) {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "Release Tokens").length > 0) {
            setSnackbarErrorText("transaction failed")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (artworkReleaseTokensState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(artworkReleaseTokensState.errorMessage || "")
            setShowTransactionFail(true)
        }




        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Purchase Offer").length > 0) {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "Purchase Offer").length > 0) {
            setSnackbarErrorText("transaction failed")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (artworkMakeOfferState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(artworkMakeOfferState.errorMessage || "")
            setShowTransactionFail(true)
        }


    }, [notifications,
        showTransactionSuccess,
        artworkSetForSaleState,
        artworkSetNotForSaleState,
        artworkReleaseTokensState,
        artworkMakeOfferState])

    // BACKDROP WITH CIRCULAR LOADER
    const [backDropOpen, setBackDropOpen] = React.useState(false);


    /// OWNERS
    const _artWorkOwners = []
    var isOwner = false
    for (var i = 0; i < artWorkOwners.length; i++) { //} in artWorkOwners) {
        if (account?.toUpperCase() == artWorkOwners[i].toUpperCase()) {
            if (i == artWorkOwners.length - 1) {
                isOwner = true
            }
        }
        _artWorkOwners.push(<li>{artWorkOwners[i]}</li>)
    }


    return (
        <>



            {!isOwner && artWorkForSale ? (
                <Grid item sx={{ p: 2 }} >
                    <div>

                        <Button variant="contained" color="primary"
                            onClick={() => {
                                setBackDropOpen(true);
                                artworkMakeOffer({ value: artWorkPrice })
                            }} >
                            Purchase Artwork
                        </Button>
                    </div>
                </Grid>
            ) : (<></>)}

            {isOwner ? (
                <>
                    <Grid sx={{ p: 2, }} >
                        <Grid item xs={12} >
                            <Typography variant="body1" color="text.secondary">Set For Sale
                                <Switch id="artWorkForSale"
                                    checked={artWorkForSale}
                                    onChange={event => {
                                        setBackDropOpen(true);
                                        setArtWorkFORSALE(event?.target.checked)
                                        if (event?.target.checked == true) {
                                            SetArtworkForSale()
                                        } else {
                                            SetArtworkNotForSale()
                                        }
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Typography variant="body1" color="text.secondary">Release Tokens</Typography>
                            <div>
                                <TextField
                                    sx={{ mt: .5 }}
                                    label="Qty"
                                    id="artWorkReleaseTokensQty"
                                    type="number"
                                    fullWidth={true}
                                    variant="filled" value={artWorkReleaseTokensQty} onChange={event => {
                                        setArtWorkReleaseTokenQty(Number(event?.target.value))
                                    }}></TextField></div>
                            <div>
                                <TextField
                                    label="Address"

                                    fullWidth={true}
                                    variant="filled" value={artWorkReleaseTokensAddress} onChange={event => {
                                        setArtWorkReleaseTokenAddress(event?.target.value)
                                    }}></TextField></div>
                            <Button sx={{ mt: 1 }} id="releaseTokens" variant="contained" onClick={() => {
                                setBackDropOpen(true);
                                artworkReleaseTokens(artWorkReleaseTokensAddress, artWorkReleaseTokensQty)
                            }}>Release Tokens</Button>
                        </Grid>
                    </Grid>
                    <Snackbar
                        id="#transactionSuccess"
                        open={showTransactionSuccess}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="success" >
                            TRANSACTION APPROVED.
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={showForTransactionFail}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="error" >
                            {snackbarErrorText}
                        </Alert>
                    </Snackbar>

                </>) : (<></>)
            }
            <div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backDropOpen}

                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>


        </>
    )

    /*  <Paper elevation={20} sx={{ p: 1, mt: 0.5, }}>
                        Set Decrease % Limit
                        <Input type="number" value={artWorkDecreaseLimit} onChange={event => {
                            setArtWorkDecreaseLimit(Number(event?.target.value))
                        }} />
                        <Button variant="contained" onClick={() => {
                            setBackDropOpen(true);
                            artworkSetDecreaseLimit(artWorkDecreaseLimit)
                        }}>Set Decrease % Limit</Button>
                    </Paper> */

}