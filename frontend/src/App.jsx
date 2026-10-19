import React, { useState, useEffect } from 'react';
import { getCurrentUser, setAuthToken, setCurrentUser } from './api';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PatientView from './components/PatientView';
import DoctorView from './components/DoctorView';
import PrescriptionModal from './components/PrescriptionModal';

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState(() => {
    const current = getCurrentUser();
    return current?.role === 'DOCTOR' ? 'appointments' : 'doctors';
  });
  const [activePrescription, setActivePrescription] = useState(null);

  useEffect(() => {
    const handleAuthChange = () => {
      const updated = getCurrentUser();
      setUser(updated);
      if (updated) {
        setActiveTab(updated.role === 'DOCTOR' ? 'appointments' : 'doctors');
      }
    };

    window.addEventListener('care_auth_change', handleAuthChange);
    return () => window.removeEventListener('care_auth_change', handleAuthChange);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab(userData.role === 'DOCTOR' ? 'appointments' : 'doctors');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setUser(null);
  };

  if (!user) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {user.role === 'DOCTOR' ? (
          <DoctorView
            user={user}
            activeTab={activeTab}
            onOpenPrescription={setActivePrescription}
          />
        ) : (
          <PatientView
            activeTab={activeTab}
            onOpenPrescription={setActivePrescription}
          />
        )}
      </main>

      {/* Global Prescription Modal */}
      {activePrescription && (
        <PrescriptionModal
          prescription={activePrescription}
          onClose={() => setActivePrescription(null)}
        />
      )}
    </div>
  );
}
