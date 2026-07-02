"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

const contractAddress = "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53";
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ActivityUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "nominees",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountPerNominee",
        type: "uint256",
      },
    ],
    name: "FundsTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_nominees", type: "address[]" },
      {
        internalType: "uint256",
        name: "_inactivityPeriod",
        type: "uint256",
      },
    ],
    name: "setNomineesAndPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateActivity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNominees",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInactivityPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastActivity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
];

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [contractBalance, setContractBalance] = useState("0");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  // Contract state
  const [nominees, setNominees] = useState([]);
  const [inactivityPeriod, setInactivityPeriod] = useState(0);
  const [lastActivity, setLastActivity] = useState(0);
  const [contractOwner, setContractOwner] = useState("");

  // Database limits state
  const [limits, setLimits] = useState({ lowerLimit: null, upperLimit: null });
  const [error, setError] = useState(null);

  // Disconnect function
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance("0");
    setContractBalance("0");
    setNetwork("");
    setWeb3Instance(null);
    setContractInstance(null);
    setNominees([]);
    setInactivityPeriod(0);
    setLastActivity(0);
    setContractOwner("");
    setLimits({ lowerLimit: null, upperLimit: null });
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wallet_connected');
    }
  }, []);

  // Fetch SQLite limits
  const fetchDbLimits = useCallback(async (userAddress) => {
    try {
      const res = await fetch(`/api/getlimits?address=${encodeURIComponent(userAddress)}`);
      if (res.ok) {
        const data = await res.json();
        setLimits({
          lowerLimit: data.lowerLimit,
          upperLimit: data.upperLimit
        });
      }
    } catch (err) {
      console.error("Failed to fetch limits from database:", err);
    }
  }, []);

  // Refresh balance & contract data
  const refreshData = useCallback(async (web3Obj, userAddress, contractObj) => {
    if (!web3Obj || !userAddress) return;

    try {
      // 1. Get user balance
      const balWei = await web3Obj.eth.getBalance(userAddress);
      const balEth = web3Obj.utils.fromWei(balWei, "ether");
      setBalance(parseFloat(balEth).toFixed(4));

      // 2. Get contract balance
      const contractBalWei = await web3Obj.eth.getBalance(contractAddress);
      const contractBalEth = web3Obj.utils.fromWei(contractBalWei, "ether");
      setContractBalance(parseFloat(contractBalEth).toFixed(4));

      // 3. Get network name
      const chainId = await web3Obj.eth.getChainId();
      let netName = "Unknown Network";
      if (chainId === 1n || chainId === 1) netName = "Ethereum Mainnet";
      else if (chainId === 5n || chainId === 5) netName = "Goerli Testnet";
      else if (chainId === 11155111n || chainId === 11155111) netName = "Sepolia Testnet";
      else if (chainId === 324n || chainId === 324) netName = "zkSync Era Mainnet";
      else if (chainId === 300n || chainId === 300) netName = "zkSync Era Sepolia";
      else netName = `Chain ID: ${chainId}`;
      setNetwork(netName);

      // 4. Read contract variables if contract is initialized
      const activeContract = contractObj || contractInstance;
      if (activeContract) {
        try {
          const ownerAddr = await activeContract.methods.owner().call();
          setContractOwner(ownerAddr);

          const lastAct = await activeContract.methods.lastActivity().call();
          setLastActivity(Number(lastAct));

          const period = await activeContract.methods.getInactivityPeriod().call();
          setInactivityPeriod(Number(period));

          const nomList = await activeContract.methods.getNominees().call();
          setNominees(nomList);
        } catch (contractErr) {
          console.error("Error reading from contract. Is it deployed on this chain?", contractErr);
        }
      }
    } catch (error) {
      console.error("Failed to refresh Web3 data:", error);
    }
  }, [contractInstance]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to use Anakto Wallet.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const web3 = new Web3(window.ethereum);
      setWeb3Instance(web3);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const userAddress = accounts[0];
      setAccount(userAddress);

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      setContractInstance(contract);

      await refreshData(web3, userAddress, contract);
      await fetchDbLimits(userAddress);

      localStorage.setItem('wallet_connected', 'true');
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      if (err && err.code === 4001) {
        setError("Connection request was rejected in MetaMask.");
      } else {
        setError(err?.message || "Failed to connect wallet.");
      }
    } finally {
      setLoading(false);
    }
  }, [refreshData, fetchDbLimits]);

  // Auto connect if previously approved
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum && localStorage.getItem('wallet_connected') === 'true') {
      const initConnect = async () => {
        try {
          const web3 = new Web3(window.ethereum);
          setWeb3Instance(web3);
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            setContractInstance(contract);
            refreshData(web3, accounts[0], contract);
            fetchDbLimits(accounts[0]);
          }
        } catch (e) {
          console.error("Auto connect failed", e);
        }
      };
      initConnect();
    }
  }, [refreshData, fetchDbLimits]);

  // Listen to chain and account change events
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (web3Instance && contractInstance) {
            refreshData(web3Instance, accounts[0], contractInstance);
            fetchDbLimits(accounts[0]);
          }
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [web3Instance, contractInstance, refreshData, fetchDbLimits, disconnectWallet]);

  // Update Nominees on contract
  const setNomineesOnChain = async (nomineeAddresses, inactivitySeconds) => {
    if (!contractInstance || !account) {
      throw new Error("Wallet not connected");
    }
    setLoading(true);
    try {
      const result = await contractInstance.methods
        .setNomineesAndPeriod(nomineeAddresses, inactivitySeconds)
        .send({ from: account });
      await refreshData(web3Instance, account, contractInstance);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Ping smart contract to update activity
  const updateActivityOnChain = async () => {
    if (!contractInstance || !account) {
      throw new Error("Wallet not connected");
    }
    setLoading(true);
    try {
      const result = await contractInstance.methods
        .updateActivity()
        .send({ from: account });
      await refreshData(web3Instance, account, contractInstance);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Set limits in database
  const setLimitsInDb = async (lower, upper) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    setLoading(true);
    try {
      const res = await fetch('/api/setlimits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: account,
          lowerLimit: lower,
          upperLimit: upper
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save limits");
      }
      setLimits({ lowerLimit: lower, upperLimit: upper });
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Send ETH
  const sendEth = async (toAddress, amountEth, toContract = false) => {
    if (!web3Instance || !account) {
      throw new Error("Wallet not connected");
    }
    setLoading(true);
    try {
      const amountWei = web3Instance.utils.toWei(amountEth.toString(), 'ether');
      const txConfig = {
        from: account,
        to: toContract ? contractAddress : toAddress,
        value: amountWei
      };
      const tx = await web3Instance.eth.sendTransaction(txConfig);
      await refreshData(web3Instance, account, contractInstance);
      return tx;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider value={{
      account,
      balance,
      contractBalance,
      network,
      loading,
      nominees,
      inactivityPeriod,
      lastActivity,
      contractOwner,
      limits,
      error,
      setError,
      contractAddress,
      connectWallet,
      disconnectWallet,
      refreshData: () => refreshData(web3Instance, account, contractInstance),
      setNomineesOnChain,
      updateActivityOnChain,
      setLimitsInDb,
      sendEth
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
}
