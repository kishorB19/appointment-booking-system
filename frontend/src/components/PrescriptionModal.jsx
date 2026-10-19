import React from 'react';
import { X, Printer, FileText, CheckCircle, Calendar, User, Stethoscope, MapPin } from 'lucide-react';

export default function PrescriptionModal({ prescription, onClose }) {
  if (!prescription) return null;

  let parsedMedicines = [];
  try {
    if (typeof prescription.medicines === 'string' && prescription.medicines.startsWith('[')) {
      parsedMedicines = JSON.parse(prescription.medicines);
    }
  } catch (e) {
    parsedMedicines = [];
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '700px',
        background: '#ffffff',
        color: '#0f172a',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        position: 'relative'
      }} className="printable-prescription">
        {/* Top Controls (Hidden in print) */}
        <div className="no-print" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background: '#0f172a',
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} color="var(--primary-light)" />
            Official Medical Prescription
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                background: 'var(--primary)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#94a3b8',
                padding: '0.35rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Prescription Slip Content */}
        <div style={{ padding: '2rem 2.25rem' }}>
          {/* Clinic & Doctor Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                {prescription.doctorName || 'Doctor'}
              </h2>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginTop: '0.2rem' }}>
                {prescription.doctorSpecialization || 'General Physician'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} />
                {prescription.clinicAddress || 'Care Medical Center'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#0284c7',
                letterSpacing: '-0.02em'
              }}>
                Medi<span style={{ color: '#0ea5e9' }}>Sync</span> Clinic
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                Rx Ref: #{prescription.id?.toString().padStart(5, '0')}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '0.3rem' }}>
                Date: {prescription.appointmentDate || new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Patient Details Row */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Patient Name
              </span>
              <strong style={{ color: '#0f172a' }}>{prescription.patientName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Email
              </span>
              <span style={{ color: '#334155' }}>{prescription.patientEmail}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Phone
              </span>
              <span style={{ color: '#334155' }}>{prescription.patientPhone || 'N/A'}</span>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Diagnosis & Clinical Assessment
            </div>
            <div style={{
              background: '#f0f9ff',
              borderLeft: '4px solid #0284c7',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#0369a1',
              borderRadius: '0 6px 6px 0'
            }}>
              {prescription.diagnosis}
            </div>
          </div>

          {/* Rx Symbol & Medications */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'serif', color: '#0284c7', lineHeight: 1 }}>
                ℞
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Prescribed Medications
              </span>
            </div>

            {parsedMedicines.length > 0 ? (
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.65rem 0.9rem', color: '#475569' }}>#</th>
                      <th style={{ padding: '0.65rem 0.9rem', color: '#475569' }}>Medicine</th>
                      <th style={{ padding: '0.65rem 0.9rem', color: '#475569' }}>Dosage</th>
                      <th style={{ padding: '0.65rem 0.9rem', color: '#475569' }}>Frequency</th>
                      <th style={{ padding: '0.65rem 0.9rem', color: '#475569' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedMedicines.map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < parsedMedicines.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '0.65rem 0.9rem', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                        <td style={{ padding: '0.65rem 0.9rem', color: '#334155' }}>{m.dosage}</td>
                        <td style={{ padding: '0.65rem 0.9rem', color: '#334155' }}>{m.frequency}</td>
                        <td style={{ padding: '0.65rem 0.9rem', color: '#334155' }}>{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                background: '#fafafa',
                border: '1px dashed #cbd5e1',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#1e293b',
                whiteSpace: 'pre-line'
              }}>
                {prescription.medicines}
              </div>
            )}
          </div>

          {/* Instructions */}
          {prescription.instructions && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Special Instructions & Dietary Advice
              </div>
              <div style={{
                background: '#fefce8',
                border: '1px solid #fef08a',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#854d0e',
                lineHeight: 1.5
              }}>
                {prescription.instructions}
              </div>
            </div>
          )}

          {/* Notes */}
          {prescription.notes && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Physician Notes
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                {prescription.notes}
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '2.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Generated via MediSync Health System • Valid Digital Prescription
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'cursive',
                fontSize: '1.15rem',
                color: '#0369a1',
                marginBottom: '0.2rem'
              }}>
                {prescription.doctorName}
              </div>
              <div style={{
                borderTop: '1px solid #334155',
                width: '160px',
                paddingTop: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase'
              }}>
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
