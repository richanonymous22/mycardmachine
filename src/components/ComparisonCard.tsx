import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Partner } from "@/types/merchant";
import { getCalculatedRates } from "@/utils/calculations";
import { Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProviderOffer {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  badge_text: string;
}

interface ComparisonCardProps {
  title: string;
  selectedPartner: Partner | null;
  onPartnerChange: (partnerId: string) => void;
  turnover?: number;
  onTurnoverChange?: (value: number) => void;
  showTurnoverInput?: boolean;
  calculationResult?: {
    transactionCosts: number;
    monthlyFees: number;
    totalMonthlyCost: number;
    annualCost: number;
  };
  variant?: "current" | "new";
  providers?: Partner[];
}

export const ComparisonCard = ({
  title,
  selectedPartner,
  onPartnerChange,
  turnover,
  onTurnoverChange,
  showTurnoverInput = false,
  calculationResult,
  variant = "current",
  providers = []
}: ComparisonCardProps) => {
  const isPrimary = variant === "new";
  const [activeOffer, setActiveOffer] = useState<ProviderOffer | null>(null);
  
  // Calculate real-time rates based on turnover
  const calculatedRates = selectedPartner && turnover && turnover > 0 
    ? getCalculatedRates(selectedPartner, turnover)
    : null;

  // Fetch active offer for the selected provider
  useEffect(() => {
    if (!selectedPartner || !turnover) {
      setActiveOffer(null);
      return;
    }

    const fetchOffer = async () => {
      const { data, error } = await supabase
        .from("provider_offers")
        .select("*")
        .eq("provider_id", selectedPartner.id)
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .order("priority", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const meetsMin = data.min_turnover === null || turnover >= data.min_turnover;
        const meetsMax = data.max_turnover === null || turnover <= data.max_turnover;
        
        if (meetsMin && meetsMax) {
          setActiveOffer(data as ProviderOffer);
        }
      }
    };

    fetchOffer();
  }, [selectedPartner, turnover]);
  
  return (
      <Card className="glass shadow-xl border border-card-border relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
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
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPrimary ? 'bg-gradient-to-br from-primary/5 to-transparent' : 'bg-gradient-to-br from-accent/5 to-transparent'
        }`}></div>
      
      <CardHeader className="relative pb-4 md:pb-6">
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2 md:p-3 rounded-xl ${isPrimary ? 'bg-primary-muted' : 'bg-accent-muted'}`}>
              <div className={`w-4 h-4 md:w-6 md:h-6 rounded ${isPrimary ? 'bg-primary' : 'bg-accent'}`}></div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold tracking-tight">{title}</h3>
              {selectedPartner && (
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">{selectedPartner.name}</p>
              )}
            </div>
          </div>
          {selectedPartner && (
            <Badge 
              className="px-3 py-1.5 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] border-2 border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.4)] font-semibold text-xs text-white self-start md:self-auto"
            >
              ✓ Selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-5 md:space-y-8">
        {/* Partner Selection */}
        <div className="space-y-3 md:space-y-4">
          <Label htmlFor={`partner-${variant}`} className="text-xs md:text-sm font-semibold text-foreground">
            Payment Partner
          </Label>
          <Select onValueChange={onPartnerChange} value={selectedPartner?.id}>
            <SelectTrigger 
              id={`partner-${variant}`} 
              className="h-12 md:h-14 glass border-card-border hover:border-primary/30 transition-all duration-200 focus-ring text-sm md:text-base"
            >
              <SelectValue placeholder="Select a payment partner..." />
            </SelectTrigger>
            <SelectContent className="glass border-card-border shadow-xl max-h-60 bg-card z-50">
              {providers.map((partner) => (
                <SelectItem 
                  key={partner.id} 
                  value={partner.id}
                  className="hover:bg-primary/10 focus:bg-primary/10 transition-colors cursor-pointer py-2 md:py-3"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                      partner.contract_length?.toLowerCase().includes("no contract") || partner.contract_length?.toLowerCase().includes("cancel anytime")
                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                        : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                    }`}></div>
                    <span className="font-medium text-sm md:text-base">{partner.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Turnover Input */}
        {showTurnoverInput && onTurnoverChange && (
          <div className="space-y-3 md:space-y-4">
            <Label htmlFor="turnover" className="text-xs md:text-sm font-semibold text-foreground">
              Monthly Turnover (£)
            </Label>
            <div className="relative">
              <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm md:text-base">£</span>
              <Input
                id="turnover"
                type="text"
                placeholder="e.g., 25000 or 25k"
                value={turnover && turnover > 0 ? turnover : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[£,\s]/g, '');
                  const numericValue = rawValue ? Number(rawValue) : 0;
                  onTurnoverChange(numericValue);
                }}
                className="h-12 md:h-14 pl-7 md:pl-8 glass border-card-border hover:border-primary/30 transition-all duration-200 focus-ring text-base md:text-lg font-medium"
              />
            </div>
          </div>
        )}

        {selectedPartner && turnover && turnover > 0 && (
          <div className="space-y-5 md:space-y-8">
            {/* Pricing Grid */}
            <div className="glass p-4 md:p-6 rounded-xl border border-card-border">
              <div className="flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary"></div>
                <h4 className="font-bold text-foreground uppercase tracking-wide text-xs">Pricing Structure</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-3 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  {calculatedRates?.blendedRate !== undefined ? (
                    <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                      <span className="text-muted-foreground font-medium text-xs md:text-sm">
                        {selectedPartner.turnover_tiers ? 'Transaction Fee (Tier-based)' : 'Blended Transaction Fee'}
                      </span>
                      <span className="font-bold text-base md:text-lg text-foreground">
                        {(calculatedRates.blendedRate * 100).toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                        <span className="text-muted-foreground font-medium text-xs md:text-sm">Debit Rate</span>
                        <span className="font-bold text-base md:text-lg text-foreground">
                          {calculatedRates?.debitRate 
                            ? `${(calculatedRates.debitRate * 100).toFixed(2)}%`
                            : selectedPartner.fees.transaction_fee 
                            ? `${(selectedPartner.fees.transaction_fee * 100).toFixed(2)}%`
                            : selectedPartner.transactionFeeDebit 
                            ? `${selectedPartner.transactionFeeDebit}%` 
                            : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                        <span className="text-muted-foreground font-medium text-xs md:text-sm">Credit Rate</span>
                        <span className="font-bold text-base md:text-lg text-foreground">
                          {calculatedRates?.creditRate 
                            ? `${(calculatedRates.creditRate * 100).toFixed(2)}%`
                            : selectedPartner.fees.transaction_fee 
                            ? `${(selectedPartner.fees.transaction_fee * 100).toFixed(2)}%`
                            : selectedPartner.transactionFeeCredit 
                            ? `${selectedPartner.transactionFeeCredit}%` 
                            : 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {selectedPartner.fees.tap_fee && (
                    <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                      <span className="text-muted-foreground font-medium text-xs md:text-sm">Tap/Auth Fee</span>
                      <span className="font-bold text-base md:text-lg text-foreground">
                        {Array.isArray(selectedPartner.fees.tap_fee) 
                          ? `${(selectedPartner.fees.tap_fee[0] * 100).toFixed(0)}-${(selectedPartner.fees.tap_fee[selectedPartner.fees.tap_fee.length - 1] * 100).toFixed(0)}p`
                          : selectedPartner.fees.tap_fee > 0 ? `${(selectedPartner.fees.tap_fee * 100).toFixed(0)}p` : null}
                      </span>
                    </div>
                  )}
                  
                  {selectedPartner.fees.monthly_rental && selectedPartner.fees.monthly_rental > 0 && (
                    <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                      <span className="text-muted-foreground font-medium text-xs md:text-sm">Monthly Rental</span>
                      <span className="font-bold text-base md:text-lg text-foreground">£{selectedPartner.fees.monthly_rental}</span>
                    </div>
                  )}
                  
                  {selectedPartner.fees.dashboard_fee && selectedPartner.fees.dashboard_fee > 0 && (
                    <div className="flex items-center justify-between py-2 md:py-3 border-b border-card-border">
                      <span className="text-muted-foreground font-medium text-xs md:text-sm">Dashboard Fee</span>
                      <span className="font-bold text-base md:text-lg text-foreground">£{selectedPartner.fees.dashboard_fee}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            {calculationResult && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-4 md:p-6 shadow-glow">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="p-1.5 md:p-2 rounded-lg bg-white/20">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-white/80"></div>
                    </div>
                    <h4 className="font-bold text-white text-base md:text-lg">Cost Analysis</h4>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center py-2 md:py-3 border-b border-white/20">
                      <span className="text-white/80 font-medium text-xs md:text-sm">Transaction Costs</span>
                      <span className="font-bold text-white text-base md:text-lg">£{calculationResult.transactionCosts.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 md:py-3 border-b border-white/20">
                      <span className="text-white/80 font-medium text-xs md:text-sm">Monthly Fees</span>
                      <span className="font-bold text-white text-base md:text-lg">£{calculationResult.monthlyFees.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 md:pt-4 border-t-2 border-white/30">
                      <span className="font-bold text-white text-base md:text-xl">Total Monthly</span>
                      <span className="font-black text-white text-xl md:text-2xl">£{calculationResult.totalMonthlyCost.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 md:p-4 bg-white/10 rounded-lg">
                      <span className="text-white/70 font-medium text-xs md:text-sm">Annual Projection</span>
                      <span className="font-bold text-white text-sm md:text-base">£{calculationResult.annualCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10 md:-translate-y-16 md:translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8 md:translate-y-12 md:-translate-x-12"></div>
              </div>
            )}

            {/* Special Offer Display */}
            {activeOffer && (
              <div className="relative mb-6 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-xl p-4 border-2 border-amber-400/50 shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 via-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="relative flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg">
                      <Gift className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100 uppercase tracking-wide mb-1">
                        {activeOffer.title}
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                        {activeOffer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent"></div>
                <h4 className="font-bold text-foreground uppercase tracking-wide text-xs">Key Benefits</h4>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {(selectedPartner.benefits || selectedPartner.features || []).slice(0, 4).map((benefit, index) => (
                  <Badge 
                    key={index} 
                    className="px-2.5 py-1 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] border-2 border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] font-semibold text-[10px] md:text-xs text-white"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contract Terms */}
            {selectedPartner.contract_length && (
              <div className="glass p-3 md:p-4 rounded-lg border border-card-border">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground font-medium text-xs md:text-sm">Contract Terms</span>
                  <Badge 
                    variant={selectedPartner.contract_length === "No contract" ? "default" : "secondary"} 
                    className={`font-semibold text-xs ${
                      selectedPartner.contract_length === "No contract" 
                        ? "bg-accent text-accent-foreground" 
                        : ""
                    }`}
                  >
                    {selectedPartner.contract_length}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};