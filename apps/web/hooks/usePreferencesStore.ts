import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreferencesState {
  video?: string;
  audio?: string;
  muted: boolean;
  videoOff: boolean;
  set: (deviceId: string, type: "audio" | "video") => void;
  toggleMute: () => void;
  toggleVideoOff: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      audio: undefined,
      video: undefined,
      muted: false,
      videoOff: false,
      set: (deviceId, type) => set({ [type]: deviceId }),
      toggleMute: () => set((state) => ({muted: !state.muted})),
      toggleVideoOff: () => set((state) => ({videoOff: !state.videoOff})),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
