import React, { useState, useEffect } from "react";
import { useContractFunction, useCall, useEthers, useNotifications } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { EtherscanProvider } from "@ethersproject/providers"
import SolidStateGallery from "../chain-info/contracts/SolidStateGallery.json"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

export const ArtworkShareTradeBuyOffer = (artworkAddress: any) => {
    const { chainId, account } = useEthers()
    const { notifications } = useNotifications()
    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { state: buyOfferState, send: _placeBuyOrder } = useContractFunction(
        SolidStateGalleryContract,
        'placeBuyOrder',
        { transactionName: 'Place Buy Order' })



    useEffect(() => {
        if (buyOfferState.status === "Exception") {
            console.log(buyOfferState.errorMessage)
        }
    }, [buyOfferState,])
    const placeBuyOrder = (address: any, shareQty: any, sharePrice: any) => {
        let sq = BigNumber.from(shareQty)
        let sp = BigNumber.from(sharePrice)
        let p = sq.mul(sp)
        _placeBuyOrder(address, shareQty, sp, { value: p })
    }
    return { placeBuyOrder, buyOfferState }
}

export const ArtworkShareTradeSellOffer = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { state: sellOfferState, send: placeSellOrder } = useContractFunction(
        SolidStateGalleryContract,
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
    const { chainId, account } = useEthers()
    const { abi: abiGallery } = SolidStateGallery
    const { abi: abiArtwork } = SolidStateArtwork
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero

    const SolidStateArtWorkAddress = artworkAddress || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abiArtwork)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)
    const SolidStateGalleryInterface = new utils.Interface(abiGallery)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { state: sellOfferState, send: placeSellOrder } = useContractFunction(
        SolidStateGalleryContract,
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
            console.log("success", artworkAddress, shareQty, shareETH, ETH)

            placeSellOrder(artworkAddress, shareQty, sp)
        }
    }, [ApproveSharesState,])

    useEffect(() => {
        if (sellOfferState.status === "Exception") {
            console.log(sellOfferState.errorMessage)
        }

    }, [sellOfferState,])

    const approveShares = (qty: any) => {
        ApproveShares(SolidStateGalleryAddress, qty)
    }
    return { approveShares, ApproveSharesState, sellOfferState };
}

export const ArtworkShareAllBuyOffers = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    //getSellOrdersByAddress(address _artworkAddress, address _address)
    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getAllBuyOrders',
        args: [artworkAddress]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllSellOffers = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    //getSellOrdersByAddress(address _artworkAddress, address _address)
    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getAllSellOrders',
        args: [artworkAddress]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllBuyOffersOwner = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    //getSellOrdersByAddress(address _artworkAddress, address _address)
    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getBuyOrdersByAddress',
        args: [artworkAddress, account]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}

export const ArtworkShareAllSellOffersOwner = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)
    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getSellOrdersByAddress',
        args: [artworkAddress, account]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value
}


export const ArtworkShareAllEvents = (artworkAddress: any) => {
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const provider = new EtherscanProvider(chainId);
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface, provider)

    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getTransactions',
        args: [artworkAddress]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value

    /* console.log(provider)
     async function getEvents() {
         let eventFilter = SolidStateGalleryContract.filters.orderTransaction(artworkAddress)
         console.log(eventFilter)
         let events = await SolidStateGalleryContract.queryFilter(eventFilter)
         return events
     }
     return getEvents()*/
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
    const { chainId, account } = useEthers()
    const { abi } = SolidStateArtwork
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)
    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'balanceOf',
        args: [SolidStateGalleryAddress]
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
    const { chainId, account } = useEthers()
    const { abi: abiGallery } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero

    const SolidStateGalleryInterface = new utils.Interface(abiGallery)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    const { state: cancelBuyOrderState, send: cancelBuyOrder } = useContractFunction(
        SolidStateGalleryContract,
        'cancelBuyOrder',
        { transactionName: 'Cancel Sell Order' })
    return { cancelBuyOrder, cancelBuyOrderState }
}

export const ArtworkShareCancelSellOffer = (artworkAddress: any) => {
    const { chainId, account } = useEthers()
    const { abi: abiGallery } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero

    const SolidStateGalleryInterface = new utils.Interface(abiGallery)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    //cancelSellOrder(uint256 id)
    const { state: cancelSellOrderState, send: cancelSellOrder } = useContractFunction(
        SolidStateGalleryContract,
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