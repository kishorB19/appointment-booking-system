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

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401) {
    // If unauthorized, clear invalid token
    setAuthToken(null);
    setCurrentUser(null);
    window.dispatchEvent(new Event('care_auth_change'));
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errData = await response.json();
      errorMessage = errData.message || errData.error || JSON.stringify(errData);
    } catch {
      errorMessage = response.statusText || `Request failed with status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
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
