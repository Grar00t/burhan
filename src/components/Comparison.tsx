import { motion } from 'motion/react';
import { ScrollReveal } from '../shared/ScrollReveal';
import { useStore } from '../store/useStore';
import { useTranslation } from '../i18n/translations';
import { Check, X, Minus, Shield, Brain, Eye, Lock, Zap } from 'lucide-react';

interface Feature {
  name: string;
  nameAr: string;
  icon: import('react').ReactNode;
  haven: 'yes' | 'no' | 'partial';
  copilot: 'yes' | 'no' | 'partial';
  grok: 'yes' | 'no' | 'partial';
  gemini: 'yes' | 'no' | 'partial';
}

const features: Feature[] = [
  { name: 'On-Device Processing', nameAr: 'معالجة محلية', icon: <Shield size={14} />, haven: 'yes', copilot: 'no', grok: 'no', gemini: 'no' },
  { name: 'Data Sovereignty', nameAr: 'سيادة البيانات', icon: <Lock size={14} />, haven: 'yes', copilot: 'no', grok: 'no', gemini: 'no' },
  { name: 'Arabic-First NLP', nameAr: 'معالجة عربية أولاً', icon: <Brain size={14} />, haven: 'yes', copilot: 'partial', grok: 'no', gemini: 'partial' },
  { name: 'Zero-Cloud Dependency', nameAr: 'بدون سحابة', icon: <Zap size={14} />, haven: 'yes', copilot: 'no', grok: 'no', gemini: 'no' },
  { name: 'Privacy-Preserving', nameAr: 'حفظ الخصوصية', icon: <Eye size={14} />, haven: 'yes', copilot: 'no', grok: 'no', gemini: 'no' },
];

export function Comparison() {
  const { language } = useStore();
  const t = useTranslation(language);

  const StatusIcon = ({ status }: { status: 'yes' | 'no' | 'partial' }) => {
    if (status === 'yes') return <Check className="text-emerald-500" size={18} />;
    if (status === 'no') return <X className="text-rose-500" size={18} />;
    return <Minus className="text-amber-500" size={18} />;
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {language === 'ar' ? 'المقارنة السيادية' : 'Sovereign Comparison'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'لماذا تختار HAVEN؟ مقارنة بين الحلول السيادية والحلول السحابية.' 
                : 'Why choose HAVEN? A comparison between sovereign and cloud solutions.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'الميزة' : 'Feature'}
                </th>
                <th className="py-4 px-6 text-sm font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10 text-center">
                  HAVEN
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                  Copilot
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                  Grok
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">
                  Gemini
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <motion.tr 
                  key={feature.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {feature.icon}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? feature.nameAr : feature.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/20 dark:bg-emerald-900/5 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.haven} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.copilot} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.grok} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      <StatusIcon status={feature.gemini} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
