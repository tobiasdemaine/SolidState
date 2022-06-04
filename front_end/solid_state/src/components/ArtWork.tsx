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
    Typography

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
    ipfs: any,
    address: any,
    visibility: any,
    galleryOwner: any
}




export const ArtWork = ({ ipfs, address, visibility, galleryOwner }: ArtWorkAddressProps) => {
    const { account } = useEthers()
    const isConnected = account !== undefined
    const { notifications } = useNotifications()
    // GET HOOKS
    const artWorkMeta = ArtWorkViewById(address) || { artist: "", title: "", medium: "", year: "", mediaDataPackURI: null }
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
                    <Grid container spacing={2} sx={{ mb: 6, mt: 1 }} alignItems="stretch">
                        <Grid item xs={12} md={6} lg={4}>
                            {artWorkMeta.mediaDataPackURI !== null &&
                                <>
                                    <ArtworkMediaCarousel ipfs={ipfs} ipfsHash={artWorkMeta.mediaDataPackURI} description="JSON FILE" />

                                </>
                            }
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>

                            <Grid sx={{ p: 2, pt: 0, mb: 2 }} >
                                {artWorkMeta.title != "" ? (
                                    <>
                                        <Grid item xs={12} sx={{ mb: 2 }}>
                                            <Typography id="artworkTitle" variant="h1" color="text.primary">{artWorkMeta.title}</Typography>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mb: 1 }}><Typography variant="body1" color="text.secondary">{artWorkMeta.artist}</Typography></Grid>
                                        <Grid item xs={12} sx={{ mb: 1 }}><Typography variant="body1" color="text.secondary">{artWorkMeta.medium}, {artWorkMeta.year}</Typography></Grid>


                                        <Grid item xs={12} sx={{ mb: 1 }}><Typography variant="body1" color="text.secondary">{Number(artWorkPrice) / 1e18} ETH</Typography></Grid>


                                        <Grid item xs={12} sx={{ mb: 1 }}><Typography variant="body1" color="text.secondary">{artWorkForSale ? (<> FOR SALE</>) : (<>NOT FOR SALE</>)}</Typography></Grid>
                                        {artWorkOwner[artWorkOwner.length - 1] === account &&

                                            <Grid item xs={12} sx={{ mb: 1 }}><Typography id="youOwnThisArtWork" variant="body1" color="text.secondary">You own this Artwork</Typography></Grid>
                                        }
                                    </>) : (<>Loading</>)}
                            </Grid>



                            <Grid sx={{ p: 2, mb: 2 }}>
                                {artWorkMeta.title != "" ? (<>
                                    <Grid container spacing={0.5} alignItems="stretch">
                                        <Grid item xs={12} sx={{ mb: 1 }}>
                                            <Typography variant="h3" color="text.primary">Token/Share</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">Name</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1" color="text.secondary">
                                                {artWorkTokenName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">Symbol</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1" color="text.secondary">{artWorkTokenSymbol}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">Price</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1" color="text.secondary">{Number(artWorkSharePrice) / 1e18}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" color="text.secondary">Shares</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="body1" color="text.secondary">{Number(artWorkTotalSupply)}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 1 }} >
                                            <Typography variant="body2" color="text.secondary">
                                                <Link target="_blank" href={ethscanAddress}>{address}</Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </>) : (<>Loading</>)}
                            </Grid>
                            {isConnected &&
                                <><ArtWorkContract address={address}></ArtWorkContract></>

                            }

                        </Grid>
                        {isConnected &&
                            <>
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
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <Paper sx={{ p: 2, mb: 2 }} >
                                        <ArtworkShareTradeHistory artworkAddress={address}></ ArtworkShareTradeHistory>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>

                                </Grid>
                            </>
                        }
                        {account === galleryOwner &&
                            <>
                                <Grid item xs={4} >
                                    <Paper elevation={0} sx={{ p: 1, }}>
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