import { useContractFunction, useCall, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"
import useSolidStateContexts from "./useSolidStateContext"

export const ArtWorkViewById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)

    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getMetaData',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }


    return value?.[0]
}

export const ArtWorkViewPriceById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getContractSalePrice',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtWorkViewForSaleById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'isForSale',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtWorkViewTokenBalanceById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'contractTokenBalance',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtWorkViewOwnersById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getOwners',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}


export const ArtWorkPriceETHById = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getContractPriceInETH',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkTokenSymbol = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'symbol',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkTokenName = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'name',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtworkTokenTotalSupply = (address: any) => {
    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)



    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'totalSupply',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const ArtWorkProvinanceItem = (address: any, index: Number) => {

    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    // test if logged in as owner    
    const { chainId, account } = useEthers()

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getProvinanceByIndex',
        args: [index]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }

    return value
}

export const ArtWorkProvinace = (address: any) => {
    const provinance = []
    //const provinanceCount = ArtWorkProvinanceCount()
    //for (var i = 0; i < provinanceCount; i++) {
    let temp = ArtWorkProvinanceItem(address, 0)
    provinance.push(temp)
    //}
    return provinance
}

export const ArtWorkGetSharePrice = (address: any) => {

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getSharePrice',

    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }

    return value?.[0]
}


export const ArtWorkGetContractPrice = (address: any) => {

    const { abi } = SolidStateArtwork
    const SolidStateArtWorkAddress = address || constants.AddressZero
    const SolidStateArtWorkInterface = new utils.Interface(abi)
    const SolidStateArtWorkContract = new Contract(SolidStateArtWorkAddress, SolidStateArtWorkInterface)


    const { value, error } = useCall(SolidStateArtWorkAddress && {
        contract: SolidStateArtWorkContract,
        method: 'getContractSalePrice',

    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }

    return value?.[0]
}


export default {
    ArtWorkViewById,
    ArtWorkViewPriceById,
    ArtWorkViewForSaleById,
    ArtWorkViewTokenBalanceById,
    ArtWorkPriceETHById,
    ArtWorkViewOwnersById,
    ArtworkTokenSymbol,
    ArtworkTokenName,
    ArtworkTokenTotalSupply,
    ArtWorkProvinace,
    ArtWorkGetSharePrice,
    ArtWorkGetContractPrice,
}



