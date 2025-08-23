import { useNotificationStore } from "./notify";
import { BellAlertIcon } from "@heroicons/react/24/outline"; 

const NotificationDropdown = () => {
  const notifications = useNotificationStore((s) => s.notifications);

  return (
    <div className="absolute right-4 top-16 w-80 max-h-[400px] overflow-y-auto bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-indigo-700">Notifications</h3>
        <BellAlertIcon className="h-5 w-5 text-indigo-500" />
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm italic">You're all caught up.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li
              key={i}
              className="bg-indigo-50 hover:bg-indigo-100 transition rounded-md p-3 border border-indigo-100"
            >
              <div className="text-sm text-indigo-900 font-medium">{n.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(n.timestamp).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;