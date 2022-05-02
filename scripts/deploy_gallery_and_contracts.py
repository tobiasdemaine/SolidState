# DEPLOYS a coin linkto an artworks provenance

from scripts.helpers import get_account, get_contract, update_front_end
from brownie import SolidStateToken, SolidStateGallery, network, config


front_end_update = False


def deploy_solid_state_gallery():

    account = get_account()
    solid_state_gallery = SolidStateGallery.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    return (solid_state_gallery, account)


def deploy_solid_state_token_2():
    account = get_account()
    solid_state = SolidStateToken.deploy(
        100_000,
        10,
        "SOLID STATE 2",
        "SS2",
        get_contract("eth_usd_price_feed"),
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    return (solid_state, account)


def deploy_solid_state_token_1():
    account = get_account()
    solid_state = SolidStateToken.deploy(
        100_000,
        10,
        "SOLID STATE 1",
        "SS1",
        get_contract("eth_usd_price_feed"),
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    return (solid_state, account)


def set_meta_data_1(solid_state, account):
    tx = solid_state.setMetaData(
        "SOLID STATE One",
        "tdm",
        "obsidian glass",
        "10x10x10",
        2022,
        "./testdata/test_data_pack_1.json",
        {"from": account},
    )
    tx.wait(1)
    return solid_state


def set_meta_data_2(solid_state, account):
    tx = solid_state.setMetaData(
        "SOLID STATE 2",
        "tdm",
        "obsidian glass",
        "10x10x10",
        2022,
        "./testdata/test_data_pack_2.json",
        {"from": account},
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
    print(1)
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    (solid_state_artwork_1, account) = deploy_solid_state_token_1()
    set_meta_data_1(solid_state_artwork_1, account)
    add_provinance(
        solid_state_artwork_1, account, "SS1 Provinance", "./testdata/provinance_1.json"
    )
    mint_tokens(solid_state_artwork_1, account)
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_1.address, {"from": account}
    )
    tx.wait(1)
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_artwork_1.address, True, {"from": account}
    )
    tx.wait(1)
    (solid_state_artwork_2, account) = deploy_solid_state_token_2()
    set_meta_data_2(solid_state_artwork_2, account)
    add_provinance(
        solid_state_artwork_2, account, "SS2 Provinance", "./testdata/provinance_2.json"
    )
    mint_tokens(solid_state_artwork_2, account)
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_2.address, {"from": account}
    )
    tx.wait(1)
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_artwork_2.address, True, {"from": account}
    )
    tx.wait(1)
    update_front_end()
