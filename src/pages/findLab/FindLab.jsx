import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Search, MapPin, FlaskConical, Loader2, Navigation, CheckCircle2, Clock, LocateFixed, AlertTriangle } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import Disclaimer from '../../components/common/Disclaimer'
import { searchLabs } from '../../api/findLabApi'

// Sample output shown by default so the response structure is visible
// before the person runs a real search.
const SAMPLE_RESULT = {
  labs: [
    { name: 'Sagar Quality & Testing Lab', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 2.1, scope: 'Hallmarking, gold purity, precious metals', workingHours: '10:00-17:00', recognitionStatus: 'RECOGNIZED' },
    { name: 'Central National Standards Laboratory', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 5.4, scope: 'Electricals, LED luminaires, EMC/EMI tests', workingHours: '09:30-17:30', recognitionStatus: 'RECOGNIZED' },
    { name: 'Bhopal Industrial Testing & Quality Centre', city: 'Bhopal', state: 'Madhya Pradesh', distanceKm: 7.8, scope: 'Food products, packaged drinking water, chemicals', workingHours: '10:00-18:00', recognitionStatus: 'RECOGNIZED' },
  ],
}

export default function FindLab() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [coords, setCoords] = useState(null) // { lat, lng }
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [data, setData] = useState(SAMPLE_RESULT)
  const [isSample, setIsSample] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: searchLabs,
    onSuccess: (res) => {
      setData(res)
      setIsSample(false)
    },
  })

  function useMyLocation() {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Please allow location access to find nearby labs.'
            : 'Could not get your location. Please try again.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function handleSearch(e) {
    e.preventDefault()
    if (!coords) {
      setLocationError('Please share your location first — nearby lab search needs GPS coordinates.')
      return
    }
    mutate({ query, lat: coords.lat, lng: coords.lng })
  }

  return (
    <div className="mx-auto max-w-5xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 border border-indigo-100">
          <FlaskConical size={12} /> National Conformity Testing Network
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('findLab.title')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('findLab.subtitle')}
        </p>
      </div>

      {/* Search Card */}
      <Card className="mt-6 border-slate-200/90 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Product or Test Parameter"
              placeholder="e.g. LED luminaire, Cement, Gold purity"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="pt-2 sm:pt-0">
            <Button type="button" variant="secondary" onClick={useMyLocation} disabled={locating}>
              {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
              {coords ? 'Location Set' : 'Use My Location'}
            </Button>
          </div>
          <div className="pt-2 sm:pt-0">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search Labs
            </Button>
          </div>
        </form>
        {locationError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
            <AlertTriangle size={14} /> {locationError}
          </div>
        )}
        {coords && !locationError && (
          <p className="mt-2 text-[11px] text-slate-500">
            Using location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
        )}
      </Card>

      {/* Results & Map Layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              {data.labs.length} Recognised Testing Facilities
            </p>
            {isSample && <Badge tone="warning">Pre-search Sample View</Badge>}
          </div>

          <div className="space-y-3">
            {data.labs.map((lab) => (
              <Card key={lab.name} className="hover:border-primary/40 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-bold text-slate-900 font-poppins">{lab.name}</p>
                      <span className="hidden sm:inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={11} /> {lab.recognitionStatus || 'RECOGNIZED'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {[lab.city, lab.state].filter(Boolean).join(', ')}
                      {lab.address ? ` — ${lab.address}` : ''}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                      <FlaskConical size={14} className="text-primary-600 shrink-0" />
                      <span><strong>Testing Scope:</strong> {lab.scope}</span>
                    </p>
                    {lab.workingHours && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={13} className="shrink-0" />
                        <span>{lab.workingHours}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800 border border-primary-100">
                      <Navigation size={11} /> {lab.distanceKm} km
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Approx. distance</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Disclaimer />
        </div>

        {/* Map Preview Panel — placeholder; see chat notes on adding a real Leaflet map */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm flex flex-col justify-between h-72 lg:h-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Spatial Locator</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {coords ? 'GPS Active' : 'GPS Pending'}
              </span>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3 shadow-2xs">
                <MapPin size={26} />
              </div>
              <p className="text-sm font-bold text-slate-800 font-poppins">GIS Geographic Map</p>
              <p className="mt-1 text-xs text-slate-500 max-w-[220px]">
                Interactive map of testing centers near your location.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-center">
            <p className="text-[11px] font-medium text-slate-600">
              {coords ? 'Coordinates centered on your current location.' : 'Share your location to center the map.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
