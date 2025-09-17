import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createDiseaseReport } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Thermometer, MapPin, Calendar, User } from "lucide-react";

interface SymptomData {
  disease: string;
  communityName: string;
  caseCount: number;
  reportDate: string;
  symptoms: string[];
  additionalNotes: string;
}

const commonDiseases = [
  "Cholera",
  "Diarrhea", 
  "Typhoid",
  "Hepatitis A",
  "Jaundice",
  "Dysentery",
  "Gastroenteritis"
];

const commonSymptoms = [
  "Fever",
  "Vomiting", 
  "Diarrhea",
  "Abdominal pain",
  "Nausea",
  "Headache",
  "Dehydration",
  "Weakness"
];

export function SymptomReportForm() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SymptomData>({
    disease: "",
    communityName: "",
    caseCount: 1,
    reportDate: new Date().toISOString().split('T')[0],
    symptoms: [],
    additionalNotes: ""
  });

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.disease || !formData.communityName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await createDiseaseReport({
        disease: formData.disease,
        community_name: formData.communityName,
        case_count: formData.caseCount,
        date: formData.reportDate,
        reported_by: userProfile?.id || null
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Report Submitted",
        description: "Your symptom report has been submitted successfully",
        variant: "default"
      });

      // Reset form
      setFormData({
        disease: "",
        communityName: "",
        caseCount: 1,
        reportDate: new Date().toISOString().split('T')[0],
        symptoms: [],
        additionalNotes: ""
      });

    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Report Disease Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disease">Disease Type *</Label>
              <Select value={formData.disease} onValueChange={(value) => setFormData(prev => ({ ...prev, disease: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disease" />
                </SelectTrigger>
                <SelectContent>
                  {commonDiseases.map(disease => (
                    <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseCount">Number of Cases *</Label>
              <Input
                id="caseCount"
                type="number"
                min="1"
                value={formData.caseCount}
                onChange={(e) => setFormData(prev => ({ ...prev, caseCount: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="communityName" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Community/Village Name *
            </Label>
            <Input
              id="communityName"
              value={formData.communityName}
              onChange={(e) => setFormData(prev => ({ ...prev, communityName: e.target.value }))}
              placeholder="Enter community or village name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Report Date
            </Label>
            <Input
              id="reportDate"
              type="date"
              value={formData.reportDate}
              onChange={(e) => setFormData(prev => ({ ...prev, reportDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Common Symptoms (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonSymptoms.map(symptom => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={formData.symptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                  />
                  <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Any additional symptoms or observations..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="medical"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}