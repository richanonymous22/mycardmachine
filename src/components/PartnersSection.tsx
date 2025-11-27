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
    <section className="py-8 relative overflow-hidden border-y border-border/30 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8">
          {/* Infinite Logo Carousel - Takes majority of space */}
          <div className="flex-1 relative overflow-hidden">
            <div className="flex gap-8 md:gap-12 animate-scroll">
              {logos.map((provider, index) => (
                <div
                  key={`${provider.id}-${index}`}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ minWidth: "120px" }}
                >
                  {provider.logo_url ? (
                    <img
                      src={provider.logo_url}
                      alt={provider.name}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <div className="h-8 flex items-center justify-center text-muted-foreground text-sm font-medium">
                      {provider.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/20 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/20 to-transparent pointer-events-none" />
          </div>

          {/* Partner CTA - Compact */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <p className="text-sm text-muted-foreground hidden md:block">
              Are you a provider?
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
              asChild
            >
              <a href="mailto:partners@mycardmachine.com">
                <Handshake className="w-4 h-4 mr-2" />
                Partner with Us
              </a>
            </Button>
          </div>
        </div>
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