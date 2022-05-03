import { useCall, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateGallery from "../chain-info/contracts/SolidStateGallery.json"



export const GalleryView = () => {

    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getArtWorks',
        args: []
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const GalleryOwners = () => {
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getOwners',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]

}

export const GalleryViewAll = () => {
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)

    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getAllArtWorks',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value
}

export const GalleryCollections = () => {
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getCollections',
        args: []
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }

    return value?.[0]

}

export const CollectionView = (id: any) => {
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getArtWorksByCollectionId',
        args: [id]
    }) ?? {}
    if (error) {

        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

export const CollectionViewAll = (id: any) => {

    const { chainId } = useEthers()
    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { value, error } = useCall(SolidStateGalleryAddress && {
        contract: SolidStateGalleryContract,
        method: 'getAllArtWorksByCollectionId',
        args: [id]
    }) ?? {}
    if (error) {
        console.error(error.message)
        return undefined
    }
    return value
}



export default {
    GalleryView,
    GalleryOwners,
    GalleryViewAll,
    GalleryCollections,
    CollectionView,
    CollectionViewAll
}