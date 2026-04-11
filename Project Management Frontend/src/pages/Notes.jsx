import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjectMembers } from "../api/project.api";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/note.api";

const Notes = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ content: "" });
  const [createLoading, setCreateLoading] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [userRole, setUserRole] = useState(null);
  const isAdmin = userRole === "admin";

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getAllNotes(projectId);
      setNotes(res.data.data);
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const membersRes = await getProjectMembers(projectId);
        const currentMember = membersRes.data.data.find(
          (m) => m.user?._id === user?._id
        );
        setUserRole(currentMember?.role);
      } catch {}
    };
    fetchRole();
    fetchNotes();
  }, [projectId]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await createNote(projectId, newNote);
      setNewNote({ content: "" });
      setShowCreateForm(false);
      fetchNotes();
    } catch (err) {
      setError("Failed to create note");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateNote = async (noteId) => {
    setEditLoading(true);
    try {
      await updateNote(projectId, noteId, { content: editContent });
      setEditingNoteId(null);
      fetchNotes();
    } catch {
      setError("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(projectId, noteId);
      fetchNotes();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/70 backdrop-blur">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-400">Notes</span>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Project Notes</h2>
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
            >
              + New
            </button>
          )}
        </div>

        {/* Create */}
        {showCreateForm && (
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl mb-6">
            <form onSubmit={handleCreateNote} className="space-y-3">
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                rows={4}
                value={newNote.content}
                onChange={(e) => setNewNote({ content: e.target.value })}
                placeholder="Write your note..."
              />
              <div className="flex gap-2">
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm">
                  {createLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No notes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="group bg-gray-900 border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition"
              >
                {editingNoteId === note._id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateNote(note._id)}
                        className="bg-white text-black px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="text-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      {isAdmin && (
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => {
                              setEditingNoteId(note._id);
                              setEditContent(note.content);
                            }}
                            className="text-blue-400 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="text-red-400 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
