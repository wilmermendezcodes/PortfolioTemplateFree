import { AlertTriangle, Shield, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DevelopmentDataNotice() {
  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 mb-4">
      <Shield className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <div className="flex items-start gap-2">
          <Database className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Development Notice:</span>
            <p className="mt-1 text-sm">
              This is a development environment. No personal information or usernames are collected. 
              All data is for testing purposes and may be reset during development.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}