"use client";

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Send, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function SendTab() {
  const { account, sendEth, contractAddress, loading } = useWeb3();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sendMode, setSendMode] = useState("direct"); // 'direct' or 'contract'
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  if (!account) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
          Please connect your MetaMask wallet to perform transactions.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setTxHash("");

    if (!amount || parseFloat(amount) <= 0) {
      setStatus("Please enter a valid positive ETH amount.");
      return;
    }

    if (sendMode === "direct" && (!recipient || recipient.trim() === "")) {
      setStatus("Please enter a recipient address.");
      return;
    }

    try {
      setStatus("Requesting transaction approval in MetaMask...");
      let tx;
      if (sendMode === "direct") {
        tx = await sendEth(recipient.trim(), amount, false);
      } else {
        tx = await sendEth(contractAddress, amount, true);
      }
      
      setStatus("Transaction successful!");
      setTxHash(tx.transactionHash || tx.hash);
      setAmount("");
      setRecipient("");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed: " + err.message);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Send size={24} color="var(--color-primary)" />
        Transfer Funds
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Transfer Ethereum directly to another wallet address, or deposit assets into your inheritance smart contract for safe-keeping.
      </p>

      {/* SEND MODE TABS */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '6px',
        gap: '8px',
        marginBottom: '2rem'
      }}>
        <button
          type="button"
          onClick={() => { setSendMode("direct"); setStatus(""); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: sendMode === "direct" ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
            borderBottom: sendMode === "direct" ? '2px solid var(--color-primary)' : 'none',
            color: sendMode === "direct" ? 'white' : 'var(--color-text-secondary)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowUpRight size={16} />
          Send to Wallet
        </button>
        <button
          type="button"
          onClick={() => { setSendMode("contract"); setStatus(""); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: sendMode === "contract" ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
            borderBottom: sendMode === "contract" ? '2px solid var(--color-secondary)' : 'none',
            color: sendMode === "contract" ? 'white' : 'var(--color-text-secondary)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldCheck size={16} />
          Deposit to Contract
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* RECIPIENT INPUT */}
        {sendMode === "direct" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
              Recipient Wallet Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field"
              disabled={loading}
            />
          </div>
        )}

        {/* CONTRACT INFO IF DEPOSIT MODE */}
        {sendMode === "contract" && (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(6, 182, 212, 0.04)', borderColor: 'rgba(6, 182, 212, 0.1)' }}>
            <HelpCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'white' }}>Depositing to Smart Switch</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Funds will be deposited to your wallet smart contract at:<br />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--color-secondary)' }}>{contractAddress}</span><br />
                This balance represents the inheritance fund that can be claimed by nominees if the switch triggers.
              </p>
            </div>
          </div>
        )}

        {/* AMOUNT INPUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
            Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            disabled={loading}
          />
        </div>

        {/* STATUS MESSAGE */}
        {status && (
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: status.includes("successful") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            border: `1px solid ${status.includes("successful") ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)'}`,
            fontSize: '14px',
            color: status.includes("successful") ? 'var(--color-success)' : 'white'
          }}>
            {status}
            {txHash && (
              <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--color-text-secondary)' }}>
                Tx Hash: {txHash}
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTON */}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ justifyContent: 'center', marginTop: '1rem' }}
        >
          {loading ? "Approving..." : sendMode === "direct" ? "Send ETH" : "Deposit ETH"}
        </button>
      </form>
    </div>
  );
}
