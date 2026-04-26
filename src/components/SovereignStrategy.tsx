import React from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, ShieldCheck, Globe, Zap, Cpu, Lock, Coins } from 'lucide-react';
import { ScrollReveal } from '../shared/ScrollReveal';

export default function SovereignStrategy() {
  const roadmap = [
    {
      phase: "01",
      title: "التعبئة التكتيكية (Tactical Readiness)",
      subtitle: "30-90 Days",
      items: [
        "Audit 70+ malicious IAP applications.",
        "Deploy Niyah local analysis nodes.",
        "Monitor operational anomalies (AS139341).",
        "Establish baseline forensic intelligence feed."
      ],
      icon: <Target className="text-blue-500" size={24} />
    },
    {
      phase: "02",
      title: "التوسع الإستراتيجي (Service Expansion)",
      subtitle: "3-12 Months",
      items: [
        "Sovereign API integration (Unified Architecture).",
        "Niyah-ready bare-metal documentation.",
        "Refine Arabic linguistic analysis models.",
        "Standardize compliance frameworks."
      ],
      icon: <TrendingUp className="text-emerald-500" size={24} />
    },
    {
      phase: "03",
      title: "الاكتفاء السيادي (Sovereign Autonomy)",
      subtitle: "1-2 Years",
      items: [
        "Optimization of local inference modules.",
        "Integration of cross-sector intelligence nexus.",
        "Refinement of sovereign technical stack.",
        "Advancement of local forensic methodologies."
      ],
      icon: <Globe className="text-purple-500" size={24} />
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      <ScrollReveal>
        <div className="glass p-12 rounded-[48px] border-blue-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Strategic Roadmap: BURHĀN</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
              إستراتيجية <span className="text-blue-600 dark:text-blue-500">بُرهان</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg leading-relaxed mb-8">
              خارطة الطريق لتحقيق الاستقلال التقني والسيادة المعلوماتية. نركز على الأدلة والحقائق المثبتة تقنيًا لضمان سلامة الفضاء الرقمي وتكريس مفهوم السيادة التقنية المستدامة.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roadmap.map((item, index) => (
          <ScrollReveal key={index} delay={index * 0.1}>
            <div className="glass p-8 rounded-[32px] border-slate-200 dark:border-white/5 h-full flex flex-col hover:border-blue-500/20 transition-all group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-black text-slate-200 dark:text-white/10">{item.phase}</span>
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{item.title}</h3>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-6">{item.subtitle}</p>
              <div className="flex-1 space-y-4">
                {item.items.map((point, i) => (
                  <div key={i} className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    <span className="text-blue-500 font-bold">•</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="glass p-10 rounded-[40px] border-slate-200 dark:border-white/5 bg-blue-600/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <ShieldCheck className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">نظام برهان (Burhan System)</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed uppercase font-mono mb-4">
              "البيانات المثبتة هي الحقيقة المطلقة." 
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
              يعتمد النظام على التحليل الحتمي وتتبع مسارات البيانات لتقديم براهين تقنية قاطعة. يتم تنفيذ العمليات محليًا لضمان أعلى مستويات الخصوصية والسيادة.
            </p>
          </div>
          
          <div className="glass p-10 rounded-[40px] border-slate-200 dark:border-white/5 bg-emerald-600/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/10">
                <Lock className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">الامتثال التشغيلي (Compliance)</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed uppercase font-mono mb-4">
              الرقابة والتحقق من النزاهة الرقمية.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
              تحليل الممارسات المالية والتقنية لضمان خلوها من التلاعب الخارجي، وتقديم تقارير شفافة ومبنية على بروتوكولات تدقيق معتمدة.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
