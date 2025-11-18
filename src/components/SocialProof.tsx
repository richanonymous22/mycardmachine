import { Users, TrendingDown, Award, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SocialProof = () => {
  const stats = [
    { icon: Users, value: "1,000+", label: "UK Businesses Helped" },
    { icon: TrendingDown, value: "£250k+", label: "Total Savings Generated" },
    { icon: Award, value: "4.9/5", label: "Average Rating" },
    { icon: CheckCircle, value: "100%", label: "Free Service" },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-primary text-white">
            Trusted by UK Businesses
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Join 1,000+ UK businesses saving on card fees
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've helped hundreds of businesses across the UK reduce their payment processing costs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">JD</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">John D.</div>
                  <div className="text-xs text-muted-foreground">Restaurant Owner</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Saved over £3,000 in the first year by switching. The comparison tool made it so easy!"
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">SM</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah M.</div>
                  <div className="text-xs text-muted-foreground">Retail Store</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Quick process and great support. No more hidden fees!"
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">MP</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Mike P.</div>
                  <div className="text-xs text-muted-foreground">Cafe Owner</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Finally understand my card processing costs. Highly recommend!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};