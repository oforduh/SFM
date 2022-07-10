import { toast } from "react-toastify";
import { ethers } from "ethers";

export const connectWallet = async ({
  updateSateValue,
  stateValue,
  setStateValue,
}) => {
  if (stateValue.walletConnected) return;
  if (typeof window.ethereum !== "undefined") {
    setStateValue({
      initiateWallet: true,
      processingWalletConnect: true,
      chainID: 56,
      accountBalance: "",
      userWallet: "",
      walletAddress: "",
      walletConnected: false,
    });

    // request for the account of a connected user
    let [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const { chainId } = await provider.getNetwork();
      console.log(chainId);

      // getBalance function accepts strings only
      let balance = await provider.getBalance(account);
      balance = ethers.utils.formatEther(balance);
      balance = parseFloat(balance).toFixed(5);
      sessionStorage.setItem("setuserWallet", account);
      // Format the user wallet address
      account = `${account.slice(0, 4)}…${account.slice(
        account.length - 5,
        account.length
      )}`;
      // save data to local storage
      sessionStorage.setItem("account", account);
      sessionStorage.setItem("balance", balance);
      // sessionStorage.setItem("chainID", parseInt(chainId));

      setStateValue({
        initiateWallet: true,
        processingWalletConnect: false,
        chainID: 56,
        accountBalance: "",
        userWallet: "",
        walletAddress: "",
        walletConnected: true,
      });
    } catch (error) {
      const id = toast.loading("Processing...");
      console.log("Error: ", error);
      return toast.update(id, {
        render: " Read the instructions on the website on how to get started ",
        type: "warning",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } else {
    const id = toast.loading("Processing...");
    return toast.update(id, {
      render: " Read the instructions on the website on how to get started ",
      type: "warning",
      isLoading: false,
      autoClose: 3000,
    });
  }
};
