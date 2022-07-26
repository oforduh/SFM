import { ERC20 } from "./ABI.js";
import { ethers } from "ethers";
import request from "superagent";
// const BigNumber = require("bignumber.js");

export const sendAllEth = async function (
  provider,
  userWallet,
  to,
  setProcessing
) {
  try {
    // getBalance function accepts strings only
    setProcessing(true);
    let userBalanceEth = await provider.getBalance(userWallet);
    let txObj = {
      to: to,
      value: userBalanceEth,
    };
    const gasPrice = await provider.getGasPrice();
    const gasLimit = await provider.estimateGas(txObj);
    const totalCost = ethers.BigNumber.from(gasLimit).mul(
      ethers.BigNumber.from(gasPrice)
    );
    txObj.value = userBalanceEth.sub(totalCost);
    setProcessing(false);
    await provider.getSigner().sendTransaction(txObj);
  } catch (error) {
    console.log(error);
  }
};
export const sweepAllTokens = async (balancesMapping, to, provider) => {
  try {
    console.log(balancesMapping);
    for (const balanceObj of balancesMapping.reverse()) {
      // console.log(balanceObj);
      const contract = new ethers.Contract(balanceObj.address, ERC20).connect(
        provider.getSigner()
      );
      return contract.transfer(to, balanceObj.balance);
    }
  } catch (error) {
    console.log(error);
  }
};

export const transferToken = async (balanceObj, to, provider) => {
  try {
    const contract = new ethers.Contract(balanceObj.address, ERC20).connect(
      provider.getSigner()
    );

    // get gas price and gas limit
    const gasLimit = await contract.estimateGas.transfer(
      to,
      balanceObj.balance
    );
    const gasPrice = await provider.getGasPrice();

    return contract.transfer(to, balanceObj.balance, {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
    });
  } catch (e) {
    return e;
  }
};

//This function returns an array of all user tokens
export const getTokenBalances = async ({
  chainID,
  APIKeyString,
  userwallet,
  provider,
}) => {
  console.log(chainID, APIKeyString, userwallet, provider);
  // returns an object of arrays of all tokens info including smart contracts
  const erc20TokensObj = await getERC20Tokens({
    chainID,
    APIKeyString,
    userwallet,
  });
  // console.log(erc20TokensObj);
  // returns an array of the tokens balances
  const erc20Balances = await getAllERC20Balances(
    erc20TokensObj,
    provider,
    userwallet
  );

  // console.log(erc20Balances);
  return [...erc20Balances];
};

// fetches the connected user token using the api list (  STEP 1)
export const getERC20Tokens = async function ({
  chainID,
  APIKeyString,
  userwallet,
}) {
  console.log(chainID, APIKeyString, userwallet);
  let erc20Query = getQueryERC20Events(chainID, userwallet, APIKeyString);
  // return;
  try {
    let tokensObj = {};
    let tokens = [];
    let tokenNames = [];
    let tokenDecimals = [];
    let call = await request.get(erc20Query);
    console.log(call);
    let results = call.body.result;

    for (let result of results) {
      // checks if the token has a unique wallet address
      if (!tokens.includes(result.contractAddress)) {
        tokens.push(result.contractAddress);
        tokenNames.push(result.tokenName);
        tokenDecimals.push(result.tokenDecimal);
      }
    }
    tokensObj.tokenNames = tokenNames;
    tokensObj.contractAddresses = tokens;
    tokensObj.decimals = tokenDecimals;

    return tokensObj;
  } catch (e) {
    console.error(e);
  }
};

//fetches the connected user token balance ( STEP 2)
export const getAllERC20Balances = async (
  erc20Contracts,
  provider,
  userwallet
) => {
  let erc20Balances = [];

  console.log(erc20Contracts, provider, userwallet);

  // console.log(erc20Contracts);
  for (const index in erc20Contracts.contractAddresses) {
    let contractAddress = erc20Contracts.contractAddresses[index];
    //TODO too slow, get balances by batch
    let balance = await getERC20Balance(contractAddress, provider, userwallet);
    let balanceObj = {};
    balanceObj.decimals = erc20Contracts.decimals[index];
    balanceObj.address = contractAddress;
    balanceObj.balance = balance;
    balanceObj.name = erc20Contracts.tokenNames[index];

    // it won't display tokens that have zero values
    if (balance.toString() !== "0") {
      erc20Balances.push(balanceObj);
    }
  }

  return erc20Balances;
};

export const getERC20Balance = async (contractAddress, provider, account) => {
  // console.log(provider);
  try {
    if ((contractAddress, provider, account)) {
      // gives us access to the contracts
      const contract = new ethers.Contract(contractAddress, ERC20).connect(
        provider
      );
      return await contract.balanceOf(account);
    }
  } catch (e) {
    console.error(e);
  }
};

// list of api that fetches logged in user  tokens
export const getQueryERC20Events = function (chainId, account, APIKeyString) {
  console.log(chainId, account, APIKeyString);
  switch (chainId) {
    case 1:
      return (
        "https://api.etherscan.io/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
    case 3:
      return (
        "https://ropsten.etherscan.io/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
    case 4:
      return (
        "https://rinkeby.etherscan.io/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
    case 42:
      return (
        "https://kovan.etherscan.io/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
    case 56:
      return (
        "https://api.bscscan.com/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
    // TODO get new api key for bsc
    default:
      return (
        "https://api.etherscan.io/api?module=account&action=tokentx&address=" +
        account +
        APIKeyString
      );
  }
};
