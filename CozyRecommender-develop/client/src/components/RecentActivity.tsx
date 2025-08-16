import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { Heart, Play, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  title: string;
  createdAt: string;
}

export default function RecentActivity() {
  const { user } = useAuthStore();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/activities', user?.id],
    enabled: !!user?.id,
  });

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'favorite':
        return <Heart className="text-white" size={16} />;
      case 'play':
        return <Play className="text-white" size={16} />;
      case 'bookmark':
        return <Bookmark className="text-white" size={16} />;
      default:
        return <Heart className="text-white" size={16} />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'favorite':
        return 'bg-gradient-to-br from-primary to-secondary';
      case 'play':
        return 'bg-gradient-to-br from-accent to-success';
      case 'bookmark':
        return 'bg-gradient-to-br from-secondary to-primary';
      default:
        return 'bg-gradient-to-br from-primary to-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {(activities as Activity[]).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          (activities as Activity[]).map((activity: Activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className={`w-10 h-10 ${getActivityColor(activity.action)} rounded-full flex items-center justify-center flex-shrink-0`}>
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.title}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
