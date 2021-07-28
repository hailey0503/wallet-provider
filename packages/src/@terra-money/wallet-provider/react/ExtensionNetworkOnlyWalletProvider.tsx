import { ChromeExtensionController } from '@terra-dev/chrome-extension';
import { NetworkInfo } from '@terra-dev/wallet-types';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { WalletStatus } from '../types';
import { Wallet, WalletContext } from './useWallet';

export interface ExtensionNetworkOnlyWalletProviderProps {
  children: ReactNode;
  defaultNetwork: NetworkInfo;
}

export function ExtensionNetworkOnlyWalletProvider({
  children,
  defaultNetwork,
}: ExtensionNetworkOnlyWalletProviderProps) {
  const [controller] = useState<ChromeExtensionController>(
    () =>
      new ChromeExtensionController({
        defaultNetwork,
        enableWalletConnection: false,
      }),
  );

  const [network, setNetwork] = useState<NetworkInfo>(defaultNetwork);

  useEffect(() => {
    const networkSubscription = controller.networkInfo().subscribe({
      next: (value) => {
        setNetwork(value);
      },
    });

    return () => {
      networkSubscription.unsubscribe();
    };
  }, [controller]);

  const state = useMemo<Wallet>(() => {
    return {
      availableConnectTypes: [],
      availableInstallTypes: [],
      status: WalletStatus.WALLET_NOT_CONNECTED,
      network,
      wallets: [],
      install: () => {
        throw new Error('not implemented!');
      },
      connect: () => {
        throw new Error('not implemented!');
      },
      connectReadonly: () => {
        throw new Error('not implemented!');
      },
      disconnect: () => {
        throw new Error('not implemented!');
      },
      post: () => {
        throw new Error(
          `<ExtensionNetworkOnlyWalletProvider> does not support post()`,
        );
      },
      sign: () => {
        throw new Error(
          `<ExtensionNetworkOnlyWalletProvider> does not support sign()`,
        );
      },
      recheckStatus: controller.recheckStatus,
    };
  }, [controller.recheckStatus, network]);

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
