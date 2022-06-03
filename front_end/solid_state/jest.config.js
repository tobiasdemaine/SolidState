
module.exports = {
  //preset: 'ts-jest',
  //testEnvironment: 'node',

  //preset: "@chainsafe/dappeteer",
  testTimeout: 25000,
  globalSetup: './jest.setup.js',
  globalTeardown: './jest.teardown.js',
  testEnvironment: './jest.environment.js',
  PUPPETEER_CONFIG: { metamaskVersion: 'v10.8.1', defaultViewport: null, },

  metamaskOptions: {
    seed: 'shell two exile coin tired wood kangaroo ask horse sun slice above',
    password: '12345678',
    showTestNets: true,
    hideSeed: false
  }
};