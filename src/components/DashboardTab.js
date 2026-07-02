"use client";

import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { ShieldCheck, ShieldAlert, Zap, Clock, Coins, Compass } from 'lucide-react';

export default function DashboardTab() {
  const {
    account,
    balance,
    contractBalance,
    lastActivity,
    inactivityPeriod,
    contractAddress,
    connectWallet,
    updateActivityOnChain,
    loading
  } = useWeb3();

  const [timeLeftStr, setTimeLeftStr] = useState("Calculating...");
  const [percentLeft, setPercentLeft] = useState(100);
  const [isTriggered, setIsTriggered] = useState(false);

  // Update timer remaining
  useEffect(() => {
    if (!lastActivity || !inactivityPeriod) {
      setTimeLeftStr("N/A (Contract not configured)");
      setPercentLeft(100);
      return;
    }

    const interval = setInterval(() => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const triggerTime = lastActivity + inactivityPeriod;
      const secondsLeft = triggerTime - nowSeconds;

      if (secondsLeft <= 0) {
        setTimeLeftStr("Triggerable / Inactive");
        setPercentLeft(0);
        setIsTriggered(true);
      } else {
        setIsTriggered(false);
        const days = Math.floor(secondsLeft / (24 * 3600));
        const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        
        const pct = Math.max(0, Math.min(100, (secondsLeft / inactivityPeriod) * 100));
        setPercentLeft(pct);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, inactivityPeriod]);

  const handlePing = async () => {
    try {
      await updateActivityOnChain();
      alert("Activity verified! The Dead Man's Switch timer has been reset.");
    } catch (e) {
      alert("Failed to update activity: " + e.message);
    }
  };

  const formatTimestamp = (sec) => {
    if (!sec) return "Never";
    return new Date(sec * 1000).toLocaleString();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* WALLET CONNECT PROMPT IF NOT CONNECTED */}
      {!account && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
          <Compass size={64} style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CONNECT YOUR WALLET</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', marginBottom: '2.5rem' }}>
            Connect your MetaMask wallet to view your balances, manage spending limits, configure your inheritance beneficiaries, and check the Dead Man's Switch activity status.
          </p>
          <button className="btn-primary" onClick={connectWallet}>
            Connect MetaMask
          </button>
        </div>
      )}

      {/* METRIC CARD GRID */}
      {account && (
        <>
          <div className="grid-cols-2">
            {/* CARD 1: WALLET METRICS */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Personal Wallet
                  </span>
                  <h3 style={{ fontSize: '1.8rem', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Coins size={28} color="var(--color-primary)" />
                    {balance} ETH
                  </h3>
                </div>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '12px',
                  padding: '8px',
                  color: 'var(--color-primary)'
                }}>
                  <Zap size={20} />
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                  <strong>Connected Address:</strong><br />
                  {account}
                </p>
              </div>
            </div>

            {/* CARD 2: CONTRACT WALLET METRICS */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Inheritance Smart Contract
                  </span>
                  <h3 style={{ fontSize: '1.8rem', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={28} color="var(--color-secondary)" />
                    {contractBalance} ETH
                  </h3>
                </div>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  borderRadius: '12px',
                  padding: '8px',
                  color: 'var(--color-secondary)'
                }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                  <strong>Contract Wallet Address:</strong><br />
                  {contractAddress}
                </p>
              </div>
            </div>
          </div>

          {/* DEAD MAN'S SWITCH MONITOR */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={22} color="var(--color-primary)" />
                  Dead Man's Switch Timer
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Keeps check of your account activity. If no transactions are detected for the configured period, beneficiaries can claim contract funds.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '12px', background: isTriggered ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                  {isTriggered ? (
                    <>
                      <ShieldAlert size={16} color="var(--color-danger)" />
                      <span style={{ fontSize: '13px', color: 'var(--color-danger)', fontWeight: '600' }}>INACTIVE</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} color="var(--color-success)" />
                      <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: '600' }}>MONITORED ACTIVE</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* COUNTDOWN TIMER & PROGRESS BAR */}
            {inactivityPeriod > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Time remaining until switch trigger:</span>
                  <span style={{ color: isTriggered ? 'var(--color-danger)' : 'white', fontFamily: 'monospace', fontWeight: '700', fontSize: '16px' }}>{timeLeftStr}</span>
                </div>
                
                {/* PROGRESS CONTAINER */}
                <div style={{
                  height: '14px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentLeft}%`,
                    background: percentLeft < 20 
                      ? 'linear-gradient(90deg, #ef4444, #f43f5e)' 
                      : percentLeft < 50
                        ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                        : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    borderRadius: '10px',
                    transition: 'width 1s linear',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)'
                  }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <span>Last Activity: {formatTimestamp(lastActivity)}</span>
                  <span>Inactivity Limit: {Math.round(inactivityPeriod / (30 * 24 * 3600))} Months</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  The contract details cannot be fetched, or the contract is not initialized. Go to the <strong>Beneficiary</strong> tab to configure nominees and start monitoring.
                </p>
              </div>
            )}

            {/* PING BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-primary" 
                onClick={handlePing}
                disabled={loading || isTriggered}
                style={{ minWidth: '180px', justifyContent: 'center' }}
              >
                {loading ? "Ping in progress..." : "Verify Activity (Ping)"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
