import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
import { useProviders } from "@/hooks/useProviders";
import { useEffect, useState } from "react";

interface ProviderLogo {
  id: string;
  name: string;
  logo_url: string;
}

export const PartnersSection = () => {
  const { data: providers } = useProviders();
  const [logos, setLogos] = useState<ProviderLogo[]>([]);

  useEffect(() => {
    if (providers) {
      // Filter providers with logo_url and duplicate for infinite scroll effect
      const providersWithLogos = providers
        .filter((p): p is typeof p & { logo_url: string } => !!p.logo_url)
        .map(p => ({ id: p.id, name: p.name, logo_url: p.logo_url }));
      setLogos([...providersWithLogos, ...providersWithLogos]); // Duplicate for seamless loop
    }
  }, [providers]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Handshake className="w-5 h-5 text-primary mr-2" />
            <span className="px-3 py-1 text-sm font-semibold text-primary">Trusted Partners</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-accent">Partners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We work with the UK's leading payment providers to bring you the best deals
          </p>
        </motion.div>

        {/* Infinite Logo Carousel */}
        <div className="relative mb-12 overflow-hidden">
          <div className="flex gap-8 md:gap-12 animate-scroll">
            {logos.map((provider, index) => (
              <motion.div
                key={`${provider.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex-shrink-0 glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                style={{ minWidth: "200px" }}
              >
                {provider.logo_url ? (
                  <img
                    src={provider.logo_url}
                    alt={provider.name}
                    className="h-12 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="h-12 flex items-center justify-center text-muted-foreground font-semibold">
                    {provider.name}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Partner CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass relative group overflow-hidden rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 p-8 md:p-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20">
                <Handshake className="h-10 w-10 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Are you a payment provider?
                </h3>
                <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                  Join our network of trusted partners and help thousands of UK businesses find better payment solutions
                </p>
              </div>
              
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-hover shadow-glow hover:shadow-xl transition-all"
                asChild
              >
                <a href="mailto:partners@mycardmachine.com">
                  Partner with Us
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};