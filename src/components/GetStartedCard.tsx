import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Partner, CalculationResult } from "@/types/merchant";
import { FileText, Phone, ArrowRight, Zap, Users } from "lucide-react";

interface GetStartedCardProps {
  partner: Partner;
  costs: CalculationResult;
  monthlyTurnover: number;
}

export const GetStartedCard = ({ partner, costs, monthlyTurnover }: GetStartedCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="glass shadow-premium border border-card-border p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          Get Started with {partner.name}
        </h3>
        <p className="text-muted-foreground">
          Choose how you'd like to proceed with your application
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Quick Apply Option */}
        <Card 
          className="p-4 md:p-6 cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all group"
          onClick={() => navigate(`/apply?partner=${partner.id}&turnover=${monthlyTurnover}&cost=${costs.totalMonthlyCost}&savings=${costs.annualCost}`)}
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex p-3 md:p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform shrink-0">
              <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                Quick Apply
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <p className="text-sm md:text-base text-muted-foreground mb-3">
                Complete your application now and upload required documents.
              </p>
              
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  <span>Upload instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  <span>Fastest processing</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Callback Request Option */}
        <Card 
          className="p-4 md:p-6 cursor-pointer hover:shadow-xl hover:border-accent/50 transition-all group"
          onClick={() => navigate(`/callback?partner=${partner.id}&turnover=${monthlyTurnover}`)}
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex p-3 md:p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform shrink-0">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-accent" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                Request Callback
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <p className="text-sm md:text-base text-muted-foreground mb-3">
                Get personalized guidance from our experts.
              </p>
              
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  <span>Expert guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  <span>Personalized help</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
