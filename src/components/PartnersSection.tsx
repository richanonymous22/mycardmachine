import { Button } from "@/components/ui/button";
import { useProviders } from "@/hooks/useProviders";
import { Handshake } from "lucide-react";

// Major UK card machine providers with placeholder logos
const majorProviders = [
  { id: "sumup", name: "SumUp", logo: "https://cdn.brandfolder.io/YIAXPZ00/at/9mhjc5-64zvnz-3k3krf/SumUp_Logo_Blue_RGB.svg" },
  { id: "zettle", name: "Zettle by PayPal", logo: "https://www.zettle.com/gb/press/assets/zettle-by-paypal-horizontal.png" },
  { id: "square", name: "Square", logo: "https://images.ctfassets.net/2d5q1td6cyxq/5pXmUj8BniFnyp6aWULNMq/5c6e2b8b4c7b0c0e4c8b5c6e2b8b4c7b/logo.svg" },
  { id: "worldpay", name: "Worldpay", logo: "https://www.worldpay.com/content/dam/worldpay-global/images/logos/worldpay-logo.svg" },
  { id: "dojo", name: "Dojo", logo: "https://dojo.tech/wp-content/uploads/2023/03/dojo-logo-dark.svg" },
  { id: "clover", name: "Clover", logo: "https://www.clover.com/assets/images/public-site/press/clover_primary_gray_rgb.png" },
  { id: "takepayments", name: "takepayments", logo: "https://www.takepayments.com/wp-content/uploads/2023/08/takepayments-logo.svg" },
  { id: "paymentsense", name: "Paymentsense", logo: "https://www.paymentsense.com/wp-content/uploads/2023/09/paymentsense-logo.svg" },
];

export const PartnersSection = () => {
  const { data: providers } = useProviders();
  
  // Combine major providers with database providers that have logos
  const dbLogos = providers?.filter(p => p.logo_url).map(p => ({ 
    id: p.id, 
    name: p.name, 
    logo: p.logo_url 
  })) || [];
  
  const allLogos = [...majorProviders, ...dbLogos];
  
  // Triple the logos for seamless infinite scroll
  const logos = [...allLogos, ...allLogos, ...allLogos];

  return (
    <section className="py-6 relative overflow-hidden border-y border-border/20 bg-gradient-to-r from-background via-muted/10 to-background">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-accent/[0.02] to-primary/[0.02] opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-4">
          {/* Logo Marquee */}
          <div className="relative overflow-hidden">
            <div className="flex gap-12 md:gap-16 animate-marquee">
              {logos.map((provider, index) => (
                <div
                  key={`${provider.id}-${index}`}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
                  style={{ minWidth: "140px" }}
                >
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="h-10 w-auto object-contain brightness-0 dark:invert"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Premium gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
          </div>

          {/* Partner CTA - Below logos */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Are you a provider?
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
              asChild
            >
              <a href="mailto:partners@mycardmachine.com" className="flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                Partner with Us
              </a>
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};