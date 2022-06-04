var crypto = require("crypto");
const { exit } = require("process");

async function clickElement(page, selector) {
    await page.bringToFront();
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    await element.click();
}

function enableSlowMo(page, delay) {
    const origin = page._client._onMessage;
    page._client._onMessage = async (...args) => {
        await new Promise(x => setTimeout(x, delay));
        return origin.call(page._client, ...args);
    }
}

async function delay(time) {
    await new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
    return true
}

const waitForTextChange = async (
    page,
    elOrSel,
    opts = { polling: "mutation", timeout: 30000 }
) => {
    const el = typeof elOrSel === "string"
        ? await page.$(elOrSel) : elOrSel
        ;
    const originalText = await el.evaluate(el => el.textContent);
    return page.waitForFunction(
        (el, originalText) => el.textContent !== originalText,
        opts, el, originalText,
    );
};

describe('Solid State Owner', () => {
    it('should switch network, localhost', async () => {

        await metamask.addNetwork({
            networkName: 'localhost8545',
            rpc: 'http://127.0.0.1:8545/',
            chainId: 1337,
            symbol: 'ETH',
            explorer: '',
        })
        await metamask.importPK('d94c9b5afae922f473403dca098d47019f47fa03c1038a7ee7e049831fe4bb24');
        await metamask.importPK('bd152130487a1e74a6e2713637518ab68ab14e4bec4e33f248de3aeb15c20438');
        await metamask.importPK('8e7d92482a732107d0e134a99ca4fd7e62baac8c2aba930c5c7033c40f11518b');
        await metamask.switchAccount(2);
        await metamask.switchNetwork('localhost8545');

        const selectedNetwork = await metamask.page.evaluate(
            () => (document.querySelector('.network-display > span:nth-child(2)')).innerHTML,
        );
        expect(selectedNetwork).toEqual('localhost8545');
    })
    it('should be titled "Solid State"', async () => {

        await page.setViewport({ width: 1280, height: 900 })

        await page.bringToFront();
        await page.goto('http://127.0.0.1:3000')
        await expect(page.title()).resolves.toMatch('Solid State');

    })
    it('should be connected', async () => {
        await clickElement(page, '#connectButton')

        await metamask.page.bringToFront();
        await metamask.page.reload();

        const checkbox0 = await metamask.page.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__accounts-list > div:nth-child(3) > div > input");
        await checkbox0.click()

        const checkbox1 = await metamask.page.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__accounts-list > div:nth-child(4) > div > input");
        await checkbox1.click()

        const button = await metamask.page.waitForSelector('button.button.btn-primary');
        await button.click();

        const connectButton = await metamask.page.waitForSelector('button.button.btn-primary');
        await connectButton.click();

        await page.bringToFront();
        await page.waitForSelector('#dash-positioned-button');
    })
    it('should navigate to add a Collection', async () => {
        await clickElement(page, '#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(1)')

        const element = await page.waitForSelector('header > div > div');
        const value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(' Add Collection');
    })
    it('should write a Collection Name to the text input', async () => {
        testVars["collectionName"] = crypto.randomBytes(10).toString('hex');
        await page.type('#collectionName', testVars["collectionName"], { delay: 20 })
    })
    it('should submit form', async () => {

        await clickElement(page, '#collectionNameSubmit')

        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
    })
    it('should locate New Collection name on page', async () => {
        const text = testVars["collectionName"];
        await page.waitForFunction(
            text => document.querySelector('body').innerText.includes(text),
            {},
            text
        );
    })
    it('should navigate to add artWork', async () => {
        await page.bringToFront();
        //
        //enableSlowMo(metamask.page, 500)
        //enableSlowMo(page, 40)
        await delay(500)
        await clickElement(page, '#dash-positioned-button');
        await delay(500)
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(2)')
        //enableSlowMo(page, 0)
        const element = await page.waitForSelector('header > div > div');
        const value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(' Add');
    })
    it('it should sumbit form to error ', async () => {
        await clickElement(page, '#addSubmit');
        var element = await page.waitForSelector('#title');
        var value = await element.evaluate(el => el.getAttribute("aria-invalid"))
        expect(value).toEqual('true');
    })
    it('it should fill in form text inputs', async () => {
        // prepare form
        testVars["title"] = crypto.randomBytes(7).toString('hex');
        testVars["artist"] = crypto.randomBytes(7).toString('hex');
        testVars["medium"] = crypto.randomBytes(10).toString('hex');
        testVars["dimensions"] = crypto.randomBytes(8).toString('hex');
        testVars["year"] = crypto.randomBytes(4).toString('hex');
        testVars["price"] = "20";
        testVars["supply"] = "100000";
        testVars["symbol"] = crypto.randomBytes(4).toString('hex');
        //fill in form
        await page.type('#title', testVars["title"], { delay: 20 })
        await page.type('#artist', testVars["artist"], { delay: 20 })
        await page.type('#medium', testVars["medium"], { delay: 20 })
        await page.type('#dimensions', testVars["dimensions"], { delay: 20 })
        await page.type('#year', testVars["year"], { delay: 20 })
        await page.type('#price', testVars["price"], { delay: 20 })
        await page.type('#supply', testVars["supply"], { delay: 20 })
        await page.type('#symbol', testVars["symbol"], { delay: 20 })

    })
    it('it should add secret key', async () => {
        testVars["secret"] = 'password';
        await page.type('#secret', testVars["secret"], { delay: 20 })
    })
    it('it should select new collection name forms mui select', async () => {
        await clickElement(page, '#collection');
        var success = false;
        var element = undefined;
        const lis = await page.$$('#menu-collection > div > ul > li')
        for (var i = 0; i < lis.length; i++) {
            let valueHandle = await lis[i].getProperty('innerText');
            let liText = await valueHandle.jsonValue();
            if (testVars["collectionName"] == liText) {
                success = true;
                element = lis[i];
            }
        }
        expect(success).toEqual(true);
        expect(element).not.toEqual(undefined);
        await element.click();
        element = await page.waitForSelector('#collection');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["collectionName"]);
    })
    it('it should submit form to error no image ', async () => {
        await delay(1000)
        await clickElement(page, '#addSubmit');
        await delay(1000)
        await page.waitForSelector('#errorNoImage');

    })
    it('it should attach an image', async () => {
        const filePath = __dirname + "/test.jpg";
        await page.waitForSelector('input[type=file]');
        const fileInput = await page.$('input[type=file]');
        await fileInput.uploadFile(filePath);
        await fileInput.evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true })));
        await page.waitForSelector('#img_0');
    })
    it('it should add text to image', async () => {
        testVars["image0Text"] = crypto.randomBytes(10).toString('hex');
        await page.waitForSelector('#Image_0');
        await page.type('#Image_0', testVars["image0Text"], { delay: 20 })

    })

    it('it should submit', async () => {
        await clickElement(page, '#addSubmit');
        await delay(1000)
        await page.waitForSelector('#artworkTitle');
        var element = await page.waitForSelector('#artworkTitle');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["title"]);
    })
    it('should set artwork For Sale', async () => {
        await clickElement(page, '#artWorkForSale');
        //await metamask.confirmTransaction();
        //await metamask.page.click(".btn-primary");

        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
    })
    it('it should release Tokens', async () => {
        await page.waitForSelector('#artWorkReleaseTokensQty');
        testVars["artWorkReleaseTokensQty"] = '10000';
        await page.type('#artWorkReleaseTokensQty', testVars["artWorkReleaseTokensQty"], { delay: 20 })
        await clickElement(page, '#releaseTokens');
        //await metamask.confirmTransaction();

        //await metamask.page.click(".btn-primary");

        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();


        await page.bringToFront();
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["artWorkReleaseTokensQty"]);

    })

    it('should place sell order for 10 shares', async () => {

        await page.bringToFront();
        await page.waitForSelector('#artWorkSellShareOfferQTY');
        await page.type('#artWorkSellShareOfferQTY', "0", { delay: 20 })
        await delay(50)
        await clickElement(page, '#approveSharesSellOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await delay(3000)
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton1 = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton1.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');

        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('9990');

    })

    it('should cancel sell order', async () => {
        await clickElement(page, '#cancelSellOrder_0');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('10000');
    })

    it('should place sell order for 10 shares', async () => {
        await delay(50)
        await clickElement(page, '#approveSharesSellOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await delay(3000)
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton1 = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton1.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('9990');

    })
    it('should place sell order for 10 shares', async () => {
        await delay(50)
        await clickElement(page, '#approveSharesSellOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await delay(3000)
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton1 = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton1.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('9980');

    })



})
describe('Solid State User 1', () => {
    it('should switch network, localhost', async () => {
        await metamask.switchAccount(3);

    })
    it('should be connected', async () => {
        await page.bringToFront();
        await page.waitForSelector('#dash-positioned-button');
    })


    it('should fill sell order', async () => {
        await clickElement(page, '#fillSellOrder_0');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        //await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('10');
    });

    it('should place a buy order for 1 share at 0.0002', async () => {
        await clickElement(page, '#placeBuyOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');

        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('11');
    });
    it('should place a buy order for 10 shares at 0.00019', async () => {
        await page.bringToFront();
        await page.waitForSelector('#artWorkBuyShareOfferQTY');
        await page.type('#artWorkBuyShareOfferQTY', "0", { delay: 20 });
        const input = await page.$("#artWorkBuyShareOfferETH");
        await input.click({ clickCount: 3 })
        await input.type("0.00019", { delay: 20 });
        await delay(3000)
        await clickElement(page, '#placeBuyOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await page.waitForSelector('#heldEth');
        var element = await page.waitForSelector('#heldEth');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('0.0019');
    })

    it('should cancel buy order', async () => {
        await clickElement(page, '#cancelBuyOrder_0');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#heldEth');
        await waitForTextChange(page, '#heldEth');
        var element = await page.waitForSelector('#heldEth');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('0');
    })

    it('should place a buy order for 10 shares at 0.00019', async () => {
        await page.bringToFront();
        //await page.waitForSelector('#artWorkBuyShareOfferQTY');
        //await page.type('#artWorkBuyShareOfferQTY', "0", { delay: 20 });
        const input = await page.$("#artWorkBuyShareOfferETH");
        await input.click({ clickCount: 3 })
        await input.type("0.00019", { delay: 20 });
        await delay(3000)
        await clickElement(page, '#placeBuyOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await page.waitForSelector('#heldEth');
        var element = await page.waitForSelector('#heldEth');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('0.0019');
    })

    it('should place sell order for 5 shares at 0.00021', async () => {


        const input0 = await page.$("#artWorkBuyShareOfferQTY");
        await input0.click({ clickCount: 3 })
        await input0.type("5", { delay: 20 });

        const input1 = await page.$("#artWorkBuyShareOfferETH");
        await input1.click({ clickCount: 3 })
        await input1.type("0.00019", { delay: 20 });

        await clickElement(page, '#approveSharesSellOrder');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await delay(3000)
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton1 = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton1.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');

        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('5');

    })


})



describe('Solid State User 2', () => {
    it('should switch network, localhost', async () => {
        await metamask.switchAccount(3);

    })
    it('should be connected', async () => {
        await page.bringToFront();
        await page.waitForSelector('#dash-positioned-button');
    })

    it('it should fill a sell order', async () => {
        await delay(50)
        await clickElement(page, '#fillSellOrder_0');
        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();

        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        //await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('9');
    })

    it('it should fill a buy order', async () => {
        await delay(50)
        await clickElement(page, '#fillBuyOrder_0');


        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await delay(3000)
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton1 = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton1.click();
    })

    it('it should buy the artwork', async () => {
        await page.waitForSelector('#purchaseArtwork')
        await page.click('#purchaseArtwork');

        await metamask.page.bringToFront();
        await metamask.page.waitForTimeout(500);
        await metamask.page.reload();
        await metamask.page.bringToFront();
        const confirmButton = await metamask.page.waitForSelector('.btn-primary:not([disabled])');
        await confirmButton.click();
        await page.waitForSelector('#youOwnThisArtWork');
        await page.waitForSelector('#transactionSuccess');
        //await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('4');
    })

    it('should disconnect', async () => {
        await page.bringToFront();
        await page.click('#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(3)')
        await page.waitForSelector('#connectButton');
    });
})

