import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '' });

  useEffect(() => {
    if (editingTask) {
      const deadline = editingTask.deadline ? new Date(editingTask.deadline) : null;
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        date: deadline ? deadline.toISOString().slice(0, 10) : '',
        time: deadline ? deadline.toISOString().slice(11, 16) : '',
      });
    } else {
      setFormData({ title: '', description: '', date: '', time: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine date and time into ISO string
    const deadline = formData.date && formData.time
      ? new Date(`${formData.date}T${formData.time}`).toISOString()
      : '';
    const payload = {
      title: formData.title,
      description: formData.description,
      deadline,
    };
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', description: '', date: '', time: '' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Appointment' : 'Create Appointment'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="flex mb-4 gap-2">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-1/2 p-2 border rounded"
        />
        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-1/2 p-2 border rounded"
        >
          <option value="">Select time</option>
          {Array.from({ length: 24 }).map((_, hour) =>
            [0, 15, 30, 45].map((min) => {
              const h = hour.toString().padStart(2, '0');
              const m = min.toString().padStart(2, '0');
              const val = `${h}:${m}`;
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })
          )}
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTask ? 'Update Appointment' : 'Create appointment'}
      </button>
    </form>
  );
};

export default TaskForm;
