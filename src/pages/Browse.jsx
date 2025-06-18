import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Browse() {
  const [subjects, setSubjects] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Load subjects
  useEffect(() => {
    axios.get('https://jssia-backend.onrender.com/api/subjects')
      .then(res => setSubjects(res.data.subjects))
      .catch(err => console.error('Subjects load error:', err));
  }, []);

  // Load papers based on selected filters
  useEffect(() => {
    if (!selectedSubject || !selectedSemester) {
      setPapers([]);
      return;
    }

    axios.get('https://jssia-backend.onrender.com/papers', {
      params: {
        subject: selectedSubject?.toLowerCase(),
        semester: selectedSemester
      }
    })
      .then(res => setPapers(res.data))
      .catch(err => console.error('Papers load error:', err));
  }, [selectedSubject, selectedSemester]);

  // Handle voting
  // Browse.jsx
  const vote = async (paperId, fileIndex, type) => {
    try {
      await axios.put(
        `https://jssia-backend.onrender.com/papers/${paperId}/files/${fileIndex}/${type}`
      );

      // refresh list
      const res = await axios.get('https://jssia-backend.onrender.com/papers', {
        params: {
          subject: selectedSubject.toLowerCase(),
          semester: selectedSemester
        }
      });
      setPapers(res.data);
    } catch (err) {
      console.error('Vote error:', err);
    }
  };




  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
        <select
          className="w-full border border-purple-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
        <select
          className="w-full border border-purple-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <option key={n} value={n.toString()}>Semester {n}</option>
          ))}
        </select>
      </div>




      {/* Papers */}
      {papers.length === 0 ? (
        <p className="text-gray-500">No papers found.</p>
      ) : (
        papers.map(paper => (
          <div key={paper._id} className="border rounded-lg p-4 mb-6 shadow">
            <h2 className="text-xl font-semibold mb-2">
              {paper.subject} — Sem {paper.semester}
            </h2>
            {paper.description && (
              <p className="text-gray-600 mb-4">{paper.description}</p>
            )}

            {Array.isArray(paper.files) && paper.files.length > 0 && (
              paper.files.map((f, idx) => (
                <div key={idx} className="mb-4 border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        onClick={() => setPreviewUrl(`https://jssia-backend.onrender.com${f.url}`)}
                      >
                        📄 View
                      </button>
                      <a
                        href={`https://jssia-backend.onrender.com${f.url}`}
                        download
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        ⬇ Download
                      </a>
                    </div>

                    <div className="flex gap-2 text-sm mt-2 sm:mt-0">
  <button
    onClick={() => {
      const voteKey = `${paper._id}-${idx}-upvoted`;
      if (localStorage.getItem(voteKey)) {
        alert("You've already liked this file.");
        return;
      }
      vote(paper._id, idx, 'upvote');
      localStorage.setItem(voteKey, 'true');
    }}
    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
  >
    👍 {f.upvotes}
  </button>

  <button
    onClick={() => {
      const voteKey = `${paper._id}-${idx}-downvoted`;
      if (localStorage.getItem(voteKey)) {
        alert("You've already disliked this file.");
        return;
      }
      const confirm = window.confirm("Are you sure you want to dislike this file?");
      if (confirm) {
        vote(paper._id, idx, 'downvote');
        localStorage.setItem(voteKey, 'true');
      }
    }}
    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
  >
    👎 {f.downvotes}
  </button>
</div>

                  </div>
                </div>
              ))
            )}

          </div>
        ))
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded shadow">
            <button
              className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => setPreviewUrl(null)}
            >
              ✖ Close
            </button>
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
