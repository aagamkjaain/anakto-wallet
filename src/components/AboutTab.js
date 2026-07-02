"use client";

import React from 'react';
import { Code, User, Award } from 'lucide-react';

export default function AboutTab() {
  const teamLead = {
    name: "Kartik",
    role: "Team Lead & Lead Smart Contract Architect",
    image: "/images/kartik.jpg",
    bio: "Focuses on blockchain infrastructure, zkSync account abstraction protocols, and secure smart contract compilation.",
    github: "#",
    linkedin: "#",
    instagram: "#"
  };

  const coreTeam = [
    {
      name: "Lallu",
      role: "Core Backend Engineer",
      image: "/images/lallu.jpg",
      bio: "Manages backend state storage, API endpoints integration, and local SQLite data caching layers.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Aagam",
      role: "Frontend Specialist",
      image: "/images/aagam.jpg",
      bio: "Crafts intuitive UI systems, state sync interfaces, and ensures premium responsive styling layouts.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Arora",
      role: "Security Analyst",
      image: "/images/arora.jpg",
      bio: "Audits contract methods, conducts penetration tests, and structures limits logic boundaries.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Anish",
      role: "Database Architect",
      image: "/images/anish.jpg",
      bio: "Maintains relational schema layers, query performance thresholds, and security wrappers.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Pranav",
      role: "QA Tester",
      image: "/images/pranav.jpg",
      bio: "Runs automated network simulators, logs client error states, and verifies MetaMask provider logic.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    },
    {
      name: "Sush",
      role: "Product Designer",
      image: "/images/sush.jpg",
      bio: "Engineers overall UX user flows, visual asset frames, and designs brand style assets.",
      github: "#",
      linkedin: "#",
      instagram: "#"
    }
  ];

  const SocialLink = ({ platform, href }) => {
    const renderIcon = () => {
      if (platform === 'github') {
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            <path d="M9 18c-4.51 2-5-2-7-2"/>
          </svg>
        );
      }
      if (platform === 'linkedin') {
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        );
      }
      if (platform === 'instagram') {
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      }
      return null;
    };

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.background = 'var(--color-primary)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {renderIcon()}
      </a>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* TEAM LEAD SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.15em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={16} /> Project Director
        </h3>
        
        <div className="glass-panel" style={{
          maxWidth: '480px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '3rem 2rem'
        }}>
          {/* PROFILE IMAGE */}
          <div style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={teamLead.image} 
              alt={teamLead.name}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 4px 0', fontFamily: 'var(--font-sans)' }}>{teamLead.name}</h4>
          <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>
            {teamLead.role}
          </span>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            {teamLead.bio}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <SocialLink platform="github" href={teamLead.github} />
            <SocialLink platform="linkedin" href={teamLead.linkedin} />
            <SocialLink platform="instagram" href={teamLead.instagram} />
          </div>
        </div>
      </div>

      {/* CORE TEAM SECTION */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.15em', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <Code size={16} /> Engineering & Design Members
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {coreTeam.map((member, index) => (
            <div key={index} className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2.5rem 1.5rem'
            }}>
              {/* PROFILE IMAGE */}
              <div style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 6px 20px rgba(6, 182, 212, 0.2)',
                marginBottom: '1.2rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'; }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop"; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 4px 0', fontFamily: 'var(--font-sans)' }}>{member.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: '600', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                {member.role}
              </span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '1.5rem', flex: 1 }}>
                {member.bio}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <SocialLink platform="github" href={member.github} />
                <SocialLink platform="linkedin" href={member.linkedin} />
                <SocialLink platform="instagram" href={member.instagram} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
