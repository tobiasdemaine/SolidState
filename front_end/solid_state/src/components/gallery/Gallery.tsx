import { GalleryOwners, GalleryViewAll, } from "../../hooks/GalleryView"
import { ArtWork } from "../artwork/ArtWork"
import { useEthers } from "@usedapp/core"
export interface Props {
    ipfs: any,
    address: any,
}

export const Gallery = ({ ipfs, address }: Props) => {
    // test if logged in as owner    
    const { account } = useEthers()


    const isConnected = account !== undefined


    const owners = GalleryOwners() || []

    const artWorks = GalleryViewAll() || []

    var data = { address: null, visibility: false }
    for (var i in artWorks[0]) {
        if (artWorks[0][i] == address) {
            data = { address: artWorks[0][i], visibility: artWorks[1][i] }
        }
    }

    return (<>
        {data.address != null &&
            <ArtWork ipfs={ipfs} address={data.address} visibility={data.visibility} galleryOwner={owners[owners.length - 1]} />
        }
    </>)

}