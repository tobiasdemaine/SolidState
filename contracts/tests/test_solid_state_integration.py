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
