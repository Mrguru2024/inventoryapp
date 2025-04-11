import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheck,
  faXmark,
  faExclamation,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

interface ReqStatusBadgeProps {
  status: "pending" | "approved" | "denied" | "error" | "fulfilled";
  darkMode?: boolean;
  className?: string;
  tooltip?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: faClock,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    darkBgColor: "dark:bg-yellow-900",
    darkTextColor: "dark:text-yellow-200",
  },
  approved: {
    label: "Approved",
    icon: faCheck,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    darkBgColor: "dark:bg-green-900",
    darkTextColor: "dark:text-green-200",
  },
  denied: {
    label: "Denied",
    icon: faXmark,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    darkBgColor: "dark:bg-red-900",
    darkTextColor: "dark:text-red-200",
  },
  error: {
    label: "Error",
    icon: faExclamation,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    darkBgColor: "dark:bg-red-900",
    darkTextColor: "dark:text-red-200",
  },
  fulfilled: {
    label: "Fulfilled",
    icon: faBox,
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    darkBgColor: "dark:bg-blue-900",
    darkTextColor: "dark:text-blue-200",
  },
};

export default function ReqStatusBadge({
  status,
  darkMode = false,
  className = "",
  tooltip,
}: ReqStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      data-testid="status-badge"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        darkMode ? config.darkBgColor : config.bgColor
      } ${darkMode ? config.darkTextColor : config.textColor} ${className}`}
      title={tooltip}
    >
      <FontAwesomeIcon
        data-testid="status-icon"
        icon={config.icon}
        className="mr-1.5 h-3.5 w-3.5"
      />
      {config.label}
    </div>
  );
}
