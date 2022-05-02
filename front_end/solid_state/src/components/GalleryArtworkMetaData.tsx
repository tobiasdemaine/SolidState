import { ImageList } from "@mui/material"
import { useIpfsRetrieve } from "../hooks/ipfs"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { ArtWorkIpfsMetaData, ArtWorkIpfsMetaDataVideo } from "./ArtworkIpfsMetaData"

export interface ArtWorkMetaDataProps {
    IpfsHash: any,
    description: any
}

export const GalleryArtworkMetaData = ({ IpfsHash, description }: ArtWorkMetaDataProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(APPSTATE.ipfs, IpfsHash)

    var metaDataPack = { "images": [], "videos": [] }
    if (isIpfsFileReady && _data != '') {
        metaDataPack = JSON.parse(_data)
    }
    return (
        <>
            <ImageList variant="masonry" cols={3} gap={8}>
                {
                    metaDataPack.images.map((data: any, index: any) => (

                        <>

                            < ArtWorkIpfsMetaData IpfsHash={data.IpfsHash} description={data.description} mime="image" />
                        </>
                    ))
                }

            </ImageList>

        </>
    )


}

/*
>> VIDE0 return(

    {
                metaDataPack.videos.map((data: any, index: any) => (

                    <>
                        < ArtWorkIpfsMetaDataVideo IpfsHash={data.IpfsHash} description={data.description} mime="video" />
                    </>
                ))
            }
)

*/