import { useEffect } from "react";
import { useContractFunction, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateGallery from "../chain-info/contracts/SolidStateGallery.json"

export const ArtworkGalleryVisibility = () => {

    // test if logged in as owner    
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { state: artworkVisibilityState, send: artworkVisibility } = useContractFunction(
        SolidStateGalleryContract,
        'setArtWorkVisibility',
        { transactionName: 'Set Visibility' })



    useEffect(() => {
        if (artworkVisibilityState.status === "Exception") {
            console.log(artworkVisibilityState.errorMessage)
        }
    }, [artworkVisibilityState,])

    return { artworkVisibility, artworkVisibilityState }
}



export default ArtworkGalleryVisibility
