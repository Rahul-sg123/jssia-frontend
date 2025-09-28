import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Upload() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://jssia-backend.onrender.com';

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/subjects`);
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error('❌ Error fetching subjects:', err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    try {
      await axios.post(`${API_BASE}/api/subjects`, { name: newSubject.trim() });
      await fetchSubjects();
      setSubject(newSubject.trim());
      setNewSubject('');
      setAddingNew(false);
    } catch (err) {
      console.error('❌ Failed to add subject:', err);
      alert('❌ Failed to add subject.');
    }
  };

  const handleSubjectChange = (e) => {
    const selected = e.target.value;
    if (selected === '__add_new__') {
      setAddingNew(true);
      setSubject('');
    } else {
      setSubject(selected);
      setAddingNew(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !semester || files.length === 0) {
      return alert('⚠️ Please select subject, semester, and upload at least one file.');
    }

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('semester', semester);
    formData.append('description', description.trim());

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setMessage('✅ Paper submitted successfully!');
        setSubject('');
        setSemester('');
        setDescription('');
        setFiles([]);
        e.target.reset();
      } else {
        alert('❌ Upload failed: ' + res.data.message);
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300">
        Submit IA Paper
      </h2>

      {message && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block mb-1 font-medium dark:text-white">Subject</label>
          <select
            value={subject}
            onChange={handleSubjectChange}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="__add_new__">➕ Add new subject</option>
          </select>

          {addingNew && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter new subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Semester */}
        <div>
          <label className="block mb-1 font-medium dark:text-white">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium dark:text-white">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Files */}
        <div>
          <label className="block mb-1 font-medium dark:text-white">Upload Image(s) / PDF(s)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-100 file:text-purple-700
              hover:file:bg-purple-200
              dark:file:bg-gray-700 dark:file:text-purple-300
              dark:hover:file:bg-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Paper'}
        </button>
      </form>
    </div>
  );
}
