import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getWaterTestReports } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Droplets, MapPin, Calendar, Search, FlaskConical } from "lucide-react";
import { format } from "date-fns";

interface WaterTestReport {
  id: string;
  location: string;
  parameter: string;
  result_value: string;
  status: string;
  date: string;
  created_at: string;
  tested_by?: string;
}

export function WaterTestReportsList() {
  const [reports, setReports] = useState<WaterTestReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<WaterTestReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report => 
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const loadReports = async () => {
    try {
      const { reports: data, error } = await getWaterTestReports();
      
      if (error) {
        throw error;
      }

      setReports(data);
    } catch (error) {
      console.error("Error loading water test reports:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load water test reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'safe':
        return <Badge className="bg-success text-success-foreground">Safe</Badge>;
      case 'contaminated':
        return <Badge variant="destructive">Contaminated</Badge>;
      case 'needs_treatment':
        return <Badge className="bg-warning text-warning-foreground">Needs Treatment</Badge>;
      case 'under_investigation':
        return <Badge variant="secondary">Under Investigation</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getParameterIcon = (parameter: string) => {
    if (parameter.toLowerCase().includes('coliform') || parameter.toLowerCase().includes('e.coli')) {
      return <FlaskConical className="h-4 w-4 text-destructive" />;
    }
    return <Droplets className="h-4 w-4 text-primary" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading water test reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Water Quality Reports</span>
          <Badge variant="outline">{reports.length} Total</Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, parameter, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={loadReports} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No reports match your search" : "No water test reports found"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getParameterIcon(report.parameter)}
                      <h4 className="font-semibold">{report.parameter}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(report.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Result: </span>
                      <span className={
                        report.status === 'Safe' ? 'text-success' :
                        report.status === 'Contaminated' ? 'text-destructive' :
                        'text-foreground'
                      }>
                        {report.result_value}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-muted-foreground">
                    Tested {format(new Date(report.created_at), 'MMM dd, HH:mm')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}