# to do provinance fix
import json
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, network, config
from scripts.artwork_meta_data_compiler import construct_meta_data


def deploy_solid_state_gallery():

    account = get_account()
    solid_state_gallery = SolidStateGallery.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state_gallery, account)


def add_dummy_provinance(solid_state, account):
    tx = solid_state.addProvinance(
        " Provinance Item", "./testdata/provinance_1.json", {"from": account}
    )
    tx.wait(1)
    return solid_state


def main():
    # deploy a gallery
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    tx = solid_state_gallery.addCollection("Test Collection", {"from": account})
    tx = solid_state_gallery.addCollection("Test Collection 2", {"from": account})
    artwork = construct_meta_data(
        "/home/studio/Development/SolidState/artwork/solid_state_1/metadata.json"
    )
    print(artwork.address)
    tx = solid_state_gallery.addArtWork(artwork.address, 0, {"from": account})
    tx.wait(1)
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_gallery.address, True, {"from": account}
    )

    artwork = construct_meta_data(
        "/home/studio/Development/SolidState/artwork/solid_state_2/metadata.json"
    )
    print(artwork.address)
    tx = solid_state_gallery.addArtWork(artwork.address, 0, {"from": account})
    tx.wait(1)
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_gallery.address, True, {"from": account}
    )
    update_front_end()
