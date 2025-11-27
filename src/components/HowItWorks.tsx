import { motion } from "framer-motion";
import { Search, Calculator, CheckCircle2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Your Details",
    description: "Tell us about your monthly card turnover and current provider",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Calculator,
    title: "Compare Providers",
    description: "Our algorithm analyzes rates from top UK payment providers instantly",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: CheckCircle2,
    title: "See Your Savings",
    description: "Get a detailed breakdown of exactly how much you could save annually",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Rocket,
    title: "Switch in Minutes",
    description: "Apply directly through us and we'll handle the entire switching process",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-20 relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <span className="px-4 py-1 text-sm font-semibold text-primary">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Switch in <span className="text-transparent bg-clip-text bg-gradient-primary">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've made comparing and switching card machines effortless. Start saving in minutes.
          </p>
        </motion.div>

        {/* Steps Grid - Mobile Optimized */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              {/* Card */}
              <div className="glass relative h-full p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover shadow-glow flex items-center justify-center">
                  <span className="text-base md:text-lg font-bold text-primary-foreground">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${step.color} mb-4 md:mb-6 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-2xl" />
                  <step.icon className={`w-6 h-6 md:w-8 md:h-8 ${step.iconColor} relative z-10`} />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-8 w-16 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Join thousands of UK businesses already saving with My Card Machine
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Free Comparison", "No Obligation", "Expert Support", "Quick Setup"].map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
