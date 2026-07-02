"use client";

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sliders, 
  Users, 
  Info, 
  LogOut, 
  Wallet,
  Globe
} from 'lucide-react';

// Import Tab Components
import DashboardTab from '@/components/DashboardTab';
import SendTab from '@/components/SendTab';
import ReceiveTab from '@/components/ReceiveTab';
import LimitsTab from '@/components/LimitsTab';
import BeneficiaryTab from '@/components/BeneficiaryTab';
import AboutTab from '@/components/AboutTab';

export default function Home() {
  const { account, network, connectWallet, disconnectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deposit', label: 'Send / Deposit', icon: ArrowUpRight },
    { id: 'receive', label: 'Receive', icon: ArrowDownLeft },
    { id: 'setlimit', label: 'Set Limit', icon: Sliders },
    { id: 'beneficiary', label: 'Beneficiary', icon: Users },
  ];

  const handleLogout = () => {
    disconnectWallet();
    setIsLoggedOut(true);
  };

  const handleGoBack = () => {
    setIsLoggedOut(false);
    setActiveTab('dashboard');
  };

  if (isLoggedOut) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
        <div className="glass-panel text-center max-w-md w-full" style={{ textAlign: 'center', padding: '3rem', width: '90%', maxWidth: '480px' }}>
          <LogOut size={64} className="mx-auto text-purple-500 mb-6" style={{ margin: '0 auto 1.5rem', color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>LOGGED OUT</h2>
          <p style={{ marginBottom: '2rem' }}>You have successfully disconnected your wallet. Access to blockchain operations is limited.</p>
          <button className="btn-primary" onClick={handleGoBack}>
            Connect Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      {/* BACKGROUND DECORATIONS */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'pulseGlow 10s ease infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-secondary-glow) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1,
        pointerEvents: 'none',
        animation: 'pulseGlow 12s ease infinite'
      }}></div>

      {/* SIDEBAR */}
      <aside style={{
        width: '280px',
        background: 'rgba(5, 2, 18, 0.45)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid var(--glass-border)',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* BRAND LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3.5rem', paddingLeft: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
          }}>
            <Wallet size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>ANAKTO</h1>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' 
                    : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <IconComponent 
                  size={18} 
                  color={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                  style={{ transition: 'color 0.3s' }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('aboutus')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '16px',
              border: 'none',
              background: activeTab === 'aboutus' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              color: activeTab === 'aboutus' ? 'white' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: activeTab === 'aboutus' ? '600' : '500',
              transition: 'all 0.2s ease'
            }}
          >
            <Info size={18} />
            About Us
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '16px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-danger)',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        padding: '3rem 4rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        {/* HEADER BAR */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
              Modular AA Wallet
            </span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>
              {activeTab === 'dashboard' && 'Overview'}
              {activeTab === 'deposit' && 'Send & Deposit'}
              {activeTab === 'receive' && 'Receive Assets'}
              {activeTab === 'setlimit' && 'Spending limits'}
              {activeTab === 'beneficiary' && 'Nominees & Switch Settings'}
              {activeTab === 'aboutus' && 'About the Creators'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {account && (
              <div className="status-badge">
                <Globe size={14} color="var(--color-text-secondary)" />
                <span>{network || "Ethereum"}</span>
                <span className="status-dot active"></span>
              </div>
            )}
            
            {account ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '14px',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>
            ) : (
              <button className="btn-primary" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* TAB VIEWS */}
        <div style={{ flex: 1 }}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'deposit' && <SendTab />}
          {activeTab === 'receive' && <ReceiveTab />}
          {activeTab === 'setlimit' && <LimitsTab />}
          {activeTab === 'beneficiary' && <BeneficiaryTab />}
          {activeTab === 'aboutus' && <AboutTab />}
        </div>
      </main>
    </div>
  );
}
