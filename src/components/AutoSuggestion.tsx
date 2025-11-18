import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Partner } from "@/types/merchant";
import { partners } from "@/data/partners";
import { calculateMerchantCosts } from "@/utils/calculations";

interface AutoSuggestionProps {
  currentPartner: Partner;
  turnover: number;
  onSuggestionSelect: (partnerId: string) => void;
}

export const AutoSuggestion = ({
  currentPartner,
  turnover,
  onSuggestionSelect
}: AutoSuggestionProps) => {
  const currentCosts = calculateMerchantCosts(currentPartner, turnover);
  
  // Calculate savings for all other partners and find the best one
  const bestSavingsOption = partners
    .filter(partner => partner.id !== currentPartner.id && partner.id !== "custom")
    .map(partner => {
      const costs = calculateMerchantCosts(partner, turnover);
      const monthlySavings = currentCosts.totalMonthlyCost - costs.totalMonthlyCost;
      const percentageSavings = (monthlySavings / currentCosts.totalMonthlyCost) * 100;
      return {
        partner,
        monthlySavings,
        percentageSavings,
        costs
      };
    })
    .filter(option => option.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  if (!bestSavingsOption || bestSavingsOption.monthlySavings <= 0) {
    return null;
  }

  const { partner, monthlySavings } = bestSavingsOption;
  const annualSavings = monthlySavings * 12;

  return (
    <Card className="glass border-2 border-primary/30 rounded-xl md:rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-fade-in overflow-hidden">
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