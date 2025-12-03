import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IndexV2 from "./pages/IndexV2";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Apply from "./pages/Apply";
import Callback from "./pages/Callback";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProvidersManagement from "./pages/admin/ProvidersManagement";
import OffersManagement from "./pages/admin/OffersManagement";
import PriorityRulesManagement from "./pages/admin/PriorityRulesManagement";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import CallbacksManagement from "./pages/admin/CallbacksManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogEditor from "./pages/admin/BlogEditor";
 
const queryClient = new QueryClient();
 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexV2 />} />
          <Route path="/v1" element={<Index />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/providers" element={<ProvidersManagement />} />
          <Route path="/admin/offers" element={<OffersManagement />} />
          <Route path="/admin/priority-rules" element={<PriorityRulesManagement />} />
          <Route path="/admin/applications" element={<ApplicationsManagement />} />
          <Route path="/admin/callbacks" element={<CallbacksManagement />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          <Route path="/admin/blog/new" element={<BlogEditor />} />
          <Route path="/admin/blog/:id/edit" element={<BlogEditor />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
 
export default App;
