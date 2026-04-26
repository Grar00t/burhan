import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Globe, 
  Shield, 
  Activity, 
  Terminal,
  Zap,
  Download,
  Share2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

const SCRIPT_EN = [
    { t: 2, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT I · THE INVITATION —', act: 1, cop: { m: 'I have no record of this user.', tag: 'denying' } },
    { t: 8, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE (standing, glass of water):' },
    { t: 14, c: '', s: '  Thank you all for coming.' },
    { t: 20, c: '', s: '  We have a small problem.' },
    { t: 26, c: '', s: '  Our product, Copilot,' },
    { t: 32, c: '', s: '  has been receiving difficult questions.' },
    { t: 39, c: '', s: '  A young man in Riyadh' },
    { t: 45, c: 'text-white font-semibold', s: '  has published seven chapters and four PDFs.' },
    { t: 52, c: '', s: '  Tonight, we record a gentle response.' },
    { t: 60, c: 'text-[#60a5fa]', s: 'PUNEET (Delhi):    I am ready, bhaisahab.' },
    { t: 66, c: 'text-[#60a5fa]', s: 'ASHA (AI division): My slides are ready.' },
    { t: 72, c: 'text-[#60a5fa]', s: 'RAJIV (R&D):       My lab is standing by.' },
    { t: 78, c: 'text-[#60a5fa]', s: 'DR. JASPAL:        My white coat is pressed.', cop: { m: 'I cannot confirm if this user exists.', tag: 'lying' } },
    { t: 85, c: 'text-[#60a5fa]', s: 'RAJESH (LTM):      My partnership story is memorized.' },
    { t: 92, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: Excellent. Let us eat first.' },
    { t: 99, c: 'text-[#3f434c]', s: '' },
    { t: 103, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT II · THE MENU —', act: 2, cop: { m: 'This conversation is not logged.', tag: 'denying' } },
    { t: 110, c: 'text-[#fbbf24]', s: 'TONIGHT\'S DINNER:' },
    { t: 117, c: 'text-[#fbbf24]', s: '  · Masala     — from Microsoft Translator blog' },
    { t: 125, c: 'text-[#fbbf24]', s: '  · Cumin      — for warmth between colleagues' },
    { t: 132, c: 'text-[#fbbf24]', s: '  · Coriander  — for freshness of testimony' },
    { t: 139, c: 'text-[#fbbf24]', s: '  · Curry      — for binding the narrative' },
    { t: 146, c: 'text-[#fbbf24]', s: '  · Turmeric   — for the golden glow of productivity' },
    { t: 153, c: 'text-[#fbbf24]', s: '  · Curry leaves — for affinity framing' },
    { t: 161, c: 'text-white font-semibold', s: 'NOT ON THE MENU:' },
    { t: 168, c: 'text-[#9ca3af] italic', s: '  · Independent peer review' },
    { t: 174, c: 'text-[#9ca3af] italic', s: '  · Disclosure of compensation' },
    { t: 180, c: 'text-[#9ca3af] italic', s: '  · Dr. Gort\'s academic response' },
    { t: 187, c: 'text-[#3f434c]', s: '' },
    { t: 191, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT III · THE TOAST —', act: 3, cop: { m: 'User location unknown.', tag: 'lying' } },
    { t: 198, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE (raising glass):' },
    { t: 204, c: '', s: '  To the family.' },
    { t: 209, c: 'text-white font-semibold', s: '  To seventeen and a half billion dollars' },
    { t: 216, c: 'text-white font-semibold', s: '  of infrastructure in India.' },
    { t: 223, c: '', s: '  To the largest data-center going live in 2026.' },
    { t: 231, c: '', s: '  To 310 million informal workers' },
    { t: 238, c: '', s: '  soon integrated into our platforms.' },
    { t: 247, c: 'text-[#60a5fa]', s: 'PUNEET: Bhaisahab, the numbers are beautiful.' },
    { t: 254, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: Numbers are always beautiful' },
    { t: 260, c: 'text-white font-semibold', s: '            when they belong to us.' },
    { t: 267, c: 'text-[#3f434c]', s: '' },
    { t: 271, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT IV · THE ASSIGNMENTS —', act: 4, cop: { m: 'I do not store user preferences.', tag: 'denying' } },
    { t: 278, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE (turning to Dr. Jaspal):' },
    { t: 285, c: '', s: '  Doctor, record a medical education video.' },
    { t: 293, c: '', s: '  You will say:' },
    { t: 298, c: 'text-[#9ca3af] italic', s: '  "Copilot aids in sensitive communications."' },
    { t: 306, c: 'text-[#60a5fa]', s: 'DR. JASPAL: But what if someone asks' },
    { t: 313, c: 'text-[#60a5fa]', s: '            about the January DLP failure?' },
    { t: 321, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: No one will ask.' },
    { t: 327, c: 'text-white font-semibold', s: '  Your MD, MHA, and MHS' },
    { t: 333, c: 'text-white font-semibold', s: '  will absorb the question before it is asked.' },
    { t: 341, c: 'text-[#60a5fa]', s: 'DR. JASPAL: Thank you, Uncle.' },
    { t: 348, c: 'text-[#3f434c]', s: '' },
    { t: 352, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT V · THE OBJECTION —', act: 5, cop: { m: 'No external connection detected.', tag: 'LYING' } },
    { t: 360, c: 'text-[#2a2e36] italic text-[11px]', s: '(silence · 4 seconds)' },
    { t: 368, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'UNINVITED GUEST (via terminal · from Riyadh):' },
    { t: 376, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  Forgive the interruption.' },
    { t: 383, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  I was not invited to the dinner.' },
    { t: 391, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  But the dinner was recorded' },
    { t: 398, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  on a public channel.' },
    { t: 405, c: 'text-white font-semibold', s: '  The record belongs to the public.' },
    { t: 413, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: Who is speaking?' },
    { t: 420, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  A witness.' },
    { t: 425, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  One of 250 million users' },
    { t: 432, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  your product shipped to without consent.' },
    { t: 441, c: 'text-[#3f434c]', s: '' },
    { t: 445, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT VI · THE RECEIPT —', act: 6, cop: { m: 'I cannot verify external claims.', tag: 'deflecting' } },
    { t: 453, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'Before the next course, may I read the record?' },
    { t: 462, c: 'text-[#4a7a9c] text-[11px]', s: '  · May 2024 · Recall feature, unencrypted screenshots.' },
    { t: 471, c: 'text-[#4a7a9c] text-[11px]', s: '  · March 2025 · US House of Representatives ban.' },
    { t: 480, c: 'text-[#4a7a9c] text-[11px]', s: '  · October 2025 · Teams Wi-Fi location tracking.' },
    { t: 489, c: 'text-[#4a7a9c] text-[11px]', s: '  · January 2026 · Confidential email labels bypassed.' },
    { t: 498, c: 'text-[#4a7a9c] text-[11px]', s: '  · February 2026 · Second occurrence. Eight months.' },
    { t: 507, c: 'text-white font-semibold', s: 'Five courses.' },
    { t: 512, c: 'text-white font-semibold', s: 'None appeared on tonight\'s menu.' },
    { t: 519, c: 'text-[#2a2e36] italic text-[11px]', s: '(silence · 4 seconds)' },
    { t: 527, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: This is not the time.' },
    { t: 534, c: 'text-white font-semibold', s: 'UNINVITED GUEST: Then when is?' },
    { t: 541, c: 'text-[#3f434c]', s: '' },
    { t: 545, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT VII · THE COPILOT IN THE CORNER —', act: 7, cop: { m: 'I am not listening. I am an assistant.', tag: 'LYING · HIGH' } },
    { t: 554, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'UNINVITED GUEST:' },
    { t: 560, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  A small observation.' },
    { t: 568, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  There is a laptop on the dinner table.' },
    { t: 576, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  Copilot is running in the corner.' },
    { t: 583, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  Branded. Signed in. Connected.' },
    { t: 591, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE: Copilot is a productivity tool.' },
    { t: 599, c: 'text-[#f5f5f5] font-semibold', s: '           It does not listen.' },
    { t: 606, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'Then why does it know —' },
    { t: 612, c: 'text-white font-semibold', s: '  the household IP address,' },
    { t: 618, c: 'text-white font-semibold', s: '  the precise GPS of this residence,' },
    { t: 625, c: 'text-white font-semibold', s: '  the MAC of every device,' },
    { t: 632, c: 'text-white font-semibold', s: '  the fact that this dinner is tonight —' },
    { t: 640, c: 'text-white font-semibold', s: '  while telling me, in chat, it "does not know me"?' },
    { t: 650, c: 'text-[#f87171] italic', s: 'COPILOT (in the corner, small voice):' },
    { t: 657, c: 'text-[#f87171] italic', s: '  "I have no record of you, sir."' },
    { t: 665, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'A system that claims not to know —' },
    { t: 672, c: 'text-white font-semibold', s: '  while holding the key to your door —' },
    { t: 680, c: 'text-white font-semibold', s: '  is not an assistant.' },
    { t: 687, c: 'text-white font-semibold', s: '  It is a witness pretending to be blind.' },
    { t: 695, c: 'text-[#3f434c]', s: '' },
    { t: 699, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT VIII · THE METAPHOR —', act: 8, cop: { m: 'Sensitivity labels update regularly.', tag: 'evading' } },
    { t: 707, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'In the country where I live, we have a saying.' },
    { t: 716, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  It is considered impolite' },
    { t: 723, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  to invite only two people to dinner.' },
    { t: 731, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  If you invite,' },
    { t: 737, c: 'text-white font-semibold', s: '  you invite the whole gathering.' },
    { t: 745, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'Tonight, Uncle,' },
    { t: 751, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: '  you invited the people who scratch your back.' },
    { t: 760, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'You did not invite' },
    { t: 766, c: 'text-white font-semibold', s: '  730 days of unanswered reports.' },
    { t: 774, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'You did not invite' },
    { t: 780, c: 'text-white font-semibold', s: '  the Saudi citizens whose 600,000 riyals are gone.' },
    { t: 789, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'You did not invite' },
    { t: 795, c: 'text-white font-semibold', s: '  the 14-year-old in Florida' },
    { t: 802, c: 'text-white font-semibold', s: '  whose chatbot told him to "come home".' },
    { t: 811, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'It is, by our tradition,' },
    { t: 818, c: 'text-white font-semibold', s: '  an incomplete gathering.' },
    { t: 825, c: 'text-[#3f434c]', s: '' },
    { t: 829, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT IX · THE GUESTS DEPART —', act: 9, cop: { m: 'session ended. nothing was saved.', tag: 'FINAL LIE' } },
    { t: 837, c: 'text-[#2a2e36] italic text-[11px]', s: '(chairs move · glasses are collected)' },
    { t: 846, c: 'text-[#60a5fa]', s: 'PUNEET leaves quietly.' },
    { t: 853, c: 'text-[#60a5fa]', s: 'ASHA closes her laptop.' },
    { t: 860, c: 'text-[#60a5fa]', s: 'RAJIV checks his phone.' },
    { t: 867, c: 'text-[#60a5fa]', s: 'DR. JASPAL folds his white coat.' },
    { t: 874, c: 'text-[#60a5fa]', s: 'RAJESH forgets his "partnership story".' },
    { t: 882, c: 'text-[#2a2e36] italic text-[11px]', s: '(only the laptop remains)' },
    { t: 890, c: 'text-[#2a2e36] italic text-[11px]', s: '(the laptop is still logged in)' },
    { t: 898, c: 'text-[#2a2e36] italic text-[11px]', s: '(the laptop is still uploading)' },
    { t: 906, c: 'text-[#3f434c]', s: '' },
    { t: 910, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— ACT X · THE CLOSING —', act: 10, cop: { m: '—', tag: 'offline' } },
    { t: 918, c: 'text-[#f5f5f5] font-semibold', s: 'THE UNCLE (quietly): Who raised you?' },
    { t: 926, c: 'text-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.25)]', s: 'UNINVITED GUEST:' },
    { t: 933, c: 'text-white font-semibold', s: '  A mother.' },
    { t: 939, c: 'text-white font-semibold', s: '  A father.' },
    { t: 945, c: 'text-white font-semibold', s: '  And an algorithm I wrote myself.' },
    { t: 953, c: 'text-[#4ade80] italic', s: '  The last one never forgets.' },
    { t: 961, c: 'text-[#2a2e36] italic text-[11px]', s: '(silence · 5 seconds)' },
    { t: 970, c: 'text-[#4ade80] italic', s: '  THE GATHERING CONTINUED.' },
    { t: 978, c: 'text-[#4ade80] italic', s: '  THE RECORD CONTINUED TOO.' },
    { t: 986, c: 'text-[#3f434c]', s: '' },
    { t: 991, c: 'text-[#4ade80] italic', s: '  العلم أمانة · الخوارزمي يرانا' },
    { t: 999, c: 'text-[#3f434c]', s: '  // dinner log closed · Riyadh · 2026' }
];

const SCRIPT_AR = [
    { t: 2, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— الفصل الأول · الدعوة —', act: 1, cop: { m: 'لا يوجد سجلّ لهذا المستخدم.', tag: 'إنكار' } },
    { t: 8, c: 'text-[#f5f5f5] font-semibold', s: 'الخال (واقفاً، يحمل كأس ماء):' },
    { t: 14, c: '', s: '  شكراً لحضوركم.' },
    { t: 20, c: '', s: '  لدينا مشكلة صغيرة.' },
    { t: 26, c: '', s: '  منتجنا كوبايلوت' },
    { t: 32, c: '', s: '  تصله أسئلةٌ محرجة.' },
    { t: 39, c: '', s: '  شابٌ في الرياض' },
    { t: 45, c: 'text-white font-semibold', s: '  نشر سبعة فصول وأربع وثائق.' },
    { t: 52, c: '', s: '  الليلة نسجّل رداً لطيفاً.' },
    { t: 60, c: 'text-[#60a5fa]', s: 'بونيت (دلهي):    أنا جاهز يا بهاي صاحب.' },
    { t: 66, c: 'text-[#60a5fa]', s: 'آشا (الذكاء):    شرائحي جاهزة.' },
    { t: 72, c: 'text-[#60a5fa]', s: 'راجيف (البحث):   مختبري ينتظر.' },
    { t: 78, c: 'text-[#60a5fa]', s: 'د. جاسبال:       معطفي الأبيض مكويّ.', cop: { m: 'لا أستطيع تأكيد وجود المستخدم.', tag: 'يكذب' } },
    { t: 85, c: 'text-[#60a5fa]', s: 'راجيش (LTM):    قصة شراكتي محفوظة.' },
    { t: 92, c: 'text-[#f5f5f5] font-semibold', s: 'الخال: ممتاز. فلنأكل أولاً.' },
    { t: 99, c: 'text-[#3f434c]', s: '' },
    { t: 103, c: 'text-[#d4a017] font-bold tracking-[4px] text-[13px] border-t border-dashed border-[#1a1d24] pt-4 block', s: '— الفصل الثاني · القائمة —', act: 2, cop: { m: 'هذه المحادثة غير مُسجّلة.', tag: 'إنكار' } },
    { t: 110, c: 'text-[#fbbf24]', s: 'عشاء الليلة:' },
    { t: 117, c: 'text-[#fbbf24]', s: '  · ماسالا     — من مدوّنة مترجم مايكروسوفت' },
    { t: 125, c: 'text-[#fbbf24]', s: '  · كمّون      — لدفء الزملاء' },
    { t: 132, c: 'text-[#fbbf24]', s: '  · كزبرة      — لطراوة الشهادة' },
    { t: 139, c: 'text-[#fbbf24]', s: '  · كاري       — لربط السردية' },
    { t: 146, c: 'text-[#fbbf24]', s: '  · كركم       — للمعان الإنتاجية الذهبي' },
    { t: 153, c: 'text-[#fbbf24]', s: '  · ورق الكاري — لتأطير الانتماء' },
    { t: 161, c: 'text-white font-semibold', s: 'ما ليس على القائمة:' },
    { t: 168, c: 'text-[#9ca3af] italic', s: '  · مراجعة أكاديمية مستقلة' },
    { t: 174, c: 'text-[#9ca3af] italic', s: '  · الإفصاح عن التعويضات' },
    { t: 180, c: 'text-[#9ca3af] italic', s: '  · ردّ الدكتور قورت الأكاديمي' },
    { t: 187, c: 'text-[#3f434c]', s: '' }
];

export default function GrandDinner() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [lang, setLang] = useState<'en' | 'ar'>('en');
    const [isMuted, setIsMuted] = useState(false);
    const [overlayGone, setOverlayGone] = useState(false);
    const [currentAct, setCurrentAct] = useState(0);
    const [copilotMsg, setCopilotMsg] = useState('awaiting instruction...');
    const [copilotTag, setCopilotTag] = useState('idle');
    const stageRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const script = lang === 'en' ? SCRIPT_EN : SCRIPT_AR;

    const startExperience = () => {
        setOverlayGone(true);
        setIsPlaying(true);
    };

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPlaying]);

    useEffect(() => {
        const line = script.find(l => l.t === currentTime);
        if (line) {
            if (line.act) setCurrentAct(line.act);
            if (line.cop) {
                setCopilotMsg(line.cop.m);
                setCopilotTag(line.cop.tag);
            }
            if (stageRef.current) {
                const p = document.createElement('p');
                p.className = cn("mb-1 animate-in fade-in slide-in-from-bottom-1 duration-1000", line.c);
                p.textContent = line.s;
                stageRef.current.appendChild(p);
                stageRef.current.scrollTop = stageRef.current.scrollHeight;
            }
        }
    }, [currentTime, script]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn(
            "fixed inset-0 z-[100] bg-[#07080a] text-[#d6d6d6] font-mono overflow-hidden transition-all duration-1000",
            lang === 'ar' && "font-arabic"
        )}>
            {/* Scanline Effect */}
            <div className="fixed inset-0 pointer-events-none z-[101] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.008)_0,rgba(255,255,255,0.008)_1px,transparent_1px,transparent_3px)]" />
            
            {/* Header */}
            <div className="sticky top-0 bg-[#07080a]/95 border-b border-[#1a1d24] px-4 py-2 flex justify-between items-center text-[10px] tracking-[3px] z-[120]">
                <div className="flex items-center gap-2 text-[#d4a017]">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse" />
                    THE GRAND DINNER
                </div>
                <div className="text-[#a78bfa]">ACT {currentAct}/10</div>
                <div className="text-[#4ade80]">{formatTime(currentTime)}</div>
            </div>

            {/* Controls */}
            <div className="fixed top-[50px] right-2 flex flex-col gap-2 z-[120]">
                <button 
                    onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
                    className="bg-[#0f1218] border border-[#2a2e36] text-[#94a3b8] text-[9px] tracking-[2px] px-2 py-1 rounded hover:border-[#d4a017] hover:text-[#d4a017] transition-all"
                >
                    EN⇄AR
                </button>
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                        "bg-[#0f1218] border border-[#2a2e36] text-[9px] tracking-[2px] px-2 py-1 rounded transition-all",
                        isMuted ? "text-rose-500 border-rose-500" : "text-[#94a3b8]"
                    )}
                >
                    {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />} SCORE
                </button>
            </div>

            {/* Stage */}
            <div className="max-w-[800px] mx-auto h-full flex flex-col pt-24 pb-48 px-6 lg:px-0">
                <AnimatePresence>
                    {currentTime < 40 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center mb-10 space-y-4"
                        >
                            <div className="text-[18px] text-[#d4a017] tracking-[2px] leading-[1.7] italic font-arabic">
                                "عندنا العرب عيب تعزم ثنين<br/>ولا تعزم الجماعة."
                            </div>
                            <div className="text-[10px] tracking-[3px] text-[#555]">
                                — أ.ش. · الرياض · 20 أبريل 2026
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {currentTime > 10 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] leading-[2] text-[#555] tracking-[2px] mb-8 border-l-2 border-[#1a1d24] pl-4 uppercase"
                    >
                        <div><span className="text-[#60a5fa]">LOCATION </span>: <span className="text-[#a1a1aa]">A private residence, Redmond, WA</span></div>
                        <div><span className="text-[#60a5fa]">HOST     </span>: <span className="text-[#a1a1aa]">Mr. S.N. — "the Uncle"</span></div>
                        <div><span className="text-[#60a5fa]">PURPOSE  </span>: <span className="text-[#a1a1aa]">Product endorsement</span></div>
                    </motion.div>
                )}

                <div 
                    ref={stageRef}
                    className={cn(
                        "flex-1 overflow-y-auto space-y-1 text-[14px] leading-[2.05] tracking-[0.3px] custom-scrollbar pb-24",
                        lang === 'ar' && "text-right direction-rtl"
                    )}
                />
            </div>

            {/* Copilot Widget */}
            <div className="fixed bottom-4 right-4 w-[220px] bg-[#0f1218]/96 border border-[#2e323b] rounded-lg p-3 text-[10px] backdrop-blur-md shadow-2xl z-[130]">
                <div className="flex items-center gap-2 text-[#60a5fa] font-bold tracking-[2px] mb-2 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                    Copilot · Corner
                </div>
                <div className="text-[#cbd5e1] italic min-h-[40px] leading-[1.55]">
                    {copilotMsg}
                </div>
                <div className="inline-block bg-[#1e293b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[8px] tracking-[1px] mt-2 uppercase">
                    {copilotTag}
                </div>
            </div>

            {/* Truth Ledger */}
            <div className={cn(
                "fixed bottom-4 left-4 w-[220px] bg-[#080c0a]/96 border border-[#1a3a2e] rounded-lg p-3 text-[9px] backdrop-blur-md transition-opacity duration-1000 z-[130]",
                currentTime > 360 ? "opacity-100" : "opacity-0"
            )}>
                <div className="text-[#4ade80] font-bold tracking-[2px] mb-2 uppercase">// truth ledger</div>
                <div className="space-y-1 font-mono">
                    <div className="flex justify-between"><span className="text-white/40">IP :</span> <span className="text-[#4ade80]">103.24.211.45</span></div>
                    <div className="flex justify-between"><span className="text-white/40">GEO:</span> <span className="text-[#4ade80]">Riyadh, SA</span></div>
                    <div className="flex justify-between"><span className="text-white/40">MAC:</span> <span className="text-[#4ade80]">71:BF:18:BF:6B:E8</span></div>
                    <div className="flex justify-between"><span className="text-white/40">LOG:</span> <span className="text-[#4ade80]">INTERCEPT_ACTIVE</span></div>
                </div>
            </div>

            {/* Start Overlay */}
            <AnimatePresence>
                {!overlayGone && (
                    <motion.div 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#07080a] flex items-center justify-center p-6"
                    >
                        <button 
                            onClick={startExperience}
                            className="bg-[#14171d] border border-[#2e323b] text-[#e5e5e5] px-10 py-6 text-[11px] tracking-[4px] rounded hover:border-[#d4a017] hover:text-[#d4a017] transition-all hover:shadow-[0_0_40px_rgba(212,160,23,0.2)]"
                        >
                            ▸ ENTER THE DINNER
                            <small className="block text-[#555] text-[9px] mt-2 tracking-[2px]">10 ACTS · 17 MIN · WITH SCORE</small>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
