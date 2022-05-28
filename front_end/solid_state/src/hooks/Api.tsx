import { useState } from 'react'
import axios from 'axios'
import { suppressDeprecationWarnings } from 'moment'
const API_ENPOINT = process.env.REACT_APP_API_ENDPOINT
const API = () => {




    const imageFileUpload = (file: any, setImages: Function, Images: any, session: any) => {
        uploadImageFile(file, setImages, Images, session)
    }

    const metaDataFileUpload = (file: any, setMetaData: Function, session: any) => {
        uploadMetaDataFile(file, setMetaData, session)
    }

    const getSession = (setSession: Function) => {
        getSessionFromAPI(setSession)
    }

    async function getSessionFromAPI(setSession: Function) {
        console.log("getSessionFromAPI")
        try {
            const data = await axios(API_ENPOINT + "/k")
            setSession(data.data.key)
            console.log(data.data.key)
        } catch (error) {
            console.log(error)
            return '';
        }
    }

    async function uploadImageFile(file: any, setImages: Function, Images: any, session: any) {
        const onUploadProgress = (event: any) => {
            const percentage = Math.round((100 * event.loaded) / event.total);
            const updatedImages = [...Images];
            updatedImages[0]["progress"] = percentage
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
            updatedImages[0]["ipfsHash"] = response.data["ipfsHash"]
            setImages(updatedImages)
        } catch (error) {
            console.log(error)
            return ''
        }
    }

    async function uploadMetaDataFile(file: any, setMetaData: Function, session: any) {
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
            setMetaData(response.data["contractHash"]);

        } catch (error) {
            console.log(error)
            return '';
        }
    }


    return { getSession, imageFileUpload, metaDataFileUpload, }
}


export default API