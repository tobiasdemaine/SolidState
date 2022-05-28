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
