import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function askConsumerQuestion(query) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      answer: 'Yes, mandatory hallmarking applies to gold jewellery in notified districts as of 2022.',
      references: [{ doc: 'BIS Hallmarking Rules 2018', clause: '3' }],
      confidence: 'high',
      insufficientEvidence: false,
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/consumer/ask', { query })
  return data
}

export async function fileComplaint({ complaintType, productDetails }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      complaintId: 'CMP-2026-0912',
      steps: ['File on CCPA portal', 'Attach evidence', 'Track status by complaint ID'],
      applicableClause: 'Consumer Protection Act, 2019',
      status: 'FILED',
      redirectUrl: 'https://www.manakonline.in',
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/consumer/complaint', { complaintType, productDetails })
  return data
}
