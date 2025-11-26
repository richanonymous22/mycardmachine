import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Calendar } from "lucide-react";
import { format } from "date-fns";

const OffersManagement = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_offers")
        .select("*, providers(name)")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const isOfferActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Offers</h1>
              <p className="text-muted-foreground">Manage timely promotions and offers</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Offer
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid gap-4">
              {offers?.map((offer) => {
                const active = isOfferActive(offer.start_date, offer.end_date) && offer.is_active;
                
                return (
                  <Card key={offer.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="flex items-center gap-3">
                            {offer.title}
                            <Badge variant={active ? "default" : "secondary"}>
                              {active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {offer.providers?.name} • Priority: {offer.priority}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{offer.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Badge:</span>
                          <p className="font-medium">{offer.badge_text}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(offer.start_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End Date:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(offer.end_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Turnover Range:</span>
                          <p className="font-medium">
                            {offer.min_turnover ? `£${offer.min_turnover.toLocaleString()}` : "No min"} - {offer.max_turnover ? `£${offer.max_turnover.toLocaleString()}` : "No max"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default OffersManagement;
