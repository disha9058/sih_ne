import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HealthCardProps {
  title: string;
  value?: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "alert" | "warning" | "success" | "critical";
  trend?: "up" | "down" | "stable";
  className?: string;
}

const variantStyles = {
  default: "border-border bg-card",
  alert: "border-alert/30 bg-alert/5 shadow-alert",
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5", 
  critical: "border-destructive/30 bg-destructive/5 shadow-alert"
};

const trendStyles = {
  up: "text-success",
  down: "text-destructive", 
  stable: "text-muted-foreground"
};

export function HealthCard({ 
  title, 
  value, 
  description, 
  icon, 
  variant = "default",
  trend,
  className 
}: HealthCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-soft",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn(
                "p-2 rounded-md",
                variant === "alert" ? "bg-alert/10 text-alert" : 
                variant === "warning" ? "bg-warning/10 text-warning" :
                variant === "success" ? "bg-success/10 text-success" :
                variant === "critical" ? "bg-destructive/10 text-destructive" :
                "bg-primary/10 text-primary"
              )}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          {variant !== "default" && (
            <Badge variant={variant === "success" ? "secondary" : "destructive"} className="text-xs">
              {variant === "alert" ? "Alert" : 
               variant === "warning" ? "Warning" :
               variant === "success" ? "Good" : 
               variant === "critical" ? "Critical" : "Normal"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {value && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {trend && (
                <span className={cn("text-sm font-medium", trendStyles[trend])}>
                  {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                </span>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}