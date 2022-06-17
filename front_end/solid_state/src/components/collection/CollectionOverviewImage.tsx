import CardMedia from '@mui/material/CardMedia';

export interface CollectionProps {
    ipfs: any,
    ipfsHash: any,
}
export const CollectionsOverviewImage = ({ ipfs, ipfsHash }: CollectionProps) => {
    //let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(ipfs, ipfsHash)
    var blobString: string = ipfs + ipfsHash //String(_blob)
    return (

        <CardMedia
            component="img"
            height="240"
            image={blobString}
            alt="Image Loading"
        />

    )
}