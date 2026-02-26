import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { RiSearchLine, RiDashboard3Line } from "react-icons/ri";
import { useQueries } from "@tanstack/react-query";
import { useBoardStore } from "../../store/use-board-store";
import { useDebounce } from "../../hooks/use-debounce";
import { COLUMNS, Status, Task } from "../../types";
import { taskService } from "../../services/task-service";

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useBoardStore();

  const [inputValue, setInputValue] = React.useState(searchQuery);
  const debouncedValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // Subscribe to the same query keys the columns use — shares their cache, no extra requests
  const results = useQueries({
    queries: COLUMNS.map((col) => ({
      queryKey: ["tasks", col.id as Status],
      queryFn: () => taskService.getByStatus(col.id as Status),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const totalTasks = results.reduce(
    (sum, r) =>
      sum + ((r.data as { data: Task[] } | undefined)?.data.length ?? 0),
    0,
  );

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <RiDashboard3Line className="text-white" size={18} />
        </div>
        <div>
          <h1 className="font-mono font-bold text-sm tracking-wider text-gray-800 uppercase">
            Kanban Board
          </h1>
          <p className="font-mono text-xs text-gray-400">{totalTasks} tasks</p>
        </div>
      </div>

      <div className="w-72 max-w-sm">
        <TextField
          size="small"
          fullWidth
          placeholder="Search tasks..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine className="text-gray-400" size={16} />
              </InputAdornment>
            ),
            className: "!font-mono !text-sm !rounded-lg",
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8f9fa",
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#d1d5db" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
          }}
        />
      </div>
    </header>
  );
};
