
import React, { useState, useEffect } from "react";
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { Button, Input, Switch, CircularProgress, Snackbar, Backdrop, Paper, Alert, Grid, Typography, TextField } from "@mui/material"

import {
    ArtWorkViewById,
    ArtWorkViewPriceById,
    ArtWorkViewForSaleById,
    ArtWorkViewTokenBalanceById,
    ArtWorkViewOwnersById,
    ArtWorkProvinace,
    ArtWorkPriceETHById
} from "../hooks/ArtworkViewByAddress"
import { ArtWorkMakeOffer } from "../hooks/ArtWorkMakeOfferByAddress"
import {
    ArtWorkOwnerSetForSale,
    ArtWorkOwnerSetNotForSale,
    ArtworkOwnerSetPrice,
    ArtworkReleaseTokens,
    ArtWorkGetDecreaseLimit,
    ArtworkSetDecreaseLimit
} from "../hooks/ArtWorkOwnerByAddress"



import { useEthers, useNotifications } from "@usedapp/core"

export interface ArtWorkContractProps {
    address: any,
}

export const ArtWorkContract = ({ address }: ArtWorkContractProps) => {
    const { account } = useEthers()
    const { notifications } = useNotifications()

    const isConnected = account !== undefined

    const { state: APPSTATE } = useSolidStateContexts()


    const { SetArtworkForSale, artworkSetForSaleState } = ArtWorkOwnerSetForSale(address)
    const { SetArtworkNotForSale, artworkSetNotForSaleState } = ArtWorkOwnerSetNotForSale(address)
    const { SetArtworkPrice, artworkSetPriceState } = ArtworkOwnerSetPrice(address)
    const { artworkReleaseTokens, artworkReleaseTokensState } = ArtworkReleaseTokens(address)
    //const { artworkSetDecreaseLimit, artworkSetDecreaseLimitState } = ArtworkSetDecreaseLimit(address)

    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: { _hex: '' }, mediaDataPackURI: '' }
    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkForSale = ArtWorkViewForSaleById(address)
    const artWorkTokenBalance = ArtWorkViewTokenBalanceById(address)
    const artWorkOwners = ArtWorkViewOwnersById(address) || []
    //const artWorkProvinance = ArtWorkProvinace(address) || []
    const artWorkPriceETH = artWorkPrice //ArtWorkPriceETHById(address) * (10 ** 10) / (10 ** 18)
    //const MakeArtWorkOffer = ArtWorkMakeOffer()
    const { artworkMakeOffer, artworkMakeOfferState } = ArtWorkMakeOffer(address)


    //const ArtWorkDecreaseLimit = ArtWorkGetDecreaseLimit(address) || 0

    const [artWorkOfferPriceInETH, setArtWorkOfferPriceInETH] = useState(artWorkPriceETH);
    const [artWorkPRICE, setArtWorkPRICE] = useState(Number(artWorkPrice._hex) || 0);
    const [artWorkReleaseTokensQty, setArtWorkReleaseTokenQty] = useState(0)
    const [artWorkReleaseTokensAddress, setArtWorkReleaseTokenAddress] = useState(account?.toString() || "")
    //const [artWorkDecreaseLimit, setArtWorkDecreaseLimit] = useState(ArtWorkDecreaseLimit)

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


    // PROVINANCE
    /*  const _artWorkProvinance = []
      for (var j in artWorkProvinance) {
          //
          var k = artWorkProvinance[j] || []
  
          _artWorkProvinance.push(<li>{k[0]}<> </>{k[1]}</li>)
      }
  */
    return (
        <>



            {!isOwner && artWorkForSale ? (
                <Paper sx={{ p: 2, }} >
                    <div>
                        MAKE OFFER IN ETH
                        <Input type="number" value={artWorkPriceETH} onChange={event => {
                            setArtWorkOfferPriceInETH(Number(event?.target.value))
                        }} />
                        <Button variant="contained" color="primary"
                            onClick={() => {
                                console.log("Make Offer :" + artWorkPriceETH)
                                var t = artWorkPriceETH * 10 ** 18
                                setBackDropOpen(true);
                                artworkMakeOffer({ value: t })

                            }} >
                            Make offer
                        </Button>
                    </div>
                </Paper>
            ) : (<></>)}

            {isOwner ? (
                <>
                    <Paper sx={{ p: 2, }} >
                        <Grid item xs={12} >
                            <Typography component="div">
                                Owner Functions
                            </Typography>

                        </Grid>
                        <Grid item xs={12} sx={{ mt: 1 }}>
                            Set For Sale
                            <Switch
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
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            Release Tokens<div>
                                <TextField
                                    sx={{ mt: .5 }}
                                    label="Qty"
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
                            <Button sx={{ mt: 1 }} variant="contained" onClick={() => {
                                setBackDropOpen(true);
                                artworkReleaseTokens(artWorkReleaseTokensAddress, artWorkReleaseTokensQty)
                            }}>Release Tokens</Button>
                        </Grid>
                    </Paper>
                    <Snackbar
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