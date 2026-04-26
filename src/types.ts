export type UserRole = 'admin' | 'responder' | 'user';

export interface UserProfile {
  uid: string;
  name: string; // Changed from displayName to name to match components
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: any;
}

export enum ContentClassification {
  Safe = 'safe',
  Harmful = 'harmful',
  RequiresConsent = 'requires_consent',
  NeedsWarning = 'needs_warning',
  SystemMessage = 'system'
}

export interface ContentAnalysis {
  originalContent?: string;
  ethicalAnalysis?: string;
  isSafe?: boolean;
  score?: number;
  classification?: ContentClassification;
  requiresDocumentation?: boolean;
  timestamp?: Date;
  reason?: string;
  explanation?: string;
  suggestion?: string;
  warning?: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  action: string;
  consent: boolean;
  timestamp: any;
  purpose: string;
  dataTypes: string[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
  lastMessageAt: any;
  deleted?: boolean;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: any;
  attachments?: string[];
}

export interface CommercialRegistryProfile {
    profileType: "commercialRegistry";
    companyName: {
        arabic: string;
        english: string;
    };
    unifiedNationalNumbers: {
        main: string;
        opc?: string;
    };
    commercialRegistryNumber: string;
    operationalStatus: {
        value: "active" | "inactive" | "suspended" | "expired";
        displayArabic: string;
        displayEnglish: string;
    };
    capital: {
        amount: number;
        currency: "SAR";
        formatted: string;
    };
    issueDate: string;
    entityType: {
        value: "onePersonCompany" | "llc" | "jointStock" | "etc";
        displayArabic: string;
        displayEnglish: string;
    };
    licensedActivities: Array<{
        categoryArabic: string;
        categoryEnglish: string;
        description: string;
    }>;
    apiEnrichment?: {
        enabled: boolean;
        lastFetched: string;
        apiSource: string;
        endpointUsed: string;
        statusCode: number;
        ownersAndManagers?: any[];
        fullAddress?: any;
    };
    relationalIntelligence: {
        linkedDomains: string[];
        nameserverInfrastructure: string[];
        crossReferences: Array<{
            source: string;
            referenceId: string;
            context: string;
        }>;
    };
    lastUpdated: string;
    source: {
        registry: string;
        verificationLevel: "official" | "forensic" | "partial";
    };
    tacticalIntelligence?: {
        threatSurface: string[];
        c_uas_vulnerability: "high" | "medium" | "low" | "moderate";
        electronicWarfareResilience: {
            jamming: string;
            spoofing: string;
            meaconing: string;
        };
        transitionHistory?: Array<{
            date: string;
            event: string;
            impact: string;
        }>;
        predictedEvolution?: Array<{
            timeframe: string;
            scenario: string;
            probability: number;
        }>;
    };
    commercialAssessment?: {
        estimatedReportValue: string;
        targetClients: string[];
        monetizationStrategy: string;
        salesPitchDraft: string;
    };
}

export interface ScamHunterProfile {
    profileType: "scamHunter";
    scamDomain: string;
    scamName: {
        arabic: string;
        english: string;
    };
    scamRiskScore: number;
    scamCategory: "crypto_ponzi" | "fake_trading" | "ecommerce_fraud" | "investment_scam" | "phishing" | "fake_bank" | "other";
    evidence: Array<{
        type: "dns" | "whois" | "registry" | "template_match" | "ip_analysis" | "user_reports" | "ssl";
        description: string;
        severity: "low" | "medium" | "high" | "critical";
        proofLink?: string;
    }>;
    linkedDomains: string[];
    ownerInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        commercialRegistry?: string;
    };
    redFlags: string[];
    victimCountEstimate?: number;
    status: "active_scam" | "taken_down" | "under_investigation" | "monitored";
    publicReportLink?: string;
    lastUpdated: string;
    source: {
        verificationLevel: "high" | "medium" | "osint";
    };
}

export type ForensicProfile = CommercialRegistryProfile | ScamHunterProfile;

export interface Nameserver {
    hostname: string;
    ip: string;
    parentDomain: string;
    totalDomains?: number;
    domains?: string[];
    registrant?: string;
    forensicProfile?: ForensicProfile;
    similarDomains?: string[];
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export interface ErrorLog extends FirestoreErrorInfo {
  timestamp: any;
  userAgent?: string;
}
