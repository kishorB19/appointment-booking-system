import React, { useState } from 'react';
import { Activity, User, Stethoscope, Lock, Mail, Phone, MapPin, Award, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../api';

export default function AuthModal({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('General Physician');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationFee, setConsultationFee] = useState(50);
  const [bio, setBio] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await api.register({
          email,
          password,
          fullName,
          phone,
          role,
          ...(role === 'DOCTOR' ? {
            specialization,
            experienceYears: Number(experienceYears),
            consultationFee: Number(consultationFee),
            bio,
            clinicAddress
          } : {})
        });
      } else {
        data = await api.login(email, password);
      }

      setAuthToken(data.token);
      setCurrentUser(data);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    try {
      const data = await api.login(demoEmail, demoPassword);
      setAuthToken(data.token);
      setCurrentUser(data);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
            marginBottom: '0.85rem'
          }}>
            <Activity size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            {isRegister ? 'Create Account' : 'Welcome to MediSync'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {isRegister
              ? 'Join as a Patient or Doctor to get started'
              : 'Sign in to access your consultations and appointments'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>•</span>
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle for Registration */}
        {isRegister && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: role === 'PATIENT' ? 'var(--primary)' : 'transparent',
                color: role === 'PATIENT' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              <User size={16} />
              Patient Role
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: role === 'DOCTOR' ? 'var(--primary)' : 'transparent',
                color: role === 'DOCTOR' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              <Stethoscope size={16} />
              Doctor Role
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={role === 'DOCTOR' ? 'Dr. Ananya Iyer' : 'Arjun Patel'}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="arjun@example.com"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Phone Number (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Doctor specific fields */}
          {isRegister && role === 'DOCTOR' && (
            <div style={{
              background: 'rgba(2, 132, 199, 0.06)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginTop: '0.25rem'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Doctor Details
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Medical Specialization
                </label>
                <select
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={experienceYears}
                    onChange={e => setExperienceYears(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={consultationFee}
                    onChange={e => setConsultationFee(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Clinic Address
                </label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={e => setClinicAddress(e.target.value)}
                  placeholder="Medical Center, Suite 101"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Professional Bio
                </label>
                <textarea
                  rows="2"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Experienced specialist dedicated to comprehensive care..."
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Register & Continue' : 'Sign In')}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{
              background: 'none',
              color: 'var(--primary-light)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"}
          </button>
        </div>

        {/* 1-Click Demo Accounts */}
        {!isRegister && (
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instant Demo Logins
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={12} /> Seeded & Ready
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('patient@demo.com', 'password123')}
                style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <User size={14} />
                <span>Patient (Arjun)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('doctor.ananya@demo.com', 'password123')}
                style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(2, 132, 199, 0.12)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Stethoscope size={14} />
                <span>Dr. Ananya (Cardio)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('doctor.vikram@demo.com', 'password123')}
                style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  color: '#c084fc',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Stethoscope size={14} />
                <span>Dr. Vikram (Derma)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('doctor.meera@demo.com', 'password123')}
                style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Stethoscope size={14} />
                <span>Dr. Meera (Pedia)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
