import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { CollectionsOverviewArtworkRetrieve } from './CollectionOverviewArtworkRetrieve';
import {
    GalleryOwners, CollectionView, CollectionViewAll
} from "../hooks/GalleryView"

export interface CollectionProps {
    ipfs: any,
    id: any,
    title: any
}
export const CollectionsOverviewArtwork = ({ ipfs, id, title }: CollectionProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()
    const artWorks = CollectionViewAll(id) || [[]]
    var workCount = 0
    for (var i = 0; i < artWorks.length; i++) {
        if (artWorks[0].length >= 1) {
            workCount++
        }
    }
    //const workCount = artWorks.length
    return (
        <>
            {
                artWorks[0].length >= 1 &&
                < CollectionsOverviewArtworkRetrieve ipfs={ipfs} address={artWorks[0][0]} />
            }

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {workCount} works
                </Typography>
            </CardContent>
        </>
    );
}