import { ImageList } from "@mui/material"
import { useIpfsRetrieve } from "../hooks/ipfs"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { CollectionsOverviewImage } from "./CollectionOverviewImage"

export interface ArtWorkMetaDataProps {
    ipfs: any,
    ipfsHash: any,

}

export const CollectionOverviewArtworkMetaLoad = ({ ipfs, ipfsHash }: ArtWorkMetaDataProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(ipfs, ipfsHash)
    var metaDataPack = { "images": [{ IpfsHash: null }] }
    if (isIpfsFileReady && _data != '') {
        metaDataPack = JSON.parse(_data)

    }
    var hash = metaDataPack.images[0].IpfsHash

    return (
        <>
            {hash !== null &&
                <CollectionsOverviewImage ipfs={ipfs} ipfsHash={hash} />
            }

        </>
    )

}

