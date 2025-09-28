import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Browse() {
  const [subjects, setSubjects] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE = 'https://jssia-backend.onrender.com';

  // Load subjects
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/subjects`)
      .then((res) => setSubjects(res.data.subjects || []))
      .catch((err) => console.error('❌ Subjects load error:', err));
  }, []);

  // Load papers whenever filters change
  useEffect(() => {
    if (!selectedSubject || !selectedSemester) {
      setPapers([]);
      return;
    }

    axios
      .get(`${API_BASE}/papers`, {
        params: { subject: selectedSubject, semester: selectedSemester },
      })
      .then((res) => {
        // Only keep files with Cloudinary URLs
        const sanitized = (res.data || []).map((p) => ({
          ...p,
          files: Array.isArray(p.files)
            ? p.files.filter((f) => f.url?.startsWith('http'))
            : [],
        }));
        setPapers(sanitized);
      })
      .catch((err) => console.error('❌ Papers load error:', err));
  }, [selectedSubject, selectedSemester]);

  // Voting function
  const vote = async (paperId, fileIndex, type) => {
    try {
      await axios.put(`${API_BASE}/papers/${paperId}/files/${fileIndex}/${type}`);

      // Refresh papers after vote
      const res = await axios.get(`${API_BASE}/papers`, {
        params: { subject: selectedSubject, semester: selectedSemester },
      });

      const sanitized = (res.data || []).map((p) => ({
        ...p,
        files: Array.isArray(p.files)
          ? p.files.filter((f) => f.url?.startsWith('http'))
          : [],
      }));

      setPapers(sanitized);
    } catch (err) {
      console.error('❌ Vote error:', err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Subject
          </label>
          <select
            className="w-full border border-purple-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Semester
          </label>
          <select
            className="w-full border border-purple-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n.toString()}>
                Semester {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Papers */}
      {papers.length === 0 ? (
        <p className="text-gray-500 mt-4">No papers found for selected filters.</p>
      ) : (
        papers.map((paper) => (
          <div key={paper._id} className="border rounded-lg p-4 shadow bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2">
              {paper.subject} — Sem {paper.semester}
            </h2>
            {paper.description && <p className="text-gray-600 mb-4">{paper.description}</p>}

            {paper.files.map((f, idx) => (
              <div
                key={idx}
                className="mb-4 border rounded-lg overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
                  {/* File actions */}
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                      onClick={() => setPreviewUrl(f.url)}
                    >
                      📄 View
                    </button>
                    <a
                      href={f.url}
                      download
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      ⬇ Download
                    </a>
                  </div>

                  {/* Voting */}
                  <div className="flex gap-2 text-sm mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        const key = `${paper._id}-${idx}-upvoted`;
                        if (localStorage.getItem(key)) {
                          alert("You've already liked this file.");
                          return;
                        }
                        vote(paper._id, idx, 'upvote');
                        localStorage.setItem(key, 'true');
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    >
                      👍 {f.upvotes}
                    </button>

                    <button
                      onClick={() => {
                        const key = `${paper._id}-${idx}-downvoted`;
                        if (localStorage.getItem(key)) {
                          alert("You've already disliked this file.");
                          return;
                        }
                        if (window.confirm('Are you sure you want to dislike this file?')) {
                          vote(paper._id, idx, 'downvote');
                          localStorage.setItem(key, 'true');
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      👎 {f.downvotes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white dark:bg-gray-900 rounded shadow">
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
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}
