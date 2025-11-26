import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const providerSchema = z.object({
  id: z.string().min(1, "Provider ID is required"),
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().optional(),
  contract_length: z.string().min(1, "Contract length is required"),
  settlement_time: z.string().min(1, "Settlement time is required"),
  early_termination_fee: z.string().optional(),
  auto_renewal: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0),
  is_active: z.boolean().default(true),
  machine_models: z.string().min(1, "Machine models are required"),
  features: z.string().min(1, "Features are required"),
  fees: z.string().min(1, "Fees are required"),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface ProviderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: any;
  onSuccess: () => void;
}

export const ProviderFormDialog = ({
  open,
  onOpenChange,
  provider,
  onSuccess,
}: ProviderFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!provider;

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      id: provider?.id || "",
      name: provider?.name || "",
      logo_url: provider?.logo_url || "",
      contract_length: provider?.contract_length || "",
      settlement_time: provider?.settlement_time || "",
      early_termination_fee: provider?.early_termination_fee || "",
      auto_renewal: provider?.auto_renewal || false,
      display_order: provider?.display_order || 0,
      is_active: provider?.is_active ?? true,
      machine_models: provider?.machine_models?.join(", ") || "",
      features: provider?.features?.join(", ") || "",
      fees: provider?.fees ? JSON.stringify(provider.fees, null, 2) : "",
    },
  });

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      // Parse arrays and JSON
      const machine_models = data.machine_models.split(",").map((s) => s.trim());
      const features = data.features.split(",").map((s) => s.trim());
      const fees = JSON.parse(data.fees);

      const providerData = {
        id: data.id,
        name: data.name,
        logo_url: data.logo_url || null,
        contract_length: data.contract_length,
        settlement_time: data.settlement_time,
        early_termination_fee: data.early_termination_fee || null,
        auto_renewal: data.auto_renewal,
        display_order: data.display_order,
        is_active: data.is_active,
        machine_models,
        features,
        fees,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("providers")
          .update(providerData)
          .eq("id", provider.id);

        if (error) throw error;
        toast.success("Provider updated successfully");
      } else {
        const { error } = await supabase
          .from("providers")
          .insert([providerData]);

        if (error) throw error;
        toast.success("Provider created successfully");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to save provider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Provider" : "Add New Provider"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the provider information below."
              : "Fill in the details to create a new provider."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} placeholder="sumup" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SumUp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contract_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Length</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="No fixed term" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settlement_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settlement Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Next business day" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="early_termination_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Early Termination Fee (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="None" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="machine_models"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Models (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SumUp Air, SumUp 3G, SumUp Solo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="No monthly fees, Free app, Portable" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fees (JSON format)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder='{"transactionFee": 1.69, "authorizationFee": 0}'
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="auto_renewal"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <FormLabel>Auto Renewal</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <FormLabel>Is Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update Provider" : "Create Provider"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
