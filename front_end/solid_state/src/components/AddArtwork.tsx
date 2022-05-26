import React, { useCallback, useState, useEffect } from "react"
import { useEthers, useNotifications } from "@usedapp/core"
import {
    FormControl,
    FormHelperText,
    Button,
    Input,
    InputLabel,
    CircularProgress,
    Snackbar,
    Backdrop,
    Paper,
    Alert,
    Grid,
    Typography,
    TextField,
    ImageList,
    ImageListItem,
    IconButton,
    ImageListItemBar
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import InfoIcon from "@mui/icons-material/Info"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GalleryOwners, } from "../hooks/GalleryView"
import { useDropzone } from 'react-dropzone'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import API from "../hooks/Api"
export interface ArtWorkAddProps {
    ipfs: any,
}

interface Provider {
    src: any,
    name: string
}
export const AddArtWork = ({ ipfs }: ArtWorkAddProps) => {
    const { getSession, imageFileUpload, metaDataFileUpload } = API()
    const owners = GalleryOwners() || []
    const { account } = useEthers() || ""
    var auth = false
    if (account !== undefined) {
        var auth = account === owners[owners.length - 1]
    }
    const [ImagesError, setImagesError] = useState(false)
    const [Images, setImages] = useState<Provider[]>([])
    const [Data, setData] = useState<any>(undefined)
    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
            setImages(Images => [...Images, { file: file, src: URL.createObjectURL(file), name: file.name, comment: "", ipfsHash: undefined, progress: 0 }]);
            /*
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                //const binaryStr = reader.result
                //const dataURL = reader.result
                //setImages(Images => [...Images, { src: dataURL, name: file.name, comment: "" }]);
            }
            //reader.readAsArrayBuffer(file)
            //reader.readAsDataURL(file)
            */
        })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    const removeImage = (index: any) => {
        setImages([
            ...Images.slice(0, index),
            ...Images.slice(index + 1, Images.length)
        ]);
    }


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('is required'),
        artist: Yup.string().required('is required'),
        dimensions: Yup.string().required('is required'),
        medium: Yup.string().required('is required'),
        year: Yup.string().required('is required'),
        price: Yup.number().required('Number is required'),
        supply: Yup.number().required('Number is required'),
    });
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const [session, setSession] = useState<any>(undefined)
    const [artWorkContractHash, setArtWorkContractHash] = useState<any>(undefined)

    const onSubmit = (data: any) => {
        if (Images.length == 0) {
            setImagesError(true)
        } else {
            setImagesError(false)
            setData(data)
            getSession(setSession)
        }
    }
    useEffect(() => {
        if (session !== undefined) {
            // 1 upload images
            Images.map((item, index) => {
                imageFileUpload(item["file"], setImages, Images, session)
            })


        }
    }, [session])
    useEffect(() => {
        if (Images.length > 0) {
            var count = 0
            var images = []
            for (var i in Images) {
                if (Images[i]["ipfsHash"] !== undefined) {
                    count++
                    images.push(
                        {
                            "IpfsHash": Images[i]["ipfsHash"],
                            "description": Images[i]["comment"],
                        }
                    )
                }
                console.log(Images[i]["progress"])
            }

            if (count == Images.length) {
                // 2 compile json
                var DATA = {
                    "title": Data["title"],
                    "artist": Data["artist"],
                    "medium": Data["medium"],
                    "dimensions": Data["dimensions"],
                    "year": Data["year"],
                    "price": Data["price"],
                    "name": Data["title"],
                    "symbol": Data["symbol"],
                    "supply": Data["supply"],
                    "images": images,
                    "videos": [],
                    "files": [],
                }

                // 3 upload json file
                // 4 deploy contract 
                // 5 add to gallery
                var blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
                const file = new File([blob], session + ".json", { 'type': "application/json" })
                metaDataFileUpload(file, setArtWorkContractHash, session)

            }
        }
    }, [Images])

    useEffect(() => {
        if (artWorkContractHash !== undefined) {
            // success an warp to contract
            // 
            console.log("Success", artWorkContractHash)
        }
    }, [artWorkContractHash])
    return (
        auth ? (
            <>
                <Grid container spacing={1} alignItems="stretch">
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper sx={{ p: 2, mt: 2, }}>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography variant="h3" color="text.primary">Add Artwork Details</Typography>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl>
                                    <InputLabel htmlFor="title">Artwork Title</InputLabel>
                                    <Input id="title" aria-describedby="title-helper-text" {...register('title')}
                                        error={errors.title ? true : false} />
                                    <FormHelperText id="title-helper-text">Artwork Title and Share Title.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="artist">Artist</InputLabel>
                                    <Input id="artist" aria-describedby="artist-helper-text" {...register('artist')}
                                        error={errors.artist ? true : false} />
                                    <FormHelperText id="artist-helper-text">Artists Name.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="medium">Medium</InputLabel>
                                    <Input id="medium" aria-describedby="medium-helper-text" {...register('medium')}
                                        error={errors.medium ? true : false} />
                                    <FormHelperText id="medium-helper-text">What the Artwork is made of.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                                    <Input id="dimensions" aria-describedby="dimensions-helper-text" {...register('dimensions')}
                                        error={errors.dimensions ? true : false} />
                                    <FormHelperText id="dimensions-helper-text">Eg. 800 x 900 x 50mm.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="year">Year</InputLabel>
                                    <Input id="year" aria-describedby="year-helper-text" {...register('year')}
                                        error={errors.year ? true : false} />
                                    <FormHelperText id="year-helper-text">Year the Artwork was made.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="price">Price</InputLabel>
                                    <Input id="price" aria-describedby="price-helper-text" {...register('price')}
                                        error={errors.price ? true : false} />
                                    <FormHelperText id="price-helper-text">Artwork price in ETH.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="supply">Share Quantity</InputLabel>
                                    <Input id="supply" aria-describedby="supply-helper-text" {...register('supply')}
                                        error={errors.supply ? true : false} />
                                    <FormHelperText id="supply-helper-text">The total amount of Shares.</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Paper>

                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper sx={{ p: 2, mt: 2, }}>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography variant="h3" color="text.primary">Add Artwork Images</Typography>
                            </Grid>
                            {
                                ImagesError == true &&
                                <>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <Alert variant="filled" severity="error">
                                            An image is  required
                                        </Alert>
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12} >
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <ImageList sx={{ width: 1 / 1, }}>
                                    {Images.map((item, index) => (
                                        <ImageListItem key={`_${item.name}`}>
                                            <img
                                                src={`${item.src}`}
                                                width="50%"
                                                //srcSet={`${item.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                            <ImageListItemBar
                                                title={<Input onChange={(event: any) => {
                                                    const updatedImages = [...Images];
                                                    updatedImages[0]["comment"] = event.target.value;
                                                    setImages(updatedImages);
                                                }} id={`Image_${index}`} />}
                                                actionIcon={
                                                    <IconButton
                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                        aria-label={`info about ${item.name}`}
                                                        name={item.name}
                                                        data-input={item.name}
                                                        onClick={(e: any) => {
                                                            removeImage(index)
                                                        }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>

                        <Paper sx={{ p: 2, mt: 2, }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Add ArtWork</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </>
        ) : (<></>)
    )

}



/*

    "title": "Solid State 2",
    "artist": "tdm",
    "medium": "obsidian glass",
    "dimensions": "100 x 20 x 50mm",
    "year": 2022,
    "price": 20,
    "name": "Solid State 2",
    "symbol": "SS2",
    "supply": 100000,
    "images": [
        {
            "filePath": "/home/studio/Development/SolidState/artwork/solid_state_2/images/image_0.png",
            "description": "A peice of atacamite.",
            "mime": "image/png"
        },
        {
            "filePath": "/home/studio/Development/SolidState/artwork/solid_state_2/images/image_1.png",
            "description": "With a hand for size comparisn.",
            "mime": "image/png"
        }
    ],
    "videos": [
        {
            "filePath": "/home/studio/Development/SolidState/artwork/solid_state_2/video/video_0_1.mp4",
            "description": "This is not coal it is atacamite.",
            "mime": "video/ogv"
        }
    ]

*/