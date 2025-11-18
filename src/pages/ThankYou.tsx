import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Mail, Phone } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "submission";

  useEffect(() => {
    // Track conversion in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'Form',
        event_label: type,
      });
    }
  }, [type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-border/50">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
              <CheckCircle2 className="w-20 h-20 text-green-500 relative animate-scale-in" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Thank You!
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            We've received your {type === 'callback' ? 'callback request' : 'application'} successfully.
          </p>

          <div className="bg-muted/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h3 className="font-semibold text-xl mb-4">What Happens Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Our team will contact you within <strong>24 hours</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Check your email for a confirmation message
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  We'll discuss your specific needs and start saving you money
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate("/v2")}
              variant="outline"
              size="lg"
            >
              Compare More Providers
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Questions? Contact us at{" "}
            <a 
              href="mailto:hello@cardcostsclever.co.uk" 
              className="text-primary hover:underline font-medium"
            >
              hello@cardcostsclever.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;