import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Hero = () => {
  const scrollToCalculator = () => {
    const calculator = document.getElementById('calculator');
    calculator?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      <div className="relative container mx-auto px-4 pt-20 md:pt-24 pb-12 md:pb-16 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-primary/20 mb-6 md:mb-8">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xs md:text-sm font-medium text-primary">UK's Leading Card Machine Comparison</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              Compare UK Card Machine
            </span>
            <br />
            <span className="text-foreground">Rates in Seconds</span>
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            See how much you're really paying — and how much you could save.
          </p>
          
          <Button onClick={scrollToCalculator} size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold px-6 py-5 md:px-8 md:py-6 text-base md:text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300">
            Start Comparison
            <ArrowDown className="ml-2 animate-bounce w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          
        </div>
      </div>
    </div>;
};