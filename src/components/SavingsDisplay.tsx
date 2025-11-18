import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { Partner } from "@/types/merchant";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface SavingsDisplayProps {
  currentPartner: Partner | null;
  newPartner: Partner | null;
  currentCosts: number;
  newCosts: number;
  turnover: number;
}

export const SavingsDisplay = ({
  currentPartner,
  newPartner,
  currentCosts,
  newCosts,
  turnover
}: SavingsDisplayProps) => {
  const monthlySavings = currentCosts - newCosts;
  const annualSavings = monthlySavings * 12;
  const percentageSavings = currentCosts > 0 ? (monthlySavings / currentCosts) * 100 : 0;
  const isSaving = monthlySavings > 0;
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    const generateSummary = async () => {
      if (!currentPartner || !newPartner) return;
      
      setLoadingSummary(true);
      try {
        // Build key advantages array
        const keyAdvantages: string[] = [];
        if (currentPartner.contract_length?.includes("18") && newPartner.contract_length === "No contract") {
          keyAdvantages.push("No long-term contract commitment");
        }
        if (newPartner.settlement_time?.includes("Same day")) {
          keyAdvantages.push("Same-day settlement");
        }
        if (newPartner.benefits?.includes("Daily payouts") || newPartner.features?.includes("Daily payouts")) {
          keyAdvantages.push("Daily payouts");
        }

        const { data, error } = await supabase.functions.invoke('generate-switch-summary', {
          body: {
            currentProvider: currentPartner.name,
            newProvider: newPartner.name,
            monthlySavings,
            annualSavings,
            isSaving,
            comparison: {
              current: currentPartner,
              newProvider: newPartner
            },
            keyAdvantages
          }
        });

        if (error) throw error;
        // Clean any markdown artifacts
        const cleanSummary = data.summary.replace(/\*\*/g, '').replace(/\*/g, '').trim();
        setAiSummary(cleanSummary);
      } catch (error) {
        console.error("Error generating summary:", error);
        setAiSummary(getBenefitTagline());
      } finally {
        setLoadingSummary(false);
      }
    };

    generateSummary();
  }, [currentPartner?.name, newPartner?.name, monthlySavings, percentageSavings, isSaving]);

  if (!currentPartner || !newPartner || !turnover) {
    return null;
  }

  const getBenefitTagline = () => {
    if (!currentPartner || !newPartner) return "";
    
    // Specific benefit combinations
    if (currentPartner.contract_length?.includes("18") && newPartner.contract_length === "No contract") {
      return "Break free from long contracts - be contractless, be free as a bird!";
    }
    
    // Check transaction fees using new structure
    const currentDebitFee = currentPartner.fees.debit?.avg || currentPartner.fees.transaction_fee || currentPartner.transactionFeeDebit || 0;
    const newDebitFee = newPartner.fees.debit?.avg || newPartner.fees.transaction_fee || newPartner.transactionFeeDebit || 0;
    
    if (currentDebitFee > 1.5 && newDebitFee < 1.0) {
      return "Slash your transaction costs with competitive rates";
    }
    if (newPartner.settlement_time?.includes("Same day")) {
      return "Get your money faster with same-day settlement";
    }
    if (newPartner.benefits?.includes("Daily payouts") || newPartner.features?.includes("Daily payouts")) {
      return "Benefit from daily payouts and improved cash flow";
    }
    
    return `Upgrade to ${newPartner.name}'s superior features`;
  };

  return (
    <Card className="glass shadow-premium border border-card-border relative overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 opacity-10 ${
        isSaving ? 'bg-gradient-to-br from-accent/20 to-accent/5' : 'bg-gradient-to-br from-destructive/20 to-destructive/5'
      }`}></div>
      
      <CardHeader className="relative pb-4 md:pb-8">
        <CardTitle className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-xl bg-primary-muted self-start">
            <ArrowRight className="h-5 w-5 md:h-7 md:w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight">Analysis Results</h2>
            <p className="text-muted-foreground font-medium mt-1 text-xs md:text-base">
              Complete cost comparison and savings breakdown
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-5 md:space-y-10">
        {/* Provider Comparison Header */}
        <div className="glass p-4 md:p-6 rounded-xl border border-card-border">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
              <div className="text-center shrink-0">
                <div className="text-[10px] md:text-xs font-medium text-muted-foreground mb-1">Current</div>
                <Badge className="px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] border border-primary/30 md:border-2 shadow-[0_0_10px_rgba(59,130,246,0.3)] md:shadow-[0_0_15px_rgba(59,130,246,0.3)] font-semibold text-[10px] md:text-xs text-white whitespace-nowrap">
                  {currentPartner.name}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              </div>
              
              <div className="text-center shrink-0">
                <div className="text-[10px] md:text-xs font-medium text-muted-foreground mb-1">Switch to</div>
                <Badge className="px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] border border-primary/30 md:border-2 shadow-[0_0_10px_rgba(59,130,246,0.3)] md:shadow-[0_0_15px_rgba(59,130,246,0.3)] font-semibold text-[10px] md:text-xs text-white whitespace-nowrap">
                  {newPartner.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Savings Display */}
        <div className={`relative p-4 md:p-8 rounded-2xl shadow-xl border-2 overflow-hidden ${
          isSaving 
            ? 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20' 
            : 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20'
        }`}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 opacity-10">
            <div className={`w-full h-full rounded-full ${
              isSaving ? 'bg-accent' : 'bg-destructive'
            } blur-3xl`}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-3 md:gap-6 mb-5 md:mb-8">
              <div className={`p-2 md:p-4 rounded-xl md:rounded-2xl ${
                isSaving ? 'bg-accent/20' : 'bg-destructive/20'
              }`}>
                {isSaving ? (
                  <TrendingDown className="h-6 w-6 md:h-10 md:w-10 text-accent" />
                ) : (
                  <TrendingUp className="h-6 w-6 md:h-10 md:w-10 text-destructive" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg md:text-3xl font-black tracking-tight mb-1 md:mb-2">
                  {isSaving ? 'Potential Monthly Savings' : 'Additional Monthly Costs'}
                </h3>
                <p className="text-sm md:text-lg text-muted-foreground font-medium">
                  {isSaving ? 'Switch and save' : 'This would cost'} {percentageSavings.toFixed(1)}% 
                  {isSaving ? ' on processing' : ' more'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-8">
              <div className={`text-center p-4 md:p-8 rounded-xl md:rounded-2xl border-2 ${
                isSaving 
                  ? 'bg-accent/10 border-accent/20' 
                  : 'bg-destructive/10 border-destructive/20'
              }`}>
                <div className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tight">
                  {Math.abs(monthlySavings) < 0.01 ? '£0' : `£${Math.abs(monthlySavings).toFixed(2)}`}
                </div>
                <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Per Month
                </div>
              </div>
              
              <div className={`text-center p-4 md:p-8 rounded-xl md:rounded-2xl border-2 ${
                isSaving 
                  ? 'bg-accent/10 border-accent/20' 
                  : 'bg-destructive/10 border-destructive/20'
              }`}>
                <div className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tight">
                  {Math.abs(annualSavings) < 0.01 ? '£0' : `£${Math.abs(annualSavings).toFixed(2)}`}
                </div>
                <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Per Year
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Benefits - Only show if saving */}
        {isSaving && (
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-primary p-4 md:p-6 shadow-glow">
            <div className="relative z-10">
              <h4 className="font-bold text-white text-sm md:text-lg mb-2 md:mb-3">Why Make The Switch?</h4>
              {loadingSummary ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-white" />
                  <p className="text-white/70 font-medium text-xs md:text-sm">Analyzing...</p>
                </div>
              ) : (
                <p className="text-white/90 font-medium text-xs md:text-sm leading-relaxed">
                  {aiSummary}
                </p>
              )}
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 md:-translate-y-16 md:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8 md:translate-y-12 md:-translate-x-12"></div>
          </div>
        )}

        {/* Cost Breakdown Summary */}
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          <div className="glass p-4 md:p-6 rounded-xl border border-card-border">
            <div className="text-center">
              <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1.5 md:mb-2">
                Current Cost
              </div>
              <div className="text-xl md:text-3xl font-black text-accent">£{currentCosts.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="glass p-4 md:p-6 rounded-xl border border-card-border">
            <div className="text-center">
              <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1.5 md:mb-2">
                New Cost
              </div>
              <div className="text-xl md:text-3xl font-black text-primary">£{newCosts.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};