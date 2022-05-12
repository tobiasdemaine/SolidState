describe('Login and Trade', () => {


    context('Connect metamask wallet', () => {
        // setup wallet
        it(`Connect Wallet`, () => {
            // visit /
            cy.visit('/');
            // wait for ipfs connect
            cy.get('#ipfsON', { timeout: 20000 }).should('be.visible')
            // connect wallet
            cy.get('#connectButton').click();
            // wait for wallet connect
            cy.acceptMetamaskAccess().then(connected => {
                expect(connected).to.be.true;
            });
        })
        it(`Navigate thru Collection Page`, () => {
            // wait collections toload 
            cy.get('#Collection_0', { timeout: 20000 }).should('be.visible')
            // select first collection item
            cy.get('#Collection_0').click();
        })
        it(`Navigate to ArtWork Page`, () => {
            // wait collection to load
            cy.get('#artwork_0', { timeout: 20000 }).should('be.visible')
            // select first artwork
            cy.get('#artwork_0 > button').click();
        })
        it(`Perform Buy Trade`, () => {
            // container.querySelector('#artwork_0 > button').click();
            cy.wait(2000)
            cy.get("#artWorkBuyShareOfferQTY").should('not.eq', '0')
            // wait for artwork to load
            // Create Buy Order
            cy.get("#artWorkBuyShareOfferQTY").type('2')
            cy.wait(1000)
            cy.get("#artWorkBuyShareOfferETH").type('{del}0.00018')
            cy.wait(1000)
            cy.findByRole('button', {
                name: /make share buy order/i
            }).click()
            // metamask confirm
            cy.confirmMetamaskTransaction().then(confirmed => {
                expect(confirmed).to.be.true;
            });
            cy.wait(10000)
            //wait for order to befilled
            //cy.findByText(/transaction approved\./i, { timeout: 20000 }).should('be.visible')
        })
        it(`Perform Sell Trade`, () => {
        })
    })

})