import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletDisconnectButton,
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

const buttonStyle = {
  backgroundColor: "#16B19A",
  zIndex: 40,
  lineHeight: "unset",
};
function ConnectButton({ className }) {
  const { wallet, connected } = useWallet();

  if (connected) {
    return (
      <div className="-translate-x-10 z-30">
        <WalletDisconnectButton style={buttonStyle} />
      </div>
    );
  } else {
    return (
      <div className="-translate-x-10 z-30">
        <WalletModalButton style={buttonStyle}>
          Connect Wallet
        </WalletModalButton>
      </div>
    );
  }
}

export default ConnectButton;
