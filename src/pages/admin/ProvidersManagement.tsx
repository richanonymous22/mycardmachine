import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ImprovedProviderFormDialog } from "@/components/admin/ImprovedProviderFormDialog";

const ProvidersManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const toggleActiveStatus = async (providerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("providers")
      .update({ is_active: !currentStatus })
      .eq("id", providerId);

    if (error) {
      toast.error("Failed to update provider status");
    } else {
      toast.success(`Provider ${!currentStatus ? "activated" : "deactivated"}`);
      refetch();
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Providers</h1>
              <p className="text-muted-foreground">Manage payment providers</p>
            </div>
            <Button onClick={() => {
              setSelectedProvider(null);
              setDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid gap-4">
              {providers?.map((provider) => (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3">
                          {provider.name}
                          <Badge variant={provider.is_active ? "default" : "secondary"}>
                            {provider.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Order: {provider.display_order} • {provider.machine_models.length} models
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActiveStatus(provider.id, provider.is_active)}
                        >
                          {provider.is_active ? (
                            <><EyeOff className="h-4 w-4 mr-2" /> Deactivate</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-2" /> Activate</>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contract:</span>
                        <p className="font-medium">{provider.contract_length}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Settlement:</span>
                        <p className="font-medium">{provider.settlement_time}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Features:</span>
                        <p className="font-medium">{provider.features.length} features</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Auto Renewal:</span>
                        <p className="font-medium">{provider.auto_renewal ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <ImprovedProviderFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          provider={selectedProvider}
          onSuccess={refetch}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ProvidersManagement;
