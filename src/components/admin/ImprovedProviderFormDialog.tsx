import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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
  
  // Simplified fee fields
  transaction_fee: z.coerce.number().min(0),
  authorization_fee: z.coerce.number().min(0).default(0),
  monthly_fee: z.coerce.number().min(0).default(0),
  chargeback_fee: z.coerce.number().min(0).default(0),
  refund_fee: z.coerce.number().min(0).default(0),
  
  // Turnover tiers
  turnover_tiers: z.array(z.object({
    min_turnover: z.coerce.number().min(0),
    max_turnover: z.coerce.number().min(0),
    transaction_fee_percent: z.coerce.number().min(0).max(100),
  })).optional(),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface ImprovedProviderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: any;
  onSuccess: () => void;
}

export const ImprovedProviderFormDialog = ({
  open,
  onOpenChange,
  provider,
  onSuccess,
}: ImprovedProviderFormDialogProps) => {
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
      transaction_fee: provider?.fees?.transactionFee || 0,
      authorization_fee: provider?.fees?.authorizationFee || 0,
      monthly_fee: provider?.fees?.monthlyFee || 0,
      chargeback_fee: provider?.fees?.chargebackFee || 0,
      refund_fee: provider?.fees?.refundFee || 0,
      turnover_tiers: provider?.turnover_tiers || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "turnover_tiers",
  });

  useEffect(() => {
    if (provider && open) {
      form.reset({
        id: provider.id,
        name: provider.name,
        logo_url: provider.logo_url || "",
        contract_length: provider.contract_length,
        settlement_time: provider.settlement_time,
        early_termination_fee: provider.early_termination_fee || "",
        auto_renewal: provider.auto_renewal,
        display_order: provider.display_order,
        is_active: provider.is_active,
        machine_models: provider.machine_models?.join(", ") || "",
        features: provider.features?.join(", ") || "",
        transaction_fee: provider.fees?.transactionFee || 0,
        authorization_fee: provider.fees?.authorizationFee || 0,
        monthly_fee: provider.fees?.monthlyFee || 0,
        chargeback_fee: provider.fees?.chargebackFee || 0,
        refund_fee: provider.fees?.refundFee || 0,
        turnover_tiers: provider.turnover_tiers || [],
      });
    }
  }, [provider, open, form]);

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      const machine_models = data.machine_models.split(",").map((s) => s.trim());
      const features = data.features.split(",").map((s) => s.trim());

      const fees = {
        transactionFee: data.transaction_fee,
        authorizationFee: data.authorization_fee,
        monthlyFee: data.monthly_fee,
        chargebackFee: data.chargeback_fee,
        refundFee: data.refund_fee,
      };

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
        turnover_tiers: data.turnover_tiers && data.turnover_tiers.length > 0 ? data.turnover_tiers : null,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Provider" : "Add New Provider"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the provider information below."
              : "Fill in the details to create a new provider."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>

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

                <div className="flex items-center gap-6 pt-8">
                  <FormField
                    control={form.control}
                    name="auto_renewal"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Auto Renewal</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Is Active</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contract Details</h3>
              
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
            </div>

            {/* Fee Structure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fee Structure</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="transaction_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Fee (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="1.69" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorization_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorization Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthly_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chargeback_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chargeback Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refund_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Turnover Tiers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Turnover Tiers (Optional)</h3>
                  <p className="text-sm text-muted-foreground">Define different fee rates based on turnover ranges</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ min_turnover: 0, max_turnover: 10000, transaction_fee_percent: 1.5 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.min_turnover`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Turnover (£)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.max_turnover`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Turnover (£)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="10000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.transaction_fee_percent`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder="1.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Features & Models */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features & Models</h3>
              
              <FormField
                control={form.control}
                name="machine_models"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine Models (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SumUp Air, SumUp 3G, SumUp Solo" />
                    </FormControl>
                    <FormDescription>Separate multiple models with commas</FormDescription>
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
                      <Textarea {...field} placeholder="No monthly fees, Free app, Portable" rows={3} />
                    </FormControl>
                    <FormDescription>Separate multiple features with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
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
