import { useState, useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const ruleSchema = z.object({
  provider_id: z.string().min(1, "Provider is required"),
  min_turnover: z.coerce.number().min(0, "Minimum turnover must be 0 or greater"),
  max_turnover: z.coerce.number().min(0, "Maximum turnover must be 0 or greater"),
  priority_score: z.coerce.number().int().min(0).max(100),
  is_active: z.boolean().default(true),
}).refine((data) => data.max_turnover > data.min_turnover, {
  message: "Maximum turnover must be greater than minimum turnover",
  path: ["max_turnover"],
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface PriorityRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: any;
  onSuccess: () => void;
}

export const PriorityRuleFormDialog = ({
  open,
  onOpenChange,
  rule,
  onSuccess,
}: PriorityRuleFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!rule;

  const { data: providers } = useQuery({
    queryKey: ["providers-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      provider_id: rule?.provider_id || "",
      min_turnover: rule?.min_turnover || 0,
      max_turnover: rule?.max_turnover || 10000,
      priority_score: rule?.priority_score || 50,
      is_active: rule?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (rule && open) {
      form.reset({
        provider_id: rule.provider_id,
        min_turnover: rule.min_turnover,
        max_turnover: rule.max_turnover,
        priority_score: rule.priority_score,
        is_active: rule.is_active,
      });
    }
  }, [rule, open, form]);

  const onSubmit = async (data: RuleFormData) => {
    setIsSubmitting(true);
    try {
      const ruleData = {
        provider_id: data.provider_id,
        min_turnover: data.min_turnover,
        max_turnover: data.max_turnover,
        priority_score: data.priority_score,
        is_active: data.is_active,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("priority_rules")
          .update(ruleData)
          .eq("id", rule.id);

        if (error) throw error;
        toast.success("Priority rule updated successfully");
      } else {
        const { error } = await supabase
          .from("priority_rules")
          .insert([ruleData]);

        if (error) throw error;
        toast.success("Priority rule created successfully");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to save priority rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Priority Rule" : "Create Priority Rule"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the priority rule below."
              : "Define how providers are prioritized based on turnover ranges."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="provider_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers?.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_turnover"
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
                name="max_turnover"
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
            </div>

            <FormField
              control={form.control}
              name="priority_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Score (0-100)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} placeholder="50" />
                  </FormControl>
                  <FormDescription>
                    Higher scores mean higher priority. Providers with higher scores appear first for this turnover range.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
