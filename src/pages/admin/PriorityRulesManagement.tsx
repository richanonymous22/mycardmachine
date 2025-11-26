import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, TrendingUp } from "lucide-react";
import { PriorityRuleFormDialog } from "@/components/admin/PriorityRuleFormDialog";

const PriorityRulesManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);

  const { data: rules, isLoading, refetch } = useQuery({
    queryKey: ["admin-priority-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("priority_rules")
        .select("*, providers(name)")
        .order("min_turnover", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Priority Rules</h1>
              <p className="text-muted-foreground">
                Control provider recommendations based on turnover
              </p>
            </div>
            <Button onClick={() => {
              setSelectedRule(null);
              setDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid gap-4">
              {rules?.map((rule) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          {rule.providers?.name}
                          <Badge variant={rule.is_active ? "default" : "secondary"}>
                            {rule.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Priority Score: {rule.priority_score}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRule(rule);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Minimum Turnover:</span>
                        <p className="font-medium text-lg">
                          £{Number(rule.min_turnover).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Maximum Turnover:</span>
                        <p className="font-medium text-lg">
                          £{Number(rule.max_turnover).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Priority Score:</span>
                        <p className="font-medium text-lg text-primary">
                          {rule.priority_score}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <PriorityRuleFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          rule={selectedRule}
          onSuccess={refetch}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default PriorityRulesManagement;
