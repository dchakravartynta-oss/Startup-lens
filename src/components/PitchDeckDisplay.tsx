import { motion } from "motion/react";
import { 
  Target, 
  Lightbulb, 
  BarChart3, 
  DollarSign, 
  Users, 
  Trophy, 
  Rocket, 
  ShieldAlert, 
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PitchDeck } from "../types";

interface Props {
  deck: PitchDeck;
}

export default function PitchDeckDisplay({ deck }: Props) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <main className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: The Core Pitch */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* Hero/Tagline Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-bg border border-card-border p-8 rounded-lg shadow-2xl"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold block mb-3 font-bold">The Tagline</span>
            <h2 className="text-4xl md:text-5xl font-serif italic leading-tight text-white">{deck.tagline}</h2>
          </motion.div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card-bg border border-card-border p-6 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-rose-400 font-bold">The Problem</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">{deck.problem.statement}</p>
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target</p>
                <p className="text-xs text-gray-300">{deck.problem.who_feels_it}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card-bg border border-card-border p-6 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-4 h-4 text-gold" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">The Solution</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">{deck.solution.what_it_is}</p>
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Engine</p>
                <p className="text-xs text-gray-300">{deck.solution.how_it_works}</p>
              </div>
            </motion.div>
          </div>

          {/* Market & Model Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card-bg border border-card-border p-6 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-blue-400 font-bold">Market Opportunity</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                <strong className="text-white not-italic pr-2 font-black">{deck.market.market_size}</strong> 
                {deck.market.target_users}
              </p>
              <p className="mt-2 text-[10px] text-blue-400/60 uppercase font-black">{deck.market.why_now}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card-bg border border-card-border p-6 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400 font-bold">Economic Engine</span>
              </div>
              <p className="text-sm text-white font-medium mb-1">{deck.business_model.how_you_make_money}</p>
              <p className="text-xs text-gray-400">{deck.business_model.pricing_idea}</p>
              <p className="mt-3 text-[10px] text-emerald-400 uppercase font-bold tracking-tighter opacity-50">{deck.business_model.growth_path}</p>
            </motion.div>
          </div>

          {/* One Liner Pitch */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gold/10 border border-gold/30 p-8 rounded-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-16 h-16 text-gold fill-gold" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-gold block mb-4 font-black">Professional Narrative</span>
            <p className="text-2xl font-serif italic text-gold leading-snug">
              "{deck.one_liner_pitch}"
            </p>
          </motion.div>
        </div>

        {/* Right Column: Investor scorecard */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Score Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#111] border-2 border-gold/40 p-8 rounded-xl flex flex-col items-center text-center shadow-[0_0_40px_rgba(212,175,55,0.1)]"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-black mb-6">Investability Index</span>
            <div className="text-8xl font-serif text-white mb-2 italic">
              {deck.investor_score.score}
              <span className="text-2xl text-gray-600 not-italic">/10</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Number(deck.investor_score.score) * 10}%` }}
                transition={{ duration: 1, delay: 1 }}
                className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
              />
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed italic uppercase tracking-[0.2em] font-bold">
              VERDICT: {deck.investor_score.verdict}
            </p>
          </motion.div>

          {/* Analysis Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card-bg border border-card-border p-6 rounded-lg flex-1"
          >
            <div className="mb-8">
              <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400 block mb-4 font-black">Core Strengths</span>
              <ul className="text-xs text-gray-300 space-y-3">
                {deck.investor_score.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <span className="text-[9px] uppercase tracking-[0.3em] text-rose-400 block mb-4 font-black">Primary Risks</span>
              <ul className="text-xs text-gray-300 space-y-3">
                {deck.investor_score.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-4 h-4 text-gold" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">Strategic Ask</span>
              </div>
              <p className="text-xs text-white font-medium mb-3">{deck.ask.what_you_need}</p>
              <div className="flex flex-wrap gap-2">
                {deck.ask.what_it_will_be_used_for.map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Next Step */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="p-5 bg-card-bg rounded-lg border border-card-border flex items-center justify-between"
          >
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 block mb-1 font-black">Next Milestone</span>
              <p className="text-xs font-bold text-white uppercase tracking-widest">{deck.traction.next_milestone}</p>
            </div>
            <Rocket className="w-5 h-5 text-gray-700" />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
