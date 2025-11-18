import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How does My Card Machine compare providers?",
    answer: "We use real-time data from major UK payment providers to calculate exact costs based on your monthly turnover. Our algorithm factors in all fees including transaction rates, authorization fees, and any hidden charges to give you the true cost comparison."
  },
  {
    question: "Is this service really free?",
    answer: "Yes, completely free. We earn a small commission from providers when you switch, but this never affects your rates. You get the same great deals as going direct, plus our expert support throughout the switching process."
  },
  {
    question: "How long does it take to switch providers?",
    answer: "Most switches are completed within 5-7 working days. We handle all the paperwork and coordinate with your new provider to ensure a seamless transition with zero downtime for your business."
  },
  {
    question: "Will I need new equipment?",
    answer: "It depends on your new provider. Many modern providers offer free card machines as part of their service. We'll advise you on equipment options during the application process and ensure you get the best deal."
  },
  {
    question: "What if I'm locked in a contract?",
    answer: "Many providers have notice periods or early termination fees. We'll review your current contract and calculate if the savings from switching still make it worthwhile. Often, the savings far outweigh any exit fees."
  },
  {
    question: "How accurate are the savings calculations?",
    answer: "Our calculations are based on actual provider rates and your specific turnover. While real-world savings can vary based on your exact transaction mix (debit vs credit cards), our estimates are typically within 5% of actual costs."
  },
];

export const FAQ = () => {
  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 rounded-full glass border border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">We've Got Answers</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Everything you need to know about comparing and switching card machines
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="glass border border-border/50 rounded-xl px-4 md:px-6 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4 md:py-5">
                      <span className="text-sm md:text-base font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-4 md:pb-5 pt-1">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 md:mt-12 text-center"
          >
            <div className="glass rounded-2xl border border-border/50 p-6 md:p-8">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md mx-auto">
                Our expert team is here to help you find the perfect card machine solution
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-hover shadow-glow hover:shadow-xl transition-shadow w-full sm:w-auto"
                  asChild
                >
                  <a href="tel:+442012345678">Call Us Now</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass border-border hover:border-primary/50 hover:bg-primary/5 w-full sm:w-auto"
                  asChild
                >
                  <a href="mailto:hello@mycardmachine.com">Email Us</a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
