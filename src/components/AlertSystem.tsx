import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Droplets, 
  MapPin, 
  Clock,
  Users,
  X 
} from "lucide-react";

interface HealthAlert {
  id: string;
  type: "outbreak" | "water_quality" | "prediction" | "resource";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  timestamp: string;
  affected: number;
  status: "active" | "resolved" | "monitoring";
}

const mockAlerts: HealthAlert[] = [
  {
    id: "1",
    type: "outbreak",
    severity: "high",
    title: "Cholera Cases Reported",
    description: "7 confirmed cholera cases in Majuli district. Immediate intervention required.",
    location: "Majuli, Assam",
    timestamp: "2 hours ago",
    affected: 7,
    status: "active"
  },
  {
    id: "2", 
    type: "water_quality",
    severity: "critical",
    title: "Water Source Contaminated",
    description: "High E.coli levels detected in main water supply. Advise boiling water.",
    location: "Dibrugarh, Assam",
    timestamp: "4 hours ago",
    affected: 1200,
    status: "active"
  },
  {
    id: "3",
    type: "prediction", 
    severity: "medium",
    title: "Diarrhea Outbreak Risk",
    description: "AI model predicts 40% increased risk in next 7 days due to monsoon patterns.",
    location: "Jorhat district",
    timestamp: "1 day ago", 
    affected: 0,
    status: "monitoring"
  }
];

const severityStyles = {
  low: "border-success/50 bg-success/5",
  medium: "border-warning/50 bg-warning/5", 
  high: "border-alert/50 bg-alert/5",
  critical: "border-destructive/50 bg-destructive/5"
};

const severityBadges = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-alert text-alert-foreground", 
  critical: "bg-destructive text-destructive-foreground"
};

const typeIcons = {
  outbreak: <AlertTriangle className="h-4 w-4" />,
  water_quality: <Droplets className="h-4 w-4" />,
  prediction: <Clock className="h-4 w-4" />,
  resource: <Users className="h-4 w-4" />
};

export function AlertSystem() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Health Alerts</h3>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {mockAlerts.filter(a => a.status === "active").length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <Alert key={alert.id} className={severityStyles[alert.severity]}>
              <div className="flex items-start justify-between w-full">
                <div className="flex gap-3 flex-1">
                  <div className="mt-0.5">
                    {typeIcons[alert.type]}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTitle className="text-sm font-medium">
                        {alert.title}
                      </AlertTitle>
                      <Badge className={severityBadges[alert.severity]} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                    
                    <AlertDescription className="text-sm">
                      {alert.description}
                    </AlertDescription>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </div>
                      {alert.affected > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {alert.affected} affected
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {alert.status === "active" && (
                        <Button size="sm" variant="medical">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Alerts ({mockAlerts.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}