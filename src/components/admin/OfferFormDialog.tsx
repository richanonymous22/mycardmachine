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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const offerSchema = z.object({
  provider_id: z.string().min(1, "Provider is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  badge_text: z.string().min(1, "Badge text is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  min_turnover: z.coerce.number().min(0).optional(),
  max_turnover: z.coerce.number().min(0).optional(),
  priority: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: any;
  onSuccess: () => void;
}

export const OfferFormDialog = ({
  open,
  onOpenChange,
  offer,
  onSuccess,
}: OfferFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!offer;

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

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      provider_id: offer?.provider_id || "",
      title: offer?.title || "",
      description: offer?.description || "",
      badge_text: offer?.badge_text || "",
      start_date: offer?.start_date ? new Date(offer.start_date).toISOString().split('T')[0] : "",
      end_date: offer?.end_date ? new Date(offer.end_date).toISOString().split('T')[0] : "",
      min_turnover: offer?.min_turnover || undefined,
      max_turnover: offer?.max_turnover || undefined,
      priority: offer?.priority || 0,
      is_active: offer?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (offer && open) {
      form.reset({
        provider_id: offer.provider_id,
        title: offer.title,
        description: offer.description,
        badge_text: offer.badge_text,
        start_date: new Date(offer.start_date).toISOString().split('T')[0],
        end_date: new Date(offer.end_date).toISOString().split('T')[0],
        min_turnover: offer.min_turnover || undefined,
        max_turnover: offer.max_turnover || undefined,
        priority: offer.priority,
        is_active: offer.is_active,
      });
    }
  }, [offer, open, form]);

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);
    try {
      const offerData = {
        provider_id: data.provider_id,
        title: data.title,
        description: data.description,
        badge_text: data.badge_text,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        min_turnover: data.min_turnover || null,
        max_turnover: data.max_turnover || null,
        priority: data.priority,
        is_active: data.is_active,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("provider_offers")
          .update(offerData)
          .eq("id", offer.id);

        if (error) throw error;
        toast.success("Offer updated successfully");
      } else {
        const { error } = await supabase
          .from("provider_offers")
          .insert([offerData]);

        if (error) throw error;
        toast.success("Offer created successfully");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to save offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Offer" : "Create New Offer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the offer information below."
              : "Fill in the details to create a new promotional offer."}
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

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Summer Special Offer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Get 50% off transaction fees..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="badge_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="LIMITED TIME" />
                  </FormControl>
                  <FormDescription>Short text displayed on the badge</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_turnover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Turnover (£, optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="5000"
                        value={field.value || ""}
                      />
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
                    <FormLabel>Max Turnover (£, optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="50000"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="0" />
                    </FormControl>
                    <FormDescription>Higher priority offers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between pt-8">
                    <FormLabel>Is Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                {isSubmitting ? "Saving..." : isEdit ? "Update Offer" : "Create Offer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
