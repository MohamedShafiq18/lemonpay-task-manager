import { useState,useEffect } from "react";
import api from "../services/api";
import TaskModal from "../Components/TaskModal";

export default function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          sessionStorage.removeItem('token');
          onLogout();
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    await loadTasks();
    handleCloseModal();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setMenuOpen(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      setMenuOpen(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">
          {error}
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden md:block p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700">Tasks Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              + Add Task
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700">Task</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-indigo-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No tasks found. Add your first task!
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, index) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(task.dueDate).toLocaleDateString('en-GB')} {new Date(task.dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{task.taskName}</td>
                      <td className="px-6 py-4 text-gray-600">{task.description}</td>
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === task._id ? null : task._id)}
                          className="text-gray-600 hover:text-gray-900 font-bold text-xl"
                        >
                          ⋮
                        </button>
                        {menuOpen === task._id && (
                          <div className="absolute right-8 top-12 bg-white shadow-lg rounded-lg py-2 z-10 min-w-[100px]">
                            <button 
                              onClick={() => handleEditTask(task)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {tasks.length > 0 && (
              <div className="flex justify-center items-center gap-2 py-6">
                <button className="px-3 py-1 hover:bg-gray-100 rounded">&lt;</button>
                {[1, 2, 3, 4, 5, 6].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 hover:bg-gray-100 rounded">&gt;</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-indigo-700">Tasks Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full text-sm"
          >
            + Add Task
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full text-sm"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No tasks found. Add your first task!
            </div>
          ) : (
            tasks.map((task, index) => (
              <div key={task._id} className="bg-white rounded-xl p-4 shadow-sm relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === task._id ? null : task._id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
                >
                  ⋮
                </button>
                {menuOpen === task._id && (
                  <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg py-2 z-10 min-w-[100px]">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-1 pr-8">{task.taskName}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString('en-GB')} {new Date(task.dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button className="px-3 py-1 hover:bg-gray-100 rounded">&lt;</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded">&gt;</button>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        editTask={editingTask}
      />
    </div>
  );
}