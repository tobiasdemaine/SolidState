// a grid of artworks
// maybe there can be a toggle view for list or grid

// owner functions 
//      newOwner(address _newOwnerAddress) public onlyOwner 
//      addArtWork(address _artWorkAddress) public onlyOwner
//      -setArtWorkVisibility(address _artWorkContractAddress, bool _visibility) public onlyOwner
//      -getAllArtworks() public view onlyOwner returns (address[] memory, bool[] memory)
//
//
// public functions
//      -getOwners() public view returns (address[] memory)
//      -getArtWorks() public view returns (address[] memory) 
//
// ///

// Get Contract ABI
// getOwner
// 


import { GalleryView, GalleryOwners, GalleryViewAll, } from "../hooks/GalleryView"
import { GalleryArtWorkItem } from "./GallerytArtWorkItem"
import { useEthers } from "@usedapp/core"
import Grid from '@mui/material/Grid';
import { GalleryArtworkList } from "./GalleryArtworkList"
export interface Props {
    ipfs: any,
    address: any,
}

export const Gallery = ({ ipfs, address }: Props) => {
    // test if logged in as owner    
    const { account } = useEthers()


    const isConnected = account !== undefined


    const owners = GalleryOwners() || []

    const artWorks = GalleryViewAll() || []


    var data = { address: null, visibility: false }
    for (var i in artWorks[0]) {
        if (artWorks[0][i] == address) {
            data = { address: artWorks[0][i], visibility: artWorks[1][i] }
        }
    }

    return (<>
        {data.address != null &&
            <GalleryArtWorkItem address={data.address} visibility={data.visibility} galleryOwner={owners[owners.length - 1]} />
        }
    </>)

}