import React from 'react';
import { Activity, Calendar, UserCheck, Stethoscope, FileText, Clock, LogOut, User } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  const isDoctor = user?.role === 'DOCTOR';

  return (
    <header style={{
      background: 'rgba(19, 27, 46, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
        }}>
          <Activity size={22} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Medi<span style={{ color: 'var(--primary-light)' }}>Sync</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {isDoctor ? 'Doctor Portal' : 'Patient Care'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {!isDoctor ? (
          <>
            <button
              onClick={() => setActiveTab('doctors')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'doctors' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'doctors' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Stethoscope size={16} />
              Find Doctors
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'appointments' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'appointments' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Calendar size={16} />
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'prescriptions' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'prescriptions' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <FileText size={16} />
              My Prescriptions
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'appointments' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'appointments' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Calendar size={16} />
              Appointments Queue
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'availability' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'availability' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Clock size={16} />
              Availability & Profile
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'prescriptions' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'prescriptions' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <FileText size={16} />
              Issued Prescriptions
            </button>
          </>
        )}
      </nav>

      {/* User Info & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '9999px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isDoctor ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDoctor ? '#38bdf8' : '#34d399'
          }}>
            <User size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.1 }}>
              {user?.fullName || user?.email}
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: isDoctor ? '#38bdf8' : '#34d399',
              fontWeight: 600,
              letterSpacing: '0.04em'
            }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign out"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'rgba(244, 63, 94, 0.1)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
