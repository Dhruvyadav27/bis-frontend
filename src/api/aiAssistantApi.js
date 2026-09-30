import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

export async function askAssistant({ query, context }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      answer: `Here's what I found for "${query}" in the context of ${context?.currentAgent || 'this page'}${
        context?.currentStep ? `, step ${context.currentStep}` : ''
      }. Verify latest details on the official BIS Care / Manak Online portal.`,
      suggestedAction: { label: 'Open certification guide', route: '/certification-guide' },
      shouldRedirect: false,
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/assistant/query', { query, context })
  return data
}
