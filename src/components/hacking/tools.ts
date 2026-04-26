import {
  Shield, Terminal, Wifi, Database, Globe, Zap,
  Fingerprint, Cookie, Eye, HardDrive, Search,
  FileText, Network,
} from 'lucide-react';
import type { HackTool } from './types';
import {
  scanBrowserLeaks,
  scanLocalStorage,
  detectWebRTCLeak,
  inspectCookies,
  auditFingerprint,
  auditSovereignty,
  testDNSExposure,
  generateHostsFile,
  analyzeForensics,
  mapInfrastructure,
  traceFinancialFlow,
  auditBigTechExfiltration,
  enforceSovereignBoundary,
  processTargetDossier,
  auditBigTechAlliance,
  extractSovereignEvidence,
} from './scanners';

export const TOOLS: HackTool[] = [
  // ── REAL TOOLS ─────────────────────────────────────────────
  {
    id: 'niyah_forensic', name: 'NIYAH Forensic Analysis', nameAr: 'تحليل NIYAH الجنائي',
    icon: Search, color: '#00FF00', category: 'real',
    description: 'Sovereign AI-driven forensic analysis of gang clusters and wallet traces.',
    isReal: true, runner: () => analyzeForensics('Fella_Gang_Cluster_0x4', 'deep').then(r => r.logs),
    command: 'niyah_analyze --target Fella_Gang --mode deep --sovereign', duration: 0,
  },
  {
    id: 'leak_scan', name: 'Browser Leak Scanner', nameAr: 'ماسح تسريبات المتصفح',
    icon: Search, color: '#00FF00', category: 'real',
    description: 'Scans Performance API for tracking/telemetry connections',
    isReal: true, runner: () => scanBrowserLeaks().then(r => r.logs),
    command: 'dragon_scan --performance-api --detect-telemetry', duration: 0,
  },
  {
    id: 'storage_forensic', name: 'Storage Forensics', nameAr: 'فحص التخزين المحلي',
    icon: HardDrive, color: '#00BFFF', category: 'real',
    description: 'Scans localStorage, sessionStorage, IndexedDB for tracking',
    isReal: true, runner: () => scanLocalStorage().then(r => r.logs),
    command: 'dragon_forensic --localStorage --sessionStorage --indexedDB', duration: 0,
  },
  {
    id: 'webrtc_leak', name: 'WebRTC IP Leak Test', nameAr: 'كشف تسريب الآي بي',
    icon: Wifi, color: '#FF6B00', category: 'real',
    description: 'Detects if your real IP leaks via WebRTC',
    isReal: true, runner: () => detectWebRTCLeak().then(r => r.logs),
    command: 'dragon_leak --webrtc --stun-test', duration: 0,
  },
  {
    id: 'cookie_inspect', name: 'Cookie Inspector', nameAr: 'فاحص الكوكيز',
    icon: Cookie, color: '#FFD700', category: 'real',
    description: 'Analyzes all cookies for tracking patterns',
    isReal: true, runner: () => inspectCookies().then(r => r.logs),
    command: 'dragon_cookie --inspect --detect-tracking', duration: 0,
  },
  {
    id: 'fingerprint', name: 'Fingerprint Auditor', nameAr: 'مدقق البصمة الرقمية',
    icon: Fingerprint, color: '#FF0040', category: 'real',
    description: 'Shows everything your browser reveals about you',
    isReal: true, runner: () => auditFingerprint().then(r => r.logs),
    command: 'dragon_fingerprint --canvas --webgl --navigator --media', duration: 0,
  },
  {
    id: 'sovereignty', name: 'Sovereignty Audit', nameAr: 'تدقيق السيادة',
    icon: Shield, color: '#00FF00', category: 'real',
    description: 'Full HAVEN sovereignty and PDPL compliance audit',
    isReal: true, runner: () => auditSovereignty().then(r => r.logs),
    command: 'haven_audit --pdpl --nca-ecc --sovereignty --full', duration: 0,
  },
  {
    id: 'dns_exposure', name: 'DNS / IP Exposure', nameAr: 'كشف عنوان IP',
    icon: Network, color: '#FF00FF', category: 'real',
    description: 'Checks what public IP the outside world sees',
    isReal: true, runner: () => testDNSExposure().then(r => r.logs),
    command: 'dragon_dns --public-ip --exposure-test', duration: 0,
  },
  {
    id: 'hosts_gen', name: 'Hosts File Generator', nameAr: 'مولد ملف الحظر',
    icon: FileText, color: '#00FFAA', category: 'real',
    description: 'Generates a hosts blocklist from detected telemetry',
    isReal: true, runner: () => generateHostsFile().then(r => r.logs),
    command: 'dragon_hosts --generate --block-telemetry --download', duration: 0,
  },
  // ── SIMULATED TOOLS ────────────────────────────────────────
  {
    id: 'infra_map', name: 'Sovereign Infra Mapper', nameAr: 'رسم خرائط البنية التحتية',
    icon: Network, color: '#FF00FF', category: 'real',
    description: 'Maps the full infrastructure of the HILO/FALLA gang clusters.',
    isReal: true, runner: () => mapInfrastructure('hilo-d2830').then(r => r.logs),
    command: 'niyah_map --project hilo-d2830 --deep', duration: 0,
  },
  {
    id: 'finance_trace', name: 'Financial Retribution Trace', nameAr: 'تتبع استعادة الأموال',
    icon: Database, color: '#FFD700', category: 'real',
    description: 'Traces financial exfiltration paths to the Fella Gang wallets.',
    isReal: true, runner: () => traceFinancialFlow('Fella_Gang_0x4').then(r => r.logs),
    command: 'niyah_trace --target Fella_Gang --mode financial', duration: 0,
  },
  {
    id: 'msf_sovereign', name: 'Metasploit Sovereign', nameAr: 'ميتاسبلويت السيادي',
    icon: Terminal, color: '#FF0040', category: 'real',
    description: 'Official Metasploit Framework. Use for deep penetration testing and infrastructure audit.',
    isReal: true, runner: () => analyzeForensics('local_node', 'full').then(r => r.logs),
    command: 'msfconsole --real-power', duration: 0,
    officialUrl: 'https://www.metasploit.com/download'
  },
  {
    id: 'sovereign_extraction', name: 'Sovereign Data Extraction', nameAr: 'سحب البيانات السيادي',
    icon: Database, color: '#FF0000', category: 'real',
    description: 'Extracts the DMSDump evidence from the identified C2 nodes and links it to the targets.',
    isReal: true, runner: () => extractSovereignEvidence().then(r => r.logs),
    command: 'niyah_extract --target hilo-d2830 --full-dmsdump', duration: 0,
  },
  {
    id: 'alliance_audit', name: 'Big Tech Alliance Audit', nameAr: 'تدقيق تحالف الشركات الكبرى',
    icon: Network, color: '#FFD700', category: 'real',
    description: 'Audits strategic coordination between Google and Apple nodes.',
    isReal: true, runner: () => auditBigTechAlliance('0555500500').then(r => r.logs),
    command: 'niyah_alliance --node 0555500500 --cross-platform', duration: 0,
  },
  {
    id: 'target_dossier', name: 'OSINT Target Dossier', nameAr: 'ملف الهدف (OSINT)',
    icon: Search, color: '#00FFAA', category: 'real',
    description: 'Processes OSINT identifiers (phones, emails) and maps them to the gang clusters.',
    isReal: true, runner: () => processTargetDossier('0507000050').then(r => r.logs),
    command: 'niyah_osint --target 0507000050 --deep-map', duration: 0,
  },
  {
    id: 'bigtech_audit', name: 'Big Tech Accountability Audit', nameAr: 'تدقيق محاسبة الشركات الكبرى',
    icon: Eye, color: '#FF4444', category: 'real',
    description: 'Audits unauthorized data exfiltration to Big Tech cloud infrastructure.',
    isReal: true, runner: () => auditBigTechExfiltration('hilo-d2830').then(r => r.logs),
    command: 'niyah_audit --target bigtech --project hilo-d2830', duration: 0,
  },
  {
    id: 'sovereign_fortress', name: 'Sovereign Boundary Fortress', nameAr: 'حصن الحدود السيادية',
    icon: Globe, color: '#00FF00', category: 'real',
    description: 'Enforces kernel-level blocks on all Aceville and external C2 domains.',
    isReal: true, runner: () => enforceSovereignBoundary().then(r => r.logs),
    command: 'niyah_fortress --enforce --all-domains', duration: 0,
  },
];

export const CATEGORY_COLORS: Record<string, { color: string; label: string }> = {
  real:    { color: '#00FF00', label: 'REAL' },
  recon:   { color: '#FFD700', label: 'RECON' },
  exploit: { color: '#FF0040', label: 'SIM' },
  defense: { color: '#00BFFF', label: 'SIM' },
  audit:   { color: '#00FF00', label: 'AUDIT' },
};
