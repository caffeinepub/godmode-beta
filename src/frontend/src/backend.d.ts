import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface EventDrift {
    lifeAltering: bigint;
    averageWeek: bigint;
    currentTrajectory: bigint;
    unusual: bigint;
    highImpact: bigint;
}
export interface Recommendation {
    adjustment: string;
    explanation: string;
}
export type SessionId = bigint;
export interface ContextScanSnapshot {
    stressLevel: bigint;
    mood: bigint;
    notes: string;
    crowdDensity: string;
    socialEnergy: bigint;
    weather: string;
}
export interface UserProfile {
    region: string;
    city: string;
    preferences: string;
    probabilityDebt: bigint;
}
export interface OutcomeSession {
    id: bigint;
    created: Time;
    riskTolerance: string;
    contextScan?: ContextScanSnapshot;
    recommendations: Array<Recommendation>;
    user: Principal;
    eventDrift: EventDrift;
    timeHorizon: string;
    outcome: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContextScan(sessionId: SessionId, snapshot: ContextScanSnapshot): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOutcomeSession(outcome: string, timeHorizon: string, riskTolerance: string): Promise<SessionId>;
    generateRecommendations(sessionId: SessionId, injectUncertainty: boolean): Promise<Array<Recommendation>>;
    getAllSessions(): Promise<Array<OutcomeSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSession(sessionId: SessionId): Promise<OutcomeSession>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSessions(user: Principal): Promise<Array<OutcomeSession>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(city: string, region: string, preferences: string): Promise<void>;
}
