import useSolidStateContexts from "../../hooks/useSolidStateContext"
import Grid from '@mui/material/Grid';
import { GalleryCollections } from "../../hooks/GalleryView"
import { CollectionsOverview } from "./CollectionOverview";

export interface HeaderCollectionProps {
    ipfs: any,
}
export const Collections = ({ ipfs }: HeaderCollectionProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()


    const galleryCollections = GalleryCollections() || []
    return (<>
        <Grid container spacing={1} alignItems="stretch">
            {galleryCollections.map((data: any, index: any) => (
                <Grid item xs={12} sm={6} md={4} key={index} >
                    <CollectionsOverview ipfs={ipfs} id={index} title={data} />
                </Grid>
            ))}
        </Grid>
    </>)
}