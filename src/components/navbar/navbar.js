import React, { useEffect } from "react";
import styles from "./navbar.module.scss";
import logo from "../../assets/safemoonLogo.png";
import { connectWallet } from "./handleWalletConnect";

const Navbar = ({ setStateValue, stateValue, setLoadingTable }) => {
  useEffect(() => {
    const walletAddressData = sessionStorage.getItem("account");
    const balanceData = sessionStorage.getItem("balance");
    // const chainIdData = sessionStorage.getItem("chainID");
    const userWalletData = sessionStorage.getItem("setuserWallet");

    if (walletAddressData) {
      setStateValue({
        initiateWallet: true,
        processingWalletConnect: false,
        chainID: 56,
        accountBalance: balanceData,
        userWallet: userWalletData,
        walletAddress: walletAddressData,
        walletConnected: true,
      });
      setLoadingTable(true);
    }
  }, [stateValue.walletConnected, setStateValue, setLoadingTable]);

  const updateSateValue = async (key, value) => {
    let newObj = { ...stateValue };
    newObj[key] = value;
    return setStateValue(newObj);
  };

  // console.log(stateValue);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logoContent}>
          <img src={logo} alt={logo} />
        </div>
        <div className={styles.logoText}>SAFEMOON</div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => {
            connectWallet({
              updateSateValue,
              stateValue,
              setStateValue,
            });
          }}
        >
          {stateValue.walletConnected
            ? stateValue.walletAddress
            : !stateValue.processingWalletConnect
            ? "Connect Wallet"
            : "Processing"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
