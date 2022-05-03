import { useCall } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import SolidStateArtwork from "../chain-info/contracts/SolidStateToken.json"

export const ArtworkTokenOwnerBalance = (address: any, tokenOwnerAddress: any) => {
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



export default ArtworkTokenOwnerBalance
