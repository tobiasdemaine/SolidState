import { useContractFunction, useCall, useEthers } from "@usedapp/core"

import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import useSolidStateContexts from "../hooks/useSolidStateContext"


export const ArtWorkOwnerSetForSale = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    // test if logged in as owner    
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

export const ArtworkOwnerSetPrice = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkSetPriceState, send: SetArtworkPrice } = useContractFunction(
        SolidStateArtWorkContract,
        'updateContractSalePrice',
        { transactionName: 'Set Price' }
    )


    return { SetArtworkPrice, artworkSetPriceState }
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

export const ArtWorkGetDecreaseLimit = (address: any) => {
    const { account } = useEthers()
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'viewOfferDecreaseLimit',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkSetDecreaseLimit = (address: any) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { state: artworkSetDecreaseLimitState, send: artworkSetDecreaseLimit } = useContractFunction(
        SolidStateArtWorkContract,
        'updateOfferDecreaseLimit',
        { transactionName: 'Decrease Limit' }
    )
    return { artworkSetDecreaseLimit, artworkSetDecreaseLimitState }
}


export default {
    ArtWorkOwnerSetForSale,
    ArtWorkOwnerSetNotForSale,
    ArtworkOwnerSetPrice,
    ArtworkReleaseTokens,
    ArtWorkGetDecreaseLimit,
    ArtworkSetDecreaseLimit
}