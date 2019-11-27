/* global artifacts */
const BigNumber = require('bignumber.js')
const Moloch = artifacts.require('./Moloch.sol')
const MolochPool = artifacts.require('./MolochPool.sol')
const SimpleToken = artifacts.require('./oz/SimpleToken.sol')

const configJSON = require('./config.json')

const isDev = false;  // read for prod

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    let approvedToken;
    if (isDev) {
      const simpleToken  = await deployer.deploy(SimpleToken)
      approvedToken = simpleToken.address
    } else {
      approvedToken = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // wETH
    }

    const moloch = await deployer.deploy(
      Moloch,
      accounts[0],
      approvedToken,
      configJSON.PERIOD_DURATION,
      configJSON.VOTING_PERIOD_LENGTH,
      configJSON.GRACE_PERIOD_LENGTH,
      configJSON.ABORT_WINDOW,
      new BigNumber(configJSON.PROPOSAL_DEPOSIT),
      configJSON.DILUTION_BOUND,
      new BigNumber(configJSON.PROCESSING_REWARD),
      { gas: 6000000 }
    )

    const pool = await deployer.deploy(
      MolochPool,
      moloch.address
    )
  })
}
