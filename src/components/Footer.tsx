import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return <footer className="bg-background border-t border-primary/10 mt-8 md:mt-16">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 rounded-sm bg-[#111318]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="md:col-span-2">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Card Costs Clever</h3>
            <p className="text-xs text-muted-foreground leading-relaxed md:text-sm">
              Card Costs Clever helps UK businesses compare merchant payment rates across major providers like Dojo, Worldpay, Elavon, EVO, Barclays, and Teya. Save money and switch smarter with our free comparison tool.
            </p>
          </div>
          
          <div>
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Contact Us</h4>
            <div className="space-y-2">
              <a href="mailto:hello@cardcostsclever.co.uk" className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                hello@cardcostsclever.co.uk
              </a>
              <a href="tel:03301337744" className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                0330 133 7744
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <Separator className="mb-6 md:mb-8 bg-primary/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Card Costs Clever. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="/terms" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};