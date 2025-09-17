import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createVisit } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { UserCheck, MapPin, Calendar, FileText } from "lucide-react";

interface VisitData {
  patientName: string;
  village: string;
  visitType: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
}

const visitTypes = [
  "Routine Checkup",
  "Emergency Visit", 
  "Follow-up",
  "Water Testing",
  "Health Education",
  "Vaccination",
  "Disease Investigation"
];

export function VisitEntryForm() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VisitData>({
    patientName: "",
    village: "",
    visitType: "",
    visitDate: new Date().toISOString().split('T')[0],
    symptoms: "",
    diagnosis: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.village || !formData.visitType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await createVisit({
        patient_name: formData.patientName,
        village: formData.village,
        visit_type: formData.visitType,
        visit_date: formData.visitDate,
        symptoms: formData.symptoms || null,
        diagnosis: formData.diagnosis || null,
        notes: formData.notes || null,
        asha_worker_id: userProfile?.id || "",
        status: "completed"
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Visit Recorded",
        description: "Patient visit has been recorded successfully",
        variant: "default"
      });

      // Reset form
      setFormData({
        patientName: "",
        village: "",
        visitType: "",
        visitDate: new Date().toISOString().split('T')[0],
        symptoms: "",
        diagnosis: "",
        notes: ""
      });

    } catch (error) {
      console.error("Error recording visit:", error);
      toast({
        title: "Recording Failed",
        description: "There was an error recording the visit. Please try again.",
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
          <UserCheck className="h-5 w-5 text-primary" />
          Record Patient Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="village" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Village *
              </Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                placeholder="Enter village name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitType">Visit Type *</Label>
              <Select value={formData.visitType} onValueChange={(value) => setFormData(prev => ({ ...prev, visitType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  {visitTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Visit Date
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms Observed</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Describe any symptoms observed during the visit..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis/Assessment</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Preliminary diagnosis or health assessment..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional observations, recommendations, or follow-up actions..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="medical"
          >
            {loading ? "Recording..." : "Record Visit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}