import Dexie, { Table } from 'dexie';

export interface FinanceEntry {
    id?: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: Date;
    note?: string;
}

export interface SocialStats {
    id?: number;
    platform: string;
    followers: number;
    views: number;
    date: Date;
}

export interface Account {
    id?: number;
    name: string;
    username: string;
    encryptedPassword: string;
    notes?: string;
    category: string;
    isPinned?: boolean;
    isHighlighted?: boolean;
}

export interface Website {
    id?: number;
    url: string;
    name: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    notes?: string;
    isPinned?: boolean;
    isHighlighted?: boolean;
}

export interface Certificate {
    id?: number;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    imageBlob?: Blob;
    isPinned?: boolean;
    isHighlighted?: boolean;
}

export interface Course {
    id?: number;
    name: string;
    platform: string;
    link: string;
    completionPercentage: number;
    status: 'not-started' | 'in-progress' | 'completed';
    deadline?: Date;
    isPinned?: boolean;
    isHighlighted?: boolean;
}

export interface Book {
    id?: number;
    title: string;
    author: string;
    coverBlob?: Blob;
    status: 'to-read' | 'reading' | 'read';
    rating?: number;
    notes?: string;
    isPinned?: boolean;
    isHighlighted?: boolean;
}

export class MyDatabase extends Dexie {
    financeEntries!: Table<FinanceEntry>;
    socialStats!: Table<SocialStats>;
    accounts!: Table<Account>;
    websites!: Table<Website>;
    certificates!: Table<Certificate>;
    courses!: Table<Course>;
    books!: Table<Book>;

    constructor() {
        super('PersonalEmpireDB');
        this.version(2).stores({
            financeEntries: '++id, type, category, date',
            socialStats: '++id, platform, date',
            accounts: '++id, name, category, isPinned',
            websites: '++id, name, priority, isPinned',
            certificates: '++id, name, issuer, isPinned',
            courses: '++id, name, status, isPinned',
            books: '++id, title, status, isPinned'
        });
    }
}

export const db = new MyDatabase();
