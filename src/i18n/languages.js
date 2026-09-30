// Every language the app knows about. `sarvam` is the code Sarvam AI's translate API expects
// (Odia is "od-IN" there, but browsers/i18n call it "or").
//
// To add a language:
//   1. add a line here
//   2. run  SARVAM_API_KEY=... npm run i18n:translate -- <code>   (generates src/i18n/locales/<code>.json)
// The language then appears in the switcher automatically. The backend already supports all 22
// scheduled languages, so AI answers work for any code listed in its LanguageContext.
export const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',   sarvam: 'en-IN' },
  { code: 'hi', label: 'Hindi',     native: 'हिन्दी',      sarvam: 'hi-IN', aliases: ['हिंदी'] },
  { code: 'bn', label: 'Bengali',   native: 'বাংলা',      sarvam: 'bn-IN' },
  { code: 'gu', label: 'Gujarati',  native: 'ગુજરાતી',    sarvam: 'gu-IN' },
  { code: 'kn', label: 'Kannada',   native: 'ಕನ್ನಡ',      sarvam: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം',    sarvam: 'ml-IN' },
  { code: 'mr', label: 'Marathi',   native: 'मराठी',      sarvam: 'mr-IN' },
  { code: 'or', label: 'Odia',      native: 'ଓଡ଼ିଆ',      sarvam: 'od-IN', aliases: ['od'] },
  { code: 'pa', label: 'Punjabi',   native: 'ਪੰਜਾਬੀ',     sarvam: 'pa-IN' },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்',      sarvam: 'ta-IN' },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు',     sarvam: 'te-IN' },
]
