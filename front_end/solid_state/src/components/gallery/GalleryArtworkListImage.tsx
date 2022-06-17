import * as React from 'react';

import CardMedia from '@mui/material/CardMedia';

import { useIpfsRetrieve, useIpfsRetrieveAsChunks, useIpfsRetrieveBinary } from "../../hooks/ipfs"
import { LinearProgress, ImageListItem, ImageListItemBar } from "@mui/material"
export interface CollectionProps {
    ipfs: any,
    ipfsHash: any,
}
export const GalleryArtworkListImage = ({ ipfs, ipfsHash }: CollectionProps) => {
    //let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(ipfs, ipfsHash)
    var blobString: string = ipfs + ipfsHash//String(_blob)

    return (
        <>{
            blobString != "" ? (

                <><CardMedia
                    component="img"
                    height="240"
                    image={blobString}
                    alt="Image Loading"
                /></>
            ) : (
                <>

                    <LinearProgress />

                </>
            )}
        </>
    )
}