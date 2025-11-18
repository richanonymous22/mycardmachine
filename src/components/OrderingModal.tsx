import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Phone, ArrowRight, Zap, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuickApplyForm } from "./QuickApplyForm";
import { CallbackRequestForm } from "./CallbackRequestForm";
import { Partner } from "@/types/merchant";
import { CalculationResult } from "@/types/merchant";

interface OrderingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner;
  costs: CalculationResult;
  monthlyTurnover: number;
  initialStep?: OrderingStep;
}

type OrderingStep = "selection" | "quick-apply" | "callback";

export const OrderingModal = ({ open, onOpenChange, partner, costs, monthlyTurnover, initialStep = "selection" }: OrderingModalProps) => {
  const [step, setStep] = useState<OrderingStep>(initialStep);
  const navigate = useNavigate();

  // Update step when initialStep changes or modal opens
  useEffect(() => {
    if (open) {
      setStep(initialStep);
    }
  }, [open, initialStep]);

  const handleClose = () => {
    setStep("selection");
    onOpenChange(false);
  };

  const handleQuickApplySuccess = () => {
    setStep("selection");
    onOpenChange(false);
    navigate('/thank-you?type=application');
  };

  const handleCallbackSuccess = () => {
    setStep("selection");
    onOpenChange(false);
    navigate('/thank-you?type=callback');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {step === "selection" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Get Started with {partner.name}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Choose how you'd like to proceed with your application
              </DialogDescription>
            </DialogHeader>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* Quick Apply Option */}
              <Card 
                className="p-4 sm:p-6 cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all group"
                onClick={() => setStep("quick-apply")}
              >
                <div className="flex flex-col h-full">
                  <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 mb-3 sm:mb-4 w-fit group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                    Quick Apply
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">
                    Complete your application now and upload required documents. Get started immediately.
                  </p>
                  
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span>Upload documents instantly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span>Fastest processing time</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 sm:mt-6 group-hover:shadow-lg transition-shadow text-sm sm:text-base">
                    Start Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Callback Request Option */}
              <Card 
                className="p-4 sm:p-6 cursor-pointer hover:shadow-xl hover:border-accent/50 transition-all group"
                onClick={() => setStep("callback")}
              >
                <div className="flex flex-col h-full">
                  <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg shadow-accent/20 mb-3 sm:mb-4 w-fit group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                    Request Callback
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">
                    Get personalized guidance from our experts. We'll call you to discuss the best options.
                  </p>
                  
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                      <span>Expert guidance & support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                      <span>Personalized recommendations</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full mt-4 sm:mt-6 group-hover:shadow-lg transition-shadow text-sm sm:text-base">
                    Request Callback
                    <Phone className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}

        {step === "quick-apply" && (
          <QuickApplyForm
            partner={partner}
            costs={costs}
            monthlyTurnover={monthlyTurnover}
            onBack={() => setStep("selection")}
            onSuccess={handleQuickApplySuccess}
          />
        )}

        {step === "callback" && (
          <CallbackRequestForm
            partner={partner}
            monthlyTurnover={monthlyTurnover}
            onBack={() => setStep("selection")}
            onSuccess={handleCallbackSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
