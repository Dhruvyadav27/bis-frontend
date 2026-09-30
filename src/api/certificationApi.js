import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function recommendScheme({
  productType,
  productCategory,
  manufacturerType,
  udyamRegistered,
  managementSystemCertificationRequested,
}) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      recommendedScheme: 'Simplified Procedure',
      reason:
        'MSME manufacturers with an active Udyam registration qualify for the simplified procedure, which reduces the documentation and inspection steps compared to the normal scheme.',
      processSteps: [
        { step: 1, title: 'Apply on Manak Online' },
        { step: 2, title: 'Submit test report from a BIS-recognised lab' },
        { step: 3, title: 'Factory inspection by BIS officer' },
        { step: 4, title: 'Grant of licence' },
      ],
      documentsRequired: ['Udyam registration', 'Test report', 'Factory layout plan', 'Identity proof'],
      estimatedTimeline: '45-60 days',
      references: [{ doc: 'Scheme of Testing and Inspection', clause: '4.1' }],
      friendlyExplanation: '',
      insufficientEvidence: false,
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/certification/recommend', {
    productType,
    productCategory,
    manufacturerType,
    udyamRegistered,
    managementSystemCertificationRequested,
  })
  // Backend leaves processSteps/documentsRequired/references/estimatedTimeline
  // unset when insufficientEvidence is true (scheme matched by rule but has no
  // PUBLISHED data yet) — default them to empty so the page never crashes on .map().
  return {
    ...data,
    processSteps: data.processSteps || [],
    documentsRequired: data.documentsRequired || [],
    references: data.references || [],
  }
}

export async function askFollowUp(schemeName, query) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      answer: 'Yes, the simplified procedure typically completes faster since it skips a few inspection steps for MSME applicants.',
      relatedScheme: schemeName,
      confidence: 'high',
    })
    return res.data
  }
  const { data } = await axiosInstance.post(`/certification/${encodeURIComponent(schemeName)}/ask`, { query })
  return data
}
