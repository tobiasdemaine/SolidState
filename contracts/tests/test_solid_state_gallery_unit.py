from scripts.deploy import (
    deploy_solid_state_token,
    deploy_solid_state_gallery,
    mint_tokens,
    add_provinance,
    set_meta_data,
    initial_token_supply,
    contract_sale_price,
)
from scripts.helpers import (
    get_account,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
)
from brownie import network, exceptions
import pytest
from web3 import Web3

# owner functions
#      newOwner(address _newOwnerAddress) public onlyOwner
#      addArtWork(address _artWorkAddress) public onlyOwner
#      setArtWorkVisibility(address _artWorkContractAddress, bool _visibility) public onlyOwner
#      getAllArtWorks() public view onlyOwner returns (address[] memory, bool[] memory)
#

# public functions
#      getOwners() public view returns (address[] memory)
#      getArtWorks() public view returns (address[] memory)


def test_collections():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    # act
    tx = solid_state_gallery.addCollection("Test Collection", {"from": account})
    tx = solid_state_gallery.addCollection("Test Collection 2", {"from": account})
    # assert
    with pytest.raises(exceptions.VirtualMachineError):
        tx = solid_state_gallery.addCollection("Test Collection", {"from": account})
    # act
    collectionId = solid_state_gallery.getCollectionIdByName(
        "Test Collection 2", {"from": account}
    )
    # assert
    assert collectionId == 1
    with pytest.raises(exceptions.VirtualMachineError):
        tx = solid_state_gallery.getCollectionIdByName(
            "No Collection", {"from": account}
        )

    (solid_state_artwork_0, account) = deploy_solid_state_token()
    (solid_state_artwork_1, account) = deploy_solid_state_token()
    (solid_state_artwork_2, account) = deploy_solid_state_token()
    # act
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_0.address, collectionId, {"from": account}
    )
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_1.address, collectionId, {"from": account}
    )
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_2.address, 0, {"from": account}
    )
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_artwork_2.address, True, {"from": account}
    )
    # assert

    artworks, visibility = solid_state_gallery.getAllArtWorksByCollectionId(
        collectionId, {"from": account}
    )

    assert artworks[0] == solid_state_artwork_0.address
    assert artworks[1] == solid_state_artwork_1.address

    # act

    artworks = solid_state_gallery.getArtWorksByCollectionId(0, {"from": account})
    # assert
    print(artworks)
    assert artworks[0] == solid_state_artwork_2.address

    # act
    collections = solid_state_gallery.getCollections({"from": account})
    print(collections)
    assert collections[1] == "Test Collection 2"


def test_add_artwork():
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_artwork, account) = deploy_solid_state_token()
    (solid_state_gallery, account) = deploy_solid_state_gallery()

    # act
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork.address, 0, {"from": account}
    )

    # assert
    with pytest.raises(exceptions.VirtualMachineError):
        tx = solid_state_gallery.addArtWork(
            solid_state_artwork.address, 0, {"from": account}
        )


def test_get_all_artworks():
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_artwork_0, account) = deploy_solid_state_token()
    (solid_state_artwork_1, account) = deploy_solid_state_token()
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    # act
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_0.address, 0, {"from": account}
    )
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_1.address, 0, {"from": account}
    )
    artworks, visibility = solid_state_gallery.getAllArtWorks({"from": account})
    # assert
    assert artworks[0] == solid_state_artwork_0.address
    assert artworks[1] == solid_state_artwork_1.address


def test_set_artwork_visibility():
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_artwork_0, account) = deploy_solid_state_token()
    (solid_state_artwork_1, account) = deploy_solid_state_token()
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_0.address, 0, {"from": account}
    )
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_1.address, 0, {"from": account}
    )
    # act
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_artwork_1.address, True, {"from": account}
    )
    artworks, visibility = solid_state_gallery.getAllArtWorks({"from": account})
    # assert
    assert visibility[0] == False
    assert visibility[1] == True


def test_set_owners():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_gallery()
    new_owner = get_account(1)
    # Act
    tx = solid_state.newOwner(new_owner, {"from": account})
    owners = solid_state.getOwners({"from": account})

    # Assert
    assert owners[0] == account
    assert owners[1] == new_owner


def test_get_owners():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state, account) = deploy_solid_state_gallery()
    # Act
    owners = solid_state.getOwners({"from": account})
    # Assert
    assert owners[0] == account


def test_get_artworks():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_artwork_0, account) = deploy_solid_state_token()
    (solid_state_artwork_1, account) = deploy_solid_state_token()
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_0.address, 0, {"from": account}
    )
    tx = solid_state_gallery.addArtWork(
        solid_state_artwork_1.address, 0, {"from": account}
    )
    # act
    tx = solid_state_gallery.setArtWorkVisibility(
        solid_state_artwork_1.address, True, {"from": account}
    )
    artworks = solid_state_gallery.getArtWorks({"from": account})
    # assert
    assert artworks[0] == solid_state_artwork_1.address


def old_test_trade_functions():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    (solid_state_1, account) = deploy_solid_state_token()
    set_meta_data(solid_state_1, account)
    add_provinance(
        solid_state_1, account, "Example Provinance", "//url.to/provinance/file"
    )
    mint_tokens(solid_state_1, account)
    (solid_state_2, account) = deploy_solid_state_token()
    set_meta_data(solid_state_2, account)
    add_provinance(
        solid_state_2, account, "Example Provinance", "//url.to/provinance/file"
    )
    mint_tokens(solid_state_2, account)
    (solid_state_gallery, account) = deploy_solid_state_gallery()
    tx = solid_state_gallery.addArtWork(solid_state_1.address, 0, {"from": account})
    tx = solid_state_gallery.addArtWork(solid_state_2.address, 0, {"from": account})
    artork_trade(solid_state_1, account, solid_state_gallery)
    artork_trade(solid_state_2, account, solid_state_gallery)

    a = solid_state_gallery.getHeldETH(solid_state_1.address, {"from": account})
    b = solid_state_gallery.getHeldETH(solid_state_2.address, {"from": account})
    c = solid_state_gallery.balance()
    assert a + b == c

    a = solid_state_gallery.getHeldShares(solid_state_1.address, {"from": account})
    b = solid_state_gallery.getHeldShares(solid_state_2.address, {"from": account})
    c = solid_state_1.balanceOf(solid_state_gallery, {"from": account})
    d = solid_state_2.balanceOf(solid_state_gallery, {"from": account})
    assert a + b == c + d


def artork_trade(solid_state, account, solid_state_gallery):

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
    buy_order_id_1 = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        10,
        Web3.toWei(0.001, "ether"),
        {"from": account_3_buy, "amount": 10 * Web3.toWei(0.001, "ether")},
    )
    buy_order_id_2 = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        10,
        Web3.toWei(0.00099, "ether"),
        {"from": account_4_buy, "amount": 10 * Web3.toWei(0.00099, "ether")},
    )
    buy_order_id_3 = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        10,
        Web3.toWei(0.00099, "ether"),
        {"from": account_5_buy, "amount": 10 * Web3.toWei(0.00099, "ether")},
    )

    b1 = solid_state.balanceOf(account_1.address, {"from": account_1})
    b2 = solid_state.balanceOf(account_2.address, {"from": account_2})
    print(b1, b2)
    solid_state.approve(solid_state_gallery.address, 5, {"from": account_1})
    sell_order_id_1 = solid_state_gallery.placeSellOrder(
        solid_state.address, 5, Web3.toWei(0.0011, "ether"), {"from": account_1}
    )

    solid_state.approve(solid_state_gallery.address, 5, {"from": account_2})
    sell_order_id_2 = solid_state_gallery.placeSellOrder(
        solid_state.address, 5, Web3.toWei(0.0011, "ether"), {"from": account_2}
    )
    solid_state.approve(solid_state_gallery.address, 7, {"from": account_2})
    sell_order_id_3 = solid_state_gallery.placeSellOrder(
        solid_state.address, 7, Web3.toWei(0.0012, "ether"), {"from": account_2}
    )
    b1 = solid_state.balanceOf(account_1.address, {"from": account_1})
    b2 = solid_state.balanceOf(account_2.address, {"from": account_2})
    print(b1, b2)

    (_share_values, _eth_values, _balances, _ids) = solid_state_gallery.getAllBuyOrders(
        solid_state.address, {"from": account}
    )
    assert _balances[2] == 10 * Web3.toWei(0.00099, "ether")

    (
        _share_values,
        _eth_values,
        _balances,
        _ids,
    ) = solid_state_gallery.getAllSellOrders(solid_state.address, {"from": account})
    assert _balances[2] == 7
    assert _eth_values[1] == Web3.toWei(0.0011, "ether")
    held_shares = solid_state_gallery.getHeldShares(
        solid_state.address, {"from": account}
    )
    assert (balance_2 + held_shares) == balance_1 - 1983
    held_eth = solid_state_gallery.getHeldETH(solid_state.address, {"from": account})

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
    ) = solid_state_gallery.getSellOrdersByAddress(
        solid_state.address, account_2.address, {"from": account_2}
    )
    assert _balances[1] == 7
    assert _ids[1] == sell_order_id_3.return_value

    tx = solid_state_gallery.cancelSellOrder(
        sell_order_id_3.return_value, {"from": account_2}
    )

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getSellOrdersByAddress(
        solid_state.address, account_2.address, {"from": account_2}
    )

    assert _balances[1] == 0
    assert _states[1] == 2

    # place successfull buy order
    held_shares_1 = solid_state_gallery.getHeldShares(
        solid_state.address, {"from": account}
    )

    tx = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        1,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": 1 * Web3.toWei(0.0011, "ether")},
    )

    held_shares_2 = solid_state_gallery.getHeldShares(
        solid_state.address, {"from": account}
    )

    assert held_shares_1 == held_shares_2 + 1

    # place buy order over 2 sell orders
    tx = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        5,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": (5 * Web3.toWei(0.0011, "ether"))},
    )

    held_shares_3 = solid_state_gallery.getHeldShares(
        solid_state.address, {"from": account}
    )
    assert held_shares_3 == held_shares_2 - 5

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getSellOrdersByAddress(
        solid_state.address, account_2.address, {"from": account_2}
    )

    # assert _balances[0] == 0
    assert _balances[0] == 4

    # successfull sell orders

    held_eth_1 = solid_state_gallery.getHeldETH(solid_state.address, {"from": account})
    solid_state.approve(solid_state_gallery.address, 5, {"from": account_2})

    tx = solid_state_gallery.placeSellOrder(
        solid_state.address, 5, Web3.toWei(0.00099, "ether"), {"from": account_2}
    )

    held_eth_2 = solid_state_gallery.getHeldETH(solid_state.address, {"from": account})

    assert held_eth_1 == (held_eth_2 + (5 * Web3.toWei(0.00099, "ether")))

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getBuyOrdersByAddress(
        solid_state.address, account_4_buy.address, {"from": account_4_buy}
    )
    assert _balances[0] == (5 * Web3.toWei(0.00099, "ether"))

    # printData(solid_state, account)
    solid_state.approve(solid_state_gallery.address, 6, {"from": account_2})
    tx = solid_state_gallery.placeSellOrder(
        solid_state.address, 6, Web3.toWei(0.00099, "ether"), {"from": account_2}
    )

    # printData(solid_state, account)

    held_eth_3 = solid_state_gallery.getHeldETH(solid_state.address, {"from": account})

    assert held_eth_2 == held_eth_3 + (6 * Web3.toWei(0.00099, "ether"))
    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getBuyOrdersByAddress(
        solid_state.address, account_4_buy.address, {"from": account_4_buy}
    )

    assert _balances[0] == 0

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getBuyOrdersByAddress(
        solid_state.address, account_5_buy.address, {"from": account_5_buy}
    )

    assert _balances[0] == (9 * Web3.toWei(0.00099, "ether"))

    tx = solid_state_gallery.cancelBuyOrder(
        buy_order_id_3.return_value, {"from": account_5_buy}
    )

    (
        _orderOwners,
        _shareValues,
        _ethValues,
        _balances,
        _states,
        _ids,
    ) = solid_state_gallery.getBuyOrdersByAddress(
        solid_state.address, account_5_buy.address, {"from": account_5_buy}
    )

    assert _balances[0] == 0
    assert _states[0] == 2
    ##assert solid_state.balance() == solid_state_gallery.getHeldETH(
    #    solid_state.address, {"from": account}
    # )
    solid_state.approve(solid_state_gallery.address, 11, {"from": account_1})
    tx = solid_state_gallery.placeSellOrder(
        solid_state.address, 11, Web3.toWei(0.001, "ether"), {"from": account_1}
    )
    (
        _share_values,
        _eth_values,
        _balances,
        _ids,
    ) = solid_state_gallery.getAllSellOrders(solid_state.address, {"from": account})
    assert _balances[1] == 1
    tx = solid_state_gallery.placeBuyOrder(
        solid_state.address,
        9,
        Web3.toWei(0.0011, "ether"),
        {"from": account_3_buy, "amount": (9 * Web3.toWei(0.0011, "ether"))},
    )

    (_share_values, _eth_values, _balances, _ids) = solid_state_gallery.getAllBuyOrders(
        solid_state.address, {"from": account}
    )

    (
        eth,
        share,
        timestamp,
        buyer,
        seller,
    ) = solid_state_gallery.getTransactions(solid_state.address, {"from": account})
    print(eth)
    print(share)
    print(timestamp)
    print(buyer)
    print(seller)

    assert _share_values[0] == 5

    return solid_state_gallery
