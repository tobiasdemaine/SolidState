import { useEffect } from "react";
import { useContractFunction, useEthers } from "@usedapp/core"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateGallery from "../chain-info/contracts/SolidStateGallery.json"

export const AddNewCollection = () => {

    // test if logged in as owner    
    const { chainId } = useEthers()

    const { abi } = SolidStateGallery
    const SolidStateGalleryAddress = chainId ? networkMapping[chainId.toString()]["SolidStateGallery"][0] : constants.AddressZero
    const SolidStateGalleryInterface = new utils.Interface(abi)
    const SolidStateGalleryContract = new Contract(SolidStateGalleryAddress, SolidStateGalleryInterface)


    const { state: addNewCollectionState, send: addNewCollection } = useContractFunction(
        SolidStateGalleryContract,
        'addCollection',
        { transactionName: 'New Collection' })



    useEffect(() => {
        if (addNewCollectionState.status === "Exception") {
            console.log(addNewCollectionState.errorMessage)
        }
    }, [addNewCollectionState,])

    return { addNewCollection, addNewCollectionState }
}



export default AddNewCollection