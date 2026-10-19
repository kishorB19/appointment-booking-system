import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, FileText, 
  User, Plus, Trash2, Save, MapPin, DollarSign, Award, Check
} from 'lucide-react';
import { api } from '../api';

export default function DoctorView({ user, activeTab, onOpenPrescription }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Prescription Composer Modal State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [savingPrescription, setSavingPrescription] = useState(false);

  // Profile & Availability State
  const [profile, setProfile] = useState({
    specialization: 'General Physician',
    experienceYears: 5,
    consultationFee: 50,
    bio: '',
    availableDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    clinicAddress: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadPrescriptions();
    loadProfile();
  }, []);

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
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

  const loadProfile = async () => {
    try {
      const doc = await api.getDoctor(user.id);
      if (doc) {
        setProfile({
          specialization: doc.specialization || '',
          experienceYears: doc.experienceYears || 5,
          consultationFee: doc.consultationFee || 50,
          bio: doc.bio || '',
          availableDays: doc.availableDays || 'Monday,Tuesday,Wednesday,Thursday,Friday',
          workingHoursStart: doc.workingHoursStart || '09:00',
          workingHoursEnd: doc.workingHoursEnd || '17:00',
          clinicAddress: doc.clinicAddress || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await api.updateAppointmentStatus(appointmentId, status);
      showNotification('success', `Appointment status updated to ${status}`);
      loadAppointments();
    } catch (err) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  const handleOpenComposer = async (apt) => {
    setSelectedAppointment(apt);
    // Check if prescription already exists for this appointment
    try {
      const existing = await api.getAppointmentPrescription(apt.id);
      if (existing) {
        setDiagnosis(existing.diagnosis || '');
        setInstructions(existing.instructions || '');
        setNotes(existing.notes || '');
        if (existing.medicines && existing.medicines.startsWith('[')) {
          setMedicines(JSON.parse(existing.medicines));
        } else {
          setMedicines([{ name: existing.medicines || '', dosage: '', frequency: '', duration: '' }]);
        }
        return;
      }
    } catch {
      // none yet
    }

    setDiagnosis('');
    setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
    setInstructions('');
    setNotes('');
  };

  const handleAddMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const validMeds = medicines.filter(m => m.name.trim() !== '');
    if (validMeds.length === 0) {
      showNotification('error', 'Please enter at least one medication');
      return;
    }

    setSavingPrescription(true);
    try {
      await api.savePrescription(selectedAppointment.id, {
        diagnosis,
        medicines: JSON.stringify(validMeds),
        instructions,
        notes
      });

      showNotification('success', 'Prescription saved & consultation completed!');
      setSelectedAppointment(null);
      loadAppointments();
      loadPrescriptions();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save prescription');
    } finally {
      setSavingPrescription(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateDoctorProfile(profile);
      showNotification('success', 'Availability schedule & profile successfully saved!');
    } catch (err) {
      showNotification('error', err.message || 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleDay = (day) => {
    const currentDays = profile.availableDays ? profile.availableDays.split(',').map(d => d.trim()) : [];
    let updated;
    if (currentDays.includes(day)) {
      updated = currentDays.filter(d => d !== day);
    } else {
      updated = [...currentDays, day];
    }
    setProfile({ ...profile, availableDays: updated.join(',') });
  };

  const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayStr = new Date().toISOString().split('T')[0];

  // Stats calculation
  const totalCount = appointments.length;
  const todayCount = appointments.filter(a => a.appointmentDate === todayStr).length;
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'ALL') return true;
    if (filter === 'TODAY') return apt.appointmentDate === todayStr;
    return apt.status === filter;
  });

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
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* VIEW: APPOINTMENTS QUEUE */}
      {activeTab === 'appointments' && (
        <div>
          {/* KPI Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  {totalCount}
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(2, 132, 199, 0.15)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={22} />
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Patients</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                  {todayCount}
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={22} />
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Action</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
                  {pendingCount}
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={22} />
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Consultations Done</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
                  {completedCount}
                </div>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Table / List Header Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Consultation Appointments
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Manage patient appointments, confirm visits, or issue prescriptions.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.35rem',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}>
              {['ALL', 'TODAY', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(item => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: filter === item ? 'var(--primary)' : 'transparent',
                    color: filter === item ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
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
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>
                      {new Date(apt.appointmentDate + 'T00:00:00').getDate()}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {new Date(apt.appointmentDate + 'T00:00:00').toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {apt.patientName}
                      </h4>
                      <span className={`status-badge status-${apt.status?.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      marginTop: '0.35rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {apt.appointmentTime}
                      </span>
                      <span>•</span>
                      <span>{apt.patientEmail}</span>
                      <span>•</span>
                      <span>{apt.patientPhone || 'No phone'}</span>
                    </div>

                    {apt.reason && (
                      <div style={{
                        marginTop: '0.45rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        background: 'rgba(15, 23, 42, 0.4)',
                        padding: '0.4rem 0.65rem',
                        borderRadius: '6px'
                      }}>
                        <strong>Chief Complaint:</strong> {apt.reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {apt.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.5rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}
                      >
                        <Check size={14} />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                        style={{
                          padding: '0.5rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#fb7185',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {apt.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleOpenComposer(apt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                      }}
                    >
                      <FileText size={15} />
                      Complete & Write Rx
                    </button>
                  )}

                  {apt.status === 'COMPLETED' && (
                    <button
                      onClick={() => handleOpenComposer(apt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
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
                      View / Edit Rx
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                <Calendar size={40} color="var(--text-dim)" style={{ marginBottom: '0.85rem' }} />
                <p>No appointments match the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: AVAILABILITY & PROFILE */}
      {activeTab === 'availability' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Practice Availability & Clinical Profile
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Define the days and hours you accept patient bookings and customize your consultation rates.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem'
          }}>
            {/* Days of week selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                Weekly Consultation Days
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {allWeekDays.map(day => {
                  const isSelected = profile.availableDays?.split(',').map(d => d.trim()).includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      style={{
                        padding: '0.55rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        background: isSelected ? 'var(--primary)' : 'rgba(15, 23, 42, 0.7)',
                        color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        border: `1px solid ${isSelected ? 'var(--primary-light)' : 'var(--border)'}`
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Working Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Consultation Start Time
                </label>
                <input
                  type="text"
                  value={profile.workingHoursStart}
                  onChange={e => setProfile({ ...profile, workingHoursStart: e.target.value })}
                  placeholder="09:00"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Consultation End Time
                </label>
                <input
                  type="text"
                  value={profile.workingHoursEnd}
                  onChange={e => setProfile({ ...profile, workingHoursEnd: e.target.value })}
                  placeholder="17:00"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Specialty & Fee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Specialization
                </label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={profile.consultationFee}
                  onChange={e => setProfile({ ...profile, consultationFee: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  value={profile.experienceYears}
                  onChange={e => setProfile({ ...profile, experienceYears: parseInt(e.target.value, 10) || 1 })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Clinic Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Clinic / Hospital Address
              </label>
              <input
                type="text"
                value={profile.clinicAddress}
                onChange={e => setProfile({ ...profile, clinicAddress: e.target.value })}
                placeholder="Apex Medical Care Center, Suite 402"
                style={{ width: '100%' }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Doctor Bio & Clinical Expertise
              </label>
              <textarea
                rows="3"
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                opacity: savingProfile ? 0.7 : 1
              }}
            >
              <Save size={16} />
              {savingProfile ? 'Saving...' : 'Save Availability & Profile'}
            </button>
          </form>
        </div>
      )}

      {/* VIEW: ISSUED PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Issued Prescriptions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Review digital prescriptions written for completed consultations.
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
                        {p.patientName}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {p.patientEmail}
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
                  <span>Preview Prescription Slip</span>
                </button>
              </div>
            ))}

            {prescriptions.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                <FileText size={40} color="var(--text-dim)" style={{ marginBottom: '0.85rem' }} />
                <p>No prescriptions issued yet. Completed patient appointments with Rx will be stored here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PRESCRIPTION COMPOSER */}
      {selectedAppointment && (
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
          zIndex: 90,
          overflowY: 'auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
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
                  Digital Prescription Composer
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  Patient: {selectedAppointment.patientName}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Visit Date: {selectedAppointment.appointmentDate} • Reason: {selectedAppointment.reason}
                </div>
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                style={{ background: 'none', color: 'var(--text-muted)', padding: '0.35rem' }}
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* Composer Form */}
            <form onSubmit={handleSavePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Diagnosis */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                  Clinical Diagnosis <span style={{ color: '#fb7185' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Pharyngitis, Seasonal Allergy, Mild Hypertension..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Medications List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                    Prescribed Medications (Rx)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(2, 132, 199, 0.15)',
                      color: 'var(--primary-light)',
                      border: '1px solid rgba(2, 132, 199, 0.3)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700
                    }}
                  >
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {medicines.map((med, idx) => (
                    <div key={idx} style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1.5fr 1.2fr 34px',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        placeholder="Medicine Name (e.g. Amoxicillin)"
                        value={med.name}
                        onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        value={med.dosage}
                        onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Frequency (2x daily)"
                        value={med.frequency}
                        onChange={e => handleMedicineChange(idx, 'frequency', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Duration (5 days)"
                        value={med.duration}
                        onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(idx)}
                        style={{
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(244, 63, 94, 0.1)',
                          color: '#fb7185',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(244, 63, 94, 0.2)'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Special Instructions / Care Advice
                </label>
                <textarea
                  rows="2"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Take with food. Drink plenty of warm water. Avoid dairy products for 48 hours."
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Doctor Internal / Follow-up Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Patient to return in 10 days for follow-up evaluation."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
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
                  disabled={savingPrescription}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    opacity: savingPrescription ? 0.7 : 1
                  }}
                >
                  <Save size={16} />
                  {savingPrescription ? 'Saving...' : 'Save & Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
