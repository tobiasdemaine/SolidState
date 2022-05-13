import {
    GalleryOwners, CollectionView, CollectionViewAll
} from "../hooks/GalleryView"
import { GalleryArtworkList } from "./GalleryArtworkList"
import Grid from '@mui/material/Grid';

export interface GalleryCollectionProps {
    collection: any,
    ipfs: any
}
export const GalleryCollections = ({ collection, ipfs }: GalleryCollectionProps) => {


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
                    <GalleryArtworkList key={index} ipfs={ipfs} id={data.address} count={index} visibility={data.visibility} galleryOwner={owners[owners.length - 1]} />

                ))}
            </Grid>


        </>
    )

}
