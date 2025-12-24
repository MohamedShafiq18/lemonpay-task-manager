import { useState, useEffect } from "react";
import api from "../services/api";

export default function TaskModal({ isOpen, onClose, onSave, editTask }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.taskName);
      setDescription(editTask.description);
      const date = new Date(editTask.dueDate);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setDueDate(localDate.toISOString().slice(0, 16));
    } else {
      setTaskName('');
      setDescription('');
      setDueDate('');
    }
  }, [editTask, isOpen]);

  const handleSubmit = async () => {
    if (!taskName || !description || !dueDate) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, {
          taskName,
          description,
          dueDate
        });
        onSave(data, true);
      } else {
        const { data } = await api.post('/tasks', {
          taskName,
          description,
          dueDate
        });
        onSave(data, false);
      }
      setTaskName('');
      setDescription('');
      setDueDate('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editTask ? 'update' : 'add'} task`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {editTask ? 'Edit Task' : 'Add Task'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter Task Name"
            className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Date Picker"
            className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-700 font-medium py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}