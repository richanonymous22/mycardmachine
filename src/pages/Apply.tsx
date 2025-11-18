import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload } from "@/components/DocumentUpload";
import { partners } from "@/data/partners";
import { Footer } from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
});

type FormStep = 1 | 2;

const Apply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const partnerId = searchParams.get("partner");
  const monthlyTurnover = parseFloat(searchParams.get("turnover") || "0");
  const estimatedSavings = parseFloat(searchParams.get("savings") || "0");
  const estimatedCost = parseFloat(searchParams.get("cost") || "0");
  
  const partner = partners.find(p => p.id === partnerId);
  
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);

  useEffect(() => {
    if (!partner || monthlyTurnover === 0) {
      navigate("/");
    }
  }, [partner, monthlyTurnover, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const progress = (currentStep / 2) * 100;

  const onSubmitPersonalInfo = async (values: z.infer<typeof formSchema>) => {
    if (!partner) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          partner_id: partner.id,
          partner_name: partner.name,
          name: values.name,
          email: values.email,
          phone: values.phone,
          monthly_turnover: monthlyTurnover,
          estimated_monthly_cost: estimatedCost,
          estimated_annual_savings: estimatedSavings,
        })
        .select()
        .single();

      if (error) throw error;

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

      // Send confirmation email to user
      if (applicationData?.email) {
        try {
          await supabase.functions.invoke('send-confirmation-email', {
            body: {
              to: applicationData.email,
              name: applicationData.name,
              type: 'application',
              partnerName: applicationData.partner_name
            }
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }
      }

      // Navigate to thank you page
      navigate('/thank-you?type=application');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredDocuments = partner?.documents_required 
    ? Object.entries(partner.documents_required)
        .filter(([_, required]) => required)
        .map(([key]) => key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
    : ["Proof of ID", "Proof of Business", "Proof of Bank"];

  if (!partner) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50">
          {/* Header */}
          <div className="mb-8 text-center px-6 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Apply to {partner.name}
            </h1>
            <p className="text-muted-foreground mb-4">
              Step {currentStep} of 2
            </p>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="px-6 pb-8 md:px-8">
              <h2 className="text-xl font-semibold mb-6">Your Information</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitPersonalInfo)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
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
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && applicationId && (
            <div className="px-6 pb-8 md:px-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
                <p className="text-sm text-muted-foreground">
                  Please upload all required documents to complete your application
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Required Documents
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
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
                <p className="text-sm text-center text-muted-foreground">
                  Please upload all {requiredDocuments.length} required documents to proceed
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;
