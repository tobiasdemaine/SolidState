import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import { randomUUID } from 'crypto'
import * as del from 'del';
import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'

import { fileFilter, } from './utils';

// setup
const IPFS_PATH = 'ipfs_host:/export'
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: fileFilter });
var UUIDS = {}

shell.exec("mkdir uploads", { silent: true })
// app
const app = express();
app.use(cors());

app.get('/k', async (req, res) => {
    // default route
    const uuid = randomUUID()
    UUIDS[uuid] = { timestamp: Date.now() }
    res.send({ key: uuid })
})

app.post('/f', upload.single('file'), async (req, res) => {
    try {
        if (req.body["key"] !== undefined) {
            if (UUIDS.hasOwnProperty(req.body["key"])) {
                if (Date.now() - 600000 < UUIDS[req.body["key"]].timestamp) {

                    // move file to docker
                    const dockerFileCopyCommand = "docker cp '" + req.file.path + "' '" + "ipfs_host:/export/" + req.file.originalname + "'";
                    shell.exec(dockerFileCopyCommand, { silent: true })

                    const dockerIPFSAddFileCommand = "docker exec ipfs_host ipfs add '/export/" + req.file.originalname + "'"

                    var ipfsOutput = shell.exec(dockerIPFSAddFileCommand, { silent: true }).stdout

                    const ipfsHash = ipfsOutput.split(" ")[1]
                    delete UUIDS[req.body["key"]]
                    fs.unlinkSync(req.file.path)

                    res.send({ ipfsHash: ipfsHash })
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
        res.send({ error: err });
    }
})



app.listen(3030, function () {
    console.log('listening on port 3030!');
})