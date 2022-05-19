import { useIpfsRetrieve, useIpfsWebRetrieve } from "../hooks/ipfs"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { GalleryArtworkListImage } from "./GalleryArtworkListImage"

export interface ArtWorkMetaDataProps {
    ipfs: any,
    ipfsHash: any,

}

export const GalleryArtworkListMetaLoad = ({ ipfs, ipfsHash }: ArtWorkMetaDataProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    //let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(ipfs, ipfsHash)
    let { _data, isIpfsFileReady } = useIpfsWebRetrieve(APPSTATE.ipfs, ipfsHash)

    var metaDataPack = { "images": [{ IpfsHash: null }] }
    if (isIpfsFileReady && _data != '') {
        metaDataPack = JSON.parse(_data)

    }
    var hash = metaDataPack.images[0].IpfsHash

    return (
        <>
            {hash !== null &&
                <GalleryArtworkListImage ipfs={ipfs} ipfsHash={hash} />
            }

        </>
    )

}

