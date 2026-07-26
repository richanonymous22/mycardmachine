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

      <section id="calculator-section" className="relative py-24 md:py-32 px-6 bg-secondary/40 border-y border-border/50">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Editorial headline */}
            <div className="space-y-8">
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
                The Math
                <br />
                <span className="text-primary">is Simple.</span>
              </h2>
              <p className="text-lg md:text-xl text-foreground/60 max-w-lg leading-relaxed">
                Most UK businesses are losing up to 40% of their margin to
                legacy bank rates. Enter your turnover to see the delta.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="p-6 rounded-3xl bg-card border border-border/60">
                  <div className="font-display text-3xl font-bold mb-1">£2.4k</div>
                  <div className="text-xs text-primary/80 uppercase tracking-widest">Avg. Yearly Saving</div>
                </div>
                <div className="p-6 rounded-3xl bg-card border border-border/60">
                  <div className="font-display text-3xl font-bold mb-1">0.4%</div>
                  <div className="text-xs text-primary/80 uppercase tracking-widest">Lowest Market Rate</div>
                </div>
              </div>
            </div>

            {/* Right: Calculator */}
            <div className="relative p-[1px] bg-gradient-to-br from-primary/60 via-border to-primary/20 rounded-[40px]">
              <div className="bg-card rounded-[38px] p-8 md:p-12 shadow-premium">
                <div>
                  <Label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                    Monthly Card Turnover
                  </Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 font-display text-4xl md:text-5xl font-bold text-primary/40">£</span>
                    <Input
                      id="turnover-v2"
                      type="text"
                      value={turnover && turnover > 0 ? turnover.toLocaleString() : ""}
                      onChange={(e) => handleTurnoverChange(e.target.value)}
                      placeholder="15,000"
                      className="font-display h-auto w-full bg-transparent border-0 border-b-2 border-border rounded-none pb-3 pl-10 text-4xl md:text-5xl font-bold text-foreground focus-visible:ring-0 focus-visible:border-primary focus-visible:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Enter between £5,000 and £200,000 for personalised results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">

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
      <FAQ />

      {/* CTA Section - Always visible */}
      <div className="mt-8 md:mt-10">
        <CTASection />
      </div>

      <Footer />
    </div>;
};
export default IndexV2;