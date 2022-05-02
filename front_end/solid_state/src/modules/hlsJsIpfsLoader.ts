

export class HlsjsIpfsLoader {
    _abortFlag: any
    ipfs: any
    hash: any
    debug = function () { }
    m3u8provider: any
    tsListProvider: any
    context: any
    config: any
    callbacks: any
    stats: any
    retryDelay: any
    cat: any
    constructor(config: any) {
        this._abortFlag = [false];
        this.ipfs = config.ipfs
        this.hash = config.ipfsHash
        if (config.debug === false) {
        } else if (config.debug === true) {
            this.debug = console.log
        } else {
            this.debug = config.debug
        }
        if (config.m3u8provider) {
            this.m3u8provider = config.m3u8provider;
        } else {
            this.m3u8provider = null;
        }
        if (config.tsListProvider) {
            this.tsListProvider = config.tsListProvider;
        } else {
            this.tsListProvider = null;
        }
    }

    destroy() {
    }

    abort() {
        this._abortFlag[0] = true;
    }

    load(context: any, config: any, callbacks: any) {
        this.context = context
        this.config = config
        this.callbacks = callbacks
        this.stats = { trequest: performance.now(), retry: 0 }
        this.retryDelay = config.retryDelay
        this.loadInternal()
    }
    /**
     * Call this by getting the HLSIPFSLoader instance from hls.js hls.coreComponents[0].loaders.manifest.setM3U8Provider()
     * @param {function} provider
     */
    setM3U8Provider(provider: any) {
        this.m3u8provider = provider;
    }
    /**
     *
     * @param {function} provider
     */
    setTsListProvider(provider: any) {
        this.tsListProvider = provider;
    }

    loadInternal() {
        console.log("loadInternal")
        const { stats, context, callbacks } = this

        stats.tfirst = Math.max(performance.now(), stats.trequest)
        stats.loaded = 0

        //When using absolute path (https://example.com/index.html) vs https://example.com/
        const urlParts = window.location.href.split("/")
        if (urlParts[urlParts.length - 1] !== "") {
            urlParts[urlParts.length - 1] = ""
        }
        const filename = context.url.replace(urlParts.join("/"), "")

        const options = { offset: 0, length: 0 }


        if (Number.isFinite(context.rangeStart)) {
            options.offset = context.rangeStart;
            if (Number.isFinite(context.rangeEnd)) {
                options.length = context.rangeEnd - context.rangeStart;
            }
        }
        console.log(this.m3u8provider)
        if (filename.split(".")[1] === "m3u8" && this.m3u8provider !== null) {
            const res = this.m3u8provider();
            let data;
            if (Buffer.isBuffer(res)) {
                data = buf2str(res)
            } else {
                data = res;
            }
            const response = { url: context.url, data: data }
            callbacks.onSuccess(response, stats, context)
            return;
        }
        if (filename.split(".")[1] === "m3u8" && this.tsListProvider !== null) {
            var tslist = this.tsListProvider();
            var hash = tslist[filename];
            if (hash) {
                // @ts-ignore
                this.cat(hash).then(res => {
                    let data;
                    if (Buffer.isBuffer(res)) {
                        data = buf2str(res)
                    } else {
                        data = res;
                    }
                    stats.loaded = stats.total = data.length
                    stats.tload = Math.max(stats.tfirst, performance.now())
                    const response = { url: context.url, data: data }
                    callbacks.onSuccess(response, stats, context)
                });
            }
            return;
        }
        this._abortFlag[0] = false;
        getFile(this.ipfs, this.hash, filename, options, this.debug, this._abortFlag).then(res => {
            console.log(res)
            const data = (context.responseType === 'arraybuffer') ? res : buf2str(res)
            stats.loaded = stats.total = data.length
            stats.tload = Math.max(stats.tfirst, performance.now())
            const response = { url: context.url, data: data }
            callbacks.onSuccess(response, stats, context)
        }, console.error)
    }
}
async function getFile(ipfs: any, rootHash: any, filename: any, options: any, debug: any, abortFlag: any) {
    console.log(`Fetching hash for '${rootHash}'`)
    const path = rootHash //${filename}`
    try {
        return await cat(path, options, ipfs, debug, abortFlag)
    } catch (ex) {
        throw new Error(`File not found: ${rootHash}`)
    }
}

function buf2str(buf: any) {
    return new TextDecoder().decode(buf)
}

async function cat(cid: any, options: any, ipfs: any, debug: any, abortFlag: any) {
    console.log(cid, options, ipfs)
    const parts = []
    let length = 0, offset = 0
    const stream = ipfs.cat(cid, options)
    for await (const buf of stream) {
        parts.push(buf)
        console.log(buf)
        length += buf.length
        if (abortFlag[0]) {
            console.log('Cancel reading from ipfs')
            break
        }
    }

    const value = new Uint8Array(length)
    for (const buf of parts) {
        value.set(buf, offset)
        offset += buf.length
    }

    console.log(`Received data for file '${cid}' size: ${value.length} in ${parts.length} blocks`)
    return value
}

export default HlsjsIpfsLoader