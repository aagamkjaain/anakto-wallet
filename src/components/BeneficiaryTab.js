"use client";

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Users, Hourglass, Trash2, Plus, RefreshCw, Heart } from 'lucide-react';
import Web3 from 'web3';

export default function BeneficiaryTab() {
  const { 
    account, 
    nominees: currentNominees, 
    inactivityPeriod: currentPeriod, 
    setNomineesOnChain, 
    loading 
  } = useWeb3();

  const [nomineeInputs, setNomineeInputs] = useState([""]);
  const [inactivityMonths, setInactivityMonths] = useState(6);
  const [status, setStatus] = useState("");

  // Sync inputs with smart contract configuration on mount/change
  useEffect(() => {
    if (currentNominees && currentNominees.length > 0) {
      setNomineeInputs(currentNominees);
    } else {
      setNomineeInputs([""]);
    }

    if (currentPeriod) {
      // Convert seconds to months
      const months = currentPeriod / (30 * 24 * 3600);
      // Keep two decimal places or round nicely
      setInactivityMonths(parseFloat(months.toFixed(2)));
    }
  }, [currentNominees, currentPeriod]);

  if (!account) {
    return (
      <div className="glass-panel text-center" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
          Please connect your MetaMask wallet to configure beneficiaries.
        </p>
      </div>
    );
  }

  const handleAddNominee = () => {
    if (nomineeInputs.length >= 5) {
      setStatus("A maximum of 5 nominees can be set on-chain.");
      return;
    }
    setNomineeInputs([...nomineeInputs, ""]);
  };

  const handleRemoveNominee = (index) => {
    if (nomineeInputs.length === 1) {
      // Just clear the single input
      setNomineeInputs([""]);
      return;
    }
    const nextInputs = nomineeInputs.filter((_, i) => i !== index);
    setNomineeInputs(nextInputs);
  };

  const handleInputChange = (index, value) => {
    const nextInputs = [...nomineeInputs];
    nextInputs[index] = value;
    setNomineeInputs(nextInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    // Validate nominee addresses
    const cleanedNominees = [];
    const web3 = new Web3();

    for (let i = 0; i < nomineeInputs.length; i++) {
      const addr = nomineeInputs[i].trim();
      if (addr === "") continue;

      if (!web3.utils.isAddress(addr)) {
        setStatus(`Invalid Ethereum address at nominee input ${i + 1}.`);
        return;
      }
      cleanedNominees.push(addr);
    }

    if (cleanedNominees.length === 0) {
      setStatus("Please enter at least one valid nominee address.");
      return;
    }

    if (cleanedNominees.length > 5) {
      setStatus("Nominees must be between 1 and 5.");
      return;
    }

    const monthsNum = parseFloat(inactivityMonths);
    if (isNaN(monthsNum) || monthsNum < 0.0001) {
      setStatus("Please enter a valid positive inactivity period.");
      return;
    }

    // Convert months to seconds
    const inactivitySeconds = Math.floor(monthsNum * 30 * 24 * 3600);

    try {
      setStatus("Requesting smart contract interaction in MetaMask...");
      await setNomineesOnChain(cleanedNominees, inactivitySeconds);
      setStatus("Nominees and inactivity period set successfully on-chain!");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed: " + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '720px', margin: '0 auto' }}>
      
      {/* INTRO CARD */}
      <div className="glass-panel" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Heart size={32} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white' }}>Inheritance Settings</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Set up trust beneficiaries who will receive your contract balance in case of prolonged account inactivity. The smart contract automatically distributes funds equally among all configured nominees when the inactivity threshold is exceeded.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Users size={24} color="var(--color-secondary)" />
          Nominees & Beneficiaries
        </h2>

        {/* ACTIVE ON-CHAIN VIEW */}
        <div style={{
          padding: '1.2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '18px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Hourglass size={14} /> Active On-Chain Configuration
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Nominees List:</span>
              {currentNominees && currentNominees.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {currentNominees.map((n, i) => (
                    <li key={i} style={{ fontFamily: 'monospace', fontSize: '12px', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', wordBreak: 'break-all' }}>
                      {i + 1}. {n}
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>None configured</span>
              )}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', marginTop: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Inactivity Threshold Period: <strong style={{ color: 'white' }}>{currentPeriod ? `${(currentPeriod / (30*24*3600)).toFixed(1)} Months` : 'Not configured'}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* NOMINEES INPUT GROUP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Beneficiary Nominee Addresses (1-5)</span>
              <button
                type="button"
                onClick={handleAddNominee}
                style={{
                  border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <Plus size={12} /> Add Nominee
              </button>
            </label>

            {nomineeInputs.map((input, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', width: '20px', textAlign: 'right' }}>
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  placeholder={`Enter nominee address ${idx + 1}`}
                  value={input}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="input-field"
                  style={{ margin: 0, flex: 1 }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNominee(idx)}
                  style={{
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: 'var(--color-danger)',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* INACTIVITY PERIOD INPUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Inactivity Period (Months)</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{inactivityMonths} Months</span>
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="range"
                min="0.1"
                max="24"
                step="0.1"
                value={inactivityMonths}
                onChange={(e) => setInactivityMonths(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px'
                }}
                disabled={loading}
              />
              <input
                type="number"
                min="0.001"
                step="0.1"
                value={inactivityMonths}
                onChange={(e) => setInactivityMonths(parseFloat(e.target.value) || 0.1)}
                className="input-field"
                style={{ width: '90px', margin: 0, padding: '8px 12px', borderRadius: '12px', textAlign: 'center' }}
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
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Signing Transaction...
              </>
            ) : "Save Settings to Blockchain"}
          </button>

        </form>
      </div>

    </div>
  );
}
