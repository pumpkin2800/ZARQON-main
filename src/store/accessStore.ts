import { create } from 'zustand';

type AccessLevel = 'PUBLIC' | 'VERIFIED' | 'INTERNAL';

interface AccessState {
    accessLevel: AccessLevel;
    unlockVerified: () => void;
    unlockInternal: () => void; // Hidden features
    resetAccess: () => void;
}

export const useAccessStore = create<AccessState>((set) => ({
    accessLevel: 'PUBLIC',
    unlockVerified: () => set({ accessLevel: 'VERIFIED' }),
    unlockInternal: () => set({ accessLevel: 'INTERNAL' }),
    resetAccess: () => set({ accessLevel: 'PUBLIC' }),
}));
