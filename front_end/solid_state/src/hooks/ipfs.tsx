import axios from 'axios'
import { create } from 'ipfs'
import { useEffect, useState } from 'react'

let ipfs: any = null

export const useIpfsConnect = () => {

    const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
    useEffect(() => {
        startIpfs()
        return function cleanup() {
            if (ipfs && ipfs.stop) {
                console.log('Stopping IPFS')
                ipfs.stop()
                ipfs = null
                setIpfsReady(false)
            }
        }
    }, [])

    async function startIpfs() {
        if (ipfs == null) {
            try {
                ipfs = await create()
            } catch (error) {
                console.error('IPFS init error:', error)
                ipfs = null
            }
        }
        setIpfsReady(Boolean(ipfs))
    }
    return { ipfs, isIpfsReady }
}

export const useIpfsWebConnect = () => {
    const ipfs = process.env.REACT_APP_IPFS
    const [isIpfsReady, setIpfsReady] = useState(true)
    return { ipfs, isIpfsReady }
}

export const useIpfsWebRetrieve = (ipfs: any, id: any) => {
    const [isIpfsFileReady, setIpfsFileReady] = useState(false)
    const [_data, set_data] = useState<any>()
    let data = ''
    const content: any = []
    useEffect(() => {
        let localData = localStorage.getItem(id)
        if (localData == null || localData == '') {
            getDataFromIpfs()
        } else {
            set_data(localData)
            setIpfsFileReady(true)
        }
    }, [])

    async function getDataFromIpfs() {
        try {
            const file = await axios(ipfs + id)
            set_data(file.data)
            localStorage.setItem(id, JSON.stringify(file.data))
            setIpfsFileReady(true)
        } catch (error) {
            console.log(error)
            return '';
        }
    }

    return { _data, isIpfsFileReady }
}

export const useIpfsRetrieve = (ifps: any, id: any) => {
    const [isIpfsFileReady, setIpfsFileReady] = useState(false)
    const [_data, set_data] = useState('')
    const [_blob, set_blob] = useState('')

    let data = ''
    const content: any = []
    useEffect(() => {
        let localData = localStorage.getItem(id)
        if (localData == null) {
            getDataFromIpfs()
        } else {
            set_data(localData)
            setIpfsFileReady(true)
        }
    }, [])

    async function getDataFromIpfs() {
        try {

            const stream = ifps.cat(id)
            for await (const chunk of stream) {
                data += chunk.toString()
                content.push(chunk);

            }
            setIpfsFileReady(true)
            let _content = concat(content) || []
            set_data(data)
            localStorage.setItem(id, data)
            var bytes = new Uint8Array(_content)
            var blobString = 'data:image/png;base64,' + encode(bytes)

            set_blob(blobString)

        } catch (error) {
            console.log(error)
            return '';
        }
    }

    return { _data, _blob, isIpfsFileReady }
}


export const useIpfsRetrieveCall = (ifps: any, id: any) => {
    const [isIpfsFileReady, setIpfsFileReady] = useState(false)
    const [_data, set_data] = useState('')
    const [_blob, set_blob] = useState('')


    let data = ''
    const content: any = []
    useEffect(() => {
        getDataFromIpfs()
    }, [])

    function startRetrieve() {
        getDataFromIpfs()

    }

    async function getDataFromIpfs() {

        try {

            const stream = ifps.cat(id)
            for await (const chunk of stream) {
                data += chunk.toString()

                content.push(chunk);

            }
            setIpfsFileReady(true)
            let _content = concat(content) || []
            set_data(data)
            var bytes = new Uint8Array(_content)
            var blobString = 'data:image;base64,' + encode(bytes)

            set_blob(blobString)

        } catch (error) {
            console.log(error)
            return '';
        }


    }

    return { _data, _blob, isIpfsFileReady }
}

export const useIpfsRetrieveAsChunks = (ifps: any, id: any) => {
    const [isIpfsFileReady, setIpfsFileReady] = useState(false)
    const [_data, set_data] = useState('')
    const [_blob, set_blob] = useState([])

    function startRetrieve(sourceBuffer: any, mediaSource: any, videoRef: any) {
        getDataFromIpfs(sourceBuffer, mediaSource, videoRef)

    }


    async function getDataFromIpfs(sourceBuffer: any, mediaSource: any, videoRef: any) {

        const stream = ifps.cat(id)
        for await (const chunk of stream) {
            sourceBuffer.appendBuffer(chunk)
            set_blob(chunk)

        }
        setIpfsFileReady(true)




    }

    return { _data, _blob, isIpfsFileReady, startRetrieve }
}

export const useIpfsRetrieveBinary = (ifps: any, id: any) => {

    const [address, setAddress] = useState(id)
    const [isIpfsFileReady, setIpfsFileReady] = useState(false)
    const [_blob, set_blob] = useState(Array())

    useEffect(() => {
        getDataFromIpfs()


        console.log("loader fired -- " + id)
    }, [])

    async function getDataFromIpfs() {
        try {
            for await (const file of ipfs.get(id)) {
                const content = [];
                for await (const chunk of file) {
                    content.push(chunk);
                    console.log("pushing chunk")
                }
                set_blob(content)
                return URL.createObjectURL(new Blob(content));
            }
        } catch (error) {
            console.log(error)
            return '';
        }
    }
    return { _blob, isIpfsFileReady }
}


function concat(arrays: any) {
    let totalLength = arrays.reduce((acc: any, value: any) => acc + value.length, 0);
    if (!arrays.length) return null;
    let result = new Uint8Array(totalLength);
    let length = 0;
    for (let array of arrays) {
        result.set(array, length);
        length += array.length;
    }
    return result;
}

export default { useIpfsConnect, useIpfsRetrieve, useIpfsRetrieveBinary, useIpfsWebRetrieve }


function encode(input: any) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN;
        chr3 = i < input.length ? input[i++] : Number.NaN;

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}