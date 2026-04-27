import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "../lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const data = await submitContactForm(formData);

      setStatus("success");
      setResponseMsg(data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      setStatus("error");
      setResponseMsg(error.message || "Connection error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-gold/10 border border-gold/30 rounded-lg text-center space-y-4"
      >
        <CheckCircle2 className="w-12 h-12 text-gold mx-auto" />
        <h3 className="text-xl font-serif text-white italic">{responseMsg}</h3>
        <button 
          onClick={() => setStatus("idle")}
          className="text-gold text-xs font-black uppercase tracking-widest hover:opacity-70"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors font-serif italic"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Email</label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors font-serif italic"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Message</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gold outline-none transition-colors font-serif italic resize-none"
          placeholder="How can our elite consultants help you?"
        />
      </div>
      
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gold text-dark-bg py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "loading" ? "Analyzing Connection..." : "Dispatch Inquiry"}
        <Send className="w-3 h-3" />
      </button>
      
      {status === "error" && (
        <p className="text-rose-400 text-xs text-center font-bold">{responseMsg}</p>
      )}
    </form>
  );
}
