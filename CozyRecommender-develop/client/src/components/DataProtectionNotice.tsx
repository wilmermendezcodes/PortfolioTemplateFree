import { Shield, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DataProtectionNoticeProps {
  onClearData?: () => void;
}

export function DataProtectionNotice({ onClearData }: DataProtectionNoticeProps) {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <div className="space-y-2">
            <div className="font-medium">Development Environment - Data Protection</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>No personal information or usernames collected - completely anonymous</li>
              <li>All data is stored locally for testing purposes only</li>
              <li>Data may be reset during development cycles</li>
              <li>No production-level security measures are active</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="font-medium">Anonymous Development Mode:</div>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Complete anonymous usage - no personal data entry required</li>
                <li>Data will be cleared periodically during development</li>
              </ul>
            </div>
            {onClearData && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearData}
                className="ml-4 flex-shrink-0"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Data
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}