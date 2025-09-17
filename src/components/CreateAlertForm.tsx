import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createAlert } from "@/lib/supabaseClient";
import { AlertTriangle, MapPin, Radio } from "lucide-react";

interface AlertData {
  message: string;
  severity: string;
  location: string;
}

const severityLevels = [
  { value: "low", label: "Low", description: "General advisory" },
  { value: "medium", label: "Medium", description: "Requires attention" },
  { value: "high", label: "High", description: "Urgent action needed" },
  { value: "critical", label: "Critical", description: "Emergency situation" }
];

export function CreateAlertForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AlertData>({
    message: "",
    severity: "",
    location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message || !formData.severity || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await createAlert({
        message: formData.message,
        severity: formData.severity,
        location: formData.location
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Alert Created",
        description: "Health alert has been broadcast successfully",
        variant: "default"
      });

      // Reset form
      setFormData({
        message: "",
        severity: "",
        location: ""
      });

    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        title: "Alert Failed",
        description: "There was an error creating the alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-alert';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          Create Health Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="severity">Alert Severity *</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${getSeverityColor(level.value)}`} />
                      <span className="font-medium">{level.label}</span>
                      <span className="text-sm text-muted-foreground">- {level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Affected Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter district, village, or specific area"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Alert Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Describe the health alert, include specific actions residents should take..."
              rows={4}
              required
            />
          </div>

          {formData.severity && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Alert Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${getSeverityColor(formData.severity)}`} />
                  <span className={`font-medium ${getSeverityColor(formData.severity)}`}>
                    {severityLevels.find(l => l.value === formData.severity)?.label.toUpperCase()} ALERT
                  </span>
                </div>
                {formData.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {formData.location}
                  </div>
                )}
                {formData.message && (
                  <p className="text-foreground">{formData.message}</p>
                )}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="medical"
          >
            {loading ? "Broadcasting..." : "Broadcast Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}