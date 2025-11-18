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
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />

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

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
              <div className="glass relative h-full p-6 md:p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <step.icon className={`w-8 h-8 ${step.iconColor} relative z-10`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
