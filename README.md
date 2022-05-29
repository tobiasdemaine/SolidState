SOLID STATE
===========

is a decentralised market for trading shares in Artworks. The premise is the owner of the artwork/s maintains storage and security of the artwork, while allowing for the artwork to realise its investment value by allowing others to invest in it as parts/shares.  These parts/shares are ec20 tokens. [Test Server](http://solidstate.tobiasdemaine.com)

The platform is broken into 2 contracts. The Artwork contract and The Gallery contract.

Each Artwork Contract is it own trading platform, managing its own buy and sell orders.  This creates independence of the contract from exisiting only on a specific trading platforms.  The price of the Artwork's shares adjusts the artworks price. Ultimately "the market" defines the price of the artwork.

The Gallery contract is a group of lists (collections) of Artworks with a visiblity switch.

**The project directory structure:**

- *contracts/* - Smart Contracts / Brownie
- *front_end/solid_state/* - React Front End
- *rest_api/* - Node Rest Api and App Server
- *tools/* - Setup Tools



## Local Host Development 
### Install on Ubuntu/Debian
'''
sudo apt install python3 pip3 docker.io curl gnupg git
curl -sL https://deb.nodesource.com/setup_17.x  | bash -
apt-get -y install nodejs
pip3 install brownie
git clone https://github.com/tobiasdemaine/SolidState.git
cd SolidState/front_end/solid_state/
npm install
cd ../../rest_api
npm install
cd ../../tools
npm install
'''

.env setup???

### Server start up order 
Open each in a new Terminal
1. Start local blockchain - Ganache 
```
cd tools
npm start localchain
```
2. Deploy Gallery Spin up Ipfs 
```
cd tools 
npm start deploy local
npm start ipfs local
cd ../../rest_api
npm start local
```
4. Start React 
```
cd front_end
npm start
```

--------

### LOCAL CHAIN TESTING
Start Local BlockChain Ganache
```text
cd tools
npm start localchain
```

Deploy the gallery Contract
```text
cd tools
npm start deploy local
```

### KOVAN CHAIN TESTING
Start Local BlockChain Ganache
```text
cd tools
npm start kovan
```

### IPFS STARTUP
Start Local IPFS
```text
cd tools
npm start ipfs local
```

Start Production IPFS
```text
cd tools
npm start ipfs production
```

----------------------

* to do
    * Front end add new collection
    * Testing
        * python contract integration tests
            * bot trading to test large data calls to UI
        * javascript UI E2E tests
    * Video stream from IPFS
    * move off infura to self hosted node
    * Complete Deploy and Update scripts


### VIDEO PREPARATION
```text
prepare videos :

ffmpeg -i video_0.mp4 -vcodec libx264 -acodec aac -pix_fmt yuv420p -movflags empty_moov+default_base_moof+frag_keyframe -profile:v baseline video_0_1.mp4


transcode video:

MP4Box -inter 500 video_0_1.mp4


video mimeCodec:

avc1.42C01F,mp4a.40.2
```






