import json
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, Multicall, network, config
from scripts.artwork_meta_data_compiler import construct_meta_data
from web3 import Web3
from time import sleep

load_dotenv()


def deploy_solid_state_gallery():
    print("deploy gallery")
    account = get_account()
    solid_state_gallery = SolidStateGallery.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state_gallery, account)


def main():
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    # deploy a gallery
    multicall = Multicall.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    multicallenv = (
        "REACT_APP_MULTICALL_LOCAL="
        + multicall.address
        + "\n REACT_APP_WEB3_INFURA_PROJECT_ID="
        + os.getenv("WEB3_INFURA_PROJECT_ID")
    )
    with open("../front_end/solid_state/.env", "w") as f:
        f.write(multicallenv)

    print(multicallenv)
    print("------")

    tx = solid_state_gallery.addCollection("Gothic", {"from": account})
    tx = solid_state_gallery.addCollection("Renaissance", {"from": account})
    tx = solid_state_gallery.addCollection("Naive", {"from": account})

    # loop directories
    directory = "/home/studio/Development/ArtScraper/gothic/"
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isdir(f):
            fpath = f + "/metadata.json"
            artwork = construct_meta_data(fpath)
            print(artwork.address)
            tx = solid_state_gallery.addArtWork(artwork.address, 0, {"from": account})
            tx.wait(1)
            tx = solid_state_gallery.setArtWorkVisibility(
                solid_state_gallery.address, True, {"from": account}
            )
            tx = artwork.contractReleaseTokens(
                account.address, 10000, {"from": account}
            )
            tx.wait(1)
            tokenAmount = artwork.balanceOf(account.address, {"from": account})
            print(tokenAmount)
            shareprice = artwork.getSharePrice({"from": account})
            tx = artwork.approve(artwork.address, 10000, {"from": account})
            tx.wait(1)

            sell_order_id_1 = artwork.placeSellOrder(
                10000,
                shareprice,
                {"from": account, "gas_limit": 300000},
            )

    directory = "/home/studio/Development/ArtScraper/renaissance/"
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isdir(f):
            fpath = f + "/metadata.json"
            artwork = construct_meta_data(fpath)
            print(artwork.address)
            tx = solid_state_gallery.addArtWork(artwork.address, 1, {"from": account})
            tx.wait(1)
            tx = solid_state_gallery.setArtWorkVisibility(
                solid_state_gallery.address, True, {"from": account}
            )
            tx = artwork.contractReleaseTokens(
                account.address, 10000, {"from": account}
            )
            tx.wait(1)
            tokenAmount = artwork.balanceOf(account.address, {"from": account})
            print(tokenAmount)
            shareprice = artwork.getSharePrice({"from": account})
            tx = artwork.approve(artwork.address, 10000, {"from": account})
            tx.wait(1)

            sell_order_id_1 = artwork.placeSellOrder(
                10000,
                shareprice,
                {"from": account, "gas_limit": 300000},
            )

    directory = "/home/studio/Development/ArtScraper/naive/"
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isdir(f):
            fpath = f + "/metadata.json"
            artwork = construct_meta_data(fpath)
            print(artwork.address)
            tx = solid_state_gallery.addArtWork(artwork.address, 2, {"from": account})
            tx.wait(1)
            tx = solid_state_gallery.setArtWorkVisibility(
                solid_state_gallery.address, True, {"from": account}
            )
            tx = artwork.contractReleaseTokens(
                account.address, 10000, {"from": account}
            )
            tx.wait(1)
            tokenAmount = artwork.balanceOf(account.address, {"from": account})
            print(tokenAmount)
            shareprice = artwork.getSharePrice({"from": account})
            tx = artwork.approve(artwork.address, 10000, {"from": account})
            tx.wait(1)

            sell_order_id_1 = artwork.placeSellOrder(
                10000,
                shareprice,
                {"from": account, "gas_limit": 300000},
            )

    update_front_end()
