import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { msfKernel, MSFModule } from '../lib/MSFKernel';
import { 
  Terminal, 
  Search, 
  Cpu, 
  ChevronRight, 
  ShieldAlert, 
  Activity,
  Play,
  Settings,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MSFPanel() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [results, setResults] = useState<MSFModule[]>(msfKernel.searchModules(''));
  const [selectedModule, setSelectedModule] = useState<MSFModule | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // New States for validation Configs
  const [targetIp, setTargetIp] = useState('192.168.1.55');
  const [ipError, setIpError] = useState('');
  
  const [kerbDomain, setKerbDomain] = useState('target.local');
  const [domainError, setDomainError] = useState('');

  const filterResults = (query: string, platform: string) => {
    let filtered = msfKernel.searchModules(query);
    if (platform !== 'All') {
      filtered = filtered.filter(m => m.platform.toLowerCase() === platform.toLowerCase() || m.platform.toLowerCase() === 'multi');
    }
    return filtered;
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setResults(filterResults(val, platformFilter));
    setSelectedModule(null);
  };

  const handlePlatformChange = (platform: string) => {
    setPlatformFilter(platform);
    setResults(filterResults(search, platform));
    setSelectedModule(null);
  };

  const validateIp = (ip: string) => {
    setTargetIp(ip);
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      setIpError('Invalid IPv4 address format (e.g. 192.168.1.55)');
    } else {
      setIpError('');
    }
  };

  const validateDomain = (domain: string) => {
    setKerbDomain(domain);
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setDomainError('Invalid domain format (e.g. target.local)');
    } else {
      setDomainError('');
    }
  };

  const runOSINTScan = () => {
    if (ipError || !targetIp) return;
    setIsExecuting(true);
    const scanLog = [
      `[OSINT_ENGINE] Initiating Passive Recon against target: ${targetIp}...`,
      `[*] Geolocating ASN... [KSA-STC-ASN : Riyadh]`,
      `[*] Correlating metadata from Shodan API...`,
      `[+] PORT  STATE   SERVICE`,
      `[+] 80    open    http (nginx 1.18.0)`,
      `[+] 443   open    https (Valid SSL: *.${kerbDomain || 'target.local'})`,
      `[+] 3389  open    ms-wbt-server (Warning: RDP exposed!)`,
      `[*] Passive directory fuzzing revealed 3 subdomains linked to this IP.`,
      `[OSINT_ENGINE] Scan complete. Proceed with targeted modules.`
    ];
    setExecutionLog(scanLog);
    setIsExecuting(false);
  }

  const runSimulation = async (path: string) => {
    if (ipError || !targetIp) return;
    setIsExecuting(true);
    setExecutionLog(["[SYSTEM] Initiating Sovereign Simulation..."]);
    // Update Kernel simulation if needed later
    const res = await msfKernel.simulateExecution(path, targetIp);
    setExecutionLog(res.log);
    setIsExecuting(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#050505] overflow-hidden">
      {/* Module List */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col h-full bg-black/40">
        <div className="p-4 border-b border-white/5 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">MSF Kernel Explorer</span>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600 transition-colors group-focus-within:text-rose-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search exploit/payload..."
              className="w-full bg-black/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-700 focus:outline-none focus:border-rose-500/50 transition-all"
            />
          </div>
          <div className="flex gap-1 mt-2">
            {['All', 'Windows', 'Linux', 'Multi'].map(plat => (
              <button
                key={plat}
                onClick={() => handlePlatformChange(plat)}
                className={cn(
                  "flex-1 text-[9px] font-bold py-1 rounded transition-colors uppercase tracking-widest",
                  platformFilter === plat 
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                    : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
                )}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {search === '' && (
             <div className="mb-4">
              <div className="px-3 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 mb-2">
                Kerberoasting Campaigns
              </div>
              {[
                { name: 'Targeted Roasting', path: 'auxiliary/gather/get_user_spns', type: 'auxiliary', rank: 'Excellent' },
                { name: 'RC4-Forced Downgrade', path: 'auxiliary/gather/kerberoast_rc4', type: 'exploit', rank: 'Normal' },
                { name: 'AS-REP Hybrid', path: 'auxiliary/gather/asrep_roast', type: 'auxiliary', rank: 'Good' },
                { name: 'Stealth/OPSEC Limit', path: 'auxiliary/gather/stealth_roast', type: 'auxiliary', rank: 'Excellent' },
                { name: 'Silver Ticket Combo', path: 'auxiliary/admin/kerberos/silver_ticket_combo', type: 'exploit', rank: 'Excellent' },
                { name: 'Mass LDAP Enum', path: 'auxiliary/gather/ldap_query', type: 'auxiliary', rank: 'Normal' }
              ].map(m => (
                <button
                  key={m.path}
                  onClick={() => setSelectedModule(m as any)}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-left border transition-all group mb-1",
                    selectedModule?.path === m.path 
                      ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                      : "border-transparent border-white/0 hover:border-white/5 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn(
                      "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                      m.type === 'exploit' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                    )}>
                      {m.type}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400">{m.rank}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-white">{m.name}</p>
                  <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">{m.path}</p>
                </button>
              ))}
              <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 mt-4 mb-2">
                Global Index
              </div>
            </div>
          )}
          {results.slice(0, 100).map((m) => (
            <button
              key={m.path}
              onClick={() => setSelectedModule(m)}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-left border transition-all group",
                selectedModule?.path === m.path 
                  ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                  : "border-transparent border-white/0 hover:border-white/5 hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={cn(
                  "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                  m.type === 'exploit' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                )}>
                  {m.type}
                </span>
                <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400">{m.rank}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-white">{m.name}</p>
              <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">{m.path}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 overflow-y-auto bg-black/20 p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedModule ? (
            <motion.div 
              key={selectedModule.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl space-y-8"
            >
              <header className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-[2rem] bg-rose-500/5 border border-rose-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">{selectedModule.name}</h2>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Platform: <span className="text-rose-400">{selectedModule.platform}</span> • Rank: <span className="text-emerald-400">{selectedModule.rank}</span></p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-[3rem] p-6 border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-rose-500" /> Module Description
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {selectedModule.description || "No documentation available in the local Sovereign index for this specific module path."}
                  </p>
                </div>

                <div className="glass rounded-[3rem] p-6 border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" /> Execution Parameters
                  </h3>
                  
                  {selectedModule.path.includes('get_user_spns') && (
                    <div className="space-y-4 mb-4">
                      {/* Kerberoasting Config */}
                      <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                          <Terminal size={12} /> Kerberoasting Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">RHOSTS</label>
                            <input type="text" defaultValue="192.168.1.55" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-rose-500/50 outline-none" />
                          </div>
                           <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">DOMAIN</label>
                            <input 
                              type="text" 
                              value={kerbDomain}
                              onChange={(e) => validateDomain(e.target.value)}
                              className={cn(
                                "w-full bg-black/40 border rounded-lg p-2 text-[10px] font-mono text-white outline-none transition-colors",
                                domainError ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-rose-500/50"
                              )} 
                            />
                            {domainError && <p className="text-[7px] text-rose-500 mt-1">{domainError}</p>}
                          </div>
                           <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">USER_FILE</label>
                            <input type="text" defaultValue="users.txt" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-rose-500/50 outline-none" />
                          </div>
                           <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">PASS_FILE</label>
                            <input type="text" defaultValue="pass.txt" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-rose-500/50 outline-none" />
                          </div>
                        </div>
                      </div>

                      {/* Harvested Accounts Display */}
                      <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                         <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Harvested SPNs Overview</h4>
                         <ul className="text-[9px] font-mono text-white/70 space-y-2">
                           <li className="flex justify-between items-center"><span className="text-emerald-400">svc_sql</span><span>MSSQLSvc/db.target.local</span><span className="text-red-400">RC4_HMAC (Weak)</span></li>
                           <li className="flex justify-between items-center"><span className="text-emerald-400">svc_backup</span><span>bckp/fs.target.local</span><span className="text-blue-400">AES256_CTS_HMAC_SHA1_96</span></li>
                         </ul>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('stealth_roast') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                      <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> Stealth/OPSEC Roasting Config
                      </h4>
                      <p className="text-[9px] text-slate-400 mb-2">Avoids mass TGS requests. Injects existing TGT to blend with normal traffic.</p>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TGT_PATH</label>
                          <input type="text" defaultValue="/tmp/administrator.ccache" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_SPN</label>
                          <input type="text" defaultValue="HTTP/web.target.local" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-cyan-500/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('asrep_roast') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> AS-REP Roasting Config
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1 flex items-center gap-2 mt-4">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                          <label className="text-[9px] font-black uppercase text-white/70 tracking-widest">Enumerate DONT_REQ_PREAUTH</label>
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_USERS</label>
                          <input type="text" defaultValue="users.txt" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-orange-500/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('silver_ticket_combo') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-zinc-300/5 border border-zinc-300/20">
                      <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> Silver Ticket Forging
                      </h4>
                      <p className="text-[9px] text-slate-400 mb-2">Forge local service tickets using cracked NTLM hashes.</p>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">SPN</label>
                          <input type="text" defaultValue="cifs/dc01.target.local" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-zinc-300/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">SERVICE_NTLM</label>
                          <input type="text" defaultValue="a1b2c3d4e5f6g7h8" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-zinc-300/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">LIFETIME (HOURS)</label>
                          <input type="text" defaultValue="87600 (10 Years)" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-zinc-300/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('rbcd') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                      <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> RBCD Config
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_COMPUTER</label>
                          <input type="text" defaultValue="DC01$" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-purple-500/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">OWNED_ACCOUNT</label>
                          <input type="text" defaultValue="EVIL-PC$" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-purple-500/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">IMPERSONATE_USER</label>
                          <input type="text" defaultValue="Administrator" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-purple-500/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('shadow_credentials') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> Shadow Credentials Config
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_SAM</label>
                          <input type="text" defaultValue="CEO_Lapper$" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-blue-500/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">CERT_NAME</label>
                          <input type="text" defaultValue="K-SPIKE-CERT" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-blue-500/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('dcsync') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                      <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> DCSync Config
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_DOMAIN</label>
                          <input type="text" defaultValue="target.local" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-amber-500/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">TARGET_USER</label>
                          <input type="text" defaultValue="krbtgt" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-amber-500/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedModule.path.includes('forge_golden_ticket') && (
                    <div className="space-y-3 mb-4 p-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/20">
                      <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Terminal size={12} /> Golden Ticket Config
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">KRBTGT_HASH</label>
                          <input type="text" defaultValue="11a4cf13a69772bf2eb2cf13a69772bf" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-yellow-400/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">DOMAIN_SID</label>
                          <input type="text" defaultValue="S-1-5-21-3623811015-3361044348-30300820" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-yellow-400/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">IMPERSONATE</label>
                          <input type="text" defaultValue="Administrator" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-yellow-400/50 outline-none" />
                        </div>
                         <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">GROUPS</label>
                          <input type="text" defaultValue="512,513,518,519,520" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:border-yellow-400/50 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Target IP Address</p>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <input 
                            type="text" 
                            value={targetIp}
                            onChange={(e) => validateIp(e.target.value)}
                            className={cn(
                              "w-full bg-black/60 border rounded-lg p-2 text-xs font-mono outline-none transition-colors",
                              ipError ? "border-rose-500/50 text-rose-500" : "border-white/10 text-emerald-400 focus:border-rose-500/50"
                            )}
                          />
                          {ipError && <p className="text-[7px] text-rose-500">{ipError}</p>}
                        </div>
                        <button 
                          onClick={runOSINTScan}
                          disabled={isExecuting || !!ipError}
                          className="px-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-600/30 disabled:opacity-50 transition-colors"
                        >
                          Run OSINT
                        </button>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interaction Mode</p>
                      <p className="text-xs font-mono text-emerald-400">Sovereign Shell Bridge</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-rose-500" /> Simulation Sandbox
                  </h3>
                  <button 
                    disabled={isExecuting}
                    onClick={() => runSimulation(selectedModule.path)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
                  >
                    {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    [ Execute Simulation ]
                  </button>
                </div>

                <div className="p-6 rounded-[3rem] bg-black border border-white/10 font-mono text-xs space-y-1 min-h-[200px]">
                  {executionLog.length === 0 && <p className="text-slate-800 uppercase animate-pulse">[ Await Execution ]</p>}
                  {executionLog.map((line, i) => (
                    <motion.p 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        line.startsWith('[+]') ? "text-emerald-400 font-bold" :
                        line.startsWith('[-]') ? "text-rose-400 font-bold" :
                        line.startsWith('[*]') ? "text-blue-400" : "text-slate-500"
                      )}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 flex items-center justify-center">
                <Settings className="w-10 h-10 text-rose-500 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Select Tactical Module</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Choose a Metasploit module from the directory to begin kernel simulation and vulnerability mapping.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    className={cn("animate-spin", className)} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
