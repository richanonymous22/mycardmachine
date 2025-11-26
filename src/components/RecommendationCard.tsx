import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Partner, CalculationResult } from "@/types/merchant";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCalculatedRates } from "@/utils/calculations";
import { Crown, TrendingUp, Calendar, Clock, AlertCircle, CheckCircle, Loader2, Zap, Phone, Gift, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface ProviderOffer {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  badge_text: string;
}

interface RecommendationCardProps {
  partner: Partner;
  costs: CalculationResult;
  monthlyTurnover: number;
  rank: number;
}

export const RecommendationCard = ({ 
  partner, 
  costs, 
  monthlyTurnover, 
  rank 
}: RecommendationCardProps) => {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [activeOffer, setActiveOffer] = useState<ProviderOffer | null>(null);
  const calculatedRates = getCalculatedRates(partner, monthlyTurnover);
  const isTopChoice = rank === 1;

  // Fetch active offers for this provider
  useEffect(() => {
    const fetchOffers = async () => {
      const { data, error } = await supabase
        .from("provider_offers")
        .select("*")
        .eq("provider_id", partner.id)
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .order("priority", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        // Check turnover conditions
        const meetsMin = data.min_turnover === null || monthlyTurnover >= data.min_turnover;
        const meetsMax = data.max_turnover === null || monthlyTurnover <= data.max_turnover;
        
        if (meetsMin && meetsMax) {
          setActiveOffer(data as ProviderOffer);
        }
      }
    };

    fetchOffers();
  }, [partner.id, monthlyTurnover]);

  useEffect(() => {
    const generateSummary = () => {
      setLoadingSummary(true);
      try {
        // Generate a concise, professional summary highlighting key benefits
        const benefits = partner.benefits || partner.features || [];
        const topBenefits = benefits.slice(0, 3);
        
        let summary = `${partner.name} offers `;
        
        if (topBenefits.length > 0) {
          summary += topBenefits.slice(0, 2).join(", ");
          if (topBenefits.length > 2) {
            summary += `, and ${topBenefits[2]}`;
          }
          summary += ". ";
        }
        
        // Add contract benefit if applicable
        if (partner.contract_length === "No contract – cancel anytime") {
          summary += "With no long-term commitment, you have the flexibility to switch if your needs change. ";
        }
        
        // Add settlement benefit if applicable
        if (partner.settlement_time?.includes("Same day") || partner.settlement_time?.includes("Next working day")) {
          summary += `Funds are settled ${partner.settlement_time.toLowerCase()}, ensuring healthy cash flow.`;
        } else {
          summary += "Reliable payment processing to keep your business running smoothly.";
        }
        
        setAiSummary(summary);
      } catch (error) {
        console.error("Error generating summary:", error);
        setAiSummary(`${partner.name} provides competitive rates and professional payment processing solutions tailored to your business needs.`);
      } finally {
        setLoadingSummary(false);
      }
    };

    generateSummary();
  }, [partner.name, partner.contract_length, partner.settlement_time]);

  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;
  const formatPercentage = (rate: number) => `${(rate * 100).toFixed(2)}%`;

  return (
    <Card className={`p-6 relative transition-all hover:shadow-xl ${
      isTopChoice ? 'border-2 border-primary shadow-lg' : ''
    }`}>
      {/* Rank Badge */}
      <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
        rank === 1 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' 
          : rank === 2 
            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
            : rank === 3
              ? 'bg-gradient-to-br from-red-400 to-red-600 text-white'
              : 'bg-muted text-muted-foreground'
      }`}>
        {rank === 1 ? <Crown className="w-6 h-6" /> : `#${rank}`}
      </div>

      {isTopChoice && (
        <Badge className="absolute -top-3 right-4 bg-primary">
          Best Value
        </Badge>
      )}

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

      {/* Header */}
      <div className="mt-2 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{partner.name}</h3>
            {partner.machine_models && partner.machine_models.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {partner.machine_models.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Key Info Pills */}
        <div className="flex flex-wrap gap-2">
          {partner.contract_length && (
            <Badge className="gap-1.5 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground border-0 shadow-md hover:shadow-lg transition-shadow px-3 py-1">
              <Calendar className="w-3.5 h-3.5" />
              {partner.contract_length}
            </Badge>
          )}
          {partner.settlement_time && (
            <Badge className="gap-1.5 bg-gradient-to-r from-accent/90 to-accent text-accent-foreground border-0 shadow-md hover:shadow-lg transition-shadow px-3 py-1">
              <Clock className="w-3.5 h-3.5" />
              {partner.settlement_time}
            </Badge>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Cost Summary - Prominent */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 mb-6 border border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Cost</p>
            <p className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(costs.totalMonthlyCost)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Annual Cost</p>
            <p className="text-2xl md:text-3xl font-semibold text-foreground">{formatCurrency(costs.annualCost)}</p>
          </div>
        </div>
        
        {/* Processing Rate */}
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Processing Rate:</span>
          {calculatedRates.blendedRate && (
            <span className="font-semibold text-foreground">{formatPercentage(calculatedRates.blendedRate)}</span>
          )}
          {calculatedRates.debitRate && calculatedRates.creditRate && (
            <span className="font-semibold text-foreground">
              {formatPercentage(calculatedRates.debitRate)} (debit) / {formatPercentage(calculatedRates.creditRate)} (credit)
            </span>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">Cost Breakdown</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction Costs</span>
            <span className="font-medium text-foreground">{formatCurrency(costs.transactionCosts)}</span>
          </div>
          
          {costs.monthlyFees > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Fees</span>
              <span className="font-medium text-foreground">{formatCurrency(costs.monthlyFees)}</span>
            </div>
          )}
          
          {partner.fees.monthly_rental && partner.fees.monthly_rental > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground pl-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Rental
              </span>
              <span>{formatCurrency(partner.fees.monthly_rental)}</span>
            </div>
          )}
          
          {partner.fees.maintenance_fee && partner.fees.maintenance_fee > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground pl-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Maintenance
              </span>
              <span>{formatCurrency(partner.fees.maintenance_fee)}</span>
            </div>
          )}
          
          {partner.fees.dashboard_fee && partner.fees.dashboard_fee > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground pl-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Dashboard
              </span>
              <span>{formatCurrency(partner.fees.dashboard_fee)}</span>
            </div>
          )}

          {partner.fees.setup_fee && partner.fees.setup_fee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Setup Fee (one-time)
              </span>
              <span className="font-medium text-foreground">{formatCurrency(partner.fees.setup_fee)}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Features */}
      {partner.features && partner.features.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-3">Key Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {partner.features.slice(0, 6).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Make The Switch Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-6 shadow-glow mb-6">
        <div className="relative z-10">
          <h4 className="font-bold text-white text-lg mb-3">Why Make The Switch?</h4>
          {loadingSummary ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <p className="text-white/70 font-medium text-sm">Analyzing benefits...</p>
            </div>
          ) : (
            <p className="text-white/90 font-medium text-sm leading-relaxed">
              {aiSummary}
            </p>
          )}
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Special Offer Section */}
      {activeOffer && (
        <div className="relative mb-6 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-xl p-5 border-2 border-amber-400/50 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/30 via-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg">
                <Gift className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-base text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                    {activeOffer.title}
                  </h4>
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                  {activeOffer.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          className="h-12 text-sm md:text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => navigate(`/apply?partner=${partner.id}&turnover=${monthlyTurnover}&cost=${costs.totalMonthlyCost}&savings=${costs.annualCost}`)}
        >
          <Zap className="mr-1.5 md:mr-2 h-4 w-4" />
          Order Now
        </Button>
        <Button 
          className="h-12 text-sm md:text-base font-semibold bg-accent hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => navigate(`/callback?partner=${partner.id}&turnover=${monthlyTurnover}`)}
        >
          <Phone className="mr-1.5 md:mr-2 h-4 w-4" />
          Request Callback
        </Button>
      </div>
    </Card>
  );
};
