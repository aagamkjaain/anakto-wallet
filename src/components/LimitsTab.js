"use client";

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Sliders, Shield, Info } from 'lucide-react';

export default function LimitsTab() {
  const { account, limits, setLimitsInDb, loading } = useWeb3();
  const [lowerLimit, setLowerLimit] = useState("");
  const [upperLimit, setUpperLimit] = useState("");
  const [status, setStatus] = useState("");

  // Sync inputs with state on mount/change
  useEffect(() => {
    if (limits.lowerLimit !== null) {
      setLowerLimit(limits.lowerLimit.toString());
    }
    if (limits.upperLimit !== null) {
      setUpperLimit(limits.upperLimit.toString());
    }
  }, [limits]);

  if (!account) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
          Please connect your MetaMask wallet to view and manage spending limits.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!lowerLimit || !upperLimit) {
      setStatus("Please enter both lower and upper limits.");
      return;
    }

    if (parseFloat(lowerLimit) < 0 || parseFloat(upperLimit) < 0) {
      setStatus("Limits must be positive numbers.");
      return;
    }

    if (parseFloat(lowerLimit) >= parseFloat(upperLimit)) {
      setStatus("The lower limit must be less than the upper limit.");
      return;
    }

    try {
      setStatus("Saving spending limits to database...");
      await setLimitsInDb(parseFloat(lowerLimit), parseFloat(upperLimit));
      setStatus(`Limits set successfully! Lower: ${lowerLimit} ETH, Upper: ${upperLimit} ETH`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to save limits: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      
      {/* EXPLANATION INFO */}
      <div className="glass-panel" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Shield size={32} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white' }}>Smart Spending Guardrails</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Setting limits helps safeguard your wallet against anomalous transactions. Lower limit represents normal transaction ceilings, and upper limit marks high-alert threshold ranges. Transactions breaching these ceilings require extra validations or nominee signatures.
          </p>
        </div>
      </div>

      {/* FORM AND CURRENT VALUES */}
      <div className="glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Sliders size={24} color="var(--color-secondary)" />
          Manage Spending Limits
        </h2>
        
        {/* CURRENT VALUES DISPLAY */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Current Lower Limit
            </span>
            <span style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>
              {limits.lowerLimit !== null ? `${limits.lowerLimit} ETH` : 'Not Set'}
            </span>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Current Upper Limit
            </span>
            <span style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>
              {limits.upperLimit !== null ? `${limits.upperLimit} ETH` : 'Not Set'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* LOWER LIMIT INPUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                Lower Limit (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="Enter lower limit"
                value={lowerLimit}
                onChange={(e) => setLowerLimit(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* UPPER LIMIT INPUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                Upper Limit (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="Enter upper limit"
                value={upperLimit}
                onChange={(e) => setUpperLimit(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>
          </div>

          {/* STATUS LOG */}
          {status && (
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              background: status.includes("successfully") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              border: `1px solid ${status.includes("successfully") ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)'}`,
              fontSize: '14px',
              color: status.includes("successfully") ? 'var(--color-success)' : 'white'
            }}>
              {status}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ justifyContent: 'center', marginTop: '1rem' }}
          >
            {loading ? "Saving limits..." : "Save Limits"}
          </button>

        </form>
      </div>

    </div>
  );
}
