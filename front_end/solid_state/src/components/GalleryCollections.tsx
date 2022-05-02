import {
    GalleryOwners, CollectionView, CollectionViewAll
} from "../hooks/GalleryView"
import { GalleryArtWorkItem } from "./GallerytArtWorkItem"
import { useEthers } from "@usedapp/core"
import { GalleryArtworkList } from "./GalleryArtworkList"
import Grid from '@mui/material/Grid';

export interface GalleryCollectionProps {
    collection: any,
    ipfs: any
}
export const GalleryCollections = ({ collection, ipfs }: GalleryCollectionProps) => {

    // test if logged in as owner    
    const { account } = useEthers()


    const isConnected = account !== undefined

    const artWorkAddresses = CollectionView(collection) || []
    const owners = GalleryOwners() || []

    const artWorks = CollectionViewAll(collection) || []

    const _artwork = []
    for (var i in artWorks[0]) {
        _artwork.push({ address: artWorks[0][i], visibility: artWorks[1][i] })
    }
    return (
        <>
            <Grid container spacing={1} alignItems="stretch">
                {_artwork.map((data: any, index: any) => (
                    <>
                        <GalleryArtworkList ipfs={ipfs} id={data.address} visibility={data.visibility} galleryOwner={owners[owners.length - 1]} />
                    </>
                ))}
            </Grid>


        </>
    )
    /* return (
         <>
             {_artwork.map((data: any, index: any) => (
 
                 <GalleryArtWorkItem address={data.address} visibility={data.visibility} galleryOwner={owners[owners.length - 1]} />
             ))
             }
 
 
         </>
     )*/
}
