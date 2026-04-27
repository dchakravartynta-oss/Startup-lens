/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ChevronLeft, 
  Zap,
  Globe,
  Briefcase,
  Mail
} from "lucide-react";
import { generatePitch } from "./lib/gemini";
import { PitchDeck } from "./types";
import PitchDeckDisplay from "./components/PitchDeckDisplay";
import ContactForm from "./components/ContactForm";

const LOADING_MESSAGES = [
  "Analyzing market dynamics and TAM...",
  "Distilling value propositions into storytelling arcs...",
  "Running adversarial risk assessment protocols...",
  "Benchmarking against industry exit multiples...",
  "Polishing the one-liner for maximum investor impact...",
  "Synthesizing competitive moats and advantages...",
  "Finalizing executive summary for the partners..."
];

export default function App() {
  const [idea, setIdea] = useState("");
  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsLoading(true);
    setLoadingMsgIdx(0);
    setError(null);
    
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    try {
      const result = await generatePitch(idea);
      setDeck(result);
    } catch (err: any) {
      console.error("Pitch generation failed:", err);
      setError(err.message || "Failed to generate pitch. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-[#e0e0e0] font-sans selection:bg-gold/20 selection:text-gold">
      <AnimatePresence mode="wait">
        {!deck && !isLoading ? (
          <motion.main
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            
            <div className="max-w-3xl w-full space-y-12 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                  <Sparkles className="w-3 h-3" />
                  Elite Startup Consultant
                </div>
                <h1 className="text-6xl font-serif italic tracking-tight text-white sm:text-8xl">
                  Pitch like <span className="text-gold">gold.</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-xl mx-auto font-medium leading-relaxed">
                  Startup-Lens AI transforms your raw concept into a fundable, investor-ready deck outline using world-class storytelling.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative group bg-white/5 p-1 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl"
              >
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your startup vision in a few sentences..."
                  className="w-full min-h-[220px] p-8 text-2xl bg-transparent border-none focus:ring-0 resize-none placeholder:text-white/10 font-serif italic text-white leading-relaxed"
                />
                
                <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.02] rounded-b-2xl">
                  <div className="flex gap-6 text-gray-500">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Zap className="w-3 h-3 text-gold" /> Velocity
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Globe className="w-3 h-3 text-white/40" /> Global
                    </span>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!idea.trim()}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-gold text-dark-bg rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                  >
                    Generate Analysis
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-sm font-bold bg-rose-400/10 py-3 px-6 rounded-lg border border-rose-400/20"
                >
                  {error}
                </motion.p>
              )}

              <div className="grid grid-cols-3 gap-12 pt-8">
                <div className="space-y-1">
                  <p className="text-3xl font-serif text-white tracking-widest italic leading-none">840+</p>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-gray-600">Decks Guided</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-serif text-gold tracking-widest italic leading-none">$14B+</p>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-gray-600">Capital Raised</p>
                </div>
                <div className="space-y-1 border-l border-white/5">
                  <p className="text-3xl font-serif text-white tracking-widest italic leading-none">100%</p>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-gray-600">Confidential</p>
                </div>
              </div>

              {/* Contact Section on Home */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-24 max-w-2xl mx-auto space-y-12"
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Mail className="w-8 h-8 text-gold opacity-30" />
                  </div>
                  <h3 className="text-3xl font-serif italic text-white leading-none">Inquiry Protocol</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">Connect with the elite consulting group</p>
                </div>
                <ContactForm />
              </motion.div>
            </div>
          </motion.main>

        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-dark-bg"
          >
            <div className="w-full max-w-md space-y-12 text-center">
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-2 border-gold border-r-2 border-r-transparent"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-b-2 border-white/20 border-l-2 border-l-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gold animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black tracking-[0.5em] text-gold">Consultant Protocol</h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsgIdx}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="text-white text-xl font-serif italic"
                  >
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-dark-bg"
          >
            <nav className="sticky top-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-white/10 px-8 py-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setDeck(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-gold" />
                  </button>
                  <div className="space-y-1">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Startup-Lens AI</h1>
                    <p className="text-sm font-serif italic text-white opacity-80">Pitch Analysis Framework // V4.2</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button
                    onClick={() => window.print()}
                    className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                  >
                    Export Outline
                  </button>
                  <button
                    className="px-6 py-2 bg-gold text-dark-bg rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Finalize Pitch
                  </button>
                </div>
              </div>
            </nav>

            {deck && <PitchDeckDisplay deck={deck} />}

            {/* Post-Analysis Contact */}
            <section className="max-w-4xl mx-auto py-24 px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-gold/[0.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <h3 className="text-4xl font-serif italic text-white">Scale your vision.</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    The analysis above is the first step. Our elite partners specialize in turning these frameworks into real market dominance.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                      <Sparkles className="w-4 h-4" /> Global Network
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                      <Zap className="w-4 h-4" /> Priority Execution
                    </div>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl">
                  <ContactForm />
                </div>
              </div>
            </section>

            <footer className="max-w-7xl mx-auto py-12 px-8 border-t border-white/10 flex justify-between">
              <span className="text-[9px] text-gray-700 uppercase tracking-[0.2em] font-bold">Confidential Strategy // Enterprise Edition</span>
              <div className="text-right space-y-4">
                <p className="text-gray-600 text-[10px] uppercase font-black tracking-widest italic">
                  "The gap between an idea and an investment is the story."
                </p>
                <button
                  onClick={() => setDeck(null)}
                  className="text-gold text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
                >
                  Generate New Analysis
                </button>
              </div>
            </footer>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
