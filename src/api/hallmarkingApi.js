import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function verifyHuid({ huid }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      verified: true,
      purity: '18K750',
      ahcCentre: 'Sagar Assaying, Bhopal',
      hallmarkedOn: '2026-03-12',
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/hallmarking/verify-huid', { huid })
  return data
}

export async function findNearestCentres({ lat, lng }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      centres: [
        { name: 'BIS AHC Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', address: 'Arera Colony, Bhopal', distanceKm: 1.8 },
      ],
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/hallmarking/nearest-centres', { params: { lat, lng } })
  return data
}

export async function getJewellerRegistrationInfo() {
  if (MOCK_MODE) {
    const res = await mockResolve({
      steps: ['Apply on manakonline.in', 'Certificate granted instantly, no documents or fee required'],
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/hallmarking/jeweller-registration-info')
  return data
}

export async function getPurityInfo(code) {
  if (MOCK_MODE) {
    const res = await mockResolve({ karat: '18K', purityPercent: 75.0, description: '18 karat gold, 75% pure' })
    return res.data
  }
  const { data } = await axiosInstance.get('/hallmarking/purity-info', { params: { code } })
  return data
}

export async function getComplaintGuidance(query) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      answer: 'You can file a complaint on the CCPA portal with photographic evidence of the hallmark.',
      applicableDoc: 'Consumer Protection Act, 2019',
      applicableClause: '49',
      compensationInfo: '2x the value of the purity shortfall + testing charges',
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/hallmarking/complaint-guidance', { query })
  return data
}

export async function askHallmarking(query, context) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      answer: 'A 6-character HUID is laser-engraved on the jewelry and lets you trace it back to the exact AHC that certified it.',
      confidence: 'high',
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/hallmarking/ask', { query, context })
  return data
}
