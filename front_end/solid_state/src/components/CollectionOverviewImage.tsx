import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { useIpfsRetrieve, useIpfsRetrieveAsChunks, useIpfsRetrieveBinary } from "../hooks/ipfs"

export interface CollectionProps {
    ipfs: any,
    ipfsHash: any,
}
export const CollectionsOverviewImage = ({ ipfs, ipfsHash }: CollectionProps) => {
    let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(ipfs, ipfsHash)
    var blobString: string = String(_blob)
    return (

        <CardMedia
            component="img"
            height="240"
            image={blobString}
            alt="Image Loading"
        />

    )
}