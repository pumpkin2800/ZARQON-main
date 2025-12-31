import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
    userName: string;
    currency: string;
    netWorth: number;
    followers: number;
    booksRead: number;
    setUserName: (name: string) => void;
    setCurrency: (currency: string) => void;
    setNetWorth: (amount: number) => void;
    setFollowers: (count: number) => void;
    setBooksRead: (count: number) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            userName: 'Emperor',
            currency: 'IQD',
            netWorth: 2450000,
            followers: 12500,
            booksRead: 42,
            setUserName: (name) => set({ userName: name }),
            setCurrency: (currency) => set({ currency }),
            setNetWorth: (amount) => set({ netWorth: amount }),
            setFollowers: (count) => set({ followers: count }),
            setBooksRead: (count) => set({ booksRead: count }),
        }),
        {
            name: 'global-storage',
        }
    )
);
