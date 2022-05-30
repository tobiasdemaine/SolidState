import { useState, useEffect } from 'react'
import { useEthers, useNotifications } from "@usedapp/core";
import {
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    FormControl,
    Input,
    FormHelperText,
    InputLabel,
    Backdrop,
    CircularProgress,
    Snackbar,
    Alert,

} from "@mui/material"
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { GalleryOwners, GalleryCollections } from "../hooks/GalleryView"
import { AddNewCollection } from '../hooks/Collections'
export interface AddCollectionProps {
    ipfs: any,
}

export const AddCollection = ({ ipfs }: AddCollectionProps) => {
    const { account } = useEthers()
    const isConnected = account !== undefined
    const { notifications } = useNotifications()
    const galleryCollections = GalleryCollections() || []
    const owners = GalleryOwners() || []
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [showForTransactionFail, setShowTransactionFail] = useState(false)
    const [snackbarErrorText, setSnackbarErrorText] = useState("Transaction Failed")
    const [backDropOpen, setBackDropOpen] = useState(false);

    const { addNewCollection, addNewCollectionState } = AddNewCollection()

    const validationSchema = Yup.object().shape({
        collectionName: Yup.string().required('is required'),

    });
    var auth = false
    if (account !== undefined) {
        var auth = account === owners[owners.length - 1]
    }
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    })
    const onSubmit = (data: any) => {
        setBackDropOpen(true)
        addNewCollection(data["collectionName"])
        reset({ collectionName: "" })
    }
    const handleCloseSnack = () => {
        setShowTransactionSuccess(false)
        setShowTransactionFail(false)
    }

    useEffect(() => {

        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "New Collection").length > 0) {
            setShowTransactionSuccess(true)
            setBackDropOpen(false)
            //reset the form

        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionFailed" &&
                notification.transactionName === "New Collection").length > 0) {
            setSnackbarErrorText("transaction failed")
            setShowTransactionFail(true)
            setBackDropOpen(false)
        }
        if (addNewCollectionState.status === "Exception") {
            setBackDropOpen(false)
            setSnackbarErrorText(addNewCollectionState.errorMessage || "")
            setShowTransactionFail(true)
        }

    }, [notifications, addNewCollectionState])
    return (
        auth ? (

            <>
                <Grid container spacing={1} alignItems="stretch" sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper sx={{ p: 2, }}>
                            <Typography variant="h3" color="text.primary">Collections</Typography>



                            <List dense={false}>
                                {galleryCollections.map((data: any, index: any) => (


                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={data}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} md={6} lg={4} >
                        <Paper sx={{ p: 2, }}>
                            <Typography variant="h3" color="text.primary">Add Collections</Typography>


                            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                                <InputLabel htmlFor="collectionName">New Collection Name</InputLabel>
                                <Input
                                    id="collectionName" aria-describedby="collectionName-helper-text" {...register('collectionName')}
                                    error={errors.title ? true : false} />
                                <FormHelperText id="collectionName-helper-text"></FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Add Collection</Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Snackbar
                    open={showTransactionSuccess}
                    autoHideDuration={5000}
                    onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="success">
                        TRANSACTION APPROVED.
                    </Alert>
                </Snackbar><Snackbar
                    open={showForTransactionFail}
                    autoHideDuration={5000}
                    onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity="error">
                        {snackbarErrorText}
                    </Alert>
                </Snackbar>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backDropOpen}

                >
                    <CircularProgress color="inherit" />
                </Backdrop>

            </>) : (<></>))
}