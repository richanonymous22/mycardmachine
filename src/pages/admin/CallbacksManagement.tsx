import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Mail, Phone, Calendar, Clock } from "lucide-react";

const CallbacksManagement = () => {
  const { data: callbacks, isLoading } = useQuery({
    queryKey: ["admin-callbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("callback_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    contacted: "bg-blue-500",
    scheduled: "bg-purple-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
    converted: "bg-emerald-500",
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Callback Requests</h1>
            <p className="text-muted-foreground">View and manage callback requests</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid gap-4">
              {callbacks?.map((callback) => (
                <Card key={callback.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-3">
                          {callback.name}
                          <Badge className={statusColors[callback.status]}>
                            {callback.status}
                          </Badge>
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {callback.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {callback.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {callback.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(callback.created_at), "MMM dd, yyyy HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Provider:</span>
                        <p className="font-medium">{callback.partner_name}</p>
                      </div>
                      {callback.business_name && (
                        <div>
                          <span className="text-muted-foreground">Business:</span>
                          <p className="font-medium">{callback.business_name}</p>
                        </div>
                      )}
                      {callback.preferred_time && (
                        <div>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Preferred Time:
                          </span>
                          <p className="font-medium">{callback.preferred_time}</p>
                        </div>
                      )}
                      {callback.monthly_turnover && (
                        <div>
                          <span className="text-muted-foreground">Monthly Turnover:</span>
                          <p className="font-medium">£{Number(callback.monthly_turnover).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    {callback.notes && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="mt-1 p-3 bg-muted rounded-lg">{callback.notes}</p>
                      </div>
                    )}
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

export default CallbacksManagement;
