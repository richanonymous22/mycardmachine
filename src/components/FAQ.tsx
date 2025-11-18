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
  {
    question: "Do you work with all major UK providers?",
    answer: "We partner with the UK's leading payment providers including SumUp, Zettle, Square, Paymentsense, and more. This ensures you get access to the most competitive rates in the market."
  },
  {
    question: "What support do you offer after switching?",
    answer: "We provide ongoing support even after you've switched. If you encounter any issues with your new provider or have questions about your service, our team is here to help at no extra cost."
  }
];

export const FAQ = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

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
            <HelpCircle className="w-4 h-4 text-primary mr-2" />
            <span className="px-3 py-1 text-sm font-semibold text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Questions? <span className="text-transparent bg-clip-text bg-gradient-primary">We've Got Answers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about comparing and switching card machines
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl border border-border/50 p-6 md:p-8 shadow-premium"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
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
                    className="border border-border/30 rounded-xl px-6 hover:border-primary/50 transition-colors bg-card/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="text-base md:text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-2">
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
            className="mt-12 text-center"
          >
            <div className="glass rounded-2xl border border-border/50 p-8 inline-block">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Our expert team is here to help you find the perfect card machine solution
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-primary shadow-glow hover:shadow-xl transition-shadow"
                  asChild
                >
                  <a href="tel:+442012345678">Call Us Now</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:border-primary/50 hover:bg-primary/5"
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
