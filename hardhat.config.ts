import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
  },
}

export default config
