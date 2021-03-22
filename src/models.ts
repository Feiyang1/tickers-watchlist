import { User } from "./auth";

export interface TickerChange {
    symbol: string;
    value: number;
    delta: number;
    timestamp: string;
}

export interface AppState {
    user: User | null;
    userPageCreated: boolean;
}