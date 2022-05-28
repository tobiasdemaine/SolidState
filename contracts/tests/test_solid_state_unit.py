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


def test_artwork_trade():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")

    (solid_state, account) = deploy_solid_state_token()
    set_meta_data(solid_state, account)
    #    pfcurrency = solid_state.getContractPriceAsPriceFeedCurrency({"from": account})
    #    assert pfcurrency.return_value == 20000
    original_price = solid_state.getContractSalePrice({"from": account})
    original_share_price = solid_state.getSharePrice({"from": account})
    account_1 = get_account(index=1)
    account_2 = get_account(index=2)
    account_3_buy = get_account(index=3)
    account_4_buy = get_account(index=4)
    account_5_buy = get_account(index=5)
    balance_1 = solid_state.contractTokenBalance({"from": account})
    tx = solid_state.contractReleaseTokens(account_1.address, 1000, {"from": account})
    tx.wait(1)
    tx = solid_state.contractReleaseTokens(account_2.address, 1000, {"from": account})
    tx.wait(1)
    balance_2 = solid_state.contractTokenBalance({"from": account})
    buy_order_id_1 = solid_state.placeBuyOrder(
        10,
        Web3.toWei(0.001, "ether"),
        {"from": account_3_buy, "amount": 10 * Web3.toWei(0.001, "ether")},
    )
    buy_order_id_2 = solid_state.placeBuyOrder(
        10,
        Web3.toWei(0.00099, "ether"),
        {"from": account_4_buy, "amount": 10 * Web3.toWei(0.00099, "ether")},
    )
    buy_order_id_3 = solid_state.placeBuyOrder(
        10,
        Web3.toWei(0.00099, "ether"),
        {"from": account_5_buy, "amount": 10 * Web3.toWei(0.00099, "ether")},
    )

    b1 = solid_state.balanceOf(account_1.address, {"from": account_1})
    b2 = solid_state.balanceOf(account_2.address, {"from": account_2})
    print(b1, b2)
    solid_state.approve(solid_state.address, 5, {"from": account_1})
    sell_order_id_1 = solid_state.placeSellOrder(
        5, Web3.toWei(0.0011, "ether"), {"from": account_1}
    )

    solid_state.approve(solid_state.address, 5, {"from": account_2})
    sell_order_id_2 = solid_state.placeSellOrder(
        5, Web3.toWei(0.0011, "ether"), {"from": account_2}
    )
    solid_state.approve(solid_state.address, 7, {"from": account_2})
    sell_order_id_3 = solid_state.placeSellOrder(
        7, Web3.toWei(0.0012, "ether"), {"from": account_2}
    )
    b1 = solid_state.balanceOf(account_1.address, {"from": account_1})
    b2 = solid_state.balanceOf(account_2.address, {"from": account_2})
    print(b1, b2)

    (_share_values, _eth_values, _balances, _ids) = solid_state.getAllBuyOrders(
        {"from": account}
    )
    assert _balances[2] == 10 * Web3.toWei(0.00099, "ether")

    (
        _share_values,
        _eth_values,
        _balances,
        _ids,
    ) = solid_state.getAllSellOrders({"from": account})
    assert _balances[2] == 7
    assert _eth_values[1] == Web3.toWei(0.0011, "ether")
    held_shares = solid_state.getHeldShares({"from": account})
    assert (balance_2 + held_shares) == balance_1 - 1983
    held_eth = solid_state.getHeldETH({"from": account})

    assert held_eth == 20 * Web3.toWei(0.00099, "ether") + 10 * Web3.toWei(
        0.001, "ether"
    )
    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getSellOrdersByAddress(account_2.address, {"from": account_2})
    assert _balances[1] == 7
    assert _ids[1] == sell_order_id_3.return_value

    tx = solid_state.cancelSellOrder(sell_order_id_3.return_value, {"from": account_2})

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getSellOrdersByAddress(account_2.address, {"from": account_2})

    assert _balances[1] == 0
    assert _states[1] == 2

    # place successfull buy order
    held_shares_1 = solid_state.getHeldShares({"from": account})

    tx = solid_state.placeBuyOrder(
        1,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": 1 * Web3.toWei(0.0011, "ether")},
    )

    held_shares_2 = solid_state.getHeldShares({"from": account})

    assert held_shares_1 == held_shares_2 + 1

    # place buy order over 2 sell orders
    tx = solid_state.placeBuyOrder(
        5,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": (5 * Web3.toWei(0.0011, "ether"))},
    )

    held_shares_3 = solid_state.getHeldShares({"from": account})
    assert held_shares_3 == held_shares_2 - 5

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getSellOrdersByAddress(account_2.address, {"from": account_2})

    # assert _balances[0] == 0
    assert _balances[0] == 4

    # successfull sell orders

    held_eth_1 = solid_state.getHeldETH({"from": account})
    solid_state.approve(solid_state.address, 5, {"from": account_2})

    tx = solid_state.placeSellOrder(
        5, Web3.toWei(0.00099, "ether"), {"from": account_2}
    )

    held_eth_2 = solid_state.getHeldETH({"from": account})

    assert held_eth_1 == (held_eth_2 + (5 * Web3.toWei(0.00099, "ether")))

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getBuyOrdersByAddress(
        account_4_buy.address, {"from": account_4_buy}
    )
    assert _balances[0] == (5 * Web3.toWei(0.00099, "ether"))

    # printData(solid_state, account)
    solid_state.approve(solid_state.address, 6, {"from": account_2})
    tx = solid_state.placeSellOrder(
        6, Web3.toWei(0.00099, "ether"), {"from": account_2}
    )

    # printData(solid_state, account)

    held_eth_3 = solid_state.getHeldETH({"from": account})

    assert held_eth_2 == held_eth_3 + (6 * Web3.toWei(0.00099, "ether"))
    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getBuyOrdersByAddress(
        account_4_buy.address, {"from": account_4_buy}
    )

    assert _balances[0] == 0

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getBuyOrdersByAddress(
        account_5_buy.address, {"from": account_5_buy}
    )

    assert _balances[0] == (9 * Web3.toWei(0.00099, "ether"))

    tx = solid_state.cancelBuyOrder(
        buy_order_id_3.return_value, {"from": account_5_buy}
    )

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state.getBuyOrdersByAddress(
        account_5_buy.address, {"from": account_5_buy}
    )

    assert _balances[0] == 0
    assert _states[0] == 2
    ##assert solid_state.balance() == solid_state.getHeldETH(
    #     {"from": account}
    # )
    solid_state.approve(solid_state.address, 11, {"from": account_1})
    tx = solid_state.placeSellOrder(11, Web3.toWei(0.001, "ether"), {"from": account_1})
    (
        _share_values,
        _eth_values,
        _balances,
        _ids,
    ) = solid_state.getAllSellOrders({"from": account})
    assert _balances[1] == 1
    tx = solid_state.placeBuyOrder(
        9,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": (9 * Web3.toWei(0.0011, "ether"))},
    )

    (_share_values, _eth_values, _balances, _ids) = solid_state.getAllBuyOrders(
        {"from": account}
    )

    (
        eth,
        share,
        timestamp,
        buyer,
        seller,
    ) = solid_state.getTransactions({"from": account})
    print(eth)
    print(share)
    # print(timestamp)
    # print(buyer)
    # print(seller)

    new_price = solid_state.getContractSalePrice({"from": account})

    total_supply = solid_state.totalSupply()
    price = int(0.0011 * 1e18) * total_supply

    print(original_price, new_price, price)

    assert new_price == price
    assert original_price != new_price

    share_price = solid_state.getSharePrice({"from": account})

    assert original_share_price == original_price / total_supply
    assert share_price == new_price / total_supply
    print(
        original_share_price,
        share_price,
    )
    assert _share_values[0] == 5
