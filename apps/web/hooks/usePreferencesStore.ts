import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface PreferencesState {
  video?: string
  audio?: string
  audioOutput?: string
  muted: boolean
  videoOff: boolean
  set: (deviceId: string, type: "audio" | "video" | "audioOutput") => void
  toggleMute: () => void
  toggleVideoOff: () => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      audio: undefined,
      video: undefined,
      audioOutput: undefined,
      muted: false,
      videoOff: false,
      set: (deviceId, type) => set({ [type]: deviceId }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      toggleVideoOff: () => set((state) => ({ videoOff: !state.videoOff })),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
