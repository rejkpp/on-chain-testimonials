require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
      goerli: {
        url: process.env.STAGING_QUICKNODE_KEY,
        accounts: [process.env.PRIVATE_KEY]
      },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHER_API
    }
  }
};
