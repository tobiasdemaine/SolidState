# SOLID STATE FRONT END
Solid State is a market for trading shares in art works 

## TESTING WITH JEST + DAPPETEER
comment out node_modules/@chainsafe/Dapeteer/dist/index.js
```code
function closeNotificationPage(browser) {
    /*return __awaiter(this, void 0, void 0, function* () {
        browser.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () {
            if (target.url().match('chrome-extension://[a-z]+/notification.html')) {
                try {
                    const page = yield target.page();
                    yield page.close();
                }
                catch (_a) {
                    return;
                }
            }
        }));
    });*/
}
```

### Run Tests
```code
npx jest
```