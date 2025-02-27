import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('AshishCoin', function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients()

    const ashishCoin = await hre.viem.deployContract('AshishCoin')

    const publicClient = await hre.viem.getPublicClient()

    return {
      ashishCoin,
      owner,
      otherAccount,
      publicClient,
    }
  }

  it('Should get name', async function () {
    const { ashishCoin } = await loadFixture(deployFixture)

    const name = await ashishCoin.read.name()

    expect(name).to.equal('AshishCoin')
  })

  it('Should get symbol', async function () {
    const { ashishCoin } = await loadFixture(deployFixture)

    const symbol = await ashishCoin.read.symbol()

    expect(symbol).to.equal('ASC')
  })

  it('Should get decimals', async function () {
    const { ashishCoin } = await loadFixture(deployFixture)

    const decimals = await ashishCoin.read.decimals()

    expect(decimals).to.equal(18)
  })

  it('Should get total supply', async function () {
    const { ashishCoin } = await loadFixture(deployFixture)

    const totalSupply = await ashishCoin.read.totalSupply()

    expect(totalSupply).to.equal(10000n * 10n ** 18n)
  })

  it('Should get balance', async function () {
    const { owner, ashishCoin } = await loadFixture(deployFixture)

    const balance = await ashishCoin.read.balanceOf([owner.account.address])

    expect(balance).to.equal(10000n * 10n ** 18n)
  })

  it('Should transfer', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    const ownerBalanceBefore = await ashishCoin.read.balanceOf([
      owner.account.address,
    ])

    const otherAccountBalanceBefore = await ashishCoin.read.balanceOf([
      otherAccount.account.address,
    ])

    await ashishCoin.write.transfer([otherAccount.account.address, 1n])

    const ownerBalanceAfter = await ashishCoin.read.balanceOf([
      owner.account.address,
    ])

    const otherAccountBalanceAfter = await ashishCoin.read.balanceOf([
      otherAccount.account.address,
    ])

    expect(ownerBalanceBefore).to.equal(10000n * 10n ** 18n)
    expect(otherAccountBalanceBefore).to.equal(0n)
    expect(ownerBalanceAfter).to.equal(10000n * 10n ** 18n - 1n)
    expect(otherAccountBalanceAfter).to.equal(1n)
  })

  it('Should NOT transfer (balance)', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    const otherAccountInstance = await hre.viem.getContractAt(
      'AshishCoin',
      ashishCoin.address,
      {
        client: {
          wallet: otherAccount,
        },
      },
    )

    await expect(
      otherAccountInstance.write.transfer([owner.account.address, 1n]),
    ).to.be.rejectedWith('Insufficient balance')
  })

  it('Should approve', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    await ashishCoin.write.approve([otherAccount.account.address, 10n])

    const valueApproved = await ashishCoin.read.allowance([
      owner.account.address,
      otherAccount.account.address,
    ])

    expect(valueApproved).to.equal(10n)
  })

  it('Should transfer from', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    await ashishCoin.write.approve([otherAccount.account.address, 10n])

    const ownerBalanceBefore = await ashishCoin.read.balanceOf([
      owner.account.address,
    ])

    const otherAccountBalanceBefore = await ashishCoin.read.balanceOf([
      otherAccount.account.address,
    ])

    const otherAccountInstance = await hre.viem.getContractAt(
      'AshishCoin',
      ashishCoin.address,
      {
        client: {
          wallet: otherAccount,
        },
      },
    )

    await otherAccountInstance.write.transferFrom([
      owner.account.address,
      otherAccount.account.address,
      10n,
    ])

    const ownerBalanceAfter = await ashishCoin.read.balanceOf([
      owner.account.address,
    ])

    const otherAccountBalanceAfter = await ashishCoin.read.balanceOf([
      otherAccount.account.address,
    ])

    expect(ownerBalanceBefore).to.equal(10000n * 10n ** 18n)
    expect(otherAccountBalanceBefore).to.equal(0n)
    expect(ownerBalanceAfter).to.equal(10000n * 10n ** 18n - 10n)
    expect(otherAccountBalanceAfter).to.equal(10n)
  })

  it('Should NOT transfer from (balance)', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    await expect(
      ashishCoin.write.transferFrom([
        otherAccount.account.address,
        owner.account.address,
        10n,
      ]),
    ).to.be.rejectedWith('Insufficient balance')
  })

  it('Should NOT transfer from (allowance)', async function () {
    const { owner, otherAccount, ashishCoin } = await loadFixture(deployFixture)

    const otherAccountInstance = await hre.viem.getContractAt(
      'AshishCoin',
      ashishCoin.address,
      {
        client: {
          wallet: otherAccount,
        },
      },
    )

    await expect(
      otherAccountInstance.write.transferFrom([
        owner.account.address,
        otherAccount.account.address,
        10n,
      ]),
    ).to.be.rejectedWith('Insufficient allowance')
  })
})
