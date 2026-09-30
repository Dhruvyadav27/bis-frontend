import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function searchStandards({ productDescription }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      results: [
        { isNumber: 'IS 16102', title: 'LED luminaires for general lighting purposes', matchScore: 96, clause: '5.2', isCompulsory: true, regulatoryType: 'QCO' },
        { isNumber: 'IS 10322', title: 'Luminaires — general requirements and tests', matchScore: 84, clause: '7.1', isCompulsory: false, regulatoryType: 'VOLUNTARY' },
        { isNumber: 'IS 15885', title: 'Self-ballasted LED lamps for general lighting', matchScore: 71, clause: '4.3', isCompulsory: false, regulatoryType: 'VOLUNTARY' },
      ],
      insufficientEvidence: false,
      message: null,
      explanation: 'These standards cover LED-based general lighting products, matched on wattage, fitting type, and safety clauses.',
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/standards/search', { productDescription })
  return {
    ...data,
    results: (data.results || []).map((r) => ({
      ...r,
      // Backend sends matchScore as a 0.0-1.0 similarity fraction; UI shows it as a percentage.
      matchScore: Math.round((r.matchScore || 0) * 100),
    })),
  }
}
