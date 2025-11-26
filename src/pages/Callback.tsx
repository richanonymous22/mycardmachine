import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Phone, PhoneCall, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProviders } from "@/hooks/useProviders";
import { Footer } from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  email: z.string().email("Invalid email address").max(255).optional().or(z.literal("")),
  preferred_time: z.string().optional()
});

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const partnerId = searchParams.get("partner");
  const monthlyTurnover = parseFloat(searchParams.get("turnover") || "0");
  
  // Fetch providers from database
  const { data: providers, isLoading: loadingProviders } = useProviders();
  const partner = providers?.find(p => p.id === partnerId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loadingProviders && (!partner || monthlyTurnover === 0)) {
      navigate("/");
    }
  }, [partner, monthlyTurnover, navigate, loadingProviders]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferred_time: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!partner) return;
    
    setIsSubmitting(true);
    try {
      const { error, data } = await supabase
        .from("callback_requests")
        .insert({
          partner_id: partner.id,
          partner_name: partner.name,
          name: values.name,
          phone: values.phone,
          email: values.email || null,
          preferred_time: values.preferred_time || null,
          monthly_turnover: monthlyTurnover,
          business_name: null,
          source: 'callback_form'
        })
        .select()
        .single();

      if (error) throw error;

      // Get the created callback data with ID
      const { data: callbackData } = await supabase
        .from("callback_requests")
        .select("*")
        .eq("phone", values.phone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Send Telegram notification
      try {
        await supabase.functions.invoke('telegram-notify', {
          body: {
            type: 'callback',
            data: callbackData || {
              id: '',
              partner_id: partner.id,
              partner_name: partner.name,
              name: values.name,
              phone: values.phone,
              email: values.email || null,
              preferred_time: values.preferred_time || null,
              monthly_turnover: monthlyTurnover,
              status: 'pending',
              created_at: new Date().toISOString()
            }
          }
        });
      } catch (notifyError) {
        console.error('Failed to send Telegram notification:', notifyError);
      }

      // Send confirmation email to user if email provided
      if (values.email) {
        try {
          await supabase.functions.invoke('send-confirmation-email', {
            body: {
              to: values.email,
              name: values.name,
              type: 'callback',
              partnerName: partner.name
            }
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }
      }

      toast({
        title: "Request submitted",
        description: "We'll call you back soon!"
      });

      // Navigate to thank you page
      navigate('/thank-you?type=callback');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit callback request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Request a Callback
            </h1>
            <p className="text-muted-foreground">
              We'll call you to discuss {partner.name}
            </p>
          </div>

          {/* Direct Call Option */}
          <div className="mx-6 mb-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex p-3 rounded-lg bg-green-500/20 shrink-0">
                <PhoneCall className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-base md:text-lg font-semibold mb-2">Prefer to call us directly?</h4>
                <a href="tel:08001234567" className="text-xl md:text-2xl font-bold text-green-600 hover:text-green-700 transition-colors block mb-2">
                  0800 123 4567
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri: 9am-6pm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Callback Form */}
          <div className="px-6 pb-8 md:px-8">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Or fill out the form below and we'll call you back within 24 hours</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferred_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                          <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request Callback"}
                  <Phone className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callback;
