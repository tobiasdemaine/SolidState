var crypto = require("crypto");

async function clickElement(page, selector) {
    await page.bringToFront();
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    await element.click();
}

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
        await metamask.switchNetwork('localhost8545');

        const selectedNetwork = await metamask.page.evaluate(
            () => (document.querySelector('.network-display > span:nth-child(2)')).innerHTML,
        );
        expect(selectedNetwork).toEqual('localhost8545');
    })
    it('should be titled "Solid State"', async () => {
        //await page.setViewport({ width: 1280, height: 800 })
        await page.bringToFront();
        await page.goto('http://127.0.0.1:3000')
        await expect(page.title()).resolves.toMatch('Solid State');
        await page.waitForTimeout(1000);
    })
    it('should be connected', async () => {
        await clickElement(page, '#connectButton')
        await metamask.approve();
        // await clickElement(page, '#connectButton')
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
        const element = await page.waitForSelector('#collectionName');
        const value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["collectionName"]);
        console.log(testVars["collectionName"])
        await page.waitForTimeout(1000);
    })
    it('should submit form', async () => {
        await clickElement(page, '#collectionNameSubmit')
        await page.waitForTimeout(3000);
        await metamask.sign();
        await metamask.confirmTransaction();
        await page.waitForTimeout(3000);
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
    })
    it('should locate New Collection name on page', async () => {
        await pause(5);
        const text = testVars["collectionName"];
        await page.waitForTimeoutFunction(
            text => document.querySelector('body').innerText.includes(text),
            {},
            text
        );
    })
    it('should navigate to add artWork', async () => {
        await clickElement(page, '#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(2)')
        const element = await page.waitForSelector('header > div > div');
        const value = await element.evaluate(el => el.textContent);
        expect(value).toEqual('Add');
    })
    it('it should fill in form text inputs', async () => {
        // prepare form
        testVars["title"] = crypto.randomBytes(7).toString('hex');
        testVars["artist"] = crypto.randomBytes(7).toString('hex');
        testVars["medium"] = crypto.randomBytes(10).toString('hex');
        testVars["dimensions"] = crypto.randomBytes(8).toString('hex');
        testVars["year"] = crypto.randomBytes(4).toString('hex');
        testVars["price"] = 20;
        testVars["supply"] = 100000;
        testVars["symbol"] = crypto.randomBytes(4).toString('hex');
        //fill in form
        await page.type('#title', testVars["title"], { delay: 20 })
        var element = await page.waitForSelector('#title');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["title"]);

        await page.type('#artist', testVars["artist"], { delay: 20 })
        element = await page.waitForSelector('#artist');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["artist"]);

        await page.type('#medium', testVars["medium"], { delay: 20 })
        element = await page.waitForSelector('#medium');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["medium"]);

        await page.type('#dimensions', testVars["dimensions"], { delay: 20 })
        element = await page.waitForSelector('#dimensions');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["dimensions"]);

        await page.type('#year', testVars["year"], { delay: 20 })
        element = await page.waitForSelector('#year');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["year"]);

        await page.type('#price', testVars["price"], { delay: 20 })
        element = await page.waitForSelector('#price');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["price"]);

        await page.type('#supply', testVars["supply"], { delay: 20 })
        element = await page.waitForSelector('#supply');
        value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["supply"]);

    })
    it('it should select new collection name forms mui select', async () => {
        await clickElement(page, '#collection');
        //
        var success = false;
        var element = undefined;
        const lis = await page.$$('#menu-collection > div > ul > li')
        for (var i = 0; i < lis.length; i++) {
            let valueHandle = await lis[i].getProperty('innerText');
            let liText = await valueHandle.jsonValue();
            const text = getText(liText);
            if (testVars["collectionName"] == text) {
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
    it('it should attach an image', async () => {
        await page.waitForSelector('input[type=file]');
        await page.waitForTimeout(1000);

        const inputUploadHandle = await page.$('input[type=file]');
        let fileToUpload = 'test_to_upload.jpg';
        inputUploadHandle.uploadFile(fileToUpload);
        await page.waitForSelector('#uploadFiles');
        await page.evaluate(() => document.getElementById('uploadFiles').click());
        await page.waitForSelector('#img_0');

    })
    it('it should add text to image', async () => {
        testVars["image0Text"] = crypto.randomBytes(10).toString('hex');
        await page.waitForSelector('#image_0');
        await page.type('#image_0', testVars["image0Text"], { delay: 20 })
        var element = await page.waitForSelector('#image_0');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["image0Text"]);
    })
    it('it should add secret key', async () => {
        testVars["secret"] = 'password';
        await page.type('#secret', testVars["secret"], { delay: 20 })
        var element = await page.waitForSelector('#secret');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["secret"]);
    })
    it('it should submit', async () => {
        await clickElement(page, '#addSubmit');
        await page.waitForTimeout(3000);
        await page.waitForSelector('#artworkTitle');
        var element = await page.waitForSelector('#artworkTitle');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["title"]);
    })
    it('it should release Tokens', async () => {
        await page.waitForSelector('#artWorkReleaseTokensQty');
        testVars["artWorkReleaseTokensQty"] = 10000;
        await page.type('#secret', testVars["artWorkReleaseTokensQty"], { delay: 20 })
        var element = await page.waitForSelector('#artWorkReleaseTokensQty');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["artWorkReleaseTokensQty"]);
        await clickElement(page, '#releaseTokens');
        await metamask.confirmTransaction();
        await page.bringToFront();
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["artWorkReleaseTokensQty"]);
    })

    /// 
    it('should place sell order for 10 shares', async () => {
        await page.waitForSelector('#artWorkSellShareOfferQTY');
        await page.type('#artWorkSellShareOfferQTY', "1", { delay: 20 })
        await metamask.confirmTransaction();
        // we need to wait for a selector the metamask.page
        await metamask.confirmTransaction();
        await page.bringToFront();
        await page.waitForSelector('#availableShares');
        var element = await page.waitForSelector('#availableShares');
        var value = await element.evaluate(el => el.textContent);
        expect(value).toEqual(testVars["artWorkReleaseTokensQty"] - 11);

    })
    // should setforsale
    it('should set artwork For Sale', async () => {
        await clickElement(page, '#artWorkForSale');
        await metamask.confirmTransaction();
        await page.bringToFront();
        await page.waitForSelector('#transactionSuccess');
    })


})
