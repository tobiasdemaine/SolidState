import useSolidStateContexts from "../hooks/useSolidStateContext"

import { ArtWorkViewById } from "../hooks/ArtworkViewByAddress"
import { CollectionOverviewArtworkMetaLoad } from "./CollectionOverviewArtworkMetaLoad"
export interface CollectionProps {
    ipfs: any,
    address: any,

}
export const CollectionsOverviewArtworkRetrieve = ({ ipfs, address }: CollectionProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()
    const artWork = ArtWorkViewById(address) || { mediaDataPackURI: null }
    var workCount = 0
    return (
        <>
            {artWork.mediaDataPackURI !== null &&
                <>
                    <CollectionOverviewArtworkMetaLoad ipfsHash={artWork.mediaDataPackURI} ipfs={ipfs} />
                </>
            }
        </>
    )
}