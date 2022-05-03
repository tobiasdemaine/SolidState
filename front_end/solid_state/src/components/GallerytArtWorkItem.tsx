import React, { useState, useEffect } from "react";
import useSolidStateContexts from "../hooks/useSolidStateContext"
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
    ArtWorkGetContractPrice,

} from "../hooks/ArtworkViewByAddress"
import {
    Link,
    CircularProgress,
    Snackbar,
    ToggleButton,
    Backdrop,
    Paper,
    Alert,
    Grid,

} from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ArtworkGalleryVisibility } from "../hooks/ArtWorkGallery"
import { useEthers, useNotifications } from "@usedapp/core";
import { GalleryArtworkMetaData } from "./GalleryArtworkMetaData"
import { ArtworkMediaCarousel } from "./ArtworkMediaCarousel"
import { ArtWorkContract } from "./ArtWorkContract"
import {
    ArtworkShareTradeBuy,
    ArtworkShareTradeSell,
    ArtworkShareBuyOrders,
    ArtworkShareSellOrders,
    ArtworkShareTradeHistory,
    ArtworkShareAllSellOrders,
    ArtworkShareAllBuyOrders,

} from "./ArtworkShareTrade"


export interface ArtWorkAddressProps {
    address: any,
    visibility: any,
    galleryOwner: any
}


export const GalleryArtWorkItem = ({ address, visibility, galleryOwner }: ArtWorkAddressProps) => {
    const { account } = useEthers()
    const { notifications } = useNotifications()

    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    // GET HOOKS
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: { _hex: '' }, mediaDataPackURI: null }
    const artWorkPrice = ArtWorkViewPriceById(address) || {}
    const artWorkForSale = ArtWorkViewForSaleById(address)
    const artWorkTokenBalance = ArtWorkViewTokenBalanceById(address)
    const artWorkTokenSymbol = ArtworkTokenSymbol(address)
    const artWorkTokenName = ArtworkTokenName(address)
    const artWorkTotalSupply = ArtworkTokenTotalSupply(address)
    const artWorkOwner = ArtWorkViewOwnersById(address) || []
    const artWorkSharePrice = ArtWorkGetSharePrice(address)
    const artWorkContractPrice = ArtWorkGetContractPrice(address)

    // SET HOOKS
    const { artworkVisibility, artworkVisibilityState } = ArtworkGalleryVisibility()

    // STATES
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);



    // BACKEND EVENTS
    useEffect(() => {

        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Set Visibility").length > 0) {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "Set Visibility").length > 0) {
            setSnackbarErrorText("transaction failed")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (artworkVisibilityState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(artworkVisibilityState.errorMessage || "")
            setShowTransactionFail(true)
        }

    }, [notifications, artworkVisibilityState])


    // ITERACTION EVENTS

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        /*const div = event.currentTarget;
        const artWorkContractAddress = div.getAttribute('data-contractaddress');
        setMainSection("artwork")
        setArtWorkAddress(artWorkContractAddress || "")
        window.history.replaceState(null, "Solid State", "/" + artWorkContractAddress)*/
    }
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    const ethscanAddress = "https://kovan.etherscan.io/address/" + address
    return (

        <>
            {(visibility || account === galleryOwner || account === artWorkOwner[artWorkOwner.length - 1]) &&
                <div data-contractaddress={address} onClick={handleClick}>
                    <Grid container spacing={2} sx={{ mb: 4, mt: 1 }} alignItems="stretch">
                        <Grid item xs={12} md={6} lg={4}>
                            {artWorkMeta.mediaDataPackURI !== null &&
                                <>
                                    <ArtworkMediaCarousel IpfsHash={artWorkMeta.mediaDataPackURI} description="JSON FILE" />

                                </>
                            }



                            <Paper elevation={1} sx={{ p: 2, mb: .5 }}>
                                {artWorkMeta.title != "" ? (<>
                                    <div><strong>{artWorkMeta.title}</strong></div>

                                    <div><small>{artWorkMeta.artist}</small></div>
                                    <div><small>{artWorkMeta.medium}, {Number(artWorkMeta.year)}</small></div>


                                    <div><small>{Number(artWorkPrice) / 1e18} ETH</small></div>


                                    <div><small>{artWorkForSale ? (<>FOR SALE</>) : (<>NOT FOR SALE</>)}</small></div>
                                    {artWorkOwner[artWorkOwner.length - 1] === account &&
                                        <div><small>You own This Artwork</small></div>
                                    }
                                </>) : (<>Loading</>)}
                            </Paper>



                            <Paper sx={{ p: 2, mb: 2 }} >
                                {artWorkMeta.title != "" ? (<>
                                    <Grid container spacing={2} sx={{ p: 2 }} alignItems="stretch">
                                        <Grid xs={12} sx={{ mb: 1 }}><strong>Token/Share</strong></Grid>
                                        <Grid xs={3}><small>Name</small></Grid><Grid xs={9}><small><strong>{artWorkTokenName}</strong></small></Grid>
                                        <Grid xs={3}><small>Symbol</small></Grid><Grid xs={9}><small><strong>{artWorkTokenSymbol}</strong></small></Grid>
                                        <Grid xs={3}><small>Price</small></Grid><Grid xs={9}><small><strong>{Number(artWorkSharePrice) / 1e18}</strong></small></Grid>
                                        <Grid xs={3}><small>Shares</small></Grid><Grid xs={9}><small><strong>{Number(artWorkTotalSupply)}</strong></small></Grid>
                                        <Grid xs={12} sx={{ mt: 1 }} >
                                            <small>
                                                <Link target="_blank" href={ethscanAddress}>{address}</Link>
                                            </small>
                                        </Grid>
                                    </Grid>
                                </>) : (<>Loading</>)}
                            </Paper>


                            <ArtWorkContract address={address}></ArtWorkContract>

                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Paper sx={{ p: 2, mb: .5 }} >
                                < ArtworkShareTradeBuy artworkAddress={address}></ArtworkShareTradeBuy>
                            </Paper>
                            <Paper sx={{ p: 2, mb: .5 }} >
                                < ArtworkShareBuyOrders artworkAddress={address}></ArtworkShareBuyOrders>
                            </Paper>
                            <Paper sx={{ p: 2, }} >
                                < ArtworkShareAllBuyOrders artworkAddress={address}></ArtworkShareAllBuyOrders>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Paper sx={{ p: 2, mb: .5 }} >
                                < ArtworkShareTradeSell artworkAddress={address}></ArtworkShareTradeSell>
                            </Paper>
                            <Paper sx={{ p: 2, mb: .5 }} >
                                < ArtworkShareSellOrders artworkAddress={address}></ArtworkShareSellOrders>
                            </Paper>
                            <Paper sx={{ p: 2, mb: .5 }} >
                                < ArtworkShareAllSellOrders artworkAddress={address}></ArtworkShareAllSellOrders>
                            </Paper>
                            <Paper sx={{ p: 2, mb: 2 }} >
                                <ArtworkShareTradeHistory artworkAddress={address}></ ArtworkShareTradeHistory>
                            </Paper>
                        </Grid>


                        {account === galleryOwner &&
                            <>
                                <Grid item xs={12} >
                                    <Paper elevation={1} sx={{ p: 1, }}>
                                        <ToggleButton
                                            value="check"
                                            selected={visibility}
                                            onChange={event => {
                                                event.stopPropagation();
                                                setBackDropOpen(true);
                                                artworkVisibility(address, !visibility)
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </ToggleButton>
                                    </Paper><Snackbar
                                        open={showTransactionSuccess}
                                        autoHideDuration={5000}
                                        onClose={handleCloseSnack}>
                                        <Alert onClose={handleCloseSnack} severity="success">
                                            TRANSACTION APPROVED.
                                        </Alert>
                                    </Snackbar><Snackbar
                                        open={showForTransactionFail}
                                        autoHideDuration={5000}
                                        onClose={handleCloseSnack}>
                                        <Alert onClose={handleCloseSnack} severity="error">
                                            {snackbarErrorText}
                                        </Alert>
                                    </Snackbar>
                                    <Backdrop
                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                        open={backDropOpen}

                                    >
                                        <CircularProgress color="inherit" />
                                    </Backdrop>
                                </Grid>
                            </>
                        }
                    </Grid>
                </div>
            }
        </>

    )

}