import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function googleLogin(idToken) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      token: 'mock.jwt.token',
      user: {
        id: 3,
        name: 'Google User',
        role: 'CONSUMER',
        userType: 'CONSUMER',
        email: 'googleuser@gmail.com',
        isNewUser: false,
        profileCompleted: true,
      },
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/auth/google', { idToken })
  return data
}

export async function completeProfile(payload) {
  // payload: { role, phone, preferredLanguage, udyamRegistered }
  if (MOCK_MODE) {
    const res = await mockResolve({ user: { ...payload, profileCompleted: true } })
    return res.data
  }
  const { data } = await axiosInstance.post('/users/complete-profile', payload)
  return data
}

export async function login({ email, password }) {
  if (MOCK_MODE) {
    const isAdmin = email?.toLowerCase().includes('admin')
    const role = isAdmin ? 'ADMIN' : 'CONSUMER'
    const res = await mockResolve({
      token: 'mock.jwt.token',
      user: {
        id: isAdmin ? 1 : 2,
        name: isAdmin ? 'Admin Officer' : 'Mulayam Singh',
        role,
        userType: role,
        email: email || (isAdmin ? 'admin@bis.gov.in' : 'user@domain.in'),
      },
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/auth/login', { email, password })
  return data
}

export async function register(payload) {
  // payload: { name, email, password, phone, userType, preferredLanguage }
  if (MOCK_MODE) {
    // Only allow CONSUMER, MSME, LABORATORY
    const safeRole = ['CONSUMER', 'MSME', 'LABORATORY'].includes(payload.userType)
      ? payload.userType
      : 'CONSUMER'
    const res = await mockResolve({
      token: 'mock.jwt.token',
      user: {
        id: Math.floor(100 + Math.random() * 900),
        name: payload.name,
        role: safeRole,
        userType: safeRole,
        email: payload.email,
      },
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/auth/register', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    role: payload.userType,
    preferredLanguage: payload.preferredLanguage,
  })
  return data
}
