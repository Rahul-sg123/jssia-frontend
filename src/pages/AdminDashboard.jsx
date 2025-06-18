import { useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [papers, setPapers] = useState([]);
  const [auth, setAuth] = useState({ username: "", password: "" });
  const [authenticated, setAuthenticated] = useState(false);

  /* ──────────────────────────────────────────
     Fetch all papers after successful login
  ────────────────────────────────────────── */
  const fetchPapers = async () => {
    try {
      const res = await axios.get("https://jssia-backend.onrender.com/admin/papers", {
        headers: {
          username: auth.username,
          password: auth.password,
        },
      });
      setPapers(res.data);
      setAuthenticated(true);
    } catch (err) {
      alert("❌ Authentication failed");
    }
  };

  /* ──────────────────────────────────────────
     Delete a paper by ID (with confirm‑dialog)
  ────────────────────────────────────────── */
  const deletePaper = async (id) => {
    if (!window.confirm("Delete this paper and ALL its files?")) return;

    try {
      await axios.delete(`https://jssia-backend.onrender.com/admin/papers/${id}`, {
        headers: {
          username: auth.username,
          password: auth.password,
        },
      });
      setPapers(papers.filter((p) => p._id !== id));
    } catch (err) {
      alert("❌ Failed to delete paper");
    }
  };

  /* ──────────────────────────────────────────
     UI
  ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      {!authenticated ? (
        /* ── Login form ──────────────────────── */
        <div className="mx-auto max-w-sm space-y-4">
          <h1 className="mb-2 text-2xl font-bold">Admin Login</h1>

          <input
            type="text"
            placeholder="Username"
            className="w-full rounded bg-gray-700 p-2"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, username: e.target.value }))
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded bg-gray-700 p-2"
            onChange={(e) =>
              setAuth((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <button
            onClick={fetchPapers}
            className="w-full rounded bg-blue-600 p-2 hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        /* ── Dashboard ───────────────────────── */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <button
              onClick={() => {
                setAuthenticated(false);
                setAuth({ username: "", password: "" });
                setPapers([]);
              }}
              className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
            >
              Logout
            </button>
          </div>

          {papers.length === 0 ? (
            <p className="text-gray-400">No papers found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {papers.map((paper) => (
                <div
                  key={paper._id}
                  className="rounded-lg bg-gray-800 p-4 shadow"
                >
                  <p>
                    <strong>Subject:</strong> {paper.subject}
                  </p>
                  <p>
                    <strong>Semester:</strong> {paper.semester}
                  </p>
                  <p>
                    <strong>Description:</strong> {paper.description}
                  </p>

                  {/* File list */}
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-300">
                    {paper.files.map((file, idx) => (
                      <li key={idx}>
                        📄{" "}
                        {file?.url ? (
                          <a
                            href={`https://jssia-backend.onrender.com${file.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 underline"
                          >
                            {file.url.split("/").pop()}
                          </a>
                        ) : (
                          <span className="text-red-400">Missing file URL</span>
                        )}
                      </li>
                    ))}

                  </ul>

                  <button
                    onClick={() => deletePaper(paper._id)}
                    className="mt-3 rounded bg-red-600 px-4 py-2 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
