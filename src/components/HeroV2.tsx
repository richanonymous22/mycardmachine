import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

export const HeroV2 = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6 md:mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-foreground">
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
            className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8 md:mb-12 px-4"
          >
            {[
              { icon: CheckCircle2, text: "100% Free" },
              { icon: CheckCircle2, text: "2-7 Day Switch" },
              { icon: CheckCircle2, text: "Expert Support" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm md:text-base">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center px-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-hover shadow-glow hover:shadow-xl transition-all text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group w-full sm:w-auto"
              onClick={() => {
                const calculatorSection = document.getElementById('calculator-section');
                calculatorSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Comparing Now
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass border-border hover:border-primary/50 hover:bg-primary/5 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto"
              asChild
            >
              <a href="tel:+442012345678">
                Or Call: 020 1234 5678
              </a>
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
