import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { partners } from "@/data/partners";
import { useProviders, usePriorityRules } from "@/hooks/useProviders";
import { calculateMerchantCosts, sanitizeTurnover } from "@/utils/calculations";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { HeroV2 } from "@/components/HeroV2";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { PartnersSection } from "@/components/PartnersSection";
import { TrendingUp, Sparkles, ChevronDown } from "lucide-react";
const IndexV2 = () => {
  const [turnover, setTurnover] = useState<number>(0);
  const [topRecommendations, setTopRecommendations] = useState<any[]>([]);
  const [allRecommendations, setAllRecommendations] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Fetch providers from database
  const { data: dbProviders, isLoading } = useProviders();
  const { data: priorityRules } = usePriorityRules(turnover);
  
  // Use database providers if available, otherwise fallback to hardcoded
  const activeProviders = dbProviders || partners;

  useEffect(() => {
    const sanitizedTurnover = sanitizeTurnover(turnover);

    // Calculate costs for all partners (except custom)
    const realPartners = activeProviders.filter(p => p.id !== "custom");
    const calculatedPartners = realPartners
      .map(partner => {
        try {
          const costs = calculateMerchantCosts(partner, sanitizedTurnover);
          return {
            partner,
            costs,
            monthlyTurnover: sanitizedTurnover
          };
        } catch (error) {
          console.error(`Error calculating costs for ${partner.name}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null values from errors

    // Apply priority rules if available
    if (priorityRules && priorityRules.length > 0) {
      const priorityMap = new Map(priorityRules.map(rule => [rule.provider_id, rule.priority_score]));
      
      calculatedPartners.sort((a, b) => {
        const priorityA = priorityMap.get(a!.partner.id) || 0;
        const priorityB = priorityMap.get(b!.partner.id) || 0;
        
        // Sort by priority first, then by cost
        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }
        return a!.costs.totalMonthlyCost - b!.costs.totalMonthlyCost;
      });
    } else {
      // Default: sort by lowest cost
      calculatedPartners.sort((a, b) => a!.costs.totalMonthlyCost - b!.costs.totalMonthlyCost);
    }

    setAllRecommendations(calculatedPartners as any[]);
    setTopRecommendations(calculatedPartners.slice(0, visibleCount) as any[]);
  }, [turnover, visibleCount, activeProviders, priorityRules]);

  const remainingCount = allRecommendations.length - visibleCount;

  const handleShowMore = () => {
    const newCount = Math.min(visibleCount + 5, allRecommendations.length);
    setVisibleCount(newCount);
    setShowAll(newCount >= allRecommendations.length);
  };
  const handleTurnoverChange = (value: string) => {
    const rawValue = value.replace(/[£,\s]/g, '');
    const numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue)) {
      setTurnover(numericValue);
    } else if (rawValue === '') {
      setTurnover(0);
    }
  };
  return <div className="min-h-screen bg-background">
      <Navigation />
      <HeroV2 />
      
      {isLoading && (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading providers...</p>
        </div>
      )}

      <div id="calculator-section" className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Premium Turnover Input Section */}
        <Card className="max-w-2xl mx-auto mb-12 shadow-2xl border-primary/30 bg-gradient-to-br from-card/95 via-card/90 to-primary/10 relative overflow-hidden backdrop-blur-xl">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-50 animate-pulse" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          
          <div className="relative p-6 md:p-10">
            {/* Icon and Title */}
            <div className="text-center mb-8 space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 animate-in fade-in duration-500 hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-primary drop-shadow-lg" />
              </div>
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                  What's your monthly card turnover?
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Enter your monthly turnover and we'll instantly show you the best payment providers
                </p>
              </div>
            </div>
            
            {/* Input Section with Animated Indicator */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '150ms' }}>
              <Label htmlFor="turnover-v2" className="text-base md:text-lg font-semibold text-center block text-foreground/90">
                Monthly Card Turnover
              </Label>
              <div className="relative group">
                {/* Glow effect on focus */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                
                {/* Animated pointer indicator */}
                {turnover === 0 && (
                  <div className="absolute -right-16 md:-right-20 top-1/2 -translate-y-1/2 animate-bounce-horizontal">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="text-2xl md:text-3xl">👈</div>
                      <span className="hidden lg:block text-sm font-medium whitespace-nowrap">Type here!</span>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-primary text-xl md:text-3xl font-bold z-10">
                    £
                  </span>
                  <Input 
                    id="turnover-v2" 
                    type="text" 
                    value={turnover && turnover > 0 ? turnover.toLocaleString() : ''} 
                    onChange={e => handleTurnoverChange(e.target.value)} 
                    placeholder="15,000" 
                    className="pl-10 md:pl-14 pr-4 text-xl md:text-3xl h-14 md:h-20 text-center font-bold border-2 border-primary/30 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-all duration-300 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/50" 
                  />
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
                Enter between <span className="text-primary font-semibold">£5,000</span> and <span className="text-primary font-semibold">£200,000</span> to see your personalized recommendations
              </p>
            </div>
          </div>
        </Card>

        {/* Recommendations Section - Only show when turnover is entered */}
        {turnover > 0 && topRecommendations.length > 0 && <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <div className="inline-block p-2 rounded-full bg-primary/10 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Your Top Recommendations</h2>
              <p className="text-base text-muted-foreground">Ranked by best value for your monthly turnover of <span className="font-semibold text-foreground">£{sanitizeTurnover(turnover).toLocaleString()}</span></p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 max-w-5xl mx-auto">
              {topRecommendations.map((rec, index) => <RecommendationCard key={rec.partner.id} partner={rec.partner} costs={rec.costs} monthlyTurnover={rec.monthlyTurnover} rank={index + 1} />)}
            </div>

            {/* Show More Button */}
            {remainingCount > 0 && !showAll && (
              <div className="flex justify-center mt-8 animate-in fade-in duration-500">
                <Button
                  onClick={handleShowMore}
                  variant="outline"
                  size="lg"
                  className="group hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <ChevronDown className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Show {Math.min(5, remainingCount)} More Provider{Math.min(5, remainingCount) > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>}
      </div>

      <HowItWorks />
      <SocialProof />
      <PartnersSection />
      <FAQ />

      {/* CTA Section - Always visible */}
      <div className="mt-8 md:mt-10">
        <CTASection />
      </div>

      <Footer />
    </div>;
};
export default IndexV2;