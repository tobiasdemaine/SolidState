"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv.config({ path: "../contracts/.env" });
const myArgs = process.argv.slice(2);
var CHAIN_ID;
var WEB3_PROVIDER;
var PRIVATE_KEY;
switch (myArgs[0]) {
    case 'local':
        console.log("Running Local");
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_LOCAL;
        PRIVATE_KEY = process.env.PRIVATE_KEY_LOCAL;
        CHAIN_ID = 1337;
        break;
    case 'kovan':
        console.log("Kovan");
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_KOVAN;
        PRIVATE_KEY = process.env.PRIVATE_KEY_KOVAN;
        CHAIN_ID = 42;
        break;
    case 'mainnet':
        console.log("Mainnet");
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_MAINNET;
        PRIVATE_KEY = process.env.PRIVATE_KEY_MAINNET;
        CHAIN_ID = 1;
        break;
    default:
        console.log("Defaulting to Kovan");
        WEB3_PROVIDER = process.env.HTTP_PROVIDER_KOVAN;
        PRIVATE_KEY = process.env.PRIVATE_KEY_KOVAN;
        CHAIN_ID = 42;
}
// setup
const CONTRACT_SOURCE = '../contracts/build/contracts/SolidStateToken.json';
const GALLERY_CONTRACT_SOURCE = '../contracts/build/contracts/SolidStateGallery.json';
const MAP = '../contracts/build/deployments/map.json';
var web3 = new web3_1.default(WEB3_PROVIDER);
const Accounts = () => {
    let accounts = [];
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xbd152130487a1e74a6e2713637518ab68ab14e4bec4e33f248de3aeb15c20438'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x8e7d92482a732107d0e134a99ca4fd7e62baac8c2aba930c5c7033c40f11518b'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x3eb8d65e69a4a4b3a91c803138380756bdc9ae7d2dc6bf3611dad216295b9740'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xada0bc146bd5bf8914cb5e4e398730d23d7aa61322e38b38f8edc6695093ee8e'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xb78f32655d449ff58a2af6b9fb7448e0b835593cb8f6f1af37b9f311bc695b74'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0x1aa903b32a906ac84fa6cd6b03189bab3397a132ea47f22c569cf22619a00069'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xe59e2cf65bec6ecf71d83911a9c0a07090403467a6605bbc970c6e9f14beeb16'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xb4cb2e32f17bf61c2ce7b5177a6a564ee57204d7dfdc73b2d9bea7ce17b0cdab'));
    accounts.push(web3.eth.accounts.privateKeyToAccount('0xa105e0c10728564d1ae74d17231fe326ad65aeade56dc0963a84caa347e016ed'));
    return accounts;
};
// build image of gallery
const Gallery = (account) => __awaiter(void 0, void 0, void 0, function* () {
    let gallery = {};
    let source = fs.readFileSync(GALLERY_CONTRACT_SOURCE);
    let contract = JSON.parse(source.toString());
    let map = JSON.parse(fs.readFileSync(MAP).toString());
    let galleryContract = new web3.eth.Contract(contract.abi, map[CHAIN_ID.toString()]["SolidStateGallery"][0]);
    const collections = yield galleryContract.methods.getCollections().call({ from: account.address });
    for (var i in collections) {
        gallery[collections[i]] = yield galleryContract.methods.getArtWorksByCollectionId(i).call({ from: account.address });
    }
    return gallery;
});
const Trader = (artwork, account) => __awaiter(void 0, void 0, void 0, function* () {
    var liquidity = true;
    // while liquid enough to trade 
    let source = fs.readFileSync(CONTRACT_SOURCE);
    let contract = JSON.parse(source.toString());
    let artworkContract = new web3.eth.Contract(contract.abi, artwork);
    while (liquidity == true) {
        // get trader stats
        let ETH = yield web3.eth.getBalance(account.address);
        let TOKEN = yield artworkContract.methods.balanceOf(account.address).call({ from: account.address });
        let SELLORDERS = yield artworkContract.methods.getAllSellOrders().call({ from: account.address });
        let BUYORDERS = yield artworkContract.methods.getAllBuyOrders().call({ from: account.address });
        let SHAREPRICE = yield artworkContract.methods.getSharePrice().call({ from: account.address });
        // if own no tokens buy some
        console.log(ETH, SHAREPRICE, TOKEN);
        console.log(SELLORDERS);
        if (ETH < SHAREPRICE) {
            //liquidity = false
            // break
        }
        if (TOKEN == 0) {
            console.log("-placeBuyOrder");
            yield artworkContract.methods.placeBuyOrder(1000, SHAREPRICE).send({
                from: account.address, value: (1000 * SHAREPRICE), gas: 400000
            });
        }
        else {
            // IF NO ETH SELL SOME LOWER THAN LAST SHARE PRICE
            if (ETH < SHAREPRICE) {
                console.log("--approve");
                yield artworkContract.methods.approve(artwork, 100).send({ "from": account.address, gas: 400000 });
                console.log("--placeSellOrder");
                yield artworkContract.methods.placeSellOrder(100, (SHAREPRICE - 10000000000000)).send({ "from": account.address, gas: 400000 });
            }
            else {
                // LOW TOKEN 
                if (TOKEN < 1000) {
                    try {
                        console.log("--placeBuyOrder");
                        yield artworkContract.methods.placeBuyOrder(1000, SHAREPRICE).send({
                            from: account.address, value: (1000 * SHAREPRICE), gas: 400000
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                    // do the simple trades
                    try {
                        console.log("---approve");
                        yield artworkContract.methods.approve(artwork, 100).send({ "from": account.address, gas: 400000 });
                        console.log("---placeSellOrder");
                        yield artworkContract.methods.placeSellOrder(100, (SHAREPRICE - 10000000000000)).send({ "from": account.address, gas: 400000 });
                        const shareP = SHAREPRICE - 10000000000000;
                        console.log("---placeBuyOrder");
                        yield artworkContract.methods.placeBuyOrder(10, shareP).send({
                            from: account.address, value: (10 * shareP), gas: 400000
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
});
// spawn traders
const SpawnTraders = (artwork, accounts) => {
    for (var i in accounts) {
        Trader(artwork, accounts[i]);
    }
};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    let account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const gallery = yield Gallery(account);
    const accounts = yield Accounts();
    for (var i in gallery) {
        for (var j in gallery[i]) {
            SpawnTraders(gallery[i][j], accounts);
        }
    }
});
start();
//# sourceMappingURL=index.js.map