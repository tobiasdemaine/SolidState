var crypto = require("crypto");

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
        await metamask.importPK('0xbd152130487a1e74a6e2713637518ab68ab14e4bec4e33f248de3aeb15c20438');
        await metamask.switchAccount(2);
        await metamask.switchNetwork('localhost8545');

        const selectedNetwork = await metamask.page.evaluate(
            () => (document.querySelector('.network-display > span:nth-child(2)')).innerHTML,
        );
        expect(selectedNetwork).toEqual('localhost8545');
    })
    it('should be titled "Solid State"', async () => {
        enableSlowMo(page, 40)
        enableSlowMo(metamask.page, 250)
        await page.setViewport({ width: 1280, height: 900 })

        await page.bringToFront();
        await page.goto('http://127.0.0.1:3000')
        await expect(page.title()).resolves.toMatch('Solid State');

    })
    it('should be connected', async () => {
        await clickElement(page, '#connectButton')
        await metamask.approve();
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
        await metamask.confirmTransaction();
        await metamask.page.click(".btn-primary");
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
        await page.click('#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(2)')
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
    it('it should sumbit form to error no image ', async () => {
        await clickElement(page, '#addSubmit');
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
        await page.waitForTimeout(3000);
        await page.waitForSelector('#artworkTitle');
        var element = await page.waitForSelector('#artworkTitle');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["title"]);
    })
    it('should set artwork For Sale', async () => {
        await clickElement(page, '#artWorkForSale');
        await metamask.confirmTransaction();
        await metamask.page.click(".btn-primary");
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
    })
    it('it should release Tokens', async () => {
        await page.waitForSelector('#artWorkReleaseTokensQty');
        testVars["artWorkReleaseTokensQty"] = '10000';
        await page.type('#artWorkReleaseTokensQty', testVars["artWorkReleaseTokensQty"], { delay: 20 })
        await clickElement(page, '#releaseTokens');
        await metamask.confirmTransaction();

        await metamask.page.click(".btn-primary");
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
        await clickElement(page, '#approveSharesSellOrder');
        await metamask.confirmTransaction();
        await page.waitForTimeout(1000);
        await page.waitForTimeout(1000);
        await page.bringToFront();
        await metamask.confirmTransaction();
        await metamask.page.click(".btn-primary");
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
        await metamask.confirmTransaction();
        try {
            await metamask.page.click(".btn-primary");
        } catch { }
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('10000');
    })

    it('should place sell order for 10 shares', async () => {
        await clickElement(page, '#approveSharesSellOrder');
        await metamask.confirmTransaction();
        await page.bringToFront();
        await metamask.confirmTransaction();
        try {
            await metamask.page.click(".btn-primary");
        } catch { }
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
        await waitForTextChange(page, '#availableShares');
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('9990');

    })

    it('should disconnect', async () => {
        await page.bringToFront();
        await page.click('#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(5)')
        await page.waitForSelector('#connectButton');
    })
})
describe('Solid State User', () => {
    it('should switch network, localhost', async () => {
        await metamask.switchAccount(3);

    })
    it('should be connected', async () => {
        await page.bringToFront();
        await clickElement(page, '#connectButton')
        await metamask.approve();
        await metamask.approve();
        await page.bringToFront();
        await page.waitForSelector('#dash-positioned-button');
    })
})