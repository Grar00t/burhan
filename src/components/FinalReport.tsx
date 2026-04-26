import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, AlertCircle, Download, CheckCircle2, ChevronRight, Briefcase, FileCode2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import html2pdf from 'html2pdf.js';

export default function FinalReport() {
  const { language } = useStore();
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [clientInfo, setClientInfo] = useState({
    companyName: 'TechFlow Solutions',
    industry: 'FinTech',
    domain: 'techflow.sa'
  });

  const handleGenerate = () => {
    setReportState('generating');
    setTimeout(() => {
      setReportState('ready');
    }, 3000);
  };

  const handleDownload = () => {
    const element = document.getElementById('vapt-report-content');
    if (!element) return;
    
    // Quick and dirty PDF export using html2pdf
    const opt = {
      margin:       0.5,
      filename:     `VAPT_REPORT_${clientInfo.companyName.replace(/\s+/g,'_').toUpperCase()}_2026.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const vaptData = {
    executiveSummary: `This Vulnerability Assessment and Penetration Testing (VAPT) was conducted for ${clientInfo.companyName} targeting ${clientInfo.domain}. The objective was to identify security flaws that could lead to unauthorized access or data exfiltration. Overall risk is classified as HIGH due to critical Active Directory misconfigurations. Immediate remediation is required to comply with NCA regulations.`,
    technicalFindings: [
      {
        id: 'VULN-01',
        title: 'AS-REP Roasting Vulnerability (DONT_REQ_PREAUTH)',
        severity: 'Critical',
        cvss: '9.8',
        description: 'Several high-privileged accounts do not have Kerberos pre-authentication enabled. This allows an unauthenticated attacker to request AS-REP tickets and perform offline password cracking.',
        remediation: 'Ensure "Do not require Kerberos preauthentication" is unchecked for all administrative and service accounts in Active Directory.',
      },
      {
        id: 'VULN-02',
        title: 'Cleartext Credentials in LDAP Properties',
        severity: 'High',
        cvss: '7.5',
        description: 'Sensitive account passwords were found stored in the userAccountControl and description fields across 14 organizational units.',
        remediation: 'Implement a strict secrets management policy and run automated scripts to scrub legacy AD properties.',
      }
    ],
    complianceStatus: [
      { check: 'NCA ECC-1: Cybersecurity Governance', status: 'Fail', notes: 'Lack of automated VAPT schedules' },
      { check: 'NCA CSCC-1: Cloud Security', status: 'Partial', notes: 'MFA not enforced on administrative jump servers' },
      { check: 'PDPL: Data Minimization', status: 'Pass', notes: 'No explicit violations detected externally' }
    ]
  };

  return (
    <div className="h-full bg-[#050505] p-6 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00ffc8]/10 rounded-lg border border-[#00ffc8]/20">
                <FileText size={24} className="text-[#00ffc8]" />
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">K-Report Engine</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] pl-1">
              Automated VAPT & NCA Compliance Generator
            </p>
          </div>

          <div className="flex bg-[#0a0a0a] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setReportState('idle')}
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                reportState === 'idle' ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"
              )}
            >
              Config
            </button>
            <button
               disabled={reportState === 'idle'}
               className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                reportState !== 'idle' ? "bg-[#00ffc8]/10 text-[#00ffc8]" : "text-slate-700 cursor-not-allowed"
              )}
            >
              Viewer
            </button>
          </div>
        </div>

        {reportState === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Briefcase size={14} className="text-[#00ffc8]" />
                  Client Parameters
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                  <input 
                    type="text" 
                    value={clientInfo.companyName}
                    onChange={e => setClientInfo({...clientInfo, companyName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#00ffc8]/50 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industry</label>
                    <input 
                      type="text" 
                      value={clientInfo.industry}
                      onChange={e => setClientInfo({...clientInfo, industry: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#00ffc8]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Target Domain</label>
                    <input 
                      type="text" 
                      value={clientInfo.domain}
                      onChange={e => setClientInfo({...clientInfo, domain: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#00ffc8]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full relative group overflow-hidden bg-[#00ffc8]/10 border border-[#00ffc8]/30 rounded-2xl p-4 transition-all hover:bg-[#00ffc8]/20 hover:border-[#00ffc8] shadow-[0_0_20px_rgba(0,255,200,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ffc8]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <FileCode2 className="text-[#00ffc8]" size={20} />
                  <span className="text-sm font-black text-[#00ffc8] uppercase tracking-[0.3em]">
                    Compile VAPT Report Structure
                  </span>
                </div>
              </button>
            </div>

            <div className="bg-[#0a0a0a]/50 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                <Shield className="text-slate-600 relative z-10" size={24} />
                <div className="absolute inset-0 border border-slate-500 rounded-full animate-ping opacity-20" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Awaiting Compilation</h4>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed max-w-sm">
                  Configuring the K-Report engine will aggregate findings from K-SPIKE and Mission Control logs to generate an enterprise-grade Penetration Testing document suitable for stakeholders and compliance audits.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {reportState === 'generating' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center space-y-6"
          >
             <div className="relative">
                <motion.div
                  initial={{ rotate: 0 }} animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-16 h-16 border-t-2 border-[#00ffc8] border-r-2 border-r-transparent rounded-full"
                />
             </div>
             <p className="text-[10px] font-black text-[#00ffc8] uppercase tracking-[0.3em] animate-pulse">
               Compiling Threat Data & Formulating Executive Lexicon...
             </p>
          </motion.div>
        )}

        {reportState === 'ready' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
             <div className="flex flex-col md:flex-row gap-6">
                
                {/* PDF Viewer Mockup */}
                <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl shadow-[#00ffc8]/5 border border-white/10">
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 font-mono flex items-center gap-2">
                       <FileText size={12} className="text-[#00ffc8]" />
                       VAPT_REPORT_{clientInfo.companyName.replace(/\s+/g,'_').toUpperCase()}_2026.pdf
                     </span>
                     <button 
                       onClick={handleDownload}
                       className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition shadow-lg"
                     >
                       <Download size={12} /> Export PDF Document
                     </button>
                  </div>
                  
                  <div className="p-8 md:p-12 h-[600px] overflow-y-auto custom-scrollbar bg-white text-slate-800">
                     {/* PDF content layout - This div is what would be printed/exported */}
                     <div id="vapt-report-content" className="max-w-[800px] mx-auto bg-white">
                         <div className="border-b-4 border-slate-900 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                           <div>
                             <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Security Audit</h1>
                             <h2 className="text-lg font-bold text-slate-500 uppercase mt-1">Vulnerability & Penetration Report</h2>
                           </div>
                           <div className="text-left md:text-right font-mono text-[10px] text-slate-500 space-y-1">
                             <p>DATE: {new Date().toLocaleDateString()}</p>
                             <p className="text-slate-800 font-bold">CLIENT: {clientInfo.companyName}</p>
                             <p className="text-rose-600 font-bold">CONFIDENTIALITY: STRICT</p>
                           </div>
                         </div>

                         <div className="space-y-10">
                           <section>
                             <h3 className="text-lg font-black uppercase text-slate-900 border-l-4 border-slate-900 pl-3 mb-4">1. Executive Summary</h3>
                             <p className="text-sm text-slate-600 leading-relaxed min-h-[80px]">
                               {vaptData.executiveSummary}
                             </p>
                           </section>

                           <section>
                             <h3 className="text-lg font-black uppercase text-slate-900 border-l-4 border-slate-900 pl-3 mb-4">2. Technical Findings</h3>
                             <div className="space-y-6">
                               {vaptData.technicalFindings.map(finding => (
                                 <div key={finding.id} className="border border-slate-300 rounded-lg p-5 bg-slate-50 shadow-sm">
                                   <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2">
                                     <div>
                                        <span className="text-[10px] font-black text-slate-500 font-mono mb-1 block">{finding.id}</span>
                                        <h4 className="font-bold text-slate-900 text-sm">{finding.title}</h4>
                                     </div>
                                     <span className={cn(
                                       "px-2 py-1 rounded text-[10px] font-black uppercase whitespace-nowrap",
                                       finding.severity === 'Critical' ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-amber-100 text-amber-600 border border-amber-200"
                                     )}>
                                       CVSS: {finding.cvss} | {finding.severity}
                                     </span>
                                   </div>
                                   <div className="space-y-4 mt-4 text-sm">
                                     <div>
                                       <strong className="text-[10px] uppercase text-slate-500 block mb-1">Description:</strong>
                                       <p className="text-slate-700 leading-relaxed">{finding.description}</p>
                                     </div>
                                     <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                       <strong className="text-[10px] uppercase text-emerald-700 block mb-1">Remediation:</strong>
                                       <p className="text-emerald-900 leading-relaxed font-medium">{finding.remediation}</p>
                                     </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </section>
                           
                           <section>
                             <h3 className="text-lg font-black uppercase text-slate-900 border-l-4 border-slate-900 pl-3 mb-4">3. Compliance Target Status</h3>
                             <div className="overflow-x-auto rounded-lg border border-slate-200">
                               <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-100 border-b border-slate-200">
                                      <th className="p-3 font-bold text-slate-700 uppercase">Framework Guideline</th>
                                      <th className="p-3 font-bold text-slate-700 uppercase w-24">Status</th>
                                      <th className="p-3 font-bold text-slate-700 uppercase">Auditor Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {vaptData.complianceStatus.map((comp, i) => (
                                      <tr key={i} className="border-b border-slate-100 last:border-b-0">
                                        <td className="p-3 font-medium text-slate-800">{comp.check}</td>
                                        <td className="p-3">
                                          <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                                            comp.status === 'Pass' ? "bg-emerald-100 text-emerald-600" :
                                            comp.status === 'Fail' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                                          )}>{comp.status}</span>
                                        </td>
                                        <td className="p-3 text-slate-500 italic">{comp.notes}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                               </table>
                             </div>
                           </section>
                           
                           <div className="pt-12 text-center text-slate-400 font-mono text-[9px] uppercase">
                              -- End of Report -- <br/>
                              Generated by Sovereign OS Intelligence
                           </div>
                         </div>
                     </div>
                  </div>
                </div>

             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
