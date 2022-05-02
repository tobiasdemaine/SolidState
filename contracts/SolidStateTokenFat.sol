// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SolidStateTokenFat is ERC20 {
    struct artworkMeta {
        string title;
        string artist;
        string medium;
        uint256 year;
        string dimensions;
        string mediaDataPackURI;
    }
    struct pMeta {
        string title;
        string URI;
    }

    struct buyOrder {
        address orderOwner;
        uint256 shareValue;
        uint256 ethValue;
        uint256 balance;
        OrderState state;
    }
    struct sellOrder {
        address orderOwner;
        uint256 shareValue;
        uint256 ethValue;
        uint256 balance;
        OrderState state;
    }

    enum OrderState {
        OPEN,
        CLOSED,
        CANCELLED
    }
    struct transaction {
        uint256 eth;
        uint256 share;
        uint256 buyId;
        uint256 sellId;
        address buyer;
        address seller;
        uint256 timestamp;
    }

    mapping(uint256 => transaction) private transactions;
    uint256 transactionCount = 0;

    mapping(uint256 => buyOrder) private buyOrders;
    mapping(uint256 => sellOrder) private sellOrders;
    uint256 buyOrderCount = 0;
    uint256 sellOrderCount = 0;

    mapping(uint256 => pMeta) public provinance;
    artworkMeta public artworkmeta;
    uint256 pPointer = 0;
    uint256 public initialSupply;
    uint256 private contractSalePrice;
    bool hasMinted = false;
    address private purchaserAddress;
    uint256 private purchaserOfferETH;
    uint256 private decreaseLimit = 5;
    address private PriceFeed;
    bool public forSale = false;
    AggregatorV3Interface public priceFeed;
    address[] private owners;
    uint256 ownerCount = 0;

    enum OfferState {
        FOR_SALE,
        NOT_FOR_SALE,
        OFFER_MADE,
        OFFER_ACCEPTED
    }
    OfferState public offerState;

    constructor(
        uint256 _initialSupply,
        uint256 _salePrice,
        string memory _name,
        string memory _tokenSymbol,
        address _priceFeed
    ) public ERC20(_name, _tokenSymbol) {
        initialSupply = _initialSupply;
        contractSalePrice = _salePrice;
        offerState = OfferState.NOT_FOR_SALE;
        PriceFeed = _priceFeed;
        owners.push(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owners[ownerCount]);
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function setMetaData(
        string memory _title,
        string memory _artist,
        string memory _medium,
        string memory _dimensions,
        uint256 _year,
        string memory _mediaDataPackURI
    ) public onlyOwner {
        if (bytes(_title).length != 0) {
            artworkmeta.title = _title;
        }
        if (bytes(_artist).length != 0) {
            artworkmeta.artist = _artist;
        }
        if (bytes(_medium).length != 0) {
            artworkmeta.medium = _medium;
        }
        if (bytes(_dimensions).length != 0) {
            artworkmeta.dimensions = _dimensions;
        }
        if (_year != 0) {
            artworkmeta.year = _year;
        }
        if (bytes(_mediaDataPackURI).length != 0) {
            artworkmeta.mediaDataPackURI = _mediaDataPackURI;
        }
    }

    function getMetaData() public view returns (artworkMeta memory) {
        return (artworkmeta);
    }

    function mintTokens() public onlyOwner {
        require(hasMinted == false, "Tokens Already Minted!");
        require(pPointer > 0, "Provinance must be supplied");
        _mint(address(this), initialSupply);
        hasMinted = true;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function addProvinance(string memory _title, string memory _meta)
        public
        onlyOwner
    {
        pMeta storage pmeta = provinance[pPointer];
        pmeta.title = _title;
        pmeta.URI = _meta;
        pPointer += 1;
    }

    function getProvinanceCount() public view returns (uint256) {
        return pPointer;
    }

    function getProvinanceByIndex(uint256 _index)
        public
        view
        returns (string memory, string memory)
    {
        return (provinance[_index].title, provinance[_index].URI);
    }

    function contractReleaseTokens(address _address, uint256 _value)
        public
        onlyOwner
    {
        require(
            IERC20(address(this)).balanceOf(address(this)) > _value,
            "Not Enough Tokens"
        );

        IERC20(address(this)).transfer(_address, _value);
    }

    function contractTokenBalance() public view returns (uint256) {
        return IERC20(address(this)).balanceOf(address(this));
    }

    function setForSaleOn() public onlyOwner {
        offerState = OfferState.FOR_SALE;
    }

    function setForSaleOff() public onlyOwner {
        offerState = OfferState.NOT_FOR_SALE;
    }

    function isForSale() public view returns (bool) {
        if (offerState == OfferState.FOR_SALE) {
            return true;
        } else {
            return false;
        }
    }

    function getContractPriceAsPriceFeedCurrency() public returns (uint256) {
        (uint256 price, uint256 _decimals) = getPriceFeedCurrencyValue();
        uint256 _contractSalePrice = getContractSalePrice();
        return (_contractSalePrice / 1e18) * (price / (10**_decimals));
    }

    function makeOfferToBuyContract() public payable {
        require(offerState == OfferState.FOR_SALE, "NOT FOR SALE");
        offerState = OfferState.OFFER_MADE;
        uint256 price = getContractSalePrice();
        require(msg.value == price, "Incorrect Price");
        offerState = OfferState.OFFER_ACCEPTED;
        require(
            offerState == OfferState.OFFER_ACCEPTED,
            "No Offer has been accepted!"
        );
        address payable OWNER = payable(owners[ownerCount]);
        OWNER.transfer(msg.value);
        owners.push(msg.sender);
        ownerCount += 1;
        offerState = OfferState.NOT_FOR_SALE;
    }

    function updateOfferDecreaseLimit(uint256 _percent) public onlyOwner {
        decreaseLimit = _percent;
    }

    function viewOfferDecreaseLimit() public view returns (uint256) {
        return decreaseLimit;
    }

    function setPriceFeed(address _priceFeed) public onlyOwner {
        PriceFeed = _priceFeed;
    }

    function getPriceFeed() public view onlyOwner returns (address) {
        return PriceFeed;
    }

    function getPriceFeedCurrencyValue() public returns (uint256, uint256) {
        priceFeed = AggregatorV3Interface(PriceFeed);
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 _decimals = uint256(priceFeed.decimals());
        return (uint256(price), _decimals);
    }

    function getContractSalePrice() public view returns (uint256) {
        (
            uint256[] memory eth,
            uint256[] memory share,
            ,
            ,

        ) = getTransactions();

        uint256 lastPrice = 0;
        if (eth.length > 0) {
            lastPrice = ((eth[eth.length - 1] / share[share.length - 1]) *
                initialSupply);
        } else {
            lastPrice = contractSalePrice;
        }

        return lastPrice;
    }

    function getSharePrice() public view returns (uint256) {
        (
            uint256[] memory eth,
            uint256[] memory share,
            ,
            ,

        ) = getTransactions();

        uint256 lastPrice = 0;
        if (eth.length > 0) {
            lastPrice = ((eth[eth.length - 1] / share[share.length - 1]));
        } else {
            lastPrice = contractSalePrice / initialSupply;
        }

        return lastPrice;
    }

    function balanceOfHeldShares() public view returns (uint256) {
        (
            uint256[] memory _shareValues,
            uint256[] memory _ethValues,
            uint256[] memory _balances,
            uint256[] memory _ids
        ) = getAllSellOrders();
        uint256 total = 0;
        for (uint8 j = 0; j < _balances.length; j++) {
            total += _balances[j];
        }
        return total;
    }

    function getAllBuyOrders()
        public
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint8 c = 0;
        for (uint8 j = 0; j < buyOrderCount; j++) {
            if (buyOrders[j].state == OrderState.OPEN) {
                c += 1;
            }
        }

        uint256[] memory _shareValues = new uint256[](c);
        uint256[] memory _ethValues = new uint256[](c);
        uint256[] memory _balances = new uint256[](c);
        uint256[] memory _ids = new uint256[](c);
        c = 0;
        for (uint8 j = 0; j < buyOrderCount; j++) {
            if (buyOrders[j].state == OrderState.OPEN) {
                _shareValues[c] = buyOrders[j].shareValue;
                _ethValues[c] = buyOrders[j].ethValue;
                _balances[c] = buyOrders[j].balance;
                _ids[c] = j;
                c++;
            }
        }
        return (_shareValues, _ethValues, _balances, _ids);
    }

    function getBuyOrdersByAddress(address _address)
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            OrderState[] memory,
            uint256[] memory
        )
    {
        uint8 c = 0;
        for (uint8 j = 0; j < buyOrderCount; j++) {
            if (buyOrders[j].orderOwner == _address) {
                c++;
            }
        }
        address[] memory _orderOwners = new address[](c);
        uint256[] memory _shareValues = new uint256[](c);
        uint256[] memory _ethValues = new uint256[](c);
        uint256[] memory _balances = new uint256[](c);
        uint256[] memory _ids = new uint256[](c);
        OrderState[] memory _states = new OrderState[](c);
        c = 0;
        for (uint8 j = 0; j < buyOrderCount; j++) {
            if (buyOrders[j].orderOwner == _address) {
                _orderOwners[c] = buyOrders[j].orderOwner;
                _shareValues[c] = buyOrders[j].shareValue;
                _ethValues[c] = buyOrders[j].ethValue;
                _balances[c] = buyOrders[j].balance;

                _ids[c] = j;
                _states[c] = buyOrders[j].state;
                c++;
            }
        }
        return (
            _orderOwners,
            _shareValues,
            _ethValues,
            _balances,
            _states,
            _ids
        );
    }

    function getAllSellOrders()
        public
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint8 c = 0;
        for (uint8 j = 0; j < sellOrderCount; j++) {
            if (sellOrders[j].state == OrderState.OPEN) {
                c++;
            }
        }
        uint256[] memory _shareValues = new uint256[](c);
        uint256[] memory _ethValues = new uint256[](c);
        uint256[] memory _balances = new uint256[](c);
        uint256[] memory _ids = new uint256[](c);
        c = 0;
        for (uint8 j = 0; j < sellOrderCount; j++) {
            if (sellOrders[j].state == OrderState.OPEN) {
                _shareValues[c] = sellOrders[j].shareValue;
                _ethValues[c] = sellOrders[j].ethValue;
                _balances[c] = sellOrders[j].balance;
                _ids[c] = j;
                c++;
            }
        }
        return (_shareValues, _ethValues, _balances, _ids);
    }

    function getSellOrdersByAddress(address _address)
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            OrderState[] memory,
            uint256[] memory
        )
    {
        uint8 c = 0;
        for (uint8 j = 0; j < sellOrderCount; j++) {
            if (sellOrders[j].orderOwner == _address) {
                c++;
            }
        }
        address[] memory _orderOwners = new address[](c);
        uint256[] memory _shareValues = new uint256[](c);
        uint256[] memory _ethValues = new uint256[](c);
        uint256[] memory _balances = new uint256[](c);
        uint256[] memory _ids = new uint256[](c);
        OrderState[] memory _states = new OrderState[](c);
        c = 0;
        for (uint8 j = 0; j < sellOrderCount; j++) {
            if (sellOrders[j].orderOwner == _address) {
                _orderOwners[c] = sellOrders[j].orderOwner;
                _shareValues[c] = sellOrders[j].shareValue;
                _ethValues[c] = sellOrders[j].ethValue;
                _balances[c] = sellOrders[j].balance;
                _states[c] = sellOrders[j].state;
                _ids[c] = j;
                c++;
            }
        }
        return (
            _orderOwners,
            _shareValues,
            _ethValues,
            _balances,
            _states,
            _ids
        );
    }

    function placeBuyOrder(uint256 shareValue, uint256 ethValue)
        public
        payable
        returns (uint256)
    {
        require(shareValue > 0, "share value can not be 0");
        require(ethValue > 0, "share value can not be 0");

        require((msg.value / shareValue) == ethValue, "can not make order");
        buyOrders[buyOrderCount] = buyOrder(
            msg.sender,
            shareValue,
            ethValue,
            msg.value,
            OrderState.OPEN
        );

        fillBuyOrder(buyOrderCount);
        buyOrderCount += 1;
        return buyOrderCount - 1;
    }

    function placeSellOrder(uint256 shareValue, uint256 ethValue)
        public
        returns (uint256)
    {
        require(shareValue > 0, "share value can not be 0");
        require(ethValue > 0, "share value can not be 0");
        IERC20(address(this)).transferFrom(
            msg.sender,
            address(this),
            shareValue
        );
        sellOrders[sellOrderCount] = sellOrder(
            msg.sender,
            shareValue,
            ethValue,
            shareValue,
            OrderState.OPEN
        );

        fillSellOrder(sellOrderCount);
        sellOrderCount += 1;
        return sellOrderCount - 1;
    }

    function cancelBuyOrder(uint256 id) public {
        require(
            buyOrders[id].orderOwner == msg.sender,
            "msg.sender is not order owner"
        );
        require(buyOrders[id].state == OrderState.OPEN, "order is not open");

        address payable payee = payable(msg.sender);
        payee.transfer(buyOrders[id].balance);
        buyOrders[id].balance = 0;
        buyOrders[id].state = OrderState.CANCELLED;
    }

    function cancelSellOrder(uint256 id) public {
        require(
            sellOrders[id].orderOwner == msg.sender,
            "msg.sender is not order owner"
        );
        require(sellOrders[id].state == OrderState.OPEN, "order is not open");

        sellOrders[id].state = OrderState.CANCELLED;
        IERC20(address(this)).transfer(
            sellOrders[id].orderOwner,
            sellOrders[id].balance
        );
        sellOrders[id].balance = 0;
    }

    function getHeldShares() public view returns (uint256) {
        uint256 heldShares = 0;
        for (uint8 j = 0; j < sellOrderCount; j++) {
            heldShares += sellOrders[j].balance;
        }
        return heldShares;
    }

    function getHeldETH() public view returns (uint256) {
        uint256 heldETH = 0;
        for (uint8 j = 0; j < buyOrderCount; j++) {
            heldETH += buyOrders[j].balance;
        }
        return heldETH;
    }

    function fillBuyOrder(uint256 bc) private {
        for (uint8 j = 0; j < sellOrderCount; j++) {
            if (sellOrders[j].state == OrderState.OPEN) {
                if (buyOrders[bc].state == OrderState.OPEN) {
                    if (sellOrders[j].ethValue == buyOrders[bc].ethValue) {
                        address payable seller = payable(
                            sellOrders[j].orderOwner
                        );
                        uint256 transferAmount = 0;
                        if (sellOrders[j].balance >= buyOrders[bc].shareValue) {
                            sellOrders[j].balance =
                                sellOrders[j].balance -
                                buyOrders[bc].shareValue;

                            transferAmount = buyOrders[bc].shareValue;

                            buyOrders[bc].balance = 0;
                            buyOrders[bc].shareValue = 0;

                            buyOrders[bc].state = OrderState.CLOSED;

                            if (sellOrders[j].balance == 0) {
                                sellOrders[j].state = OrderState.CLOSED;
                            }
                        } else {
                            buyOrders[bc].balance =
                                buyOrders[bc].balance -
                                (sellOrders[j].ethValue *
                                    sellOrders[j].balance);

                            buyOrders[bc].shareValue =
                                buyOrders[bc].shareValue -
                                sellOrders[j].balance;

                            transferAmount = sellOrders[j].balance;

                            sellOrders[j].balance = 0;
                            sellOrders[j].state = OrderState.CLOSED;
                            if (buyOrders[bc].balance == 0) {
                                buyOrders[bc].state = OrderState.CLOSED;
                            }
                        }
                        seller.transfer(
                            buyOrders[bc].ethValue * transferAmount
                        );

                        IERC20(address(this)).transfer(
                            buyOrders[bc].orderOwner,
                            transferAmount
                        );
                        orderTransaction(
                            buyOrders[bc].ethValue * transferAmount,
                            transferAmount,
                            bc,
                            j,
                            buyOrders[bc].orderOwner,
                            sellOrders[j].orderOwner
                        );
                    }
                }
            }
        }
    }

    function fillSellOrder(uint256 sc) private {
        for (uint8 j = 0; j < buyOrderCount; j++) {
            if (sellOrders[sc].state == OrderState.OPEN) {
                if (buyOrders[j].state == OrderState.OPEN) {
                    if (sellOrders[sc].ethValue == buyOrders[j].ethValue) {
                        address payable seller = payable(
                            sellOrders[sc].orderOwner
                        );
                        uint256 transferAmount = 0;
                        if (sellOrders[sc].balance >= buyOrders[j].shareValue) {
                            sellOrders[sc].balance =
                                sellOrders[sc].balance -
                                buyOrders[j].shareValue;

                            transferAmount = buyOrders[j].shareValue;

                            buyOrders[j].balance = 0;
                            buyOrders[j].shareValue = 0;

                            buyOrders[j].state = OrderState.CLOSED;

                            if (sellOrders[sc].balance == 0) {
                                sellOrders[sc].state = OrderState.CLOSED;
                            }
                        } else {
                            buyOrders[j].balance =
                                buyOrders[j].balance -
                                (sellOrders[sc].ethValue *
                                    sellOrders[sc].balance);

                            transferAmount = sellOrders[sc].balance;
                            buyOrders[j].shareValue =
                                buyOrders[j].shareValue -
                                sellOrders[sc].balance;

                            sellOrders[sc].balance = 0;
                            sellOrders[sc].state = OrderState.CLOSED;
                            if (buyOrders[j].balance == 0) {
                                buyOrders[j].state = OrderState.CLOSED;
                            }
                        }

                        seller.transfer(buyOrders[j].ethValue * transferAmount);
                        IERC20(address(this)).transfer(
                            buyOrders[j].orderOwner,
                            transferAmount
                        );
                        orderTransaction(
                            buyOrders[j].ethValue * transferAmount,
                            transferAmount,
                            j,
                            sc,
                            buyOrders[j].orderOwner,
                            sellOrders[sc].orderOwner
                        );
                    }
                    // }
                }
            }
        }
    }

    function orderTransaction(
        uint256 eth,
        uint256 share,
        uint256 buyId,
        uint256 sellId,
        address buyer,
        address seller
    ) internal {
        transactions[transactionCount].eth = eth;
        transactions[transactionCount].share = share;
        transactions[transactionCount].timestamp = block.timestamp;
        transactions[transactionCount].buyId = buyId;
        transactions[transactionCount].sellId = sellId;
        transactions[transactionCount].buyer = buyer;
        transactions[transactionCount].seller = seller;
        transactionCount++;
    }

    function getTransactions()
        public
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            address[] memory,
            address[] memory
        )
    {
        uint256 c = 0;
        for (uint8 j = 0; j < transactionCount; j++) {
            c++;
        }
        uint256[] memory eth = new uint256[](c);
        uint256[] memory share = new uint256[](c);
        uint256[] memory timestamp = new uint256[](c);
        address[] memory buyer = new address[](c);
        address[] memory seller = new address[](c);
        c = 0;
        for (uint8 j = 0; j < transactionCount; j++) {
            eth[c] = transactions[j].eth;
            share[c] = transactions[j].share;
            timestamp[c] = transactions[j].timestamp;
            buyer[c] = transactions[j].buyer;
            seller[c] = transactions[j].seller;
            c++;
        }
        return (eth, share, timestamp, buyer, seller);
    }
}
