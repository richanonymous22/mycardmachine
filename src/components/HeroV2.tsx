import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

export const HeroV2 = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-primary/20 mb-6 md:mb-8"
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-primary">
              UK's #1 Card Machine Comparison Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight"
          >
            Save Money on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
              Card Payments
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Compare rates from UK's leading payment providers in seconds. 
            Most businesses save <span className="text-foreground font-semibold">£2,000+ per year</span>.
          </motion.p>

          {/* Trust Indicators - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12 px-4 max-w-2xl mx-auto"
          >
            {[
              { icon: CheckCircle2, text: "100% Free" },
              { icon: CheckCircle2, text: "2-7 Day Switch" },
              { icon: CheckCircle2, text: "Expert Support" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
                <span className="text-muted-foreground whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button - Single */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center px-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-hover shadow-glow hover:shadow-xl transition-all text-base md:text-lg px-8 md:px-10 py-6 md:py-7 group"
              onClick={() => {
                const calculatorSection = document.getElementById('calculator-section');
                calculatorSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              Start Comparing Now
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats - Mobile Optimized Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 max-w-3xl mx-auto px-4"
          >
            {[
              { value: "10,000+", label: "Businesses" },
              { value: "£2.4M+", label: "Saved" },
              { value: "4.9/5", label: "Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.6 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};
