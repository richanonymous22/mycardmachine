import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle2, Phone, PhoneCall, Clock } from "lucide-react";
import { Partner } from "@/types/merchant";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  email: z.string().email("Invalid email address").max(255).optional().or(z.literal("")),
  preferred_time: z.string().optional()
});
interface CallbackRequestFormProps {
  partner: Partner;
  monthlyTurnover: number;
  onBack: () => void;
  onSuccess: () => void;
}
export const CallbackRequestForm = ({
  partner,
  monthlyTurnover,
  onBack,
  onSuccess
}: CallbackRequestFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
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
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("callback_requests").insert({
        partner_id: partner.id,
        partner_name: partner.name,
        name: values.name,
        phone: values.phone,
        email: values.email || null,
        preferred_time: values.preferred_time || null,
        monthly_turnover: monthlyTurnover,
        business_name: null,
        source: 'callback_form'
      }).select().single();
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

      setIsSubmitted(true);
      toast({
        title: "Request submitted",
        description: "We'll call you back soon!"
      });
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
  if (isSubmitted) {
    return <>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">Request Submitted</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4 sm:py-8 space-y-4 sm:space-y-6">
          <div className="inline-flex p-4 sm:p-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 shadow-lg">
            <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">We'll Call You Soon!</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
              Thank you for your interest in {partner.name}. One of our experts will contact you shortly to discuss your requirements.
            </p>
          </div>

          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg max-w-md mx-auto">
            <p className="text-xs sm:text-sm font-semibold mb-2">What to expect:</p>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 text-left">
              <li>• We'll call you within 24 hours</li>
              <li>• Discuss your business needs in detail</li>
              <li>• Guide you through the application process</li>
              <li>• Answer any questions you may have</li>
            </ul>
          </div>

          <Button onClick={onSuccess} className="w-full max-w-xs">
            Done
          </Button>
        </div>
      </>;
  }
  return <>
      <DialogHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl truncate">
              Request a Callback
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              We'll call you to discuss {partner.name}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Direct Call Option */}
      <div className="mt-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex p-2 rounded-lg bg-green-500/20 shrink-0">
            <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-semibold mb-1">Prefer to call us directly?</h4>
            <a href="tel:08001234567" className="text-base sm:text-lg font-bold text-green-600 hover:text-green-700 transition-colors block mb-1">
              0800 123 4567
            </a>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Mon-Fri: 9am-6pm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Or fill out the form below and we'll call you back</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <FormField control={form.control} name="name" render={({
            field
          }) => <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="phone" render={({
            field
          }) => <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+44 7123 456789" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="preferred_time" render={({
            field
          }) => <FormItem>
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
                </FormItem>} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Callback"}
              <Phone className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </>;
};