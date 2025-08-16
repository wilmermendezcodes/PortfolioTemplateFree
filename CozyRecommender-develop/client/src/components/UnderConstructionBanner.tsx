import { AlertTriangle, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UnderConstructionBanner() {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 mb-4">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
        <Wrench className="h-4 w-4" />
        <span className="font-medium">Under Construction:</span>
        This site is currently being developed. Some features may not work as expected.
      </AlertDescription>
    </Alert>
  );
}