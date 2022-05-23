SOLID STATE
===========

is a decentralised market for trading shares in Artworks. The premise is the owner of the artwork/s maintains storage and security of the artwork, while allowing for the artwork to realise it investment value by allowing others to invest in it as parts/shares.  These parts/shares are ec20 tokens. [Test Server](http://solidstate.tobiasdemaine.com)

The platform is broken into 2 contracts. The Artwork contract and The Gallery contract.

Each Artwork Contract is it own trading platform, managing its own buy and sell orders.  This creates indepence of the contract from exisiting only specific a trading platforms.  The price of the Artwork's shares adjusts the artworks price. 

The Gallery contract is a list of Artworks with a visiblity switch.

VIDEO PREPARATION
```text
prepare videos :

ffmpeg -i video_0.mp4 -vcodec libx264 -acodec aac -pix_fmt yuv420p -movflags empty_moov+default_base_moof+frag_keyframe -profile:v baseline video_0_1.mp4


transcode video:

MP4Box -inter 500 video_0_1.mp4


video mimeCodec:

avc1.42C01F,mp4a.40.2
```






