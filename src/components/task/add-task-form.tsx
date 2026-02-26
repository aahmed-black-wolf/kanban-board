import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import { MenuItem, Select, TextField } from '@mui/material';
import { Priority, Status } from '../../types';
import { useCreateTask } from '../../hooks/use-tasks';

interface AddTaskFormProps {
  status: Status;
  nextOrder: number;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ status, nextOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask.mutateAsync({ title, description, priority, status, order: nextOrder });
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setIsOpen(false);
  };

  return (
    <div className="mt-2">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-mono text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
          >
            <RiAddLine size={14} />
            Add task
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm space-y-2"
          >
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              InputProps={{ className: '!font-mono !text-sm' }}
            />
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              InputProps={{ className: '!font-mono !text-xs' }}
            />
            <Select
              size="small"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              fullWidth
              className="!font-mono !text-xs"
            >
              <MenuItem value="HIGH">HIGH</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="LOW">LOW</MenuItem>
            </Select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!title.trim() || createTask.isPending}
                className="flex-1 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-mono font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {createTask.isPending ? 'Adding...' : 'Add Task'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md transition-colors"
              >
                <RiCloseLine size={14} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
