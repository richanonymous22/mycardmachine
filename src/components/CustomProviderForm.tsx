import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface CustomProviderFormProps {
  onUpdate: (data: CustomProviderData) => void;
}

export interface CustomProviderData {
  name: string;
  turnover: number;
  debitRate: number;
  creditRate: number;
  internationalRate: number;
  amexRate: number;
  tapAuthFee: number;
  isBlended: boolean;
}

export const CustomProviderForm = ({ onUpdate }: CustomProviderFormProps) => {
  const [formData, setFormData] = useState<CustomProviderData>({
    name: "",
    turnover: 0,
    debitRate: 0,
    creditRate: 0,
    internationalRate: 0,
    amexRate: 0,
    tapAuthFee: 0,
    isBlended: false,
  });

  const handleChange = (field: keyof CustomProviderData, value: string | number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <Card className="glass border-primary/20 p-4 md:p-6 mt-3 md:mt-4 animate-fade-in">
      <div className="space-y-3 md:space-y-4">
        <div>
          <Label htmlFor="providerName" className="text-xs md:text-sm font-medium text-foreground">Provider Name</Label>
          <Input
            id="providerName"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
            placeholder="Enter provider name"
          />
        </div>

        <div>
          <Label htmlFor="turnover" className="text-xs md:text-sm font-medium text-foreground">Monthly Turnover (£)</Label>
          <Input
            id="turnover"
            type="number"
            value={formData.turnover > 0 ? formData.turnover : ''}
            onChange={(e) => handleChange('turnover', parseFloat(e.target.value) || 0)}
            className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
            placeholder="25000"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="blended" className="text-xs md:text-sm font-medium text-foreground">Blended Rate</Label>
          <Switch
            id="blended"
            checked={formData.isBlended}
            onCheckedChange={(checked) => handleChange('isBlended', checked)}
          />
        </div>

        {formData.isBlended ? (
          <div>
            <Label htmlFor="blendedRate" className="text-xs md:text-sm font-medium text-foreground">Blended Rate (%)</Label>
            <Input
              id="blendedRate"
              type="number"
              step="0.01"
              value={formData.debitRate > 0 ? formData.debitRate : ''}
              onChange={(e) => handleChange('debitRate', parseFloat(e.target.value) || 0)}
              className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
              placeholder="1.5"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label htmlFor="debitRate" className="text-xs md:text-sm font-medium text-foreground">Debit Rate (%)</Label>
              <Input
                id="debitRate"
                type="number"
                step="0.01"
                value={formData.debitRate > 0 ? formData.debitRate : ''}
                onChange={(e) => handleChange('debitRate', parseFloat(e.target.value) || 0)}
                className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
                placeholder="0.75"
              />
            </div>

            <div>
              <Label htmlFor="creditRate" className="text-xs md:text-sm font-medium text-foreground">Credit Rate (%)</Label>
              <Input
                id="creditRate"
                type="number"
                step="0.01"
                value={formData.creditRate > 0 ? formData.creditRate : ''}
                onChange={(e) => handleChange('creditRate', parseFloat(e.target.value) || 0)}
                className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
                placeholder="1.25"
              />
            </div>

            <div>
              <Label htmlFor="internationalRate" className="text-xs md:text-sm font-medium text-foreground">International Rate (%)</Label>
              <Input
                id="internationalRate"
                type="number"
                step="0.01"
                value={formData.internationalRate > 0 ? formData.internationalRate : ''}
                onChange={(e) => handleChange('internationalRate', parseFloat(e.target.value) || 0)}
                className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
                placeholder="2.5"
              />
            </div>

            <div>
              <Label htmlFor="amexRate" className="text-xs md:text-sm font-medium text-foreground">Amex Rate (%)</Label>
              <Input
                id="amexRate"
                type="number"
                step="0.01"
                value={formData.amexRate > 0 ? formData.amexRate : ''}
                onChange={(e) => handleChange('amexRate', parseFloat(e.target.value) || 0)}
                className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
                placeholder="2.95"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="tapAuthFee" className="text-xs md:text-sm font-medium text-foreground">Tap/Auth Fee (pence)</Label>
          <Input
            id="tapAuthFee"
            type="number"
            step="0.1"
            value={formData.tapAuthFee > 0 ? formData.tapAuthFee : ''}
            onChange={(e) => handleChange('tapAuthFee', parseFloat(e.target.value) || 0)}
            className="mt-1 md:mt-1.5 glass border-primary/20 text-foreground text-sm md:text-base h-10 md:h-11"
            placeholder="1.5"
          />
        </div>
      </div>
    </Card>
  );
};
