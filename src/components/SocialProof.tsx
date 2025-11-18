import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Award, Quote } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Businesses",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: TrendingUp,
    value: "£2.4M+",
    label: "Total Savings Generated",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Award,
    value: "98%",
    label: "Customer Satisfaction",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Coffee Shop Owner",
    content: "Switched from my old provider and I'm saving £180 per month! The process was seamless and the My Card Machine team handled everything.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James Patterson",
    role: "Restaurant Manager",
    content: "I had no idea I was overpaying until I used this tool. Now I'm saving over £2,000 annually. Absolutely brilliant service!",
    rating: 5,
    avatar: "JP",
  },
  {
    name: "Emma Thompson",
    role: "Retail Store Owner",
    content: "The comparison was eye-opening. I switched providers in less than a week and the savings are already adding up. Highly recommend!",
    rating: 5,
    avatar: "ET",
  },
];

export const SocialProof = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-muted/30 to-transparent">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-accent/10 rounded-full mb-4">
            <span className="px-4 py-1 text-sm font-semibold text-accent">Trusted by Thousands</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Join the UK's <span className="text-transparent bg-clip-text bg-gradient-accent">Fastest Growing</span> Switching Service
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thousands of UK businesses trust My Card Machine to find them the best payment deals
          </p>
        </motion.div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass relative group overflow-hidden rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative p-6 md:p-8">
                {/* Icon */}
                <div className="mb-4">
                  <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.iconColor}`} />
                </div>
                
                {/* Value */}
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="glass relative group rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 p-6 md:p-8"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by businesses across the UK
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "FCA Authorized",
              "SSL Secured",
              "GDPR Compliant",
              "UK Based Support",
              "No Hidden Fees",
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                className="px-4 py-2 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
