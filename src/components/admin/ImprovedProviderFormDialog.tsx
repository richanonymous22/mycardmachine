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
  
  // Fee structure - match Partner type exactly
  transaction_fee: z.coerce.number().min(0).optional(),
  monthly_rental: z.coerce.number().min(0).optional(),
  maintenance_fee: z.coerce.number().min(0).optional(),
  setup_fee: z.coerce.number().min(0).optional(),
  dashboard_fee: z.coerce.number().min(0).optional(),
  pci_fee: z.coerce.number().min(0).optional(),
  chargeback_fee: z.coerce.number().min(0).optional(),
  refund_fee: z.coerce.number().min(0).optional(),
  
  // Documents required
  doc_proof_of_id: z.boolean().default(true),
  doc_proof_of_business: z.boolean().default(true),
  doc_proof_of_bank: z.boolean().default(true),
  doc_proof_of_address: z.boolean().default(true),
  
  // Device info
  devices: z.array(z.object({
    device_name: z.string().min(1),
    rental_price: z.coerce.number().min(0).optional(),
    buy_price: z.coerce.number().min(0).optional(),
  })).optional(),
  
  // Turnover tiers
  turnover_tiers: z.array(z.object({
    range: z.string().min(1),
    fee: z.coerce.number().min(0),
    eligible: z.boolean().default(true),
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
      transaction_fee: provider?.fees?.transaction_fee || 0,
      monthly_rental: provider?.fees?.monthly_rental || 0,
      maintenance_fee: provider?.fees?.maintenance_fee || 0,
      setup_fee: provider?.fees?.setup_fee || 0,
      dashboard_fee: provider?.fees?.dashboard_fee || 0,
      pci_fee: provider?.fees?.pci_fee || 0,
      chargeback_fee: provider?.fees?.chargeback_fee || 0,
      refund_fee: provider?.fees?.refund_fee || 0,
      doc_proof_of_id: provider?.documents_required?.proof_of_id ?? true,
      doc_proof_of_business: provider?.documents_required?.proof_of_business ?? true,
      doc_proof_of_bank: provider?.documents_required?.proof_of_bank ?? true,
      doc_proof_of_address: provider?.documents_required?.proof_of_address ?? true,
      devices: provider?.device_info ? (Array.isArray(provider.device_info) ? provider.device_info : [provider.device_info]) : [],
      turnover_tiers: provider?.turnover_tiers || [],
    },
  });

  const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({
    control: form.control,
    name: "turnover_tiers",
  });

  const { fields: deviceFields, append: appendDevice, remove: removeDevice } = useFieldArray({
    control: form.control,
    name: "devices",
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
        transaction_fee: provider.fees?.transaction_fee || 0,
        monthly_rental: provider.fees?.monthly_rental || 0,
        maintenance_fee: provider.fees?.maintenance_fee || 0,
        setup_fee: provider.fees?.setup_fee || 0,
        dashboard_fee: provider.fees?.dashboard_fee || 0,
        pci_fee: provider.fees?.pci_fee || 0,
        chargeback_fee: provider.fees?.chargeback_fee || 0,
        refund_fee: provider.fees?.refund_fee || 0,
        doc_proof_of_id: provider.documents_required?.proof_of_id ?? true,
        doc_proof_of_business: provider.documents_required?.proof_of_business ?? true,
        doc_proof_of_bank: provider.documents_required?.proof_of_bank ?? true,
        doc_proof_of_address: provider.documents_required?.proof_of_address ?? true,
        devices: provider.device_info ? (Array.isArray(provider.device_info) ? provider.device_info : [provider.device_info]) : [],
        turnover_tiers: provider.turnover_tiers || [],
      });
    }
  }, [provider, open, form]);

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      const machine_models = data.machine_models.split(",").map((s) => s.trim()).filter(Boolean);
      const features = data.features.split(",").map((s) => s.trim()).filter(Boolean);

      // Build fees object matching Partner type structure
      const fees: any = {};
      if (data.transaction_fee) fees.transaction_fee = data.transaction_fee / 100; // Convert to decimal
      if (data.monthly_rental) fees.monthly_rental = data.monthly_rental;
      if (data.maintenance_fee) fees.maintenance_fee = data.maintenance_fee;
      if (data.setup_fee) fees.setup_fee = data.setup_fee;
      if (data.dashboard_fee) fees.dashboard_fee = data.dashboard_fee;
      if (data.pci_fee) fees.pci_fee = data.pci_fee;
      if (data.chargeback_fee) fees.chargeback_fee = data.chargeback_fee;
      if (data.refund_fee) fees.refund_fee = data.refund_fee;

      const documents_required = {
        proof_of_id: data.doc_proof_of_id,
        proof_of_business: data.doc_proof_of_business,
        proof_of_bank: data.doc_proof_of_bank,
        proof_of_address: data.doc_proof_of_address,
      };

      const device_info = data.devices && data.devices.length > 0 ? data.devices : null;

      // Process turnover tiers if exists
      const turnover_tiers = data.turnover_tiers && data.turnover_tiers.length > 0 
        ? data.turnover_tiers.map(tier => ({
            range: tier.range,
            fee: tier.fee / 100, // Convert to decimal
            eligible: tier.eligible
          }))
        : null;

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
        documents_required,
        device_info,
        turnover_tiers,
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
      console.error("Provider save error:", error);
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
              <p className="text-sm text-muted-foreground">Enter percentage fees as whole numbers (e.g., 1.69 for 1.69%)</p>
              
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
                      <FormDescription>Main transaction fee %</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthly_rental"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rental (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenance_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="setup_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setup Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dashboard_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dashboard Fee (£)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pci_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PCI Fee (£)</FormLabel>
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

            {/* Device Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Device Information (Optional)</h3>
                  <p className="text-sm text-muted-foreground">Add multiple machines with buy/rent options</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendDevice({ device_name: "", rental_price: 0, buy_price: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>

              {deviceFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <FormField
                      control={form.control}
                      name={`devices.${index}.device_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SumUp Air" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`devices.${index}.rental_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rental Price (£/month)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder="19.99" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`devices.${index}.buy_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buy Price (£)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder="99.00" />
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
                    onClick={() => removeDevice(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Documents Required */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documents Required</h3>
              <p className="text-sm text-muted-foreground">Select which documents are required for this provider</p>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="doc_proof_of_id"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 p-3 border rounded-lg">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">Proof of ID</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doc_proof_of_business"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 p-3 border rounded-lg">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">Proof of Business</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doc_proof_of_bank"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 p-3 border rounded-lg">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">Proof of Bank</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doc_proof_of_address"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 p-3 border rounded-lg">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer">Proof of Address</FormLabel>
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
                  <p className="text-sm text-muted-foreground">Define different fees for turnover ranges (e.g., "5000-10000" or "50000+")</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTier({ range: "5000-10000", fee: 1.5, eligible: true })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              {tierFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.range`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Range</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="5000-10000 or 50000+" />
                          </FormControl>
                          <FormDescription>Format: "min-max" or "min+"</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.fee`}
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

                    <FormField
                      control={form.control}
                      name={`turnover_tiers.${index}.eligible`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="!mt-0">Eligible</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeTier(index)}
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
