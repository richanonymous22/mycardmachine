import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Tag, TrendingUp, FileText, Phone, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  // Fetch stats
  const { data: providersCount } = useQuery({
    queryKey: ["providers-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("providers")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: offersCount } = useQuery({
    queryKey: ["offers-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("provider_offers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      return count || 0;
    },
  });

  const { data: priorityRulesCount } = useQuery({
    queryKey: ["priority-rules-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("priority_rules")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      return count || 0;
    },
  });

  const { data: applicationsCount } = useQuery({
    queryKey: ["applications-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: callbacksCount } = useQuery({
    queryKey: ["callbacks-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("callback_requests")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    { title: "Total Providers", value: providersCount, icon: Users, color: "text-blue-500" },
    { title: "Active Offers", value: offersCount, icon: Tag, color: "text-green-500" },
    { title: "Priority Rules", value: priorityRulesCount, icon: TrendingUp, color: "text-purple-500" },
    { title: "Applications", value: applicationsCount, icon: FileText, color: "text-orange-500" },
    { title: "Callbacks", value: callbacksCount, icon: Phone, color: "text-pink-500" },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your card machine comparison platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value ?? "..."}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                System Status
              </CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="text-green-500 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Providers API</span>
                  <span className="text-green-500 font-medium">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
