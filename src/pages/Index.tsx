import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { getHealthStats, signOut } from "@/lib/supabaseClient";
import { HealthCard } from "@/components/HealthCard";
import { AlertSystem } from "@/components/AlertSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroImage from "@/assets/hero-nehealth.jpg";
import { 
  Droplets, 
  AlertTriangle, 
  Users, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Thermometer,
  Activity,
  Phone,
  BookOpen,
  Globe
} from "lucide-react";
import { DiseaseReportsList } from "@/components/DiseaseReportsList";
import { WaterTestReportsList } from "@/components/WaterTestReportsList";

type UserRole = "community" | "asha" | "dho" | "authority";

const Index = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [healthStats, setHealthStats] = useState({
    activeCases: 0,
    waterQualityPercentage: 0,
    riskAreas: 0,
    responseRate: 0
  });
  
  const currentRole = (userProfile?.role as UserRole) || "community";
  const currentUser = {
    name: userProfile?.name || "User",
    role: currentRole
  };

  // Debug logging
  console.log('Index page - userProfile:', userProfile);
  console.log('Index page - currentRole:', currentRole);

  useEffect(() => {
    const loadHealthStats = async () => {
      const stats = await getHealthStats();
      if (!stats.error) {
        setHealthStats(stats);
      }
    };
    loadHealthStats();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={currentUser} onSignOut={handleSignOut} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Protecting Northeast India from Water-Borne Diseases
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              AI-powered early warning system for rural and tribal communities
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="gap-2">
                <Shield className="h-5 w-5" />
                Report Symptoms
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-white/20 text-white hover:bg-white/10">
                <MapPin className="h-5 w-5" />
                View Disease Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Role Display */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Current Role:</span>
              <span className="text-sm font-medium capitalize">
                {currentRole === "asha" ? "ASHA Worker" : currentRole === "dho" ? "DHO" : currentRole}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Health Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthCard
                title="Active Cases"
                value={healthStats.activeCases.toString()}
                description="Water-borne disease cases this month"
                icon={<Users className="h-4 w-4" />}
                variant="alert"
                trend="up"
              />
              <HealthCard
                title="Water Quality"
                value={`${healthStats.waterQualityPercentage}%`}
                description="Sources tested as safe"
                icon={<Droplets className="h-4 w-4" />}
                variant="warning"
                trend="stable"
              />
              <HealthCard
                title="Risk Areas"
                value={healthStats.riskAreas.toString()}
                description="High-risk zones identified"
                icon={<AlertTriangle className="h-4 w-4" />}
                variant="critical"
                trend="down"
              />
              <HealthCard
                title="Response Rate"
                value={`${healthStats.responseRate}%`}
                description="Health worker response time"
                icon={<Activity className="h-4 w-4" />}
                variant="success"
                trend="up"
              />
            </div>
          </section>

          {/* Role-Based Dashboard */}
          <section>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {currentRole === "community" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-primary" />
                          Report Symptoms
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Help protect your community by reporting any symptoms of water-borne diseases.
                        </p>
                        <Button 
                          variant="medical" 
                          className="w-full"
                          onClick={() => navigate('/report-symptoms')}
                        >
                          Report New Symptoms
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-secondary" />
                          Emergency Contacts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Local ASHA Worker</span>
                          <Button size="sm" variant="outline">Call</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Health Center</span>
                          <Button size="sm" variant="outline">Call</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentRole === "asha" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Tasks</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Badge variant="secondary">Pending</Badge>
                            <span>Visit Majuli village - Water testing</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Badge className="bg-warning text-warning-foreground">Urgent</Badge>
                            <span>Follow-up with 3 diarrhea cases</span>
                          </div>
                        </div>
                        <Button 
                          variant="medical" 
                          className="w-full"
                          onClick={() => navigate('/enter-visit')}
                        >
                          Enter Patient Data
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentRole === "dho" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Disease Hotspot Map
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Interactive disease mapping</p>
                            <p className="text-sm text-muted-foreground">Real-time outbreak visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Lab Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted rounded">
                              <span className="font-medium">Guwahati Water Sample #1234</span>
                              <Badge className="bg-water-quality-good text-white">Safe</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted rounded">
                              <span className="font-medium">Jorhat Sample #1235</span>
                              <Badge className="bg-water-quality-poor text-white">Contaminated</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={() => navigate('/lab-report')}
                          >
                            Upload New Report
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>AI Predictions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 bg-alert/10 border border-alert/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-alert" />
                                <span className="font-medium text-alert">High Risk Predicted</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Cholera outbreak risk increased by 35% in Dibrugarh district based on water quality and seasonal patterns.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {currentRole === "authority" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <HealthCard
                        title="Total Districts"
                        value="33"
                        description="Under monitoring"
                        icon={<MapPin className="h-4 w-4" />}
                      />
                      <HealthCard
                        title="Health Workers"
                        value="1,247"
                        description="Active in network"
                        icon={<Users className="h-4 w-4" />}
                      />
                      <HealthCard
                        title="Response Time"
                        value="2.3h"
                        description="Average alert response"
                        icon={<Activity className="h-4 w-4" />}
                        variant="success"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AlertSystem />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SMS Notifications</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Email Alerts</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Push Notifications</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DiseaseReportsList />
                  <WaterTestReportsList />
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Health Education Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Water Purification Methods</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn safe water treatment techniques using local materials
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View Resources
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Symptom Recognition</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Identify early signs of water-borne diseases
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View Resources
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Prevention Tips</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Daily practices to prevent disease transmission
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View Resources
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;