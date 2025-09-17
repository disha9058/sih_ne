import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createLabReport } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { FlaskConical, MapPin, Calendar, FileBarChart } from "lucide-react";

interface LabReportData {
  sampleId: string;
  reportType: string;
  location: string;
  testDate: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  status: string;
  notes: string;
}

const reportTypes = [
  "Water Quality Test",
  "Blood Test",
  "Stool Sample",
  "Environmental Sample",
  "Food Safety Test"
];

const waterTestParameters = [
  { name: "pH Level", unit: "pH", normalRange: "6.5-8.5" },
  { name: "Turbidity", unit: "NTU", normalRange: "< 5" },
  { name: "E. coli", unit: "CFU/100ml", normalRange: "0" },
  { name: "Total Coliform", unit: "CFU/100ml", normalRange: "0" },
  { name: "Chlorine Residual", unit: "mg/L", normalRange: "0.2-0.5" },
  { name: "Nitrates", unit: "mg/L", normalRange: "< 10" }
];

export function LabReportForm() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LabReportData>({
    sampleId: "",
    reportType: "",
    location: "",
    testDate: new Date().toISOString().split('T')[0],
    parameters: {},
    results: {},
    status: "pending",
    notes: ""
  });

  const handleParameterChange = (paramName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [paramName]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sampleId || !formData.reportType || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await createLabReport({
        sample_id: formData.sampleId,
        report_type: formData.reportType,
        location: formData.location,
        test_date: formData.testDate,
        parameters: formData.reportType === "Water Quality Test" 
          ? waterTestParameters.reduce((acc, param) => ({ ...acc, [param.name]: param }), {})
          : {},
        results: formData.results,
        status: formData.status,
        tested_by_id: userProfile?.id || null,
        health_center_id: userProfile?.health_center_id || null
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Report Submitted",
        description: "Lab report has been submitted successfully",
        variant: "default"
      });

      // Reset form
      setFormData({
        sampleId: "",
        reportType: "",
        location: "",
        testDate: new Date().toISOString().split('T')[0],
        parameters: {},
        results: {},
        status: "pending",
        notes: ""
      });

    } catch (error) {
      console.error("Error submitting lab report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Submit Lab Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sampleId">Sample ID *</Label>
              <Input
                id="sampleId"
                value={formData.sampleId}
                onChange={(e) => setFormData(prev => ({ ...prev, sampleId: e.target.value }))}
                placeholder="Enter unique sample ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type *</Label>
              <Select value={formData.reportType} onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sample Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter sample collection location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Test Date
              </Label>
              <Input
                id="testDate"
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData(prev => ({ ...prev, testDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {formData.reportType === "Water Quality Test" && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                Test Results
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                {waterTestParameters.map(param => (
                  <div key={param.name} className="space-y-2">
                    <Label className="text-sm font-medium">{param.name}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Value"
                        value={formData.results[param.name] || ""}
                        onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      />
                      <span className="flex items-center text-sm text-muted-foreground min-w-20">
                        {param.unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Normal: {param.normalRange}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Report Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="requires_follow_up">Requires Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional observations or recommendations..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="medical"
          >
            {loading ? "Submitting..." : "Submit Lab Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}