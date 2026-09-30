import { create } from 'zustand'

export const useJourneyStore = create((set, get) => ({
  journeyId: null,
  currentStep: 1,
  stages: [],

  setJourney: ({ journeyId, currentStep, stages }) =>
    set({ journeyId, currentStep, stages }),

  // Prefer the authoritative stages array the backend returned from /journey/advance
  // (it carries the real per-stage result — matched scheme, matched lab, etc.).
  // Only fall back to hand-computing done/in_progress if the backend didn't send stages.
  advanceStep: (nextStep, message, newStages) => {
    if (newStages && newStages.length) {
      set({ currentStep: nextStep, stages: newStages, lastMessage: message })
      return
    }
    const { stages, currentStep } = get()
    const updatedStages = stages.map((s) => {
      if (s.step === currentStep) return { ...s, status: 'done' }
      if (s.step === nextStep) return { ...s, status: 'in_progress' }
      return s
    })
    set({ currentStep: nextStep, stages: updatedStages, lastMessage: message })
  },
}))
