import Web3 from 'web3'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
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

const CONTRACT_SOURCE = '../contracts/contracts/SolidStateToken.json'
const GALLERY_CONTRACT_SOURCE = '../cotracts/contracts/SolidStateGallery.json'
const MAP = '../contracts/build/deployments/map.json'

var web3 = new Web3(WEB3_PROVIDER)
const Accounts = () => {
    let accounts: any = []
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xbd152130487a1e74a6e2713637518ab68ab14e4bec4e33f248de3aeb15c20438'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x8e7d92482a732107d0e134a99ca4fd7e62baac8c2aba930c5c7033c40f11518b'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x3eb8d65e69a4a4b3a91c803138380756bdc9ae7d2dc6bf3611dad216295b9740'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xada0bc146bd5bf8914cb5e4e398730d23d7aa61322e38b38f8edc6695093ee8e'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xb78f32655d449ff58a2af6b9fb7448e0b835593cb8f6f1af37b9f311bc695b74'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x1aa903b32a906ac84fa6cd6b03189bab3397a132ea47f22c569cf22619a00069'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xe59e2cf65bec6ecf71d83911a9c0a07090403467a6605bbc970c6e9f14beeb16'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xb4cb2e32f17bf61c2ce7b5177a6a564ee57204d7dfdc73b2d9bea7ce17b0cdab'))
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xa105e0c10728564d1ae74d17231fe326ad65aeade56dc0963a84caa347e016ed'))
    return accounts
}
// build image of gallery
const Gallery = async (account: any) => {
    let gallery = {}
    let source = fs.readFileSync(GALLERY_CONTRACT_SOURCE)
    let contract = JSON.parse(source.toString())
    let galleryContract = new web3.eth.Contract(contract.abi, MAP[CHAIN_ID.toString()]["SolidStateGallery"][0])
    const collections = await galleryContract.methods.getCollections().call({ from: account })
    for (var i in collections) {
        gallery[collections[i]] = await galleryContract.methods.getArtWorksByCollectionId(collections[i]).call({ from: account })
    }


    return gallery
}


const Trader = async (artwork: any, account: any) => {
    var liquidity = true;
    // while liquid enough to trade 
    let source = fs.readFileSync(CONTRACT_SOURCE)
    let contract = JSON.parse(source.toString())
    let artworkContract = new web3.eth.Contract(contract.abi, artwork)
    while (liquidity == true) {
        // get trader stats
        let ETH = await web3.eth.getBalance(account.address)
        let TOKEN = await artworkContract.methods.balance(account.address).call({ from: account })
        let SELLORDERS = await artworkContract.methods.getAllSellOrders().call({ from: account })
        let BUYORDERS = await artworkContract.methods.getAllBuyOrders().call({ from: account })
        let SHAREPRICE = await artworkContract.methods.getSharePrice().call({ from: account })
        // if own no tokens fill some buy order at cheapest price 
        if (TOKEN == 0) {
            await artworkContract.methods.placeBuyOrder(11000, SHAREPRICE).send({
                from: account, value: (11000 * SHAREPRICE)
            })
        } else {
            // IF NO ETH SELL SOME LOWER THAN LAST SHARE PRICE
            if (ETH < SHAREPRICE) {

            }



        }
    }

}



// spawn traders
const SpawnTraders = (artwork: any, accounts: any) => {
    for (var i in accounts) {
        Trader(artwork, accounts[i])
    }
}

//sets up the trades
// releases all tokens to owner
// owner places orders 0.0002 to 0.0003
const SetupTrading = async (artwork: any, account: any) => {
    //release tokens to owner
    let source = fs.readFileSync(CONTRACT_SOURCE)
    let contract = JSON.parse(source.toString())
    let artworkContract = new web3.eth.Contract(contract.abi, artwork)
    await artworkContract.methods.contractReleaseTokens(account.address, 100000).send({ from: account })

    await artworkContract.methods.approve(MAP[CHAIN_ID.toString()]["SolidStateGallery"][0], 100000, { "from": account })
    await artworkContract.methods.placeSellOrder(
        100000, Web3.utils.toWei("0.0002", "ether"), { "from": account }
    )

}

const start = () => {
    let account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    const gallery = Gallery(account)
    const accounts = Accounts()
    for (var i in gallery) {
        for (var j in gallery[i]) {
            //setup the intial trades
            SetupTrading(gallery[i][j], accounts)
            SpawnTraders(gallery[i][j], accounts)
        }
    }
}

start()