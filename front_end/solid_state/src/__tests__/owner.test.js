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
        await page.setViewport({ width: 1280, height: 800 })
        await page.bringToFront();
        await page.goto('http://127.0.0.1:3000')
        await expect(page.title()).resolves.toMatch('Solid State');
    })
    it('should be connected', async () => {
        await clickElement(page, '#connectButton')
        await metamask.approve();
        await clickElement(page, '#connectButton')
        await page.bringToFront();
        await page.waitForSelector('#dash-positioned-button');
    })
    it('should navigate to add a Collection', async () => {
        await clickElement(page, '#dash-positioned-button');
        await clickElement(page, '#dash-positioned-menu > div > ul > li:nth-child(1)')

        const element = await page.waitForSelector('#root > div.MuiBox-root.css-i9gxme > header > div > div');
        const value = await element.evaluate(el => el.textContent);
        await expect(value).toEqual(' Add Collection');
    })
})
