"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { DirectoryConsultant } from "@/app/actions";

interface MapViewProps {
  consultants: DirectoryConsultant[];
  onConsultantClick?: (consultant: DirectoryConsultant) => void;
}

export function DirectoryMapView({ consultants, onConsultantClick }: MapViewProps) {
  // Group consultants by location for clustering
  const locationGroups = consultants.reduce((acc, consultant) => {
    const key = `${consultant.city || ""}-${consultant.state || ""}-${consultant.country || ""}`.trim();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(consultant);
    return acc;
  }, {} as Record<string, DirectoryConsultant[]>);

  const locations = Object.entries(locationGroups);

  return (
    <div className="relative h-[600px] w-full rounded-lg border bg-muted/30 overflow-hidden">
      {/* Placeholder map - Replace with Leaflet or Google Maps */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="text-center p-8">
          <MapPin className="mx-auto h-16 w-16 mb-4 text-primary/40" />
          <p className="text-lg font-semibold mb-2">Interactive Map View</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Map integration ready. To enable, add a mapping library (Leaflet, Google Maps, or Mapbox) and geocode consultant addresses.
          </p>
          
          {/* Location clusters preview */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
            {locations.slice(0, 9).map(([location, consultants]) => (
              <Card
                key={location}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onConsultantClick?.(consultants[0])}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{location || "Unknown"}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {consultants.length} consultant{consultants.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {locations.length > 9 && (
            <p className="text-xs text-muted-foreground mt-4">
              +{locations.length - 9} more locations
            </p>
          )}

          <div className="mt-6 p-4 bg-background/80 rounded-lg border text-left max-w-md mx-auto">
            <p className="text-xs font-semibold mb-2">Implementation Steps:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Install mapping library: <code className="bg-muted px-1 rounded">npm install leaflet react-leaflet</code></li>
              <li>Geocode consultant addresses (city/state) to lat/lng</li>
              <li>Add map component with markers/clusters</li>
              <li>Enable click-to-filter by location</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Map overlay for future implementation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Future: Leaflet/Google Maps component will go here */}
      </div>
    </div>
  );
}
