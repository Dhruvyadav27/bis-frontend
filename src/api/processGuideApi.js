import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

// Backend stage/journey status values are UPPERCASE ("DONE"/"IN_PROGRESS"/"PENDING"/
// "SKIPPED"/"COMPLETED"); this page's components compare against lowercase strings
// ('done'/'in_progress'/...), so every journey response is normalized here.
function normalizeJourney(journey) {
  if (!journey) return journey
  return {
    ...journey,
    status: (journey.status || '').toLowerCase(),
    stages: (journey.stages || []).map((s) => ({ ...s, status: (s.status || '').toLowerCase() })),
  }
}

export async function getCurrentJourney() {
  if (MOCK_MODE) {
    const res = await mockResolve({
      journeyId: 'J-102',
      currentStep: 3,
      stages: [
        { step: 1, title: 'Identify standard', status: 'done', result: 'IS 16102' },
        { step: 2, title: 'Check scheme', status: 'done', result: 'Simplified Procedure' },
        { step: 3, title: 'Get tested', status: 'in_progress' },
        { step: 4, title: 'Apply registration', status: 'pending' },
        { step: 5, title: 'License generation', status: 'pending' },
      ],
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/journey/current')
  // Backend returns 204 No Content (empty body) when the user hasn't started a
  // journey yet — normalize that to null instead of an empty string.
  return data ? normalizeJourney(data) : null
}

export async function startJourney({ productTitle, productDescription, state, district, manufacturerType }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      journeyId: 'J-102',
      currentStep: 1,
      stages: [
        { step: 1, title: 'Identify standard', status: 'in_progress' },
        { step: 2, title: 'Check scheme', status: 'pending' },
        { step: 3, title: 'Get tested', status: 'pending' },
        { step: 4, title: 'Apply registration', status: 'pending' },
        { step: 5, title: 'License generation', status: 'pending' },
      ],
    })
    return res.data
  }
  const { data } = await axiosInstance.post('/journey/start', {
    productTitle,
    productDescription,
    state,
    district,
    manufacturerType,
  })
  return normalizeJourney(data)
}

export async function advanceJourney({ journeyId, step, action, lat, lng }) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      currentStep: step + 1,
      message: 'Ab registration apply karein',
    })
    return res.data
  }
  // Backend's Find Lab stage (step 3) needs GPS coordinates — if they aren't passed
  // yet, that stage stays IN_PROGRESS server-side waiting for a later retry with lat/lng.
  const { data } = await axiosInstance.post('/journey/advance', { journeyId, step, action, lat, lng })
  // Response is { currentStep, message, stages } — the real per-stage results
  // (matched scheme, matched lab, etc.) live in `stages`, so normalize + pass it
  // through rather than letting the caller recompute statuses client-side.
  return {
    ...data,
    stages: (data.stages || []).map((s) => ({ ...s, status: (s.status || '').toLowerCase() })),
  }
}
