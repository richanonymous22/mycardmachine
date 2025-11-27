import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { Partner, CalculationResult } from "@/types/merchant";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload } from "./DocumentUpload";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
});

interface QuickApplyFormProps {
  partner: Partner;
  costs: CalculationResult;
  monthlyTurnover: number;
  onBack: () => void;
  onSuccess: () => void;
}

type FormStep = 1 | 2 | 3;

export const QuickApplyForm = ({ partner, costs, monthlyTurnover, onBack, onSuccess }: QuickApplyFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const progress = (currentStep / 3) * 100;

  const onSubmitPersonalInfo = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-application", {
        body: {
          partner_id: partner.id,
          partner_name: partner.name,
          name: values.name,
          email: values.email,
          phone: values.phone,
          monthly_turnover: monthlyTurnover,
          estimated_monthly_cost: costs.totalMonthlyCost,
          estimated_annual_savings: costs.annualCost,
        },
      });

      if (error) throw error;
      if (!data || typeof data.id !== "string") {
        throw new Error("Invalid response from application service");
      }

      setApplicationId(data.id);
      setCurrentStep(2);
      
      toast({
        title: "Information saved",
        description: "Now upload your required documents",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentsComplete = async () => {
    if (!applicationId) return;
    
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: "pending" })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      // Get uploaded documents
      const { data: documents } = await supabase
        .from("application_documents")
        .select("*")
        .eq("application_id", applicationId);

      // Get full application data
      const { data: applicationData } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      // Send Telegram notification with complete data and documents
      try {
        await supabase.functions.invoke('telegram-notify', {
          body: { 
            type: 'application', 
            data: applicationData,
            documents: documents || []
          }
        });
      } catch (notifyError) {
        console.error('Telegram notify error:', notifyError);
      }

      setCurrentStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredDocuments = partner.documents_required 
    ? Object.entries(partner.documents_required)
        .filter(([_, required]) => required)
        .map(([key]) => key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
    : ["Proof of ID", "Proof of Business", "Proof of Bank"];

  return (
    <>
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={currentStep === 1 ? onBack : () => setCurrentStep(prev => (prev - 1) as FormStep)}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl truncate">
              Apply to {partner.name}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Step {currentStep} of 3
            </DialogDescription>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </DialogHeader>

      <div className="mt-4 sm:mt-6">
        {currentStep === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPersonalInfo)} className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Step 1 of 3</FormDescription>
              <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Step 3 of 3</FormDescription>
              <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+44 7123 456789" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Step 2 of 3</FormDescription>
              <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Continue to Documents"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        )}

        {currentStep === 2 && applicationId && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-semibold mb-2 flex items-center gap-2">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Required Documents
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Please upload all required documents to continue
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                {requiredDocuments.map((doc) => (
                  <li key={doc}>• {doc}</li>
                ))}
              </ul>
            </div>

            <DocumentUpload 
              applicationId={applicationId} 
              requiredDocuments={requiredDocuments}
              onUploadComplete={setAllDocumentsUploaded}
            />

            <Button 
              onClick={handleDocumentsComplete} 
              className="w-full" 
              disabled={isSubmitting || !allDocumentsUploaded}
            >
              {isSubmitting ? "Processing..." : !allDocumentsUploaded ? "Upload All Documents First" : "Complete Application"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {!allDocumentsUploaded && (
              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                Please upload all {requiredDocuments.length} required documents to proceed
              </p>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-4 sm:py-8 space-y-4 sm:space-y-6">
            <div className="inline-flex p-4 sm:p-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 shadow-lg">
              <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold">Application Submitted!</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
                Thank you for applying to {partner.name}. We've received your application and documents. 
                You'll receive a confirmation email shortly.
              </p>
            </div>

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg max-w-md mx-auto">
              <p className="text-xs sm:text-sm font-semibold mb-2">What happens next?</p>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 text-left">
                <li>• You'll receive a confirmation email within 24 hours</li>
                <li>• Our team will review your application</li>
                <li>• We'll contact you with the next steps</li>
              </ul>
            </div>

            <Button onClick={onSuccess} className="w-full max-w-xs">
              Done
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
