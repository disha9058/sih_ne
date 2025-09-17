import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "./LanguageSelector";
import { Bell, User, Menu } from "lucide-react";

interface HeaderProps {
  currentUser?: {
    name: string;
    role: "community" | "asha" | "dho" | "authority";
  };
  onSignOut?: () => void;
}

const roleLabels = {
  community: "Community Member",
  asha: "ASHA Worker", 
  dho: "District Health Officer",
  authority: "Health Authority"
};

const roleColors = {
  community: "bg-secondary text-secondary-foreground",
  asha: "bg-primary text-primary-foreground",
  dho: "bg-warning text-warning-foreground", 
  authority: "bg-gradient-hero text-white"
};

export function Header({ currentUser, onSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-sm">NH</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">NeHealth</h1>
              <p className="text-xs text-muted-foreground">Northeast Health Platform</p>
            </div>
          </div>
        </div>

        {/* Language & User Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <LanguageSelector onLanguageChange={(lang) => console.log("Language changed:", lang)} />

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-alert rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <p className="font-medium text-foreground">{currentUser.name}</p>
                <Badge className={roleColors[currentUser.role]} variant="secondary">
                  {roleLabels[currentUser.role]}
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
              {onSignOut && (
                <Button variant="outline" size="sm" onClick={onSignOut}>
                  Sign Out
                </Button>
              )}
            </div>
          ) : (
            <Button variant="default">Login</Button>
          )}

          {/* Mobile Menu */}
          <Button variant="outline" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}