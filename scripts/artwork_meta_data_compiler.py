# to do provinance fix
import json
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, network, config

load_dotenv()


# upload to an ipfs provider

PINATA_BASE_URL = "https://api.pinata.cloud/"
endpoint = "pinning/pinFileToIPFS"
headers = {
    "pinata_api_key": os.getenv("PINATA_API_KEY"),
    "pinata_secret_api_key": os.getenv("PINATA_API_SECRET"),
}


def upload_to_ipfs(file_path):
    file_name = file_path.split("/")[-1:][0]
    with Path(file_path).open("rb") as fp:
        image_binary = fp.read()
        response = requests.post(
            PINATA_BASE_URL + endpoint,
            files={"file": (file_name, image_binary)},
            headers=headers,
        )
        data = response.json()
        return data["IpfsHash"]


def upload_json_to_ipfs(json_data):
    with open("meta_data.json", "w") as fp:
        json.dump(json_data, fp, indent=4)
    ipfs_hash = upload_to_ipfs("meta_data.json")
    os.remove("meta_data.json")

    return ipfs_hash


def load_meta_data(file_path):
    file_data = open(file_path)
    meta_data = json.load(file_data)
    return meta_data


def deploy_artwork_contract(meta_data):
    account = get_account()
    solid_state = SolidStateToken.deploy(
        meta_data["supply"],
        int(meta_data["price"]) * 1e18,
        meta_data["name"],
        meta_data["symbol"],
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state, account)


def set_meta_data(meta_data, data_pack_address, solid_state, account):
    tx = solid_state.setMetaData(
        meta_data["title"],
        meta_data["artist"],
        meta_data["medium"],
        meta_data["dimensions"],
        meta_data["year"],
        data_pack_address,
        {"from": account},
    )
    tx.wait(1)


def mint_tokens(solid_state, account):
    tx = solid_state.mintTokens({"from": account})
    tx.wait(1)
    return solid_state


def provinance(meta_data, solid_state, account):
    return solid_state


def add_dummy_provinance(solid_state, account):
    tx = solid_state.addProvinance(
        "Provinance Item", "./testdata/provinance_1.json", {"from": account}
    )
    tx.wait(1)
    return solid_state


# constructs and deploys an artwork contract returns artwork
def construct_meta_data(file_path):
    print(file_path)

    meta_data = load_meta_data(file_path)
    print("..........Parsed, Loaded and Compiled Meta Data")
    META_DATA = {
        "title": meta_data["title"],
        "artist": meta_data["artist"],
        "medium": meta_data["medium"],
        "dimensions": meta_data["dimensions"],
        "year": meta_data["year"],
        "price": meta_data["price"],
        "name": meta_data["name"],
        "symbol": meta_data["symbol"],
        "supply": meta_data["supply"],
        "images": [],
        "videos": [],
        "files": [],
    }

    # images
    if "images" in meta_data:
        for _meta in meta_data["images"]:
            address = upload_to_ipfs(_meta["filePath"])
            print(address)
            META_DATA["images"].append(
                {
                    "IpfsHash": address,
                    "description": _meta["description"],
                }
            )

    # video
    if "videos" in meta_data:
        for _meta in meta_data["videos"]:
            address = upload_to_ipfs(_meta["filePath"])
            print(address)
            META_DATA["videos"].append(
                {
                    "IpfsHash": address,
                    "description": _meta["description"],
                }
            )
    # files
    if "files" in meta_data:
        for _meta in meta_data["files"]:
            address = upload_to_ipfs(_meta["filePath"])
            print(address)
            META_DATA["files"].append(
                {
                    "ipfsHash": address,
                    "description": _meta["description"],
                }
            )

    data_pack_address = upload_json_to_ipfs(META_DATA)

    (solid_state, account) = deploy_artwork_contract(meta_data)
    print(".........deploy_artwork_contract")
    set_meta_data(META_DATA, data_pack_address, solid_state, account)
    print(".........set meta data")
    # provinance(META_DATA, solid_state, account)
    # add_dummy_provinance(solid_state, account)
    # print(".........set provinance")
    # mint_tokens(solid_state, account)
    # print(".........mint_tokens")
    return solid_state
