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
import InfoIcon from "@mui/icons-material/Info"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GalleryOwners, } from "../hooks/GalleryView"
import { useDropzone } from 'react-dropzone'

export interface ArtWorkAddProps {
    ipfs: any,
}

interface Provider {
    src: any,
    name: string
}
export const AddArtWork = ({ ipfs }: ArtWorkAddProps) => {
    const owners = GalleryOwners() || []
    const { account } = useEthers() || ""
    var auth = false
    if (account !== undefined) {
        var auth = account === owners[owners.length - 1]
    }
    const [Images, setImages] = useState<Provider[]>([]);
    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader()
            console.log(file)
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                //const binaryStr = reader.result
                const dataURL = reader.result
                setImages(Images => [...Images, { src: dataURL, name: file.name }]);
            }
            //reader.readAsArrayBuffer(file)
            reader.readAsDataURL(file)
        })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

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
                                    <Input id="title" aria-describedby="title-helper-text" />
                                    <FormHelperText id="title-helper-text">Artwork Title and Share Title.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="artist">Artist</InputLabel>
                                    <Input id="artist" aria-describedby="artist-helper-text" />
                                    <FormHelperText id="artist-helper-text">Artists Name.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="medium">Medium</InputLabel>
                                    <Input id="medium" aria-describedby="medium-helper-text" />
                                    <FormHelperText id="medium-helper-text">What the Artwork is made of.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="dimensions">Dimensions</InputLabel>
                                    <Input id="dimensions" aria-describedby="dimensions-helper-text" />
                                    <FormHelperText id="dimensions-helper-text">Eg. 800 x 900 x 50mm.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="year">Year</InputLabel>
                                    <Input id="year" aria-describedby="year-helper-text" />
                                    <FormHelperText id="year-helper-text">Year the Artwork was made.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="price">Price</InputLabel>
                                    <Input id="price" aria-describedby="price-helper-text" />
                                    <FormHelperText id="price-helper-text">Artwork price in ETH.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <InputLabel htmlFor="supply">Share Quantity</InputLabel>
                                    <Input id="supply" aria-describedby="supply-helper-text" />
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
                            <Grid item xs={12} >
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <ImageList sx={{ width: 1 / 1, }}>
                                    {Images.map((item) => (
                                        <ImageListItem key={item.name}>
                                            <img
                                                src={`${item.src}`}
                                                width="50%"
                                                //srcSet={`${item.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                alt={item.name}
                                                loading="lazy"
                                            />
                                            <ImageListItemBar
                                                title={item.name}
                                                actionIcon={
                                                    <IconButton
                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                        aria-label={`info about ${item.name}`}
                                                    >
                                                        <InfoIcon />
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
                            <Button variant="contained" color="primary" onClick={() => {
                                console.log("Add Art Work")
                            }}>Add ArtWork</Button>
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