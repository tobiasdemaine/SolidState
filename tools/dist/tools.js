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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployGallery = exports.localAccounts = exports.localChain = exports.setupLocalChain = exports.dotEnv = void 0;
const shell = __importStar(require("shelljs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const dotEnv = () => {
    // build the dot env file
};
exports.dotEnv = dotEnv;
const setupLocalChain = () => {
    shell.exec("brownie networks delete SolidStateTest", { silent: false });
    shell.exec("brownie networks add Ethereum SolidStateTest host=http://127.0.0.1:8545 chainid=1337", { silent: false });
};
exports.setupLocalChain = setupLocalChain;
const localChain = () => {
    shell.exec("ganache-cli --accounts 10 --hardfork istanbul --gasLimit 12000000 --mnemonic solidstate --port 8545", { silent: false });
};
exports.localChain = localChain;
const localAccounts = () => {
    console.log(`
        Available Accounts
        ==================
        (0) 0xF70Da1549B55932b070740FA10A0f9347224E2A3 (100 ETH)
        (1) 0xa1fFA8B6A5515B4722d6bf1Ff20e13B6c48CA8E1 (100 ETH)
        (2) 0x62DC6cF9e2DF4B41B2207e12C2d516daCcb180B0 (100 ETH)
        (3) 0x0B249E8C26297F740aF6587c4F992518F6E3C80F (100 ETH)
        (4) 0x4e5F86A929275d4fcFDF384200c7Bc2745906DE7 (100 ETH)
        (5) 0x442fb7a2627298481db04C8C03b4A8B846D68760 (100 ETH)
        (6) 0xBAc41b24d2A61553E0C1f19c8A150c213f5f349C (100 ETH)
        (7) 0x3D0c4F8502CF415AbE1D7Fe3d4e9AC782F8D88c5 (100 ETH)
        (8) 0x8a5804CA735deD75be9B72E25740CF2632628122 (100 ETH)
        (9) 0x4c4AEFc23B79ED74BEF918ad6ECE0A77bA462F46 (100 ETH)

        Private Keys
        ==================
        (0) 0xd94c9b5afae922f473403dca098d47019f47fa03c1038a7ee7e049831fe4bb24
        (1) 0xbd152130487a1e74a6e2713637518ab68ab14e4bec4e33f248de3aeb15c20438
        (2) 0x8e7d92482a732107d0e134a99ca4fd7e62baac8c2aba930c5c7033c40f11518b
        (3) 0x3eb8d65e69a4a4b3a91c803138380756bdc9ae7d2dc6bf3611dad216295b9740
        (4) 0xada0bc146bd5bf8914cb5e4e398730d23d7aa61322e38b38f8edc6695093ee8e
        (5) 0xb78f32655d449ff58a2af6b9fb7448e0b835593cb8f6f1af37b9f311bc695b74
        (6) 0x1aa903b32a906ac84fa6cd6b03189bab3397a132ea47f22c569cf22619a00069
        (7) 0xe59e2cf65bec6ecf71d83911a9c0a07090403467a6605bbc970c6e9f14beeb16
        (8) 0xb4cb2e32f17bf61c2ce7b5177a6a564ee57204d7dfdc73b2d9bea7ce17b0cdab
        (9) 0xa105e0c10728564d1ae74d17231fe326ad65aeade56dc0963a84caa347e016ed
    `);
};
exports.localAccounts = localAccounts;
const deployGallery = () => {
    shell.exec("rm -fr build/deployments/1337", { silent: false });
    shell.exec("brownie run scripts/deploy_gallery.py --network SolidStateTest", { silent: false });
};
exports.deployGallery = deployGallery;
const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
    case 'dotEnv':
        console.log("dotEnv");
        (0, exports.dotEnv)();
        break;
    case 'localchain':
        (0, exports.setupLocalChain)();
        (0, exports.localChain)();
        break;
    case 'localaccounts':
        (0, exports.localAccounts)();
        break;
    case 'deploygallery':
        (0, exports.deployGallery)();
        break;
    default:
        console.log("please supply command");
}
//# sourceMappingURL=tools.js.map