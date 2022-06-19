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
        console.log("Running Local")
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const testSecret = (req: any) => { //quick and dirty authetication
    //console.log(req)
    if (typeof (req.body) !== undefined) {
        if (req.body["secret"] !== undefined) {
            if (req.body["secret"] == process.env.API_SECRET) {
                return true
            }
        }
    }
    return false
}

const testUUID = (req: any) => { //quick and dirty authetication
    if (typeof (req.body["key"]) !== undefined) {
        if (req.body["key"] !== undefined) {
            if (UUIDS.hasOwnProperty(req.body["key"])) {
                if (Date.now() - 12000000 < UUIDS[req.body["key"]].timestamp) {
                    return true
                } else {
                    delete UUIDS[req.body["key"]]
                }
            }
        }
    }
    return false
}

app.post('/k', upload.none(), async (req, res) => { //set a session key
    try {
        if (testSecret(req)) {
            const uuid = randomUUID()
            UUIDS[uuid] = { timestamp: Date.now(), files: [], submit: false, address: null, ready: false }
            res.send({ key: uuid })
        } else {
            res.send({ key: 'error' })
        }
    } catch (err) {
        console.log(err)
        res.send({ ready: err });
    }
})


app.post('/r', upload.none(), async (req, res) => {
    try {
        if (testUUID(req)) {
            if (UUIDS[req.body["key"]].ready) {
                res.send({ ready: UUIDS[req.body["key"]].address })
                delete UUIDS[req.body["key"]]
            } else {
                res.send({ ready: "working" })
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
        if (testUUID(req)) {
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
                if (UUIDS[req.body["key"]]["submit"] == false) {
                    UUIDS[req.body["key"]]["submit"] = true
                    deployTokenContract(ipfsHash, metaData, req.body["key"])
                }


                res.send({ contractHash: "Processing" })
            } else {
                fs.unlinkSync(req.file.path)
                res.send({ ipfsHash: ipfsHash })
            }

        } else {
            fs.unlinkSync(req.file.path)
            throw "error"
        }

    } catch (err) {
        console.log(err)
        res.send({ error: "err" });
    }
})

//app.use('/', express.static('public')) // serve the react app
//app.all('*', express.static('public'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});
app.listen(3030, function () {
    console.log('listening on port 3030!');
})

const deployTokenContract = (ipfsHash: any, metaData: any, UUID: any) => {
    let source = fs.readFileSync(CONTRACT_SOURCE)
    let contract = JSON.parse(source.toString())
    let code = '0x' + contract.bytecode
    let tokenContract = new web3.eth.Contract(contract.abi)
    let account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    var gas: any

    web3.eth.getGasPrice().then((gasPrice: any) => {
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
                                    let source = fs.readFileSync(GALLERY_CONTRACT_SOURCE)
                                    let contract = JSON.parse(source.toString())
                                    let netmap = fs.readFileSync("./chain-info/deployments/map.json")
                                    let networkMapping = JSON.parse(netmap.toString())

                                    web3.eth.getGasPrice().then((gasPrice: any) => {
                                        let galleryContract = new web3.eth.Contract(contract.abi, networkMapping[CHAIN_ID.toString()]["SolidStateGallery"][0])
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
                                                        //console.log(result)
                                                    })
                                            })
                                    })
                                })
                        } catch (err) {
                            console.log(err)
                        }


                    })
            })
        })
    })
}