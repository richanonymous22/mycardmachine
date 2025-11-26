import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Mail, Phone, Calendar } from "lucide-react";

const ApplicationsManagement = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    documents_uploaded: "bg-blue-500",
    under_review: "bg-purple-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    completed: "bg-gray-500",
    contacted: "bg-cyan-500",
    converted: "bg-emerald-500",
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Applications</h1>
            <p className="text-muted-foreground">View and manage customer applications</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid gap-4">
              {applications?.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-3">
                          {app.name}
                          <Badge className={statusColors[app.status]}>
                            {app.status.replace("_", " ")}
                          </Badge>
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {app.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {app.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(app.created_at), "MMM dd, yyyy HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Provider:</span>
                        <p className="font-medium">{app.partner_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Turnover:</span>
                        <p className="font-medium">£{Number(app.monthly_turnover).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Monthly Cost:</span>
                        <p className="font-medium">
                          {app.estimated_monthly_cost ? `£${Number(app.estimated_monthly_cost).toFixed(2)}` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Annual Savings:</span>
                        <p className="font-medium text-green-600">
                          {app.estimated_annual_savings ? `£${Number(app.estimated_annual_savings).toFixed(2)}` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ApplicationsManagement;
