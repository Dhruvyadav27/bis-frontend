import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function searchLabs({ query, lat, lng }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      labs: [
        { name: 'Sagar Testing Lab', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 2.1, scope: 'Hallmarking, gold purity', workingHours: '10:00-17:00', recognitionStatus: 'RECOGNIZED' },
        { name: 'Central Standards Lab', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 5.4, scope: 'Electricals, LED luminaires', workingHours: '09:30-17:30', recognitionStatus: 'RECOGNIZED' },
        { name: 'Bhopal Quality Testing Centre', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 7.8, scope: 'Food products, packaged water', workingHours: '10:00-18:00', recognitionStatus: 'RECOGNIZED' },
      ],
    })
    return res.data
  }
  // Backend is GPS-based: GET /labs/nearest?productDescription=&lat=&lng= — it does NOT
  // accept a free-text city/state param at all. lat/lng are required.
  const { data } = await axiosInstance.get('/labs/nearest', {
    params: { productDescription: query, lat, lng },
  })
  return data
}
