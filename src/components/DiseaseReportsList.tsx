import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDiseaseReports } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Users, Search, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface DiseaseReport {
  id: string;
  disease: string;
  community_name: string;
  case_count: number;
  date: string;
  created_at: string;
  reported_by?: string;
}

export function DiseaseReportsList() {
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DiseaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report => 
      report.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.community_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const loadReports = async () => {
    try {
      const { reports: data, error } = await getDiseaseReports();
      
      if (error) {
        throw error;
      }

      setReports(data);
    } catch (error) {
      console.error("Error loading disease reports:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load disease reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (caseCount: number) => {
    if (caseCount >= 10) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (caseCount >= 5) {
      return <Badge className="bg-alert text-alert-foreground">High</Badge>;
    } else if (caseCount >= 2) {
      return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    }
    return <Badge variant="secondary">Low</Badge>;
  };

  const getDiseaseTrend = (disease: string) => {
    const recentReports = reports
      .filter(r => r.disease === disease)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    
    if (recentReports.length < 2) return "stable";
    
    const recent = recentReports[0].case_count;
    const previous = recentReports[1].case_count;
    
    if (recent > previous) return "up";
    if (recent < previous) return "down";
    return "stable";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading disease reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Disease Reports</span>
          <Badge variant="outline">{reports.length} Total</Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by disease or community..."
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
            {searchTerm ? "No reports match your search" : "No disease reports found"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{report.disease}</h4>
                      {getSeverityBadge(report.case_count)}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span className={
                          getDiseaseTrend(report.disease) === "up" ? "text-destructive" :
                          getDiseaseTrend(report.disease) === "down" ? "text-success" :
                          "text-muted-foreground"
                        }>
                          {getDiseaseTrend(report.disease) === "up" ? "↗" : 
                           getDiseaseTrend(report.disease) === "down" ? "↘" : "→"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.community_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {report.case_count} {report.case_count === 1 ? 'case' : 'cases'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(report.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-muted-foreground">
                    Reported {format(new Date(report.created_at), 'MMM dd, HH:mm')}
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