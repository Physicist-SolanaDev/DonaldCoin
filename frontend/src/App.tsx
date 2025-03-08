import './App.css';
import Ui from './assets/ui.tsx';
import constants from './assets/constants.ts';

import { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  SolflareWalletAdapter, CoinbaseWalletAdapter,
} 
// @ts-ignore
from '@solana/wallet-adapter-wallets';

import { 
  SolanaMobileWalletAdapter, createDefaultWalletNotFoundHandler, createDefaultAddressSelector, createDefaultAuthorizationResultCache
} 
// @ts-ignore
from '@solana-mobile/wallet-adapter-mobile';

import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
//import { constants } from 'buffer';

const App: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = constants.NETWORK//useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/anza-xyz/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new SolflareWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new SolanaMobileWalletAdapter({
              addressSelector: createDefaultAddressSelector(),
              appIdentity: {
                  name: constants.TOKEN_LABEL,
                  uri: constants.DOMAIN,
                  icon: './icon.svg',
              },
              authorizationResultCache: createDefaultAuthorizationResultCache(),
              cluster: network,
              onWalletNotFound: createDefaultWalletNotFoundHandler(),
            }),
          ],
      [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <div>
                    <WalletMultiButton />
                    {/*<WalletDisconnectButton />*/}
                  </div>
                  {/* Wrapping the components in a fragment */}
                  <>
                  <Ui />
                  </>
                  {/* Your app's components go here, nested within the context providers. */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
