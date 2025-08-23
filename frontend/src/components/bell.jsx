import { useState } from "react";
import { useNotificationStore } from "./notify";
import NotificationDropdown from "./NotificationDropdown";
import { BellIcon } from "@heroicons/react/24/outline"; 

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const hasNew = useNotificationStore((s) => s.hasNew);
  const markAsSeen = useNotificationStore((s) => s.markAsSeen);

  const toggleDropdown = () => {
    setOpen(!open);
    if (hasNew) markAsSeen();
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <BellIcon className={`h-6 w-6 ${hasNew ? "text-red-500" : "text-gray-600"}`} />
        {hasNew && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </button>
      {open && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;