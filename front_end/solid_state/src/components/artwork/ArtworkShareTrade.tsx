import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Snackbar, Backdrop, Alert, Typography, Paper, Button, Input, TextField } from "@mui/material"
import { styled } from '@mui/material/styles';
import useSolidStateContexts from "../../hooks/useSolidStateContext"
import { useEthers, useNotifications } from "@usedapp/core"
import {
    ArtworkShareTradeBuyOffer,
    ArtworkShareTradeSellOffer,
    ArtworkShareTradeSellOfferApprove,
    ArtworkShareAllBuyOffers,
    ArtworkShareAllBuyOffersOwner,
    ArtworkShareAllSellOffers,
    ArtworkShareAllSellOffersOwner,
    ArtworkShareAllEvents,
    ArtworkShareOwn,
    ArtworkShareCancelBuyOffer,
    ArtworkShareCancelSellOffer,

} from "../../hooks/ArtworkShareTradeFunction";
import { formatUnits } from "@ethersproject/units"
import moment from 'moment';
import {
    ArtWorkGetSharePrice,
    ArtWorkGetContractPrice,

} from "../../hooks/ArtworkViewByAddress"
export interface Props {
    artworkAddress: any,
}



export const ArtworkShareTradeBuy = ({ artworkAddress }: Props) => {
    const { placeBuyOrder, buyOfferState } = ArtworkShareTradeBuyOffer(artworkAddress)
    const [buyShareQty, setBuyShareQty] = useState(1)
    const [buyShareETH, setBuyShareETH] = useState(0)
    const [buyShareETHTotal, setBuyShareETHTotal] = useState(0)
    const [canUpdate, setCanUpdate] = useState(true)
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);
    const artWorkSharePrice = ArtWorkGetSharePrice(artworkAddress) || 0

    useEffect(() => {
        if (canUpdate === true) {
            setBuyShareETH(artWorkSharePrice / 1e18)
            setBuyShareETHTotal(artWorkSharePrice / 1e18)
        }
    }, [artWorkSharePrice])

    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {
        if (buyOfferState.status === "Exception") {
            setSnackbarErrorText(buyOfferState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
            setCanUpdate(true)
        }
        if (buyOfferState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
            setCanUpdate(true)
        }
    }, [buyOfferState,])



    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    return (
        <>
            <Grid item xs={12} >
                <Typography component="div">
                    Share Buy Order
                </Typography>
            </Grid>
            <Grid container spacing={1} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>

                <Grid item xs={12}>
                    <TextField
                        id="artWorkBuyShareOfferQTY"
                        label="Share Qty"
                        type="number"
                        fullWidth={true}

                        variant="filled"
                        value={buyShareQty}
                        onChange={event => {
                            setBuyShareQty(Number(event?.target.value))
                            setBuyShareETHTotal(Number(event?.target.value) * buyShareETH)
                            setCanUpdate(false)
                        }}
                    />
                    <TextField
                        id="artWorkBuyShareOfferETH"
                        label="Share ETH"
                        type="number"
                        fullWidth={true}

                        variant="filled"
                        value={buyShareETH}
                        onChange={event => {
                            setBuyShareETH(Number(event?.target.value))
                            setBuyShareETHTotal(buyShareQty * Number(event?.target.value))
                            setCanUpdate(false)
                        }}
                    />
                    <TextField
                        id="artWorkBuyTotalETH"
                        label="Total Eth"
                        fullWidth={true}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        value={buyShareETHTotal}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button id="placeBuyOrder" variant="contained" color="primary" onClick={() => {
                        setBackDropOpen(true)
                        var shareETH = buyShareETH * 1e18
                        //var ETHToSend = (buyShareQty * parseFloat(formatUnits(buyShareETH, 18)))
                        placeBuyOrder(
                            buyShareQty,
                            shareETH
                        )
                        setCanUpdate(false)
                    }}
                    >Make Share Buy Order</Button>
                </Grid>
            </Grid>
            <Snackbar id="transactionSuccess"
                open={showTransactionSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success" >
                    TRANSACTION APPROVED.
                </Alert>
            </Snackbar>
            <Snackbar id="transactionFail"
                open={showForTransactionFail}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="error" >
                    {snackbarErrorText}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backDropOpen}

            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export const ArtworkShareTradeSell = ({ artworkAddress }: Props) => {
    const { account } = useEthers()
    const artworkShareOwn = ArtworkShareOwn(artworkAddress, account) || 0
    const [sellShareQty, setSellShareQty] = useState(1)
    const [sellShareETH, setSellShareETH] = useState(0)
    const [canUpdate, setCanUpdate] = useState(true)
    const [sellShareETHTotal, setSellShareETHTotal] = useState(0)
    const { approveShares, ApproveSharesState, sellOfferState } = ArtworkShareTradeSellOfferApprove(artworkAddress, sellShareQty, sellShareETH)
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);
    const artWorkSharePrice = ArtWorkGetSharePrice(artworkAddress) || 0




    useEffect(() => {
        if (canUpdate === true) {
            setSellShareETH(artWorkSharePrice / 1e18)
            setSellShareETHTotal(artWorkSharePrice / 1e18)
        }
    }, [artWorkSharePrice])

    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {
        if (ApproveSharesState.status === "Exception") {
            setSnackbarErrorText(ApproveSharesState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
            setCanUpdate(true)
        }
        if (ApproveSharesState.status === "Success") {
            setShowTransactionSuccess(true)

        }

        if (sellOfferState.status === "Exception") {
            setSnackbarErrorText(sellOfferState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
            setCanUpdate(true)
        }
        if (sellOfferState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
            setCanUpdate(true)
        }
    }, [sellOfferState, ApproveSharesState])



    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    return (
        <>
            {artworkShareOwn == 0 ? (
                <>
                    <Typography component="div">
                        You have no shares to trade.
                    </Typography>
                </>
            ) : (
                <>
                    <Grid item xs={12} >
                        <Typography component="div">
                            Share Sell Order
                        </Typography>
                        <div>
                            <strong id="availableShares">{Number(artworkShareOwn)}</strong> available Shares
                        </div>
                    </Grid>
                    <Grid container spacing={1} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>

                        <Grid item xs={12}>
                            <TextField
                                id="artWorkSellShareOfferQTY"
                                label="Share Qty"
                                type="number"
                                fullWidth={true}
                                variant="filled"
                                value={sellShareQty}
                                onChange={event => {
                                    setSellShareQty(Number(event?.target.value))
                                    setSellShareETHTotal(Number(event?.target.value) * sellShareETH)
                                    setCanUpdate(false)
                                }}
                            />
                            <TextField
                                id="artWorkSellShareOfferETH"
                                label="Share ETH"
                                type="number"
                                fullWidth={true}
                                variant="filled"
                                value={sellShareETH}
                                onChange={event => {
                                    setSellShareETH(Number(event?.target.value))
                                    setSellShareETHTotal(sellShareQty * Number(event?.target.value))
                                    setCanUpdate(false)
                                }}
                            />
                            <TextField
                                id="artWorkSellTotalETH"
                                label="Total Eth"
                                fullWidth={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={sellShareETHTotal}
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" id="approveSharesSellOrder" color="primary" onClick={() => {
                                setBackDropOpen(true)
                                approveShares(sellShareQty)
                                setCanUpdate(false)
                            }}>Approve &amp; Make Share Sell Order</Button>
                        </Grid>
                    </Grid>
                    <Snackbar id="transactionSuccess"
                        open={showTransactionSuccess}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="success" >
                            TRANSACTION APPROVED.
                        </Alert>
                    </Snackbar>
                    <Snackbar id="transactionFail"
                        open={showForTransactionFail}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="error" >
                            {snackbarErrorText}
                        </Alert>
                    </Snackbar>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backDropOpen}

                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            )}

        </>
    )
}


export const ArtworkShareBuyOrders = ({ artworkAddress }: Props) => {
    const buyOrders = ArtworkShareAllBuyOffersOwner(artworkAddress) || [[]]
    const { cancelBuyOrder, cancelBuyOrderState } = ArtworkShareCancelBuyOffer(artworkAddress)
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);
    // snack bars
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }
    useEffect(() => {
        if (cancelBuyOrderState.status === "Exception") {
            setSnackbarErrorText(cancelBuyOrderState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (cancelBuyOrderState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }


    }, [cancelBuyOrderState])


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    var total = 0
    for (var x in buyOrders[0]) {
        if (buyOrders[4][x] == 0) {
            total += Number(buyOrders[3][x]) / (10 ** 18)
        }
    }
    return (
        <>
            {buyOrders[0][0] !== undefined ? (
                <>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Typography component="div">
                            My Buy Orders
                        </Typography>
                        <small> You have <strong id="heldEth">{total}</strong> held ETH</small>
                    </Grid>
                    <Grid container spacing={.3} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>

                        <Grid item xs={1}>
                            <Item>
                                <small>ID</small>
                            </Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item>
                                <small>ETH</small>
                            </Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item>
                                <small>SHARES</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>CANCEL</small>
                            </Item>
                        </Grid>
                        {
                            buyOrders[0].map((data: any, index: any) =>
                                buyOrders[4][index] == 0 &&
                                <React.Fragment key={index}>  <Grid item xs={1}>
                                    <Item>
                                        {Number(buyOrders[5][index])}
                                    </Item>
                                </Grid>
                                    <Grid item xs={4}>
                                        <Item>
                                            {Number(buyOrders[2][index]) / (10 ** 18)}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>
                                            {Number(buyOrders[1][index])}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <Button id={'cancelBuyOrder_' + index} style={{ fontSize: '10px', padding: 0.5 }} variant="contained" size="small" onClick={() => {
                                                setBackDropOpen(true)
                                                cancelBuyOrder(Number(buyOrders[5][index]))

                                            }}>
                                                Cancel
                                            </Button>
                                        </Item>
                                    </Grid>
                                </React.Fragment>


                            )
                        }
                    </Grid>
                    <Snackbar id="transactionSuccess"
                        open={showTransactionSuccess}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="success" >
                            TRANSACTION APPROVED.
                        </Alert>
                    </Snackbar>
                    <Snackbar id="transactionFail"
                        open={showForTransactionFail}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="error" >
                            {snackbarErrorText}
                        </Alert>
                    </Snackbar>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backDropOpen}

                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            ) : (
                <>
                    <Typography component="div">
                        You have no active Buy Orders
                    </Typography>
                </>
            )
            }
        </>
    )
}

export const ArtworkShareSellOrders = ({ artworkAddress }: Props) => {

    const sellOrders = ArtworkShareAllSellOffersOwner(artworkAddress) || [[]]
    const { cancelSellOrder, cancelSellOrderState } = ArtworkShareCancelSellOffer(artworkAddress)
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);


    // snack bars
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }


    useEffect(() => {
        if (cancelSellOrderState.status === "Exception") {
            setSnackbarErrorText(cancelSellOrderState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (cancelSellOrderState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }


    }, [cancelSellOrderState])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    var total = 0
    for (var x in sellOrders[0]) {
        if (sellOrders[4][x] == 0) {
            total += parseInt(sellOrders[3][x])
        }
    }
    return (
        <>
            {sellOrders[0][0] !== undefined ? (
                <>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Typography component="div">
                            My Sell Orders
                        </Typography>
                        <small> You have {total} held Shares</small>
                    </Grid>
                    <Grid container spacing={.3} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>

                        <Grid item xs={1}>
                            <Item>
                                <small>ID</small>
                            </Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item>
                                <small>ETH</small>
                            </Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item>
                                <small>SHARES</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>CANCEL</small>
                            </Item>
                        </Grid>
                        {
                            sellOrders[0].map((data: any, index: any) =>
                                sellOrders[4][index] == 0 &&
                                <React.Fragment key={index}>
                                    <Grid item xs={1}>
                                        <Item>
                                            {Number(sellOrders[5][index])}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>
                                            {Number(sellOrders[2][index]) / (10 ** 18)}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>
                                            {Number(sellOrders[3][index])}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <Button id={'cancelSellOrder_' + index} style={{ fontSize: '10px', padding: 0.5 }} variant="contained" size="small" onClick={() => {
                                                setBackDropOpen(true)
                                                cancelSellOrder(Number(sellOrders[5][index]))

                                            }}>
                                                Cancel
                                            </Button>
                                        </Item>
                                    </Grid>
                                </React.Fragment>
                            )
                        }
                    </Grid>
                    <Snackbar id="transactionSuccess"
                        open={showTransactionSuccess}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="success" >
                            TRANSACTION APPROVED.
                        </Alert>
                    </Snackbar>
                    <Snackbar id="transactionFail"
                        open={showForTransactionFail}
                        autoHideDuration={5000}
                        onClose={handleCloseSnack}>
                        <Alert onClose={handleCloseSnack} severity="error" >
                            {snackbarErrorText}
                        </Alert>
                    </Snackbar>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backDropOpen}

                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            ) : (
                <>
                    <Typography component="div">
                        You have no active Sell Orders
                    </Typography>
                </>
            )
            }
        </>
    )
}

export const ArtworkShareAllSellOrders = ({ artworkAddress }: Props) => {
    const sellOrders = ArtworkShareAllSellOffers(artworkAddress) || [[]]
    const { placeBuyOrder, buyOfferState } = ArtworkShareTradeBuyOffer(artworkAddress)
    const [buyShareQty, setBuyShareQty] = useState(1)
    const [buyShareETH, setBuyShareETH] = useState(0)
    const [buyShareETHTotal, setBuyShareETHTotal] = useState(0)

    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);
    // snack bars
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {

        if (buyOfferState.status === "Exception") {
            setSnackbarErrorText(buyOfferState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (buyOfferState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
    }, [buyOfferState,])





    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    // _shareValues, _ethValues, _balances, _ids
    return (
        <>
            {
                sellOrders[0][0] !== undefined ? (
                    <>
                        <Grid item xs={12} sx={{ mb: 1 }}>
                            <Typography component="div">
                                Open Sell Orders
                            </Typography>
                        </Grid>
                        <Grid container spacing={.3} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>


                            <Grid item xs={3}>
                                <Item>
                                    <small>ETH</small>
                                </Item>
                            </Grid>
                            <Grid item xs={3}>
                                <Item>
                                    <small>SHARES</small>
                                </Item>
                            </Grid>
                            <Grid item xs={3}>
                                <Item>
                                    <small>TOTAL</small>
                                </Item>
                            </Grid>
                            <Grid item xs={3}>
                                <Item>
                                    <small>Fill Order</small>
                                </Item>
                            </Grid>

                            {
                                sellOrders[0].map((data: any, index: any) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={3}>
                                            <Item>
                                                {Number(sellOrders[1][index]) / 10 ** 18}
                                            </Item>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Item>
                                                {Number(sellOrders[2][index])}
                                            </Item>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Item>
                                                {(Number(sellOrders[1][index]) * Number(sellOrders[0][index]) / 10 ** 18)}
                                            </Item>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Item>
                                                <Button id={'fillSellOrder_' + index} style={{ fontSize: '10px', padding: 0.5 }} variant="contained" size="small" onClick={() => {
                                                    setBuyShareQty(Number(sellOrders[2][index]))
                                                    setBuyShareETH(Number(sellOrders[1][index] / 10 ** 18))
                                                    setBackDropOpen(true)
                                                    console.log(artworkAddress,
                                                        Number(sellOrders[2][index]),
                                                        Number(sellOrders[1][index]))
                                                    placeBuyOrder(
                                                        Number(sellOrders[2][index]),
                                                        Number(sellOrders[1][index])
                                                    )
                                                }}>
                                                    Fill Order
                                                </Button>
                                            </Item>


                                        </Grid>
                                        <Snackbar id="transactionSuccess"
                                            open={showTransactionSuccess}
                                            autoHideDuration={5000}
                                            onClose={handleCloseSnack}>
                                            <Alert onClose={handleCloseSnack} severity="success" >
                                                TRANSACTION APPROVED.
                                            </Alert>
                                        </Snackbar>
                                        <Snackbar id="transactionFail"
                                            open={showForTransactionFail}
                                            autoHideDuration={5000}
                                            onClose={handleCloseSnack}>
                                            <Alert onClose={handleCloseSnack} severity="error" >
                                                {snackbarErrorText}
                                            </Alert>
                                        </Snackbar>
                                        <Backdrop
                                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                            open={backDropOpen}

                                        >
                                            <CircularProgress color="inherit" />
                                        </Backdrop>

                                    </React.Fragment>
                                ))
                            }
                        </Grid>

                    </>
                ) : (
                    <>
                        <Typography component="div">
                            No Sell Orders
                        </Typography>
                    </>
                )
            }
        </>
    )
}

export const ArtworkShareAllBuyOrders = ({ artworkAddress }: Props) => {
    const buyOrders = ArtworkShareAllBuyOffers(artworkAddress) || [[]]
    const [sellShareQty, setSellShareQty] = useState(1)
    const [sellShareETH, setSellShareETH] = useState(0)
    const [sellShareETHTotal, setSellShareETHTotal] = useState(0)
    const { approveShares, ApproveSharesState, sellOfferState } = ArtworkShareTradeSellOfferApprove(artworkAddress, sellShareQty, sellShareETH)
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = React.useState(false);
    // snack bars
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {
        if (ApproveSharesState.status === "Exception") {
            setSnackbarErrorText(ApproveSharesState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (ApproveSharesState.status === "Success") {
            setShowTransactionSuccess(true)

        }

        if (sellOfferState.status === "Exception") {
            setSnackbarErrorText(sellOfferState.errorMessage || "")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (sellOfferState.status === "Success") {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
        }
    }, [sellOfferState, ApproveSharesState])


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    // _shareValues, _ethValues, _balances, _ids
    return (
        <>
            {buyOrders[0][0] !== undefined ? (

                <>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Typography component="div">
                            Open Buy Orders
                        </Typography>
                    </Grid>
                    <Grid container spacing={.3} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>


                        <Grid item xs={3}>
                            <Item>
                                <small>ETH</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>SHARES</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>TOTAL</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>FILL ORDER</small>
                            </Item>
                        </Grid>

                        {
                            buyOrders[0].map((data: any, index: any) => (
                                <React.Fragment key={index}>
                                    < Grid item xs={3} >
                                        <Item>
                                            {Number(buyOrders[1][index]) / 10 ** 18}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            {Number(buyOrders[0][index])}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            {(Number(buyOrders[1][index]) * Number(buyOrders[0][index]) / 10 ** 18)}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <Button id={'fillBuyOrder_' + index} style={{ fontSize: '10px', padding: 0.5 }} variant="contained" size="small" onClick={() => {
                                                setSellShareQty(Number(buyOrders[0][index]))
                                                setSellShareETH(Number(buyOrders[1][index] / 10 ** 18))
                                                setBackDropOpen(true)
                                                approveShares(sellShareQty)
                                            }}>
                                                Fill Order
                                            </Button>
                                        </Item>


                                    </Grid>
                                    <Snackbar id="transactionSuccess"
                                        open={showTransactionSuccess}
                                        autoHideDuration={5000}
                                        onClose={handleCloseSnack}>
                                        <Alert onClose={handleCloseSnack} severity="success" >
                                            TRANSACTION APPROVED.
                                        </Alert>
                                    </Snackbar>
                                    <Snackbar id="transactionFail"
                                        open={showForTransactionFail}
                                        autoHideDuration={5000}
                                        onClose={handleCloseSnack}>
                                        <Alert onClose={handleCloseSnack} severity="error" >
                                            {snackbarErrorText}
                                        </Alert>
                                    </Snackbar>
                                    <Backdrop
                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                        open={backDropOpen}

                                    >
                                        <CircularProgress color="inherit" />
                                    </Backdrop>
                                </React.Fragment>
                            ))
                        }
                    </Grid>

                </>
            ) : (
                <>
                    <Typography component="div">
                        No Buy Orders
                    </Typography>
                </>
            )
            }
        </>
    )
}

export const ArtworkShareOwnerBuyOrders = ({ artworkAddress }: Props) => {

    return (
        <>

        </>
    )
}

export const ArtworkShareOwnerSellOrders = ({ artworkAddress }: Props) => {


    return (
        <></>
    )
}

export const ArtworkShareTradeHistory = ({ artworkAddress }: Props) => {
    const events = ArtworkShareAllEvents(artworkAddress) || [[]]
    const { account } = useEthers()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0.5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    //eth, share, timestamp, buyer, seller)
    return (
        <>
            {events[0][0] !== undefined ? (
                <>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Typography component="div">
                            My Transactions
                        </Typography>
                    </Grid>
                    <Grid container spacing={.3} alignItems="stretch" style={{ maxHeight: 400, overflow: 'auto' }}>

                        <Grid item xs={3}>
                            <Item>
                                <small>Date</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>ETH</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>Shares</small>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <small>Type</small>
                            </Item>
                        </Grid>
                        {
                            events[0].map((data: any, index: any) =>
                                events[3][index] == account &&
                                <React.Fragment key={index}>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{(moment(events[2][index])).format('DD-MM-YYYY')}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{Number(events[0][index]) / 1e18}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{Number(events[1][index])}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>Sell</small>
                                        </Item>
                                    </Grid>
                                </React.Fragment>

                            )
                        }{
                            events[0].map((data: any, index: any) =>
                                events[4][index] == account &&
                                <React.Fragment key={index}>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{(moment(events[2][index])).format('DD-MM-YYYY')}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{Number(events[0][index]) / (1e18)}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>{Number(events[1][index])}</small>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Item>
                                            <small>Buy</small>
                                        </Item>
                                    </Grid>
                                </React.Fragment>
                            )
                        }
                    </Grid>
                </>
            ) : (
                <>
                    <Typography component="div">
                        No Transactions
                    </Typography>
                </>
            )
            }</>
    )
}