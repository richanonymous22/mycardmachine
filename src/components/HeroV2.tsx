import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroV2 = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToProviders = () => {
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
      {/* Atmospheric glows */}
      <div className="absolute top-1/4 -left-20 w-[28rem] h-[28rem] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[28rem] h-[28rem] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_80%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            Live UK Market Rates
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-10 uppercase"
        >
          Stop{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-primary">
            Overpaying
          </span>
          <br />
          For Payments
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-100/60 font-medium leading-relaxed mb-12 px-4"
        >
          The UK's most transparent card machine comparison. We surface the
          margins other brokers hide — zero fees, no fluff.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-10 py-7 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_60px_-10px_hsl(var(--primary)/0.9)] transition-all group"
          >
            Compare Machines
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToProviders}
            className="w-full sm:w-auto px-10 py-7 bg-card border border-border hover:bg-secondary-hover text-white rounded-full font-bold text-lg"
          >
            View Providers
          </Button>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 md:gap-12 mt-20 max-w-3xl mx-auto"
        >
          {[
            { value: "10,000+", label: "UK Businesses" },
            { value: "£2.4M+", label: "Saved / Year" },
            { value: "4.9/5", label: "Merchant Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl md:text-4xl font-extrabold text-white mb-1">
                {s.value}
              </div>
              <div className="text-[11px] md:text-xs uppercase tracking-widest text-indigo-300/60">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 pointer-events-none">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-primary" />
      </div>
    </section>
  );
};
