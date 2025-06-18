import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubjectSemesterSelect({
  subject,
  setSubject,
  semester,
  setSemester,
  allowAdd = false,
}) {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('https://jssia-backend.onrender.com/api/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      await axios.post('https://jssia-backend.onrender.com/api/subjects', { name: newSubject });
      setNewSubject('');
      fetchSubjects(); // Refresh list
      setSubject(newSubject); // Set the newly added subject as selected
    } catch (err) {
      console.error('Error adding subject:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Subject Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded p-2 max-h-40 overflow-y-auto"
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Add subject input */}
        {allowAdd && (
          <div className="flex mt-2 gap-2">
            <input
              type="text"
              placeholder="Add new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="flex-1 border rounded p-2"
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

      {/* Semester Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Select semester</option>
          {['1', '2', '3', '4', '5', '6','7','8'].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
