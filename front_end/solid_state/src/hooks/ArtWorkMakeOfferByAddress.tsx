import { useContractFunction, useCall, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { useEffect, useState } from "react"

export const ArtWorkMakeOffer = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    // test if logged in as owner    
    const { chainId, account } = useEthers()

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkMakeOfferState, send: artworkMakeOffer } = useContractFunction(
        SolidStateArtWorkContract,
        'makeOfferToBuyContract',
        { transactionName: 'Purchase Offer' })

    const MakeArtworkOffer = (amount: string) => {
        //setAmountToStake(Number(amount))
        return artworkMakeOffer({
            value: amount,
        })
    }


    useEffect(() => {
        if (artworkMakeOfferState.status === "Exception") {
            console.log(artworkMakeOfferState.errorMessage)
        }
    }, [artworkMakeOfferState,])

    return { artworkMakeOffer, artworkMakeOfferState }
}

export default ArtWorkMakeOffer