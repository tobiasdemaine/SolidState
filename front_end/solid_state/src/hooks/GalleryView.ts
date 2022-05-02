import { useContractFunction, useCall, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateGallery from "../chain-info/contracts/SolidStateGallery.json"
import { ChargingStationRounded } from "@mui/icons-material"


export const GalleryView = () => {

    // test if logged in as owner    
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    //getArtWorks() public view returns (address[] memory)
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
    const { chainId, account } = useEthers()

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

    // test if logged in as owner    
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    //getAllArtworks() public view onlyOwner returns (address[] memory, bool[] memory)
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
    const { chainId, account } = useEthers()

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

    // test if logged in as owner    
    const { chainId, account } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    //getArtWorks() public view returns (address[] memory)
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

    // test if logged in as owner    
    const { chainId, account } = useEthers()
    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    //getAllArtworks() public view onlyOwner returns (address[] memory, bool[] memory)
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