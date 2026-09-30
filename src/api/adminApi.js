import axiosInstance, { mockResolve, MOCK_MODE } from './axiosInstance'

// In-memory mock database for Admin operations
let mockStandards = [
  {
    id: 'IS-1293',
    code: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets for Domestic and Similar Purposes of Rated Voltage up to and including 250V',
    category: 'Electrotechnical',
    status: 'published',
    version: '2.1',
    effectiveDate: '2020-07-01',
    lastModified: '2026-01-15',
    author: 'admin.officer@bis.gov.in',
  },
  {
    id: 'IS-13252',
    code: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment — Safety — General Requirements',
    category: 'Electronics & IT',
    status: 'published',
    version: '1.4',
    effectiveDate: '2012-09-07',
    lastModified: '2025-11-20',
    author: 'admin.officer@bis.gov.in',
  },
  {
    id: 'IS-1417',
    code: 'IS 1417:2016',
    title: 'Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking',
    category: 'Precious Metals',
    status: 'published',
    version: '3.0',
    effectiveDate: '2017-01-01',
    lastModified: '2026-02-10',
    author: 'gold.cell@bis.gov.in',
  },
  {
    id: 'IS-16046',
    code: 'IS 16046 (Part 2):2018',
    title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)',
    category: 'Batteries & Energy',
    status: 'pending_review',
    version: '2.0-draft',
    effectiveDate: '2026-06-01',
    lastModified: '2026-03-01',
    author: 'standards.reviewer@bis.gov.in',
  },
  {
    id: 'IS-9873',
    code: 'IS 9873 (Part 1):2019',
    title: 'Safety of Toys: Mechanical and Physical Properties',
    category: 'Consumer Products',
    status: 'draft',
    version: '1.2-draft',
    effectiveDate: '2026-08-01',
    lastModified: '2026-03-05',
    author: 'toy.standards@bis.gov.in',
  },
]

let mockHistory = {
  'IS-1293': [
    { version: '2.1', date: '2026-01-15', editor: 'Admin Officer', change: 'Updated test voltage table 4.2' },
    { version: '2.0', date: '2024-05-10', editor: 'S. K. Verma', change: 'Incorporated Amendment No. 2' },
    { version: '1.0', date: '2019-12-01', editor: 'Technical Committee', change: 'Initial publication' },
  ],
  'IS-13252': [
    { version: '1.4', date: '2025-11-20', editor: 'Admin Officer', change: 'Harmonized IEC 60950 references' },
    { version: '1.0', date: '2010-06-15', editor: 'IT Sectional Committee', change: 'Initial release' },
  ],
}

let mockSchemes = [
  {
    id: 'SCH-1',
    code: 'Scheme I (ISI Mark)',
    name: 'Product Certification Scheme (Domestic Manufacturers)',
    description: 'Third-party guarantee of quality, safety and reliability for Indian manufacturers.',
    status: 'published',
    productsCovered: 450,
    mandatoryItems: 180,
    version: '3.2',
  },
  {
    id: 'SCH-2',
    code: 'Scheme II (CRS)',
    name: 'Compulsory Registration Scheme for Electronics & IT Goods',
    description: 'Self-declaration of conformity based on testing in BIS-recognized laboratories.',
    status: 'published',
    productsCovered: 82,
    mandatoryItems: 82,
    version: '2.0',
  },
  {
    id: 'SCH-3',
    code: 'Scheme IV (FMCS)',
    name: 'Foreign Manufacturers Certification Scheme',
    description: 'Enables overseas manufacturers to obtain BIS license to use the standard mark.',
    status: 'published',
    productsCovered: 1200,
    mandatoryItems: 180,
    version: '1.8',
  },
  {
    id: 'SCH-4',
    code: 'Scheme V (Management Systems)',
    name: 'Quality Management Systems (ISO 9001/14001 Certification)',
    description: 'Auditing and certification of organizational management frameworks.',
    status: 'draft',
    productsCovered: 0,
    mandatoryItems: 0,
    version: '1.0-draft',
  },
]

let mockServices = [
  {
    id: 'SRV-1',
    name: 'Standard Finder Engine',
    slug: 'standard-finder',
    status: 'published',
    endpoint: '/api/standards/search',
    version: '2.4',
    uptime: '99.98%',
    description: 'Semantic vector search across 22,000+ Bureau of Indian Standards.',
  },
  {
    id: 'SRV-2',
    name: 'Certification Pathway Assistant',
    slug: 'certification-guide',
    status: 'published',
    endpoint: '/api/certification/guide',
    version: '2.1',
    uptime: '99.95%',
    description: 'Guided rule-based advisor for ISI Mark, CRS Scheme II, and FMCS.',
  },
  {
    id: 'SRV-3',
    name: 'HUID & Hallmarking Verification',
    slug: 'hallmarking',
    status: 'published',
    endpoint: '/api/hallmarking/verify',
    version: '3.0',
    uptime: '100%',
    description: 'Real-time 6-digit alphanumeric laser code verification with AHC registry.',
  },
  {
    id: 'SRV-4',
    name: 'Laboratory Directory & Scope Engine',
    slug: 'find-lab',
    status: 'published',
    endpoint: '/api/labs/search',
    version: '1.9',
    uptime: '99.91%',
    description: 'Geospatial and test-parameter search across BIS Central & Recognized labs.',
  },
]

let mockFlaggedAnswers = [
  {
    id: 'FLG-101',
    query: 'Is BIS certification mandatory for Bluetooth speakers under CRS?',
    generatedAnswer: 'Yes, Bluetooth speakers are covered under CRS Scheme II under IS 616:2017 Audio, Video and Similar Electronic Apparatus.',
    confidenceScore: 68,
    userFeedback: 'User noted Bluetooth speakers below 10W might fall under exemption clause 4.3.',
    timestamp: '2026-03-08 14:22',
    status: 'pending',
    agentContext: 'Standard Finder Agent',
  },
  {
    id: 'FLG-102',
    query: 'What is the fee concession for women-owned micro enterprises applying for ISI mark?',
    generatedAnswer: 'MSMEs receive a 20% concession on annual license fees.',
    confidenceScore: 74,
    userFeedback: 'Official Gazette Notification specifies 50% concession for Micro-enterprises and Women-led units.',
    timestamp: '2026-03-07 11:05',
    status: 'pending',
    agentContext: 'Certification Guide Agent',
  },
  {
    id: 'FLG-103',
    query: 'Can a gold jeweller sell non-hallmarked 14k gold jewellery upon customer request?',
    generatedAnswer: 'No. From 1st June 2022, mandatory hallmarking applies to 14k, 18k, 20k, 22k, 23k, and 24k gold artefacts without exception in notified districts.',
    confidenceScore: 92,
    userFeedback: 'Flagged for verification against latest 2026 amendments.',
    timestamp: '2026-03-06 17:40',
    status: 'pending',
    agentContext: 'Hallmarking Agent',
  },
  {
    id: 'FLG-104',
    query: 'Which laboratory in Gujarat is accredited to test helmet impact resistance as per IS 4151?',
    generatedAnswer: 'BIS Western Regional Office Laboratory (WROL) in Mumbai and CIPET Ahmedabad test automotive helmets.',
    confidenceScore: 62,
    userFeedback: 'CIPET Ahmedabad helmet testing accreditation status needs review.',
    timestamp: '2026-03-05 09:15',
    status: 'pending',
    agentContext: 'Lab Finder Agent',
  },
]

let mockUsers = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'admin@bis.gov.in',
    role: 'ADMIN',
    department: 'Central IT & Standardization Cell',
    status: 'Active',
    createdAt: '2025-01-10',
  },
  {
    id: 2,
    name: 'Priya Narayanan',
    email: 'priya.msme@industries.co.in',
    role: 'MSME',
    department: 'Precision Instruments Pvt Ltd',
    status: 'Active',
    createdAt: '2025-06-18',
  },
  {
    id: 3,
    name: 'Dr. A. K. Sengupta',
    email: 'director@spectro-labs.org',
    role: 'LABORATORY',
    department: 'Spectro Analytical Labs (Accredited)',
    status: 'Active',
    createdAt: '2025-08-22',
  },
  {
    id: 4,
    name: 'Ananya Deshmukh',
    email: 'ananya.consumer@gmail.com',
    role: 'CONSUMER',
    department: 'Citizen Advocate',
    status: 'Active',
    createdAt: '2026-02-01',
  },
  {
    id: 5,
    name: 'Sunil Verma',
    email: 's.verma@bis.gov.in',
    role: 'ADMIN',
    department: 'Certification Directorate',
    status: 'Active',
    createdAt: '2025-03-14',
  },
]

export async function getOverview() {
  if (MOCK_MODE) {
    const res = await mockResolve({
      standardsCount: mockStandards.length,
      publishedStandards: mockStandards.filter((s) => s.status === 'published').length,
      pendingStandards: mockStandards.filter((s) => s.status === 'pending_review').length,
      schemesCount: mockSchemes.length,
      servicesCount: mockServices.length,
      pendingReviewsCount: mockStandards.filter((s) => s.status === 'pending_review').length + 2,
      flaggedAnswersCount: mockFlaggedAnswers.filter((f) => f.status === 'pending').length,
      totalUsersCount: mockUsers.length,
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/overview')
  // Backend field names differ from the UI's expected shape, and doesn't track
  // pendingReviewsCount / totalUsersCount separately yet — defaulted to 0 for now.
  return {
    standardsCount: data.totalStandards ?? 0,
    publishedStandards: 0,
    pendingStandards: 0,
    schemesCount: data.totalSchemes ?? 0,
    servicesCount: data.totalServices ?? 0,
    pendingReviewsCount: 0,
    flaggedAnswersCount: data.flaggedThisWeek ?? 0,
    totalUsersCount: 0,
  }
}

// Standards
export async function getStandards({ search = '', status = 'all' } = {}) {
  if (MOCK_MODE) {
    let filtered = [...mockStandards]
    if (status !== 'all') {
      filtered = filtered.filter((s) => s.status === status)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      )
    }
    const res = await mockResolve(filtered)
    return res.data
  }
  // Backend stores status as UPPERCASE ("DRAFT"/"PENDING_REVIEW"/"PUBLISHED") and
  // treats any non-empty status param as a literal exact-match filter — sending
  // lowercase or the sentinel "all" matches nothing. Convert here: "all" -> no
  // param at all (backend returns everything), anything else -> UPPERCASE.
  const backendStatus = status && status !== 'all' ? status.toUpperCase() : undefined
  const { data } = await axiosInstance.get('/admin/standards', { params: { search, status: backendStatus } })
  const list = data.content ?? data
  // Backend's Standard model uses isNumber / UPPERCASE status / int version — different
  // shape from the mock schema this page reads. Mapped here; there's no backend field
  // for `effectiveDate` so it stays blank.
  return list.map((s) => ({
    id: s.id,
    code: s.isNumber,
    title: s.title,
    category: s.category,
    status: (s.status || '').toLowerCase(),
    version: String(s.version ?? 1),
    effectiveDate: '',
    lastModified: s.publishedAt ? s.publishedAt.slice(0, 10) : '',
    author: s.lastEditedBy || s.createdBy || '',
  }))
}

export async function createStandard(payload) {
  if (MOCK_MODE) {
    const newStd = {
      id: `IS-${Math.floor(1000 + Math.random() * 9000)}`,
      code: payload.code || 'IS 99999:2026',
      title: payload.title,
      category: payload.category || 'General',
      status: 'draft', // By default starts in draft
      version: '1.0-draft',
      effectiveDate: payload.effectiveDate || new Date().toISOString().slice(0, 10),
      lastModified: new Date().toISOString().slice(0, 10),
      author: 'admin@bis.gov.in',
    }
    mockStandards.unshift(newStd)
    mockHistory[newStd.id] = [
      { version: '1.0-draft', date: new Date().toISOString().slice(0, 10), editor: 'Admin Officer', change: 'Created draft standard' },
    ]
    const res = await mockResolve(newStd)
    return res.data
  }
  // Backend field is `isNumber`, not `code`; `effectiveDate` has no backend
  // equivalent so it's dropped (not stored anywhere on the Standard model).
  const { data } = await axiosInstance.post('/admin/standards', {
    isNumber: payload.code,
    title: payload.title,
    category: payload.category,
    status: 'DRAFT',
    version: 1,
  })
  return data
}

export async function submitForReview(id) {
  if (MOCK_MODE) {
    mockStandards = mockStandards.map((s) => (s.id === id ? { ...s, status: 'pending_review' } : s))
    const res = await mockResolve({ success: true, message: 'Submitted for secondary review.' })
    return res.data
  }
  const { data } = await axiosInstance.post(`/admin/standards/${id}/submit-for-review`)
  return data
}

export async function publishStandard(id) {
  if (MOCK_MODE) {
    mockStandards = mockStandards.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'published',
            version: s.version.replace('-draft', ''),
            lastModified: new Date().toISOString().slice(0, 10),
          }
        : s
    )
    const res = await mockResolve({ success: true, message: 'Standard published successfully.' })
    return res.data
  }
  const { data } = await axiosInstance.post(`/admin/standards/${id}/publish`)
  return data
}

export async function importStandards(items) {
  if (MOCK_MODE) {
    items.forEach((item) => {
      mockStandards.unshift({
        id: `IS-${Math.floor(1000 + Math.random() * 9000)}`,
        code: item.code,
        title: item.title,
        category: item.category || 'General',
        status: 'draft',
        version: '1.0-draft',
        effectiveDate: new Date().toISOString().slice(0, 10),
        lastModified: new Date().toISOString().slice(0, 10),
        author: 'import.batch@bis.gov.in',
      })
    })
    const res = await mockResolve({ success: true, count: items.length })
    return res.data
  }
  // Backend only accepts a multipart CSV FILE (columns: isNumber,title,scope,revision,
  // category — header row skipped), not a JSON { items } body. Build that CSV here and
  // upload it as a file so the parsed rows actually reach the backend correctly.
  const header = 'isNumber,title,scope,revision,category'
  const rows = items.map((item) =>
    [item.code, item.title, '', '', item.category].map((v) => String(v || '').replace(/,/g, ' ')).join(',')
  )
  const csvBlob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
  const formData = new FormData()
  formData.append('file', csvBlob, 'standards-import.csv')

  const { data } = await axiosInstance.post('/admin/standards/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function importPdf(file, { type = 'standards' } = {}) {
  const formData = new FormData()
  formData.append('file', file)

  // Backend path is /admin/bulk-import/pdf (hyphen) and only accepts file + type;
  // `category` isn't a supported param so it's dropped here.
  const { data } = await axiosInstance.post('/admin/bulk-import/pdf', formData, {
    params: { type },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 0,
  })

  // Backend only returns { type, ocrTextLength, importedCount } — it doesn't track
  // page counts or created/updated/skipped separately (every parsed row is a new
  // insert, there's no update/skip logic). Mapped onto the fields this modal reads
  // so a successful import actually shows a non-zero count instead of all 0s.
  return {
    pages: 0,
    ocrPages: 0,
    detectedRows: data.importedCount ?? 0,
    created: data.importedCount ?? 0,
    updated: 0,
    skipped: 0,
    ocrTextLength: data.ocrTextLength ?? 0,
    warnings: [],
  }
}

export async function getStandardHistory(id) {
  if (MOCK_MODE) {
    const history = mockHistory[id] || [
      { version: '1.0', date: '2025-01-01', editor: 'Admin Officer', change: 'Standard baseline created' },
    ]
    const res = await mockResolve(history)
    return res.data
  }
  const { data } = await axiosInstance.get(`/admin/standards/${id}/history`)
  // Backend doesn't persist real version history yet — it returns one explanatory
  // string instead of {version,date,editor,change} records. Wrapped so the drawer
  // renders it as a single info row instead of showing blank fields.
  return (data || []).map((note) => ({ version: '—', date: '', editor: 'System', change: note }))
}

// Schemes
export async function getSchemes() {
  if (MOCK_MODE) {
    const res = await mockResolve([...mockSchemes])
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/schemes')
  const list = data.content ?? data
  // Backend's CertificationScheme model has no code/productsCovered/mandatoryItems
  // fields at all — those exist only in this page's mock data. Mapped what does
  // exist; the rest defaults to blank/0 since it genuinely isn't stored anywhere.
  return list.map((s) => ({
    id: s.id,
    code: s.id,
    name: s.schemeName,
    description: s.description,
    status: (s.status || '').toLowerCase(),
    productsCovered: 0,
    mandatoryItems: 0,
    version: s.version,
  }))
}

export async function createScheme(payload) {
  if (MOCK_MODE) {
    const newScheme = {
      id: `SCH-${mockSchemes.length + 1}`,
      code: payload.code,
      name: payload.name,
      description: payload.description,
      status: 'draft',
      productsCovered: Number(payload.productsCovered) || 0,
      mandatoryItems: Number(payload.mandatoryItems) || 0,
      version: '1.0-draft',
    }
    mockSchemes.push(newScheme)
    const res = await mockResolve(newScheme)
    return res.data
  }
  // Only schemeName/description have a backend home — code/productsCovered/
  // mandatoryItems can't be persisted without a backend schema change.
  const { data } = await axiosInstance.post('/admin/schemes', {
    schemeName: payload.name,
    description: payload.description,
  })
  return data
}

export async function publishScheme(id) {
  if (MOCK_MODE) {
    mockSchemes = mockSchemes.map((s) =>
      s.id === id ? { ...s, status: 'published', version: s.version.replace('-draft', '') } : s
    )
    const res = await mockResolve({ success: true })
    return res.data
  }
  const { data } = await axiosInstance.post(`/admin/schemes/${id}/publish`)
  return data
}

// Services
export async function getServices() {
  if (MOCK_MODE) {
    const res = await mockResolve([...mockServices])
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/services')
  const list = data.content ?? data
  // BisService has no slug/endpoint/uptime fields on the backend — mock-only.
  // Mapped what exists; the rest defaults to blank since it isn't stored.
  return list.map((s) => ({
    id: s.id,
    name: s.serviceName,
    slug: '',
    endpoint: '',
    description: s.description,
    status: (s.status || '').toLowerCase(),
    version: s.version,
    uptime: '',
  }))
}

export async function createService(payload) {
  if (MOCK_MODE) {
    const newService = {
      id: `SRV-${mockServices.length + 1}`,
      name: payload.name,
      slug: payload.slug,
      endpoint: payload.endpoint,
      description: payload.description,
      status: 'draft',
      version: '1.0-draft',
      uptime: '100%',
    }
    mockServices.push(newService)
    const res = await mockResolve(newService)
    return res.data
  }
  // Only serviceName/description have a backend home — slug/endpoint aren't fields
  // on BisService, so they can't be persisted without a backend schema change.
  const { data } = await axiosInstance.post('/admin/services', {
    serviceName: payload.name,
    description: payload.description,
  })
  return data
}

export async function publishService(id) {
  if (MOCK_MODE) {
    mockServices = mockServices.map((s) =>
      s.id === id ? { ...s, status: 'published', version: s.version.replace('-draft', '') } : s
    )
    const res = await mockResolve({ success: true })
    return res.data
  }
  const { data } = await axiosInstance.post(`/admin/services/${id}/publish`)
  return data
}

// Flagged Answers
export async function getFlaggedAnswers() {
  if (MOCK_MODE) {
    const res = await mockResolve([...mockFlaggedAnswers])
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/flagged-answers')
  // Backend field names (question/agent/confidence/answer/source) differ from what
  // ReviewAiAnswers.jsx reads (query/agentContext/confidenceScore/generatedAnswer/
  // userFeedback/timestamp/status). Mapped here; timestamp/status/userFeedback have
  // no backend equivalent yet, so they're defaulted.
  return (data || []).map((item) => ({
    id: item.id,
    query: item.question,
    agentContext: item.agent,
    confidenceScore: Math.round((item.confidence || 0) * 100),
    generatedAnswer: item.answer,
    userFeedback: '',
    timestamp: '',
    status: 'pending',
  }))
}

export async function resolveFlaggedAnswer(id, { action, notes, editedAnswer }) {
  if (MOCK_MODE) {
    mockFlaggedAnswers = mockFlaggedAnswers.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'resolved',
            resolution: { action, notes, editedAnswer, resolvedAt: new Date().toISOString() },
          }
        : item
    )
    const res = await mockResolve({ success: true, message: 'Flagged answer resolved successfully.' })
    return res.data
  }
  // Backend's FlaggedAnswerResolveRequest expects a singular `note`, and for the
  // "edit" action it uses `note` as the new answer text (no separate editedAnswer field).
  const { data } = await axiosInstance.post(`/admin/flagged-answers/${id}/resolve`, {
    action,
    note: action === 'edit' ? editedAnswer : notes,
  })
  return data
}

// Consumer Query Trends (Aggregated Only - Zero Personal Data)
export async function getConsumerTrends() {
  if (MOCK_MODE) {
    const res = await mockResolve({
      totalQueriesTracked: 24890,
      reportingPeriod: 'Last 30 Days',
      privacyCompliant: true,
      categoryBreakdown: [
        { category: 'Electronics & IT (CRS)', queries: 8450, percentage: 34 },
        { category: 'Gold & Silver Hallmarking (HUID)', queries: 6220, percentage: 25 },
        { category: 'Domestic Electrical Appliances', queries: 3730, percentage: 15 },
        { category: 'Food & Agricultural Standards', queries: 3240, percentage: 13 },
        { category: 'Toys Quality Control Orders', queries: 2240, percentage: 9 },
        { category: 'Chemicals, Cement & Steel', queries: 1010, percentage: 4 },
      ],
      weeklyTrend: [
        { week: 'Week 1', volume: 5400 },
        { week: 'Week 2', volume: 6100 },
        { week: 'Week 3', volume: 5900 },
        { week: 'Week 4', volume: 7490 },
      ],
      topKeywords: [
        'HUID 6-digit verification',
        'MSME certification fee rebate',
        'Mandatory QCO for power adapters',
        'ISI license renewal procedure',
        'Accredited battery testing labs',
        'Counterfeit ISI mark reporting',
      ],
    })
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/consumer-trends')
  // Backend returns { categories: [{name,count}], trend: [{date,count}] } — quite
  // different from the mock shape the page reads. Mapped here as best as possible;
  // `topKeywords` has no backend equivalent yet, so it stays empty.
  const categories = data.categories || []
  const totalQueriesTracked = categories.reduce((sum, c) => sum + (c.count || 0), 0)
  return {
    totalQueriesTracked,
    reportingPeriod: '',
    privacyCompliant: true,
    categoryBreakdown: categories.map((c) => ({
      category: c.name,
      queries: c.count,
      percentage: totalQueriesTracked ? Math.round((c.count / totalQueriesTracked) * 100) : 0,
    })),
    weeklyTrend: (data.trend || []).map((t) => ({ week: t.date, volume: t.count })),
    topKeywords: [],
  }
}

// Manage Users (Role Management)
export async function getUsers() {
  if (MOCK_MODE) {
    const res = await mockResolve([...mockUsers])
    return res.data
  }
  const { data } = await axiosInstance.get('/admin/users')
  // Backend status is ACTIVE/DISABLED (all caps); this page's badge checks for the
  // exact string 'Active'. Normalized here. There's no backend `department` field —
  // the page already falls back to "General User" when it's missing, so it's left as is.
  return (data || []).map((u) => ({
    ...u,
    status: u.status === 'ACTIVE' ? 'Active' : u.status === 'DISABLED' ? 'Disabled' : u.status,
  }))
}

export async function updateUserRole(id, role) {
  if (MOCK_MODE) {
    mockUsers = mockUsers.map((u) => (u.id === id ? { ...u, role } : u))
    const res = await mockResolve({ success: true, message: `User role updated to ${role}` })
    return res.data
  }
  const { data } = await axiosInstance.post(`/admin/users/${id}/role`, { role })
  return data
}

export async function inviteAdmin({ name, email, department }) {
  if (MOCK_MODE) {
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      role: 'ADMIN',
      department: department || 'BIS Administration',
      status: 'Invited',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    mockUsers.unshift(newUser)
    const res = await mockResolve(newUser)
    return res.data
  }
  // Backend's AdminInviteRequest only accepts { email, role } — this endpoint always
  // creates an ADMIN account, and it ignores `name`/`department` (it hardcodes the
  // new user's name to "Invited Admin" server-side).
  const { data } = await axiosInstance.post('/admin/users/invite', { email, role: 'ADMIN' })
  return data
}

// =========================================================
// NEW: JSON bulk-import endpoints (Schemes, Services, Labs,
// Standards-with-chunks, Consumer Rules, HUID Records)
// =========================================================

export async function bulkImportStandardsJson(items) {
  const { data } = await axiosInstance.post('/admin/standards/bulk-import-json', items)
  return data
}

export async function bulkImportLabsJson(items) {
  const { data } = await axiosInstance.post('/admin/bulk-import/labs-json', items)
  return data
}

export async function bulkImportSchemesJson(items) {
  const { data } = await axiosInstance.post('/admin/schemes/bulk-import-json', items)
  return data
}

export async function bulkImportServicesJson(items) {
  const { data } = await axiosInstance.post('/admin/services/bulk-import-json', items)
  return data
}

export async function getConsumerRules(params = {}) {
  const { data } = await axiosInstance.get('/admin/consumer-rules', { params })
  return data.content ?? data
}

export async function bulkImportConsumerRulesJson(items) {
  const { data } = await axiosInstance.post('/admin/consumer-rules/bulk-import-json', items)
  return data
}

export async function getHuidRecords(params = {}) {
  const { data } = await axiosInstance.get('/admin/huid-records', { params })
  return data.content ?? data
}

export async function bulkImportHuidRecordsJson(items) {
  const { data } = await axiosInstance.post('/admin/huid-records/bulk-import-json', items)
  return data
}
