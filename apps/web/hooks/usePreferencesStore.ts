import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreferencesState {
  video: string;
  audio: string;
  set: (deviceId: string, type: "audio" | "video") => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      audio: "default",
      video: "default",
      set: (deviceId, type) => set({ [type]: deviceId }),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
