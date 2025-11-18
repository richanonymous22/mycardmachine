import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the comparison tool work?",
    answer: "Our comparison tool analyzes your current payment provider's fees and compares them with alternative providers based on your monthly turnover. We calculate transaction costs, monthly fees, and potential savings to help you make an informed decision."
  },
  {
    question: "Is there any cost to use this service?",
    answer: "No, our comparison service is completely free to use. We're here to help UK businesses save money on card processing fees without any hidden charges."
  },
  {
    question: "How accurate are the savings calculations?",
    answer: "Our calculations are based on real provider fee structures and your actual monthly turnover. While we strive for accuracy, final costs may vary slightly depending on your specific business needs and negotiated rates with providers."
  },
  {
    question: "How long does it take to switch providers?",
    answer: "Switching typically takes 1-2 weeks depending on the provider. This includes application processing, terminal setup, and integration. We'll guide you through every step to ensure a smooth transition."
  },
  {
    question: "Will I need to buy new equipment?",
    answer: "Most modern payment providers offer both rental and purchase options for card terminals. Some may offer free terminals as part of their package. We'll help you find the best option for your business."
  },
  {
    question: "What if I'm in a contract with my current provider?",
    answer: "Many providers have early termination fees. However, the potential savings from switching often outweigh these costs. We can help you calculate whether switching makes financial sense in your situation."
  },
  {
    question: "Do you support all UK payment providers?",
    answer: "We work with the major UK payment providers including SumUp, Zettle, Square, Dojo, and others. If your current provider isn't listed, you can use our custom provider option to compare costs."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. We only collect the information necessary to provide comparisons and never store sensitive payment data. See our Privacy Policy for full details."
  }
];

export const FAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers. Find everything you need to know about switching payment providers.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:hello@cardcostsclever.co.uk"
              className="text-primary hover:underline font-semibold"
            >
              Contact us at hello@cardcostsclever.co.uk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};