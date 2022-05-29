import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { randomUUID } from 'crypto'
import * as del from 'del';
import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import Web3 from 'web3'
import * as dotenv from 'dotenv'

import { fileFilter, } from './utils'

dotenv.config()

const myArgs = process.argv.slice(2);
var CHAIN_ID: any
var WEB3_PROVIDER: any
var PRIVATE_KEY: any
switch (myArgs[0]) {
    case 'local':
        console.log("Local")
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_LOCAL
        PRIVATE_KEY = process.env.PRIVATE_KEY_LOCAL
        CHAIN_ID = 1337
        break
    case 'kovan':
        console.log("Kovan")
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_KOVAN
        PRIVATE_KEY = process.env.PRIVATE_KEY_KOVAN
        CHAIN_ID = 42
        break
    case 'mainnet':
        console.log("Mainnet")
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_MAINNET
        PRIVATE_KEY = process.env.PRIVATE_KEY_MAINNET
        CHAIN_ID = 1
        break
    default:
        console.log("Defaulting to Kovan")
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_KOVAN
        PRIVATE_KEY = process.env.PRIVATE_KEY_KOVAN
        CHAIN_ID = 42
}
console.log(WEB3_PROVIDER)
console.log(PRIVATE_KEY)
// setup
const IPFS_PATH = 'ipfs_host:/export'
const UPLOAD_PATH = 'uploads'
const CONTRACT_SOURCE = './chain-info/contracts/SolidStateToken.json'
const GALLERY_CONTRACT_SOURCE = './chain-info/contracts/SolidStateGallery.json'

const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: fileFilter })
var UUIDS = {}

var web3 = new Web3(WEB3_PROVIDER)


shell.exec("mkdir uploads", { silent: true })
// app
const app = express()
app.use(cors())

app.get('/k', async (req, res) => {
    // this will get confirmation from the gallery contract
    const uuid = randomUUID()
    UUIDS[uuid] = { timestamp: Date.now(), files: [], submit: false, address: null, ready: false }
    res.send({ key: uuid })
})


app.post('/r', upload.single('file'), async (req, res) => {
    try {
        if (req.body["key"] !== undefined) {
            if (UUIDS.hasOwnProperty(req.body["key"])) {
                if (Date.now() - 12000000 < UUIDS[req.body["key"]].timestamp) {
                    if (UUIDS[req.body["key"]].ready) {
                        console.log(req.body["key"], UUIDS[req.body["key"]].ready)

                        res.send({ ready: UUIDS[req.body["key"]].address })
                        delete UUIDS[req.body["key"]]
                    } else {
                        res.send({ ready: "working" })
                    }
                } else {
                    delete UUIDS[req.body["key"]]
                    throw "error"
                }
            } else {
                throw "error"
            }

        } else {
            throw "error"
        }
    } catch (err) {
        console.log(err)
        res.send({ ready: err });
    }
})

app.post('/f', upload.single('file'), async (req, res) => {
    try {
        if (req.body["key"] !== undefined) {
            if (UUIDS.hasOwnProperty(req.body["key"])) {
                if (Date.now() - 12000000 < UUIDS[req.body["key"]].timestamp) { // 20 minutes to perform the transaction

                    // move file to docker
                    const dockerFileCopyCommand = "docker cp '" + req.file.path + "' '" + "ipfs_host:/export/" + req.file.originalname + "'";
                    shell.exec(dockerFileCopyCommand, { silent: true })

                    const dockerIPFSAddFileCommand = "docker exec ipfs_host ipfs add '/export/" + req.file.originalname + "'"

                    var ipfsOutput = shell.exec(dockerIPFSAddFileCommand, { silent: true }).stdout

                    const ipfsHash = ipfsOutput.split(" ")[1]

                    UUIDS[req.body["key"]].files.push(ipfsHash)


                    if (req.body["publish"] == "true") {
                        let metaText = fs.readFileSync(req.file.path)
                        let metaData = JSON.parse(metaText.toString())
                        console.log("Publish")
                        if (UUIDS[req.body["key"]]["submit"] == false) {
                            UUIDS[req.body["key"]]["submit"] = true
                            deployTokenContract(ipfsHash, metaData, req.body["key"])
                        }


                        res.send({ contractHash: "Processing this will take sometime" })
                    } else {
                        fs.unlinkSync(req.file.path)
                        res.send({ ipfsHash: ipfsHash })
                    }
                } else {
                    delete UUIDS[req.body["key"]]
                    fs.unlinkSync(req.file.path)
                    throw "out of time"
                }

            } else {
                fs.unlinkSync(req.file.path)
                throw "bad key"
            }
        } else {
            fs.unlinkSync(UPLOAD_PATH + "/" + req.file.filename)
            throw "no key"
        }

    } catch (err) {
        console.log(err)
        res.send({ error: "err" });
    }
})

app.use('/', express.static('public'))

app.listen(3030, function () {
    console.log('listening on port 3030!');
})

const deployTokenContract = (ipfsHash: any, metaData: any, UUID: any) => {
    let source = fs.readFileSync(CONTRACT_SOURCE)
    let contract = JSON.parse(source.toString())
    let code = '0x' + contract.bytecode
    let tokenContract = new web3.eth.Contract(contract.abi)
    let account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    var gasPrice: any
    var gas: any



    web3.eth.getGasPrice().then((gasPrice: any) => {
        console.log(metaData["supply"],
            Web3.utils.toWei(metaData["price"].toString()),
            metaData["title"],
            metaData["symbol"])
        var artWorkPrice = Web3.utils.toWei(metaData["price"].toString())

        gas = tokenContract.deploy({
            data: code,
            arguments: [
                metaData["supply"],
                artWorkPrice,
                metaData["title"],
                metaData["symbol"],
            ]
        }).estimateGas().then(function (gas: any) {
            tokenContract.deploy({
                data: code,
                arguments: [
                    metaData["supply"],
                    artWorkPrice,
                    metaData["title"],
                    metaData["symbol"],
                ]
            }).send({
                from: account.address,
                gas: gas,
                gasPrice: gasPrice
            }).then(function (newContractInstance) {
                console.log("newContractInstance.options.address", newContractInstance.options.address) // instance with the new contract address
                //add the meta data
                UUIDS[UUID]["address"] = newContractInstance.options.address
                let tokenContract = new web3.eth.Contract(contract.abi, newContractInstance.options.address)
                gas = tokenContract.methods.setMetaData(
                    metaData["title"],
                    metaData["artist"],
                    metaData["medium"],
                    metaData["dimensions"],
                    metaData["year"],
                    ipfsHash).estimateGas().then((gas: any) => {
                        try {
                            tokenContract.methods.setMetaData(
                                metaData["title"],
                                metaData["artist"],
                                metaData["medium"],
                                metaData["dimensions"],
                                metaData["year"],
                                ipfsHash).send({
                                    from: account.address,
                                    gas: gas,
                                    gasPrice: gasPrice
                                }).then((result: any) => {
                                    // call gallery contract
                                    console.log(result)

                                    let source = fs.readFileSync(GALLERY_CONTRACT_SOURCE)
                                    let contract = JSON.parse(source.toString())
                                    let code = '0x' + contract.bytecode
                                    let netmap = fs.readFileSync("./chain-info/deployments/map.json")

                                    let networkMapping = JSON.parse(netmap.toString())
                                    var gasPrice: any
                                    var gas: any

                                    web3.eth.getGasPrice().then((gasPrice: any) => {
                                        let galleryContract = new web3.eth.Contract(contract.abi, networkMapping[CHAIN_ID.toString()]["SolidStateGallery"][0])
                                        console.log(newContractInstance.options.address,
                                            metaData["collection"])
                                        galleryContract.methods.addArtWork(
                                            newContractInstance.options.address,
                                            metaData["collection"]).estimateGas().then((gas: any) => {
                                                galleryContract.methods.addArtWork(
                                                    newContractInstance.options.address,
                                                    metaData["collection"]).send({
                                                        from: account.address,
                                                        gas: gas,
                                                        gasPrice: gasPrice
                                                    }).then(function (result: any) {
                                                        UUIDS[UUID]["ready"] = true
                                                        console.log(result)
                                                    })
                                            })
                                    })
                                })
                        } catch (err) {
                            console.log("---")
                            console.log(err)
                        }


                    })
            })
        })
    })
}