import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Clock, DollarSign, Award, Star, MapPin, 
  ChevronRight, AlertCircle, CheckCircle, XCircle, FileText, X
} from 'lucide-react';
import { api } from '../api';

export default function PatientView({ activeTab, onOpenPrescription }) {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState('ALL');
  
  const [prescriptions, setPrescriptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    loadDoctors();
    loadSpecializations();
    loadAppointments();
    loadPrescriptions();
  }, []);

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const loadDoctors = async (spec = selectedSpecialization) => {
    try {
      const data = await api.getDoctors(spec);
      setDoctors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSpecializations = async () => {
    try {
      const data = await api.getSpecializations();
      setSpecializations(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await api.getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const data = await api.getMyPrescriptions();
      setPrescriptions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpecializationChange = (spec) => {
    setSelectedSpecialization(spec);
    loadDoctors(spec);
  };

  const handleStartBooking = (doctor) => {
    setBookingDoctor(doctor);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('10:00 AM');
    setBookingReason('');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingDoctor) return;

    setSubmittingBooking(true);
    try {
      await api.bookAppointment({
        doctorId: bookingDoctor.id,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        reason: bookingReason
      });

      showNotification('success', `Appointment booked successfully with ${bookingDoctor.fullName}!`);
      setBookingDoctor(null);
      loadAppointments();
    } catch (err) {
      showNotification('error', err.message || 'Failed to book appointment');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.updateAppointmentStatus(appointmentId, 'CANCELLED', 'Cancelled by patient');
      showNotification('success', 'Appointment cancelled');
      loadAppointments();
    } catch (err) {
      showNotification('error', err.message || 'Failed to cancel appointment');
    }
  };

  const handleViewAppointmentPrescription = async (appointmentId) => {
    try {
      const data = await api.getAppointmentPrescription(appointmentId);
      onOpenPrescription(data);
    } catch (err) {
      showNotification('error', 'Prescription not found or unavailable');
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const query = searchQuery.toLowerCase();
    const matchName = doc.fullName?.toLowerCase().includes(query);
    const matchSpec = doc.specialization?.toLowerCase().includes(query);
    const matchClinic = doc.clinicAddress?.toLowerCase().includes(query);
    return matchName || matchSpec || matchClinic;
  });

  const filteredAppointments = appointments.filter(apt => {
    if (appointmentFilter === 'ALL') return true;
    return apt.status === appointmentFilter;
  });

  // Generate reasonable time slots for booking
  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.25rem' }}>
      {/* Toast Notification */}
      {feedback.message && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 90,
          background: feedback.type === 'success' ? '#064e3b' : '#881337',
          border: `1px solid ${feedback.type === 'success' ? '#059669' : '#e11d48'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.88rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* VIEW: FIND DOCTORS */}
      {activeTab === 'doctors' && (
        <div>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}>
                <CheckCircle size={13} /> Verified Specialists
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Find Experienced Doctors & Schedule Consultations
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Browse top certified medical professionals, view availability schedules, and book appointments in a few clicks.
              </p>
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
              width: '100%',
              maxWidth: '340px'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search doctor, clinic or specialty..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0.4rem 0.2rem',
                  width: '100%',
                  fontSize: '0.9rem',
                  boxShadow: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', color: 'var(--text-dim)', padding: '0.2rem' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Specialty Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => handleSpecializationChange('')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: selectedSpecialization === '' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedSpecialization === '' ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border)'
              }}
            >
              All Specialties
            </button>
            {specializations.map(spec => (
              <button
                key={spec}
                onClick={() => handleSpecializationChange(spec)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedSpecialization === spec ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedSpecialization === spec ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border)'
                }}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctor Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Top Doctor Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                        {doctor.fullName}
                      </h3>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(2, 132, 199, 0.15)',
                        color: 'var(--primary-light)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginTop: '0.25rem'
                      }}>
                        {doctor.specialization}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: '#fbbf24',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      <Star size={13} fill="#fbbf24" stroke="none" />
                      <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.8'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {doctor.bio && (
                    <p style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {doctor.bio}
                    </p>
                  )}

                  {/* Meta details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(15, 23, 42, 0.4)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1.1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Award size={14} color="var(--primary-light)" />
                      <span>{doctor.experienceYears} Years Clinical Experience</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Clock size={14} color="var(--primary-light)" />
                      <span>{doctor.workingHoursStart} - {doctor.workingHoursEnd} ({doctor.availableDays})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={14} color="var(--primary-light)" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doctor.clinicAddress || 'Care Medical Center'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer price & Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                      Consultation Fee
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                      ${doctor.consultationFee?.toFixed(2) || '50.00'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartBooking(doctor)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem 1.15rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    <Calendar size={15} />
                    <span>Book Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)'
            }}>
              <AlertCircle size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
              <p>No doctors found matching your query. Try selecting another specialty or clearing the search filter.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW: MY APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                My Appointments History
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Track upcoming doctor consultations, reviews, and completed prescriptions.
              </p>
            </div>

            {/* Filter Status */}
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}>
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setAppointmentFilter(status)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: appointmentFilter === status ? 'var(--primary)' : 'transparent',
                    color: appointmentFilter === status ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Date Badge */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(2, 132, 199, 0.12)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-light)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>
                      {new Date(apt.appointmentDate + 'T00:00:00').getDate() || '12'}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {new Date(apt.appointmentDate + 'T00:00:00').toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {apt.doctorName}
                      </h4>
                      <span className={`status-badge status-${apt.status?.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--primary-light)', fontWeight: 600, marginTop: '0.2rem' }}>
                      {apt.doctorSpecialization}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      marginTop: '0.45rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {apt.appointmentTime}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} />
                        {apt.clinicAddress || 'Care Clinic'}
                      </span>
                      <span>•</span>
                      <span>Fee: ${apt.consultationFee?.toFixed(2) || '50.00'}</span>
                    </div>

                    {apt.reason && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        background: 'rgba(15, 23, 42, 0.4)',
                        padding: '0.4rem 0.65rem',
                        borderRadius: '6px'
                      }}>
                        <strong>Reason:</strong> {apt.reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {apt.hasPrescription && (
                    <button
                      onClick={() => handleViewAppointmentPrescription(apt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.95rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <FileText size={15} />
                      View Rx
                    </button>
                  )}

                  {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid rgba(244, 63, 94, 0.25)',
                        color: '#fb7185',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                <Calendar size={40} color="var(--text-dim)" style={{ marginBottom: '0.85rem' }} />
                <p>No appointments found in this view.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: MY PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Medical Prescriptions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Access, review, and print prescriptions issued by your attending physicians.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}>
            {prescriptions.map(p => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Rx Ref: #{p.id}
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                        {p.doctorName}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                        {p.doctorSpecialization}
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: 'var(--primary-light)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {p.appointmentDate}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                      Diagnosis
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                      {p.diagnosis}
                    </strong>
                  </div>

                  {p.instructions && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      <strong>Advice:</strong> {p.instructions}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onOpenPrescription(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(2, 132, 199, 0.15)',
                    border: '1px solid rgba(2, 132, 199, 0.3)',
                    color: 'var(--primary-light)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  <FileText size={15} />
                  <span>View Printable Prescription</span>
                </button>
              </div>
            ))}

            {prescriptions.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                <FileText size={40} color="var(--text-dim)" style={{ marginBottom: '0.85rem' }} />
                <p>No prescriptions have been written yet. Completed consultations will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: BOOK APPOINTMENT */}
      {bookingDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 10, 20, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 90
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                  Schedule Consultation
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  {bookingDoctor.fullName}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {bookingDoctor.specialization} • Fee: ${bookingDoctor.consultationFee?.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => setBookingDoctor(null)}
                style={{ background: 'none', color: 'var(--text-muted)', padding: '0.35rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Select Time Slot ({bookingDoctor.workingHoursStart} - {bookingDoctor.workingHoursEnd})
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.45rem',
                  maxHeight: '135px',
                  overflowY: 'auto',
                  padding: '0.2rem'
                }}>
                  {availableSlots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setBookingTime(slot)}
                      style={{
                        padding: '0.45rem 0.2rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: bookingTime === slot ? 'var(--primary)' : 'rgba(15, 23, 42, 0.6)',
                        color: bookingTime === slot ? '#ffffff' : 'var(--text-muted)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  required
                  rows="3"
                  value={bookingReason}
                  onChange={e => setBookingReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit (e.g. routine checkup, persistent cough, skin allergy...)"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    opacity: submittingBooking ? 0.7 : 1
                  }}
                >
                  {submittingBooking ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
