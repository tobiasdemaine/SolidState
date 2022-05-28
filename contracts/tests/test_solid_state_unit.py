from scripts.deploy import (
    deploy_solid_state_token,
    mint_tokens,
    add_provinance,
    set_meta_data,
    initial_token_supply,
    contract_sale_price,
)
from scripts.helpers import (
    get_account,
    get_contract,
    DECIMALS,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
from brownie import network, exceptions
from web3 import Web3
import pytest


currentETHUSD = 2000


def test_meta_data():
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    # act
    tx = solid_state.setMetaData(
        "Test Title",
        "Test Artist",
        "medium",
        "1x1",
        1984,
        "//data.uri/",
        {"from": account},
    )
    tx.wait(1)
    metaData = solid_state.getMetaData({"from": account})
    # assert
    assert (
        metaData["title"] == "Test Title"
        and metaData["artist"] == "Test Artist"
        and metaData["medium"] == "medium"
        and metaData["dimensions"] == "1x1"
        and metaData["year"] == 1984
        and metaData["mediaDataPackURI"] == "//data.uri/"
    )


"""def test_provinance():
    # addProvinance
    # testGetProvinanceount
    # getProvinanceByIndex
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)
    # Act
    tx = solid_state.addProvinance("Test Title 0", "uri0", {"from": account})
    tx.wait(1)
    tx = solid_state.addProvinance("Test Title 1", "uri1", {"from": account})
    tx.wait(1)
    count = solid_state.getProvinanceCount({"from": account})
    provinance0_title, provinance0_uri = solid_state.getProvinanceByIndex(
        0, {"from": account}
    )
    provinance1_title, provinance1_uri = solid_state.getProvinanceByIndex(
        1, {"from": account}
    )
    # Assert
    assert count == 2
    assert provinance0_title == "Test Title 0"
    assert provinance0_uri == "uri0"
    assert provinance1_title == "Test Title 1"
    assert provinance1_uri == "uri1"
"""

"""def test_mint_tokens_and_balance():
    # mintTokens
    # contractTokenBalance
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)
    add_provinance(
        solid_state, account, "Example Provinance", "//url.to/provinance/file"
    )
    # Act
    tx = solid_state.mintTokens({"from": account})
    tx.wait(1)
    balance = solid_state.contractTokenBalance({"from": account})
    # Assert
    assert balance == initial_token_supply
"""


def test_contract_release_tokens():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)
    send_to_account = get_account(index=1)
    # Act
    tx = solid_state.contractReleaseTokens(send_to_account, 1000, {"from": account})
    tx.wait(1)
    balance = solid_state.contractTokenBalance({"from": account})
    # Assert
    assert balance == initial_token_supply - 1000


def test_for_sale():
    # setForSaleOn()
    # setForSaleOff()
    # isForSale()
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    # Act
    forsale1 = solid_state.isForSale({"from": account})
    tx = solid_state.setForSaleOn({"from": account})
    tx.wait(1)
    forsale2 = solid_state.isForSale({"from": account})
    tx1 = solid_state.setForSaleOff({"from": account})
    tx1.wait(1)
    forsale3 = solid_state.isForSale({"from": account})
    # Assert
    assert forsale1 == False
    assert forsale2 == True
    assert forsale3 == False


def test_get_owners():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    # Act
    owners = solid_state.getOwners({"from": account})
    # Assert
    assert owners[0] == account


"""def test_get_contract_price_in_ETH():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    # Act
    tx = solid_state.getContractPriceInETH({"from": account})
    price = tx.return_value
    test_price = int(contract_sale_price * (10**18) / 2000)
    # Assert
    assert price == test_price"""


"""def test_offer_decrease_limit():
    # viewOfferDecreaseLimit
    # updateOfferDecreaseLimit
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    # Actl
    limit_1 = solid_state.viewOfferDecreaseLimit({"from": account})
    tx = solid_state.updateOfferDecreaseLimit(10, {"from": account})
    tx.wait(1)
    limit_2 = solid_state.viewOfferDecreaseLimit({"from": account})
    # Assert
    assert limit_1 == 5 and limit_2 == 10
"""
"""
def test_price_feed():
    # setPriceFeed
    # getPriceFeed
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    new_feed = "0xAc559F25B1619171CbC396a50854A3240b6A4e99"
    # Actl
    price_feed_1 = solid_state.getPriceFeed({"from": account})
    tx = solid_state.setPriceFeed(new_feed, {"from": account})
    tx.wait(1)
    price_feed_2 = solid_state.getPriceFeed({"from": account})
    # assert
    assert (
        price_feed_1 == get_contract("eth_usd_price_feed") and price_feed_2 == new_feed
    )
"""


def test_make_offer_to_buy_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)

    price = solid_state.getContractSalePrice({"from": account})
    # price = tx.return_value
    # price_fail = price / 100 * 50
    send_to_account = get_account(1)
    account_balance = account.balance()
    # Act
    # FOR SALE TEST
    with pytest.raises(exceptions.VirtualMachineError):
        tx = solid_state.makeOfferToBuyContract(
            {"from": send_to_account, "amount": price}
        )
    tx = solid_state.setForSaleOn({"from": account})
    tx.wait(1)
    # test offer fail amount
    # with pytest.raises(exceptions.VirtualMachineError):
    #    tx = solid_state.makeOfferToBuyContract(
    #        {"from": send_to_account, "amount": price_fail}
    #    )

    tx = solid_state.makeOfferToBuyContract({"from": send_to_account, "amount": price})
    owners = solid_state.getOwners({"from": account})
    # Assert
    assert owners[1] == send_to_account
    assert account_balance + price == account.balance()

    # test an owner from from the originator account will fail
    # with pytest.raises(exceptions.VirtualMachineError):
    #    solid_state.viewOfferDecreaseLimit({"from": account})
    # test new owner is can do onlyOwner Functions
    # solid_state.viewOfferDecreaseLimit({"from": send_to_account})
