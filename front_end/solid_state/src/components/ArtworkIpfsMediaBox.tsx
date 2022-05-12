import { LinearProgress, Box, } from "@mui/material"
import { useIpfsRetrieveAsChunks, } from "../hooks/ipfs"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { useState, useEffect, useRef } from "react";



export interface ArtWorkMetaDataProps {
    IpfsHash: any,
    description: any,
    mime: any
}

export const ArtWorkIpfsMediaBox = ({ IpfsHash, description, mime }: ArtWorkMetaDataProps) => {
    //let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(APPSTATE.ipfs, IpfsHash)
    var blobString: string = "//ipfs.tobiasdemaine.com/ipfs/" + IpfsHash //String(_blob)

    return (
        <>
            {blobString != "" ? (

                mime === "image" ? (
                    <>
                        <>

                            <Box
                                component="img"
                                sx={{

                                    display: 'block',

                                    overflow: 'hidden',
                                    width: '100%',
                                    maxheight: '600'
                                }}
                                src={blobString}
                                alt={description}
                            />
                        </>

                    </>
                ) : (
                    mime === "video" && (
                        <>

                            <video
                                src={blobString}
                                height="320" controls
                            />


                        </>
                    )

                )



            ) : (
                <>

                    <LinearProgress />

                </>
            )

            }

        </>
    )


}

export const ArtWorkIpfsMetaDataVideo = ({ IpfsHash, description, mime }: ArtWorkMetaDataProps) => {


    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const [sbuffer, setSourceBuffer] = useState<SourceBuffer | null>(null);
    let tmp: any = {}
    const [mediaSource] = useState(new MediaSource())
    const _videoRef = useRef(null)
    console.log(IpfsHash)
    console.log(document.getElementById(IpfsHash))
    const videoRef = useRef(document.getElementById(IpfsHash) as HTMLVideoElement)
    console.log(videoRef)
    let { _data, _blob, isIpfsFileReady, startRetrieve } = useIpfsRetrieveAsChunks(APPSTATE.ipfs, IpfsHash)

    useEffect(() => {


    }, [])

    useEffect(() => {
        if (_videoRef.current != null) {
            var vid = _videoRef.current
            // @ts-ignore
            vid.src = URL.createObjectURL(mediaSource);
            mediaSource.addEventListener('sourceopen', () => {
                var mimeCodec = 'video/mp4; codecs="avc1.42C01F,mp4a.40.2"';
                var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

                setSourceBuffer(sourceBuffer)

            });
        }
    }, [_videoRef])


    useEffect(() => {
        if (sbuffer != null) {
            //console.log(_blob)
            //sbuffer.appendBuffer(new Uint8Array(_blob))
            sbuffer.addEventListener('updateend', function () {
                //mediaSource.endOfStream();
                //videoRef.current.play();
                console.log(mediaSource)
            })
        }

    }, [_blob])
    const [once, setOnce] = useState(false)
    useEffect(() => {

        if ((once == false) && (sbuffer !== null)) {
            console.log(sbuffer)
            console.log("-----------")
            setOnce(true)
            startRetrieve(sbuffer, mediaSource, videoRef)

        }
    }, [sbuffer])

    return (
        <>
            <video ref={_videoRef} id={IpfsHash} controls></video>
        </>
    )

}