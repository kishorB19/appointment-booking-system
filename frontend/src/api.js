const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

export function getAuthToken() {
  return localStorage.getItem('care_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('care_token', token);
  } else {
    localStorage.removeItem('care_token');
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem('care_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('care_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('care_user');
  }
}

// -------------------------------------------------------------
// Cloud / Offline Mock Store for Vercel Serverless Hosting
// Ensures the deployed site works 100% without a separate cloud Java host
// -------------------------------------------------------------
const INITIAL_DOCTORS = [
  {
    id: 2,
    profileId: 1,
    fullName: "Dr. Ananya Iyer",
    email: "doctor.ananya@demo.com",
    phone: "+91 97654 32109",
    specialization: "Cardiology",
    experienceYears: 12,
    consultationFee: 75.0,
    bio: "Board-certified cardiologist specializing in preventive cardiology, hypertension, and advanced heart health.",
    availableDays: "Monday,Tuesday,Wednesday,Thursday,Friday",
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    rating: 4.9,
    clinicAddress: "Shree Heart & Vascular Center, Banjara Hills"
  },
  {
    id: 3,
    profileId: 2,
    fullName: "Dr. Vikram Deshmukh",
    email: "doctor.vikram@demo.com",
    phone: "+91 96543 21098",
    specialization: "Dermatology",
    experienceYears: 8,
    consultationFee: 60.0,
    bio: "Specializing in medical, surgical, and cosmetic dermatology with patient-first precision.",
    availableDays: "Monday,Wednesday,Thursday,Saturday",
    workingHoursStart: "10:00",
    workingHoursEnd: "18:00",
    rating: 4.8,
    clinicAddress: "Radiant Skin Clinic, MG Road, Pune"
  },
  {
    id: 4,
    profileId: 3,
    fullName: "Dr. Meera Krishnan",
    email: "doctor.meera@demo.com",
    phone: "+91 95432 10987",
    specialization: "Pediatrics",
    experienceYears: 10,
    consultationFee: 55.0,
    bio: "Compassionate pediatrician devoted to child wellness, immunization, and newborn development.",
    availableDays: "Monday,Tuesday,Wednesday,Friday",
    workingHoursStart: "08:30",
    workingHoursEnd: "16:30",
    rating: 4.9,
    clinicAddress: "Little Stars Children's Clinic, Koramangala"
  },
  {
    id: 5,
    profileId: 4,
    fullName: "Dr. Rajesh Nair",
    email: "doctor.rajesh@demo.com",
    phone: "+91 94321 09876",
    specialization: "Neurology",
    experienceYears: 15,
    consultationFee: 90.0,
    bio: "Expert neurologist focused on migraines, neurological diagnostic care, and neuro-rehabilitation.",
    availableDays: "Tuesday,Thursday,Friday",
    workingHoursStart: "09:00",
    workingHoursEnd: "15:00",
    rating: 4.7,
    clinicAddress: "Neuro Life Institute, Jubilee Hills"
  }
];

const STORE_VERSION = 'care_data_v3';

function getLocalStore(key, defaultVal) {
  const data = localStorage.getItem(`care_${key}`);
  if (!data) {
    localStorage.setItem(`care_${key}`, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    const parsed = JSON.parse(data);
    if (key === 'doctors' && (!Array.isArray(parsed) || parsed.length === 0)) {
      localStorage.setItem(`care_${key}`, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return parsed;
  } catch {
    return defaultVal;
  }
}

function setLocalStore(key, val) {
  localStorage.setItem(`care_${key}`, JSON.stringify(val));
}

function initMockData() {
  // If version mismatch or missing, refresh mock cache so updated Hindu names load properly
  if (localStorage.getItem('care_version') !== STORE_VERSION) {
    localStorage.setItem('care_version', STORE_VERSION);
    setLocalStore('doctors', INITIAL_DOCTORS);
    setLocalStore('appointments', [
      {
        id: 101,
        patientId: 1,
        patientName: "Arjun Patel",
        patientEmail: "patient@demo.com",
        patientPhone: "+91 98765 43210",
        doctorId: 2,
        doctorName: "Dr. Ananya Iyer",
        doctorEmail: "doctor.ananya@demo.com",
        doctorSpecialization: "Cardiology",
        consultationFee: 75.0,
        clinicAddress: "Shree Heart & Vascular Center, Banjara Hills",
        appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        appointmentTime: "10:00 AM",
        status: "CONFIRMED",
        reason: "Regular cardiac checkup and blood pressure assessment",
        createdAt: new Date().toISOString(),
        hasPrescription: false
      },
      {
        id: 102,
        patientId: 1,
        patientName: "Arjun Patel",
        patientEmail: "patient@demo.com",
        patientPhone: "+91 98765 43210",
        doctorId: 3,
        doctorName: "Dr. Vikram Deshmukh",
        doctorEmail: "doctor.vikram@demo.com",
        doctorSpecialization: "Dermatology",
        consultationFee: 60.0,
        clinicAddress: "Radiant Skin Clinic, MG Road, Pune",
        appointmentDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        appointmentTime: "02:30 PM",
        status: "COMPLETED",
        reason: "Consultation regarding persistent skin rash on right arm",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        hasPrescription: true,
        prescriptionId: 501
      }
    ]);
    setLocalStore('prescriptions', [
      {
        id: 501,
        appointmentId: 102,
        appointmentDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        appointmentTime: "02:30 PM",
        doctorId: 3,
        doctorName: "Dr. Vikram Deshmukh",
        doctorSpecialization: "Dermatology",
        clinicAddress: "Radiant Skin Clinic, MG Road, Pune",
        patientId: 1,
        patientName: "Arjun Patel",
        patientEmail: "patient@demo.com",
        patientPhone: "+91 98765 43210",
        diagnosis: "Contact Dermatitis with mild allergic irritation",
        medicines: JSON.stringify([
          { name: "Hydrocortisone Cream 1%", dosage: "Thin layer", frequency: "2x daily", duration: "7 days" },
          { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "At bedtime", duration: "5 days" }
        ]),
        instructions: "Avoid harsh soaps and hot water baths. Keep skin moisturized with gentle hypoallergenic lotion.",
        notes: "Patient responded well to initial exam. Follow up in 10 days if symptoms persist.",
        createdAt: new Date().toISOString()
      }
    ]);
    return;
  }

  const existingDocs = getLocalStore('doctors', INITIAL_DOCTORS);
  if (!Array.isArray(existingDocs) || existingDocs.length === 0) {
    setLocalStore('doctors', INITIAL_DOCTORS);
  }
}

initMockData();

// -------------------------------------------------------------
// Fallback Mock Request Handler
// -------------------------------------------------------------
function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const currentUser = getCurrentUser();

  // 1. Auth Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    if (email === 'patient@demo.com' || email.includes('patient')) {
      return {
        token: 'demo-patient-token-xyz',
        id: 1,
        email: email,
        fullName: 'Arjun Patel',
        phone: '+91 98765 43210',
        role: 'PATIENT'
      };
    }
    const doctors = getLocalStore('doctors', INITIAL_DOCTORS);
    const matchedDoctor = doctors.find(d => d.email.toLowerCase() === email.toLowerCase());
    if (matchedDoctor) {
      return {
        token: 'demo-doctor-token-xyz',
        id: matchedDoctor.id,
        email: matchedDoctor.email,
        fullName: matchedDoctor.fullName,
        phone: matchedDoctor.phone,
        role: 'DOCTOR',
        doctorProfileId: matchedDoctor.profileId
      };
    }
    // Generic login fallback
    return {
      token: 'demo-user-token-xyz',
      id: 99,
      email: email,
      fullName: email.split('@')[0],
      phone: '+1 (555) 000-0000',
      role: email.includes('doctor') ? 'DOCTOR' : 'PATIENT'
    };
  }

  // 2. Auth Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const newId = Date.now();
    const newUser = {
      token: `demo-token-${newId}`,
      id: newId,
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      role: body.role,
      doctorProfileId: body.role === 'DOCTOR' ? newId : null
    };

    if (body.role === 'DOCTOR') {
      const doctors = getLocalStore('doctors', INITIAL_DOCTORS);
      doctors.push({
        id: newId,
        profileId: newId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        specialization: body.specialization || 'General Physician',
        experienceYears: body.experienceYears || 5,
        consultationFee: body.consultationFee || 50,
        bio: body.bio || '',
        availableDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00',
        rating: 4.8,
        clinicAddress: body.clinicAddress || 'Care Medical Center'
      });
      setLocalStore('doctors', doctors);
    }
    return newUser;
  }

  // 3. Doctors List
  if (endpoint.startsWith('/doctors') && method === 'GET') {
    const doctors = getLocalStore('doctors', INITIAL_DOCTORS);
    if (endpoint === '/doctors/specializations') {
      const specs = [...new Set(doctors.map(d => d.specialization))].sort();
      return specs;
    }
    const matchId = endpoint.match(/^\/doctors\/(\d+)$/);
    if (matchId) {
      const doc = doctors.find(d => d.id === parseInt(matchId[1], 10));
      return doc || doctors[0];
    }
    const url = new URL(`http://localhost${endpoint}`);
    const spec = url.searchParams.get('specialization');
    if (spec) {
      return doctors.filter(d => d.specialization.toLowerCase().includes(spec.toLowerCase()));
    }
    return doctors;
  }

  // 4. Update Doctor Profile & Availability
  if (endpoint === '/doctors/profile' && method === 'PUT') {
    const doctors = getLocalStore('doctors', INITIAL_DOCTORS);
    const docIdx = doctors.findIndex(d => d.id === currentUser?.id);
    if (docIdx >= 0) {
      doctors[docIdx] = { ...doctors[docIdx], ...body };
      setLocalStore('doctors', doctors);
      return doctors[docIdx];
    }
    return body;
  }

  // 5. Book Appointment
  if (endpoint === '/appointments' && method === 'POST') {
    const appointments = getLocalStore('appointments', []);
    const doctors = getLocalStore('doctors', INITIAL_DOCTORS);
    const doctor = doctors.find(d => d.id === body.doctorId) || doctors[0];
    
    const newApt = {
      id: Date.now(),
      patientId: currentUser?.id || 1,
      patientName: currentUser?.fullName || 'Arjun Patel',
      patientEmail: currentUser?.email || 'patient@demo.com',
      patientPhone: currentUser?.phone || '+91 98765 43210',
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      doctorEmail: doctor.email,
      doctorSpecialization: doctor.specialization,
      consultationFee: doctor.consultationFee,
      clinicAddress: doctor.clinicAddress,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      status: 'PENDING',
      reason: body.reason,
      createdAt: new Date().toISOString(),
      hasPrescription: false
    };

    appointments.unshift(newApt);
    setLocalStore('appointments', appointments);
    return newApt;
  }

  // 6. Get My Appointments
  if (endpoint === '/appointments/my' && method === 'GET') {
    const appointments = getLocalStore('appointments', []);
    if (currentUser?.role === 'DOCTOR') {
      return appointments.filter(a => a.doctorId === currentUser?.id);
    }
    return appointments.filter(a => a.patientId === currentUser?.id || a.patientEmail === currentUser?.email);
  }

  // 7. Update Appointment Status
  if (endpoint.startsWith('/appointments/') && endpoint.endsWith('/status') && method === 'PATCH') {
    const aptId = parseInt(endpoint.split('/')[2], 10);
    const appointments = getLocalStore('appointments', []);
    const target = appointments.find(a => a.id === aptId);
    if (target) {
      target.status = body.status;
      if (body.cancellationReason) {
        target.cancellationReason = body.cancellationReason;
      }
      setLocalStore('appointments', appointments);
      return target;
    }
    return null;
  }

  // 8. Prescriptions
  if (endpoint.startsWith('/prescriptions/appointment/') && method === 'GET') {
    const aptId = parseInt(endpoint.split('/')[3], 10);
    const prescriptions = getLocalStore('prescriptions', []);
    return prescriptions.find(p => p.appointmentId === aptId) || null;
  }

  if (endpoint.startsWith('/prescriptions/appointment/') && method === 'POST') {
    const aptId = parseInt(endpoint.split('/')[3], 10);
    const appointments = getLocalStore('appointments', []);
    const prescriptions = getLocalStore('prescriptions', []);
    const apt = appointments.find(a => a.id === aptId);

    const newPresc = {
      id: Date.now(),
      appointmentId: aptId,
      appointmentDate: apt?.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: apt?.appointmentTime || '10:00 AM',
      doctorId: currentUser?.id || apt?.doctorId,
      doctorName: currentUser?.fullName || apt?.doctorName,
      doctorSpecialization: apt?.doctorSpecialization || 'General Physician',
      clinicAddress: apt?.clinicAddress || 'Care Clinic',
      patientId: apt?.patientId,
      patientName: apt?.patientName,
      patientEmail: apt?.patientEmail,
      patientPhone: apt?.patientPhone,
      diagnosis: body.diagnosis,
      medicines: body.medicines,
      instructions: body.instructions,
      notes: body.notes,
      createdAt: new Date().toISOString()
    };

    if (apt) {
      apt.status = 'COMPLETED';
      apt.hasPrescription = true;
      apt.prescriptionId = newPresc.id;
      setLocalStore('appointments', appointments);
    }

    prescriptions.unshift(newPresc);
    setLocalStore('prescriptions', prescriptions);
    return newPresc;
  }

  if (endpoint === '/prescriptions/my' && method === 'GET') {
    const prescriptions = getLocalStore('prescriptions', []);
    if (currentUser?.role === 'DOCTOR') {
      return prescriptions.filter(p => p.doctorId === currentUser?.id);
    }
    return prescriptions.filter(p => p.patientId === currentUser?.id || p.patientEmail === currentUser?.email);
  }

  return null;
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (response.status === 401) {
      setAuthToken(null);
      setCurrentUser(null);
      window.dispatchEvent(new Event('care_auth_change'));
    }

    // If server error, proxy error, 404, or 405 occurs, fall back to mock data
    if (!response.ok) {
      const mockResult = handleMockRequest(endpoint, options);
      if (mockResult !== null && mockResult !== undefined) {
        return mockResult;
      }

      let errorMessage = 'An error occurred';
      try {
        const errData = await response.json();
        errorMessage = errData.message || errData.error || JSON.stringify(errData);
      } catch {
        errorMessage = response.statusText || `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      // If doctors endpoint returns an empty array, fall back to default doctors
      if (endpoint.startsWith('/doctors') && Array.isArray(data) && data.length === 0) {
        return handleMockRequest(endpoint, options) || INITIAL_DOCTORS;
      }
      return data;
    }
    return null;
  } catch (err) {
    // If backend isn't reachable or proxy failed, fall back gracefully
    const mockResult = handleMockRequest(endpoint, options);
    if (mockResult !== null && mockResult !== undefined) {
      return mockResult;
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  me: () => request('/auth/me'),

  // Doctors
  getDoctors: (specialization) => {
    const query = specialization ? `?specialization=${encodeURIComponent(specialization)}` : '';
    return request(`/doctors${query}`);
  },

  getDoctor: (id) => request(`/doctors/${id}`),

  getSpecializations: () => request('/doctors/specializations'),

  updateDoctorProfile: (data) =>
    request('/doctors/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Appointments
  bookAppointment: (data) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyAppointments: () => request('/appointments/my'),

  getAppointment: (id) => request(`/appointments/${id}`),

  updateAppointmentStatus: (id, status, cancellationReason = null) =>
    request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, cancellationReason }),
    }),

  // Prescriptions
  getAppointmentPrescription: (appointmentId) =>
    request(`/prescriptions/appointment/${appointmentId}`),

  getMyPrescriptions: () => request('/prescriptions/my'),

  getPrescription: (id) => request(`/prescriptions/${id}`),

  savePrescription: (appointmentId, data) =>
    request(`/prescriptions/appointment/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
