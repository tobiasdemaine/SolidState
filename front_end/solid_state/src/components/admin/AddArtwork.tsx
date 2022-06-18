import React, { useCallback, useState, useEffect } from "react"
import { useEthers, useNotifications } from "@usedapp/core"
import {
    FormControl,
    FormHelperText,
    Button,
    Input,
    InputLabel,
    LinearProgress,
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
    ImageListItemBar,
    Select,
    MenuItem,
    AlertTitle
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import InfoIcon from "@mui/icons-material/Info"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GalleryOwners, } from "../../hooks/GalleryView"
import { useDropzone } from 'react-dropzone'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import API from "../../hooks/Api"
import { GalleryCollections } from "../../hooks/GalleryView"
import useSolidStateContexts from "../../hooks/useSolidStateContext"
import pdfImage from "../../media/pdf.png";
import mp4Image from "../../media/mp4.png";
export interface ArtWorkAddProps {
    ipfs: any,
}

interface Provider {
    src: any,
    name: string
}
export const AddArtWork = ({ ipfs }: ArtWorkAddProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()
    const { getSession, imageFileUpload, metaDataFileUpload, isReady } = API()
    const owners = GalleryOwners() || []
    const { account } = useEthers() || ""
    const galleryCollections = GalleryCollections() || []
    var auth = false
    if (account !== undefined) {
        var auth = account === owners[owners.length - 1]
    }
    const [ImagesError, setImagesError] = useState(false)
    const [Images, setImages] = useState<Provider[]>([])
    const [Data, setData] = useState<any>(undefined)
    const [session, setSession] = useState<any>(undefined)
    const [ArtWorkContractHash, setArtWorkContractHash] = useState<any>(undefined)
    const [collection, setCollection] = useState<any>('')
    const [Ready, setReady] = useState<any>(undefined)
    const [MetaUpload, setMetaUpload] = useState<any>(undefined)
    const [CleanUp, setCleanUp] = useState<any>(undefined)

    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
            // test for image type 
            const type = file.name.split(".").pop()
            var fileSrc: any
            if (type === "pdf") {
                fileSrc = pdfImage
            } else if (type === "mp4") {
                fileSrc = mp4Image
            } else {
                fileSrc = URL.createObjectURL(file)
            }
            setImages(Images => [...Images, { file: file, src: fileSrc, name: file.name, comment: "", ipfsHash: undefined, progress: 0 }]);
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
        symbol: Yup.string().required('is required'),
        collection: Yup.string().required('is required'),
        secret: Yup.string().required('is required'),
    });
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    })



    const onSubmit = (data: any) => {
        if (Images.length == 0) {
            setImagesError(true)
        } else {
            setImagesError(false)
            setData(data)
            getSession(setSession, data["secret"])
        }
    }
    useEffect(() => {
        if (session !== undefined) {
            // 1 upload images
            Images.map((item, index) => {
                imageFileUpload(item["file"], setImages, Images, index, session)
            })


        }
    }, [session])
    useEffect(() => {
        if (Images.length > 0) {
            var count = 0
            var images = []
            var imgs = []
            var videos = []
            var files = []
            for (var i in Images) {
                if (Images[i]["ipfsHash"] !== undefined) {
                    count++
                    //if(images)
                    const type = Images[i]["file"]["name"].split(".").pop()
                    if (type === "pdf") {
                        files.push(
                            {
                                "IpfsHash": Images[i]["ipfsHash"],
                                "description": Images[i]["comment"],
                            }
                        )
                    } else if (type === "mp4") {
                        videos.push(
                            {
                                "IpfsHash": Images[i]["ipfsHash"],
                                "description": Images[i]["comment"],
                            }
                        )
                    } else {
                        imgs.push(
                            {
                                "IpfsHash": Images[i]["ipfsHash"],
                                "description": Images[i]["comment"],
                            }
                        )
                    }


                }

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
                    "collection": Data["collection"],
                    "images": imgs,
                    "videos": videos,
                    "files": files,
                }

                // 3 upload json file
                // 4 deploy contract 
                // 5 add to gallery
                var blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
                const file = new File([blob], session + ".json", { 'type': "application/json" })
                setMetaUpload(true)
                metaDataFileUpload(file, setReady, session)
            }
        }
    }, [Images])

    useEffect(() => {
        if (ArtWorkContractHash !== undefined) {
            // success an warp to contract
            // 
            if (ArtWorkContractHash !== "ERROR") {
                setReady(undefined)
                setCleanUp(true)

            } else {
                console.log("ERROR")
            }
        }
    }, [ArtWorkContractHash])
    var timer: any = false
    useEffect(() => {
        if (Ready !== undefined) {
            if (Ready == false) {
                timer = window.setInterval(() => {
                    if (Ready == "error") {
                        clearInterval(timer)
                    } else {
                        isReady(setReady, session)
                    }
                }, 5000)
            } else {
                // we are finshed 
                if (Ready == "working") {
                    // still working update ui??
                } else {
                    setArtWorkContractHash(Ready)
                }

            }
        }
        return () => {
            window.clearInterval(timer);
        };
    }, [Ready])

    useEffect(() => {
        if (CleanUp == true) {
            clearInterval(timer)
            setMainSection({ section: "artwork", value: ArtWorkContractHash, title: ArtWorkContractHash })
        }
    }, [CleanUp])


    return (
        auth ? (

            <>
                <Grid container spacing={1} alignItems="stretch">
                    {Data == undefined && (
                        <>
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper sx={{ p: 2, mt: 2, }}>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <Typography variant="h3" color="text.primary">Add Artwork Details</Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }} >
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="title">Artwork Title</InputLabel>
                                            <Input id="title" aria-describedby="title-helper-text" {...register('title')}
                                                error={errors.title ? true : false} />
                                            <FormHelperText id="title-helper-text">Artwork Title and Share Title.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="artist">Artist</InputLabel>
                                            <Input id="artist" aria-describedby="artist-helper-text" {...register('artist')}
                                                error={errors.artist ? true : false} />
                                            <FormHelperText id="artist-helper-text">Artists Name.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="medium">Medium</InputLabel>
                                            <Input id="medium" aria-describedby="medium-helper-text" {...register('medium')}
                                                error={errors.medium ? true : false} />
                                            <FormHelperText id="medium-helper-text">What the Artwork is made of.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                                            <Input id="dimensions" aria-describedby="dimensions-helper-text" {...register('dimensions')}
                                                error={errors.dimensions ? true : false} />
                                            <FormHelperText id="dimensions-helper-text">Eg. 800 x 900 x 50mm.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="year">Year</InputLabel>
                                            <Input id="year" aria-describedby="year-helper-text" {...register('year')}
                                                error={errors.year ? true : false} />
                                            <FormHelperText id="year-helper-text">Year the Artwork was made.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="price">Price</InputLabel>
                                            <Input id="price" aria-describedby="price-helper-text" {...register('price')}
                                                error={errors.price ? true : false} />
                                            <FormHelperText id="price-helper-text">Artwork price in ETH.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="supply">Share Quantity</InputLabel>
                                            <Input id="supply" aria-describedby="supply-helper-text" {...register('supply')}
                                                error={errors.supply ? true : false} />
                                            <FormHelperText id="supply-helper-text">The total amount of Shares.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <FormControl fullWidth >
                                            <InputLabel htmlFor="symbol">Symbol</InputLabel>
                                            <Input id="symbol" aria-describedby="symbol-helper-text" {...register('symbol')}
                                                error={errors.supply ? true : false} />
                                            <FormHelperText id="symbol-helper-text">The trading symbol of the Artwork/Shares.</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth >
                                            <InputLabel id="collection-label">Collection</InputLabel>
                                            <Select
                                                labelId="collection-label"
                                                id="collection"
                                                value={collection}
                                                label="Collection"

                                                {...register('collection')}
                                                error={errors.supply ? true : false}

                                                onChange={event => {
                                                    setCollection(event.target.value)
                                                }}

                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {galleryCollections.map((data: any, index: any) => (
                                                    <MenuItem key={index} value={index}>{data}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>Select which Collection this art work belong </FormHelperText>
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
                                                <Alert id="errorNoImage" variant="filled" severity="error">
                                                    A file is required
                                                </Alert>
                                            </Grid>
                                        </>
                                    }
                                    <Grid item xs={12} >
                                        <div id="uploadFiles" {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        </div>
                                        <ImageList sx={{ width: 1 / 1, }}>
                                            {Images.map((item, index) => (
                                                <ImageListItem key={`_${item.name}`}>
                                                    <img
                                                        id={`img_${index}`}
                                                        src={`${item.src}`}
                                                        width="50%"
                                                        alt={item.name}
                                                        loading="lazy"
                                                    />
                                                    <ImageListItemBar
                                                        title={<Input onChange={(event: any) => {
                                                            const updatedImages = [...Images];
                                                            updatedImages[index]["comment"] = event.target.value;
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
                        </>
                    )}
                    <Grid item xs={12} md={6} lg={4}>

                        <Paper sx={{ p: 2, mt: 2, }}>
                            {Data == undefined ? (<>
                                <Alert severity="warning" sx={{ mb: 2 }}>

                                    <AlertTitle>Warning</AlertTitle>
                                    Once Submitted, data in this artwork contract <strong>can not be modified</strong>. Ensure your data is 100% correct.
                                </Alert>
                                <Grid item xs={12} sx={{ mb: 1 }} >
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="secret">API Secret</InputLabel>
                                        <Input type="password"
                                            autoComplete="current-password" id="secret" aria-describedby="secret-helper-text" {...register('secret')}
                                            error={errors.title ? true : false} />
                                        <FormHelperText id="secret-helper-text">Secret Key</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Button id="addSubmit" variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Add ArtWork</Button>
                            </>) : (<>
                                <LinearProgress />
                                <Grid item xs={12} sx={{ mb: 1, mt: 2 }}>
                                    <Typography variant="h5" color="text.primary">Uploading data</Typography>
                                </Grid>
                                {Images.map((item: any, index: any) => (
                                    <Grid item key={index}>{item["name"]} -  {item["progress"]}</Grid>

                                ))}
                                {
                                    MetaUpload == true &&
                                    <>
                                        <Grid item>MetaData...</Grid>
                                    </>
                                }
                                {
                                    Ready == false &&
                                    <>
                                        <Grid item><strong>Deploying Contract...</strong></Grid>
                                    </>
                                }
                            </>)}


                        </Paper>
                    </Grid>
                </Grid>
            </>
        ) : (<></>)
    )

}

