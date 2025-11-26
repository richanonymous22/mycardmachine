import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift } from "lucide-react";
import { Partner } from "@/types/merchant";
import { calculateMerchantCosts } from "@/utils/calculations";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProviderOffer {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  badge_text: string;
}

interface AutoSuggestionProps {
  currentPartner: Partner;
  turnover: number;
  onSuggestionSelect: (partnerId: string) => void;
  providers: Partner[];
  priorityRules?: Array<{ provider_id: string; priority_score: number }>;
}

export const AutoSuggestion = ({
  currentPartner,
  turnover,
  onSuggestionSelect,
  providers,
  priorityRules
}: AutoSuggestionProps) => {
  const [activeOffer, setActiveOffer] = useState<ProviderOffer | null>(null);
  const currentCosts = calculateMerchantCosts(currentPartner, turnover);
  
  // Calculate savings for all other partners and find the best one
  const bestSavingsOption = providers
    .filter(partner => partner.id !== currentPartner.id && partner.id !== "custom")
    .map(partner => {
      try {
        const costs = calculateMerchantCosts(partner, turnover);
        const monthlySavings = currentCosts.totalMonthlyCost - costs.totalMonthlyCost;
        const percentageSavings = (monthlySavings / currentCosts.totalMonthlyCost) * 100;
        const priorityScore = priorityRules?.find(rule => rule.provider_id === partner.id)?.priority_score || 0;
        return {
          partner,
          monthlySavings,
          percentageSavings,
          costs,
          priorityScore
        };
      } catch (error) {
        console.error(`Error calculating costs for ${partner.name}:`, error);
        return null;
      }
    })
    .filter((option): option is NonNullable<typeof option> => option !== null && option.monthlySavings > 0)
    .sort((a, b) => {
      // Sort by priority first, then by savings
      if (priorityRules && priorityRules.length > 0) {
        if (a.priorityScore !== b.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }
      }
      return b.monthlySavings - a.monthlySavings;
    })[0];

  // Fetch active offer for the recommended provider
  useEffect(() => {
    if (!bestSavingsOption) return;

    const fetchOffer = async () => {
      const { data, error } = await supabase
        .from("provider_offers")
        .select("*")
        .eq("provider_id", bestSavingsOption.partner.id)
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .order("priority", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        // Check turnover conditions
        const meetsMin = data.min_turnover === null || turnover >= data.min_turnover;
        const meetsMax = data.max_turnover === null || turnover <= data.max_turnover;
        
        if (meetsMin && meetsMax) {
          setActiveOffer(data as ProviderOffer);
        }
      }
    };

    fetchOffer();
  }, [bestSavingsOption, turnover]);

  if (!bestSavingsOption || bestSavingsOption.monthlySavings <= 0) {
    return null;
  }

  const { partner, monthlySavings } = bestSavingsOption;
  const annualSavings = monthlySavings * 12;

  return (
    <Card className="glass border-2 border-primary/30 rounded-xl md:rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-fade-in overflow-hidden relative">
      {/* Active Offer Badge */}
      {activeOffer && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-md animate-pulse"></div>
            <Badge className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-2 border-white shadow-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
              <Gift className="w-3.5 h-3.5 mr-1.5 animate-bounce" />
              {activeOffer.badge_text}
            </Badge>
          </div>
        </div>
      )}

      <CardContent className="p-4 md:p-8">
        <div className="flex items-start gap-3 md:gap-6">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <h3 className="text-base md:text-xl font-bold text-foreground">💡 Best Deal for You</h3>
              <div className="px-2 py-1 md:px-3 md:py-1.5 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-full border border-primary/30 self-start">
                <span className="text-xs font-semibold text-primary">Smart Match</span>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-foreground mb-1.5 md:mb-2">
              Switch to <span className="font-bold text-primary text-base md:text-lg">{partner.name}</span> and save{" "}
              <span className="font-bold text-green-500 text-base md:text-lg">£{monthlySavings.toFixed(2)}/mo</span>
            </p>
            
            <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
              {(partner.benefits || partner.features || []).slice(0, 2).join(" • ")}
            </p>

            {/* Special Offer Display */}
            {activeOffer && (
              <div className="mb-4 md:mb-6 p-3 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-lg border-2 border-amber-400/50">
                <div className="flex items-start gap-2">
                  <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-100 uppercase mb-1">
                      {activeOffer.title}
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      {activeOffer.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => {
                onSuggestionSelect(partner.id);
                setTimeout(() => {
                  const compareSection = document.querySelector('[data-compare-section]');
                  if (compareSection) {
                    compareSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 text-sm md:text-base px-4 py-3 md:px-6"
            >
              Compare Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};