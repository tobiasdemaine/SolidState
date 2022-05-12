import { Card, CardActionArea, Grid } from "@mui/material"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { CollectionsOverviewArtwork } from './CollectionOverviewArtwork';
export interface CollectionProps {
    ipfs: any,
    id: any,
    title: any
}
export const CollectionsOverview = ({ ipfs, id, title }: CollectionProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()
    const cardId = "Collection_" + id
    return (
        <>

            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 390, mt: 2 }} id={cardId} onClick={() => {
                    setMainSection({ section: "collection", value: id, title: title })
                }}>
                    <CardActionArea>
                        <CollectionsOverviewArtwork ipfs={ipfs} id={id} title={title} />
                    </CardActionArea>
                </Card>
            </Grid>

        </>
    );
}