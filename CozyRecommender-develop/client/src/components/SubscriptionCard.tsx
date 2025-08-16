import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Crown, Check } from "lucide-react";

export default function SubscriptionCard() {
  const { user } = useAuthStore();
  const isPremium = user?.subscription === "premium";

  const features = [
    "Unlimited recommendations",
    "Advanced AI insights", 
    "Personalized mood matching",
    "Priority support",
    "All mood varieties",
    "Enhanced discovery algorithms"
  ];

  return (
    <div className="bg-subscription-gradient rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center">
              <Crown className="text-white" size={12} />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </span>
            {isPremium && (
              <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-3">
            {isPremium 
              ? "Full access to all features with 1-week free trial, then $1/month"
              : "Free trial includes all features for 1 week"
            }
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center space-x-2">
                <Check className={isPremium || index < 2 ? "text-success" : "text-gray-300"} size={16} />
                <span className={`${isPremium || index < 2 ? "text-gray-600" : "text-gray-400"}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
          {isPremium && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Next billing: <span className="font-medium text-gray-700">March 15, 2024</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center md:items-end space-y-3">
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold text-gray-800">
              {isPremium ? "$1.00" : "Free Trial"}
              {isPremium && <span className="text-sm font-normal text-gray-500">/month</span>}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isPremium ? "After 1-week free trial" : "7 days, then $1/month"}
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Manage Plan
            </Button>
            <Button 
              size="sm"
              className="px-4 py-2 bg-gradient-to-r from-success to-primary text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              {isPremium ? "Continue Plan" : "Start Free Trial"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
