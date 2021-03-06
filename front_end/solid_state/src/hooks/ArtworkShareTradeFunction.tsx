import { useEffect } from "react";
import { useContractFunction, useCall, useEthers } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import { BigNumber } from "@ethersproject/bignumber"

export const ArtworkShareTradeBuyOffer = (artworkAddress: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)


    const { state: buyOfferState, send: _placeBuyOrder } = useContractFunction(
        SolidStateArtworkContract,
        'placeBuyOrder',
        { transactionName: 'Place Buy Order' })



    useEffect(() => {
        if (buyOfferState.status === "Exception") {
            console.log(buyOfferState.errorMessage)
        }
    }, [buyOfferState,])
    const placeBuyOrder = (shareQty: any, sharePrice: any) => {
        let sq = BigNumber.from(shareQty)
        let sp = BigNumber.from(sharePrice)
        let p = sq.mul(sp)
        _placeBuyOrder(shareQty, sp, { value: p })
    }
    return { placeBuyOrder, buyOfferState }
}

export const ArtworkShareTradeSellOffer = (artworkAddress: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)


    const { state: sellOfferState, send: placeSellOrder } = useContractFunction(
        SolidStateArtworkContract,
        'placeSellOrder',
        { transactionName: 'Place Sell Order' })



    useEffect(() => {
        if (sellOfferState.status === "Exception") {
            console.log(sellOfferState.errorMessage)
        }
    }, [sellOfferState,])

    return { placeSellOrder, sellOfferState }

}

export const ArtworkShareTradeSellOfferApprove = (artworkAddress: any, shareQty: any, shareETH: any) => {
    const { abi } = SolidStateArtwork


    const SolidStateArtWorkAddress = artworkAddress || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { state: sellOfferState, send: placeSellOrder } = useContractFunction(
        SolidStateArtWorkContract,
        'placeSellOrder',
        { transactionName: 'Place Sell Order' })


    const { state: ApproveSharesState, send: ApproveShares } = useContractFunction(
        SolidStateArtWorkContract,
        'approve',
        { transactionName: 'Approve Shares' })

    useEffect(() => {
        if (ApproveSharesState.status === "Exception") {
            console.log(ApproveSharesState.errorMessage)
        }
        if (ApproveSharesState.status === "Success") {

            var ETH = shareETH * (10 ** 18)
            let sq = BigNumber.from(shareQty)
            let sp = BigNumber.from(ETH)
            let p = sq.mul(sp)

            placeSellOrder(sq, sp)
        }
    }, [ApproveSharesState,])

    useEffect(() => {
        if (sellOfferState.status === "Exception") {
            console.log(sellOfferState.errorMessage)
        }

    }, [sellOfferState,])

    const approveShares = (qty: any) => {
        console.log(qty)
        ApproveShares(artworkAddress, qty)
    }
    return { approveShares, ApproveSharesState, sellOfferState };
}

export const ArtworkShareAllBuyOffers = (artworkAddress: any) => {

    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { value, error } = useCall(artworkAddress && {
        contract: SolidStateArtworkContract,
        method: 'getAllBuyOrders',

    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllSellOffers = (artworkAddress: any) => {

    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { value, error } = useCall(artworkAddress && {
        contract: SolidStateArtworkContract,
        method: 'getAllSellOrders',

    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllBuyOffersOwner = (artworkAddress: any) => {
    const { account } = useEthers()

    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { value, error } = useCall(artworkAddress && {
        contract: SolidStateArtworkContract,
        method: 'getBuyOrdersByAddress',
        args: [account]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllSellOffersOwner = (artworkAddress: any) => {
    const { account } = useEthers()

    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)
    const { value, error } = useCall(artworkAddress && {
        contract: SolidStateArtworkContract,
        method: 'getSellOrdersByAddress',
        args: [account]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}


export const ArtworkShareAllEvents = (artworkAddress: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { value, error } = useCall(artworkAddress && {
        contract: SolidStateArtworkContract,
        method: 'getTransactions',
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value

}

export const ArtworkShareOwn = (address: any, tokenOwnerAddress: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)
    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'balanceOf',
        args: [tokenOwnerAddress]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkSharesInOffers = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)
    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'balanceOfHeldShares',
        args: [SolidStateArtWorkContract]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkShareOwnInOffers = (artworkAddress: any) => {

    return false
}

export const ArtworkShareCancelBuyOffer = (artworkAddress: any) => {
    const { abi } = SolidStateArtwork

    const SolidStateArtworkInterface = new utils.Interface(abi)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { state: cancelBuyOrderState, send: cancelBuyOrder } = useContractFunction(
        SolidStateArtworkContract,
        'cancelBuyOrder',
        { transactionName: 'Cancel Sell Order' })
    return { cancelBuyOrder, cancelBuyOrderState }
}

export const ArtworkShareCancelSellOffer = (artworkAddress: any) => {
    const { abi: abiGallery } = SolidStateArtwork

    const SolidStateArtworkInterface = new utils.Interface(abiGallery)
    const SolidStateArtworkContract = new Contract(artworkAddress, SolidStateArtworkInterface)

    const { state: cancelSellOrderState, send: cancelSellOrder } = useContractFunction(
        SolidStateArtworkContract,
        'cancelSellOrder',
        { transactionName: 'Cancel Sell Order' })
    return { cancelSellOrder, cancelSellOrderState }
}


export default {
    ArtworkShareTradeBuyOffer,
    ArtworkShareTradeSellOffer,
    ArtworkShareTradeSellOfferApprove,
    ArtworkShareAllBuyOffers,
    ArtworkShareAllBuyOffersOwner,
    ArtworkShareAllSellOffersOwner,
    ArtworkShareAllSellOffers,
    ArtworkShareAllEvents,
    ArtworkShareOwn,
    ArtworkSharesInOffers,
    ArtworkShareOwnInOffers,
    ArtworkShareCancelBuyOffer,
    ArtworkShareCancelSellOffer
}