import React from "react";
import { Priority, PRIORITY_COLORS } from "../../types";

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colors = PRIORITY_COLORS[priority];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold tracking-wider"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {priority}
    </span>
  );
};
