import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { Web3Button } from '@web3modal/react';

const chains = [arbitrum, mainnet, polygon]
const projectId = '7fd11c117bf05ddf882179f112e240bf'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export function RainbowConnect() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Rainbow />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}

function Rainbow() {
    return <Web3Button />
  }


