import { useContractFunction, useCall, useEthers } from "@usedapp/core"

import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import useSolidStateContexts from "../hooks/useSolidStateContext"


export const ArtWorkOwnerSetForSale = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { chainId, account } = useEthers()

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkSetForSaleState, send: SetArtworkForSale } = useContractFunction(
        SolidStateArtWorkContract,
        'setForSaleOn',
        { transactionName: 'Set FOR SALE' }
    )

    return { SetArtworkForSale, artworkSetForSaleState }
}

export const ArtWorkOwnerSetNotForSale = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkSetNotForSaleState, send: SetArtworkNotForSale } = useContractFunction(
        SolidStateArtWorkContract,
        'setForSaleOff',
        { transactionName: 'Set FOR SALE' }
    )

    return { SetArtworkNotForSale, artworkSetNotForSaleState }
}



export const ArtworkReleaseTokens = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkReleaseTokensState, send: artworkReleaseTokens } = useContractFunction(
        SolidStateArtWorkContract,
        'contractReleaseTokens',
        { transactionName: 'Release Tokens' }
    )


    return { artworkReleaseTokens, artworkReleaseTokensState }
}



export default {
    ArtWorkOwnerSetForSale,
    ArtWorkOwnerSetNotForSale,
    ArtworkReleaseTokens
}