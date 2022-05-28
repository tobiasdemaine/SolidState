# to do provinance fix
import json
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, Multicall, network, config
from scripts.artwork_meta_data_compiler import construct_meta_data


def deploy_solid_state_gallery():

    account = get_account()
    print(account)
    multicall = Multicall.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    multicallenv = "REACT_APP_MULTICALL_LOCAL=" + multicall.address
    with open("../front_end/solid_state/.env", "w") as f:
        f.write(multicallenv)

    print(multicallenv)
    print("------")

    solid_state_gallery = SolidStateGallery.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state_gallery, account)


def main():
    # deploy a gallery
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    tx = solid_state_gallery.addCollection("Collection 1", {"from": account})
    tx = solid_state_gallery.addCollection("Collection 2", {"from": account})

    update_front_end()
