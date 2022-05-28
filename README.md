SOLID STATE
===========

is a decentralised market for trading shares in Artworks. The premise is the owner of the artwork/s maintains storage and security of the artwork, while allowing for the artwork to realise it investment value by allowing others to invest in it as parts/shares.  These parts/shares are ec20 tokens. [Test Server](http://solidstate.tobiasdemaine.com)

The platform is broken into 2 contracts. The Artwork contract and The Gallery contract.

Each Artwork Contract is it own trading platform, managing its own buy and sell orders.  This creates independence of the contract from exisiting only on a specific a trading platforms.  The price of the Artwork's shares adjusts the artworks price. Ultmately "the market" defines the priceof the artwork.

The Gallery contract is a group of lists (collections) of Artworks with a visiblity switch.

Smart Contracts / Brownie
--------------- 
```text
contracts/
```

React Front End
--------------- 
```text
front_end/solid_state/
```

Node Rest Api and App Server
--------------- 
```text
rest_api/
```

Tools
--------------- 
```text
tools/
```


LOCAL CHAIN TESTING
-------------------
Start Local BlockChain Ganache
'''text
cd tools
npm start localchain
'''

Deploy the gallery Contract
'''text
cd tools
npm start localchain
'''

KOVAN CHAIN TESTING
-------------------
Start Local BlockChain Ganache
'''text
cd tools
npm start kovan
'''

IPFS STARTUP
-------------------
Start Local IPFS
'''text
cd tools
npm start ipfs local
'''

Start Production IPFS
'''text
cd tools
npm start ipfs production
'''

----------------------

* to do
    * Front end for deploying new artwork contract
    * Front end add new collection
    * Testing
        * python contract integration tests
            * bot trading to test large data calls to UI
        * javascript UI E2E tests
    * Video stream from IPFS
    * move off infura to self hosted node
    * Complete Deploy and Update scripts


VIDEO PREPARATION
-----------------
```text
prepare videos :

ffmpeg -i video_0.mp4 -vcodec libx264 -acodec aac -pix_fmt yuv420p -movflags empty_moov+default_base_moof+frag_keyframe -profile:v baseline video_0_1.mp4


transcode video:

MP4Box -inter 500 video_0_1.mp4


video mimeCodec:

avc1.42C01F,mp4a.40.2
```






