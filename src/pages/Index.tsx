import { useState } from "react";
import { ComparisonCard } from "@/components/ComparisonCard";
import { SavingsDisplay } from "@/components/SavingsDisplay";
import { AutoSuggestion } from "@/components/AutoSuggestion";
import { Hero } from "@/components/Hero";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

import { CustomProviderForm, CustomProviderData } from "@/components/CustomProviderForm";
import { GetStartedCard } from "@/components/GetStartedCard";
import { partners } from "@/data/partners";
import { calculateMerchantCosts } from "@/utils/calculations";
import { Partner } from "@/types/merchant";
import { TrendingDown, TrendingUp } from "lucide-react";

const Index = () => {
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [newPartner, setNewPartner] = useState<Partner | null>(null);
  const [turnover, setTurnover] = useState<number>(0);
  const [customProviderData, setCustomProviderData] = useState<CustomProviderData | null>(null);

  const handleTurnoverChange = (value: number) => {
    // Store the raw value - sanitization happens in calculations
    setTurnover(value);
    
    // Scroll to best deal section on mobile when turnover is entered
    if (value > 0 && currentPartner && window.innerWidth < 768) {
      setTimeout(() => {
        const bestDealSection = document.querySelector('.best-deal-section');
        if (bestDealSection) {
          bestDealSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleCurrentPartnerChange = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId) || null;
    setCurrentPartner(partner);
    if (partner?.id !== "custom") {
      setCustomProviderData(null);
    }
  };

  const handleNewPartnerChange = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId) || null;
    setNewPartner(partner);
  };

  const handleCustomProviderUpdate = (data: CustomProviderData) => {
    setCustomProviderData(data);
    setTurnover(data.turnover);
    
    // Update current partner with custom data
    if (currentPartner?.id === "custom") {
      const customPartner: Partner = {
        ...currentPartner,
        name: data.name || "Custom Provider",
        fees: {
          ...currentPartner.fees,
          ...(data.isBlended 
            ? { blended_rate: { min: data.debitRate / 100, max: data.debitRate / 100, avg: data.debitRate / 100 } }
            : {
                debit: { min: data.debitRate / 100, max: data.debitRate / 100, avg: data.debitRate / 100 },
                credit: { min: data.creditRate / 100, max: data.creditRate / 100, avg: data.creditRate / 100 }
              }
          ),
          tap_fee: data.tapAuthFee / 100,
        }
      };
      setCurrentPartner(customPartner);
    }
  };

  // Calculate costs for custom provider
  const getCustomProviderCosts = () => {
    if (!customProviderData || customProviderData.turnover === 0) return null;
    
    const customPartner: Partner = {
      id: "custom",
      name: customProviderData.name || "Custom Provider",
      fees: customProviderData.isBlended 
        ? { 
            blended_rate: { min: customProviderData.debitRate / 100, max: customProviderData.debitRate / 100, avg: customProviderData.debitRate / 100 },
            tap_fee: customProviderData.tapAuthFee / 100
          }
        : {
            debit: { min: customProviderData.debitRate / 100, max: customProviderData.debitRate / 100, avg: customProviderData.debitRate / 100 },
            credit: { min: customProviderData.creditRate / 100, max: customProviderData.creditRate / 100, avg: customProviderData.creditRate / 100 },
            tap_fee: customProviderData.tapAuthFee / 100
          },
      benefits: ["Custom rates"],
    };
    
    return calculateMerchantCosts(customPartner, customProviderData.turnover);
  };

  const currentCalculation = currentPartner?.id === "custom"
    ? getCustomProviderCosts()
    : currentPartner && turnover > 0
    ? calculateMerchantCosts(currentPartner, turnover)
    : null;

  const newCalculation = newPartner && turnover > 0
    ? calculateMerchantCosts(newPartner, turnover)
    : null;

  const monthlySavings = currentCalculation && newCalculation
    ? currentCalculation.totalMonthlyCost - newCalculation.totalMonthlyCost
    : 0;

  const percentageSavings = currentCalculation && monthlySavings !== 0
    ? (monthlySavings / currentCalculation.totalMonthlyCost) * 100
    : 0;

  const isSaving = monthlySavings > 0;

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Main Calculator Section */}
      <div id="calculator" className="container mx-auto px-4 md:px-6 py-8 md:py-16 scroll-smooth">
        {currentPartner && turnover > 0 && (
          <div className="mb-6 md:mb-12 best-deal-section animate-fade-in">
            <AutoSuggestion 
              currentPartner={currentPartner} 
              turnover={turnover}
              onSuggestionSelect={handleNewPartnerChange}
            />
          </div>
        )}

        {/* Comparison Grid */}
        <div className="relative">
          {/* Glowing Divider Line - Desktop Only */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent z-10 hidden lg:block animate-pulse"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-2 border-primary/40 z-20 hidden lg:flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
            {/* Current Provider */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"></div>
              <ComparisonCard
                title="Your Current Provider"
                selectedPartner={currentPartner}
                onPartnerChange={handleCurrentPartnerChange}
                turnover={currentPartner?.id === "custom" ? customProviderData?.turnover || 0 : turnover}
                onTurnoverChange={handleTurnoverChange}
                showTurnoverInput={currentPartner?.id !== "custom"}
                calculationResult={currentCalculation || undefined}
                variant="current"
              />
              {currentPartner?.id === "custom" && (
                <CustomProviderForm onUpdate={handleCustomProviderUpdate} />
              )}
            </div>

            {/* New Provider - Always show both cards */}
            <div className="relative group" data-compare-section>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"></div>
              <ComparisonCard
                title="Compare With"
                selectedPartner={newPartner}
                onPartnerChange={handleNewPartnerChange}
                turnover={turnover}
                calculationResult={newCalculation || undefined}
                variant="new"
              />
            </div>
          </div>

          {/* Center Savings Indicator - Desktop Only */}
          {currentPartner && newPartner && turnover > 0 && currentCalculation && newCalculation && (
            <div className="hidden lg:flex absolute left-1/2 bottom-8 -translate-x-1/2 z-30">
              <div className={`glass border-2 px-6 py-4 rounded-2xl shadow-lg ${
                isSaving 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-red-500/50 bg-red-500/10'
              }`}>
                <div className="flex items-center gap-3">
                  {isSaving ? (
                    <TrendingDown className="w-6 h-6 text-green-500" />
                  ) : (
                    <TrendingUp className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${isSaving ? 'text-green-500' : 'text-red-500'}`}>
                      {isSaving ? 'Save up to' : 'Extra cost'}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      £{Math.abs(monthlySavings).toFixed(2)}/mo ({Math.abs(percentageSavings).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Savings Display - Shows on both mobile and desktop */}
        {currentPartner && newPartner && turnover > 0 && currentCalculation && newCalculation && (
          <div className="mt-8 md:mt-16 max-w-4xl mx-auto space-y-8">
            <SavingsDisplay
              currentPartner={currentPartner}
              newPartner={newPartner}
              currentCosts={currentCalculation.totalMonthlyCost}
              newCosts={newCalculation.totalMonthlyCost}
              turnover={turnover}
            />
            
            {/* Get Started Section */}
            {monthlySavings > 0 && (
              <GetStartedCard
                partner={newPartner}
                costs={newCalculation}
                monthlyTurnover={turnover}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-8 md:mt-10">
        <CTASection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
