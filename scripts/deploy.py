# DEPLOYS a coin linkto an artworks provenance

from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, network, config
from web3 import Web3
import yaml
import json
import os
import shutil


initial_token_supply = 100_000
contract_sale_price = 10 * 1e18
token_name = "SOLID STATE 1"
token_symbol = "SS1"
title = "Solid State 1"
artist = "Tobias De Maine"
medium = "Ceramic Obsidian Glass"
dimensions = "1x1"
year = 2022
media_data_pack_URI = "//url.to/media/and/data/pack"
front_end_update = False


def deploy_solid_state_gallery():
    account = get_account()
    solid_state_gallery = SolidStateGallery.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state_gallery, account)


def deploy_solid_state_token():
    account = get_account()
    solid_state = SolidStateToken.deploy(
        initial_token_supply,
        contract_sale_price,
        token_name,
        token_symbol,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    return (solid_state, account)


def set_meta_data(solid_state, account):
    tx = solid_state.setMetaData(
        title, artist, medium, dimensions, year, media_data_pack_URI, {"from": account}
    )
    tx.wait(1)
    return solid_state


def add_provinance(solid_state, account, _title, _metaURI):
    tx = solid_state.addProvinance(_title, _metaURI, {"from": account})
    tx.wait(1)
    return solid_state


def mint_tokens(solid_state, account):
    tx = solid_state.mintTokens({"from": account})
    tx.wait(1)
    return solid_state


def main():
    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)
    add_provinance(
        solid_state, account, "Example Provinance", "//url.to/provinance/file"
    )
    mint_tokens(solid_state, account)

    if front_end_update:
        update_front_end()
