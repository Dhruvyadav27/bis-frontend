import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

// NOTE: this calls a NEW backend endpoint that does not exist yet —
// GET /api/standards/clause?doc=<isNumber>&clause=<clauseRef>
// It should look up the Standard/Scheme/Service by its identifier (isNumber,
// schemeName, or serviceName — whatever `doc` holds), find the chunk whose
// clauseRef matches, and return its full stored text. See chat notes for
// the exact response shape this expects.
export async function getClauseText(doc, clause) {
  if (MOCK_MODE) {
    const res = await mockResolve({
      doc,
      clause,
      title: doc,
      text:
        'This is placeholder clause text shown in mock mode. Once the backend clause-lookup ' +
        'endpoint is built, the real stored clause text will appear here instead.',
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/standards/clause', { params: { doc, clause } })
  return data
}
