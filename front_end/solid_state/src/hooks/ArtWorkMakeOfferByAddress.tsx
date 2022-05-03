import { useContractFunction, useCall, useEthers } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import { useEffect, useState } from "react"

export const ArtWorkMakeOffer = (address: any) => {
    // test if logged in as owner    

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkMakeOfferState, send: artworkMakeOffer } = useContractFunction(
        SolidStateArtWorkContract,
        'makeOfferToBuyContract',
        { transactionName: 'Purchase Offer' })




    useEffect(() => {
        if (artworkMakeOfferState.status === "Exception") {
            console.log(artworkMakeOfferState.errorMessage)
        }
    }, [artworkMakeOfferState,])

    return { artworkMakeOffer, artworkMakeOfferState }
}

export default ArtWorkMakeOffer