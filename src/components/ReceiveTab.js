"use client";

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react';

export default function ReceiveTab() {
  const { account } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [snapStatus, setSnapStatus] = useState("");

  if (!account) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
          Please connect your MetaMask wallet to view your receive details.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openMetaMaskReceive = async () => {
    setSnapStatus("");
    try {
      // Trigger MetaMask receive snap
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: ['npm:@metamask/receive-snap', {
          method: 'showReceive'
        }]
      });
    } catch (error) {
      console.error(error);
      setSnapStatus("Please open MetaMask directly to access the Receive tab or install @metamask/receive-snap.");
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', marginBottom: '1rem' }}>
        <QrCode size={24} color="var(--color-primary)" />
        Receive Assets
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', alignSelf: 'flex-start', textAlign: 'left' }}>
        Scan the QR code below or copy your address to receive Ethereum and ERC20 tokens directly into your wallet.
      </p>

      {/* QR CODE CONTAINER */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        marginBottom: '2rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid rgba(255, 255, 255, 0.1)'
      }}>
        <QRCodeSVG 
          value={account} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#0a0418"}
          level={"H"}
          includeMargin={false}
        />
      </div>

      {/* WALLET ADDRESS CONTAINER */}
      <div 
        onClick={handleCopy}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          marginBottom: '2.5rem',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        }}
      >
        <span style={{
          fontSize: '13px',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          color: 'var(--color-text-secondary)',
          textAlign: 'left'
        }}>
          {account}
        </span>
        <button style={{
          border: 'none',
          background: 'transparent',
          color: copied ? 'var(--color-success)' : 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      {/* ACTION BUTTON GRID */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
        <button 
          className="btn-primary" 
          onClick={handleCopy} 
          style={{ flex: 1, justifyContent: 'center', minWidth: '150px' }}
        >
          {copied ? "Address Copied!" : "Copy Address"}
        </button>
        <button 
          className="btn-secondary" 
          onClick={openMetaMaskReceive}
          style={{ flex: 1, justifyContent: 'center', minWidth: '150px' }}
        >
          Show in MetaMask
        </button>
      </div>

      {/* SNAP WARNING */}
      {snapStatus && (
        <p style={{ fontSize: '13px', color: 'var(--color-warning)', marginTop: '1.5rem', lineHeight: '1.4' }}>
          {snapStatus}
        </p>
      )}

      {/* BLOCK EXPLORER LINK */}
      <a 
        href={`https://etherscan.io/address/${account}`} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--color-secondary)',
          marginTop: '2rem',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        View on Etherscan
        <ExternalLink size={14} />
      </a>

    </div>
  );
}
