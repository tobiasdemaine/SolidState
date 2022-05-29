import { useState } from 'react'
import axios from 'axios'
import { suppressDeprecationWarnings } from 'moment'

const API_ENPOINT = process.env.REACT_APP_API_ENDPOINT
const API = () => {




    const imageFileUpload = (file: any, setImages: Function, Images: any, index: any, session: any) => {
        uploadImageFile(file, setImages, Images, index, session)
    }

    const metaDataFileUpload = (file: any, setReady: Function, session: any) => {
        uploadMetaDataFile(file, setReady, session)
    }

    const getSession = (setSession: Function, secret: any) => {
        getSessionFromAPI(setSession, secret)
    }

    const isReady = (setReady: Function, session: any) => {
        getReadyState(setReady, session)
    }

    async function getSessionFromAPI(setSession: Function, secret: any) {
        try {
            let formData = new FormData()
            formData.append('secret', secret)
            const response = await axios.post(API_ENPOINT + "/k", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            setSession(response.data.key)
        } catch (error) {
            console.log(error)
            return '';
        }
    }

    async function uploadImageFile(file: any, setImages: Function, Images: any, index: any, session: any) {
        const onUploadProgress = (event: any) => {
            const percentage = Math.round((100 * event.loaded) / event.total);
            const updatedImages = [...Images];
            updatedImages[index]["progress"] = percentage
            setImages(updatedImages);
        };
        try {
            let formData = new FormData()
            formData.append('file', file)
            formData.append('key', session)
            formData.append('publish', "false");
            const response = await axios.post(API_ENPOINT + "/f", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress,
            });
            const updatedImages = [...Images];
            updatedImages[index]["ipfsHash"] = response.data["ipfsHash"]
            setImages(updatedImages)
        } catch (error) {
            console.log(error)
            return ''
        }
    }

    async function uploadMetaDataFile(file: any, setReady: Function, session: any) {
        try {
            let formData = new FormData()
            formData.append('file', file)
            formData.append('key', session);
            formData.append('publish', "true");
            const response = await axios.post(API_ENPOINT + "/f", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReady(false)

        } catch (error) {
            console.log(error)
            return '';
        }
    }

    async function getReadyState(setReady: any, session: any) {
        try {
            let formData = new FormData()
            formData.append('key', session);
            const response = await axios.post(API_ENPOINT + "/r", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReady(response.data["ready"]);

        } catch (error) {
            console.log(error)
            return '';
        }
    }


    return { getSession, imageFileUpload, metaDataFileUpload, isReady }
}


export default API