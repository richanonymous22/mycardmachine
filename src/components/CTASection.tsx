import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const CTASection = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
      <Card className="glass border-2 border-primary/30 p-6 md:p-8 lg:p-12 text-center shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            Ready to Switch and Save?
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8">
            Our expert team can handle your setup in minutes. No hassle, no hidden fees.
          </p>
          
          <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 text-sm md:text-base"
            >
              <Phone className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              Talk to Our Team
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10 text-foreground font-semibold text-sm md:text-base"
            >
              <Mail className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              Get a Free Consultation
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Phone className="w-3 h-3 md:w-4 md:h-4" />
              <span>0800 123 4567</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Mail className="w-3 h-3 md:w-4 md:h-4" />
              <span className="truncate max-w-[200px] md:max-w-none">hello@cardcostsclever.co.uk</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
              <span>Live Chat</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
