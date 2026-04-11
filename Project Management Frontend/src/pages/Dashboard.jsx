import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllProjects, createProject } from "../api/project.api";
import { logoutUser } from "../api/auth.api";
import { FolderOpen, Plus, LogOut, Users, ChevronRight, X } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllProjects();
      setProjects(res.data.data);
    } catch (err) {
      setError("Projects load nahi hue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {}
    logout();
    navigate("/login");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError("");
    try {
      await createProject(newProject);
      setNewProject({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Project create nahi hua");
    } finally {
      setCreateLoading(false);
    }
  };

  const roleColor = (role) => {
    if (role === "admin") return "bg-purple-500/10 text-purple-400";
    if (role === "project_admin") return "bg-blue-500/10 text-blue-400";
    return "bg-gray-500/10 text-gray-400";
  };

  const getInitials = (name) => {
    if (!name) return "P";
    return name.slice(0, 2).toUpperCase();
  };

  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-500",
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <FolderOpen size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white">Project Camp</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold">
                {user.fullName?.[0]?.toUpperCase() ||
                  user.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-400 font-medium">
                {user.fullName || user.username}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition text-sm px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">My Projects</h2>
            <p className="text-gray-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-white">
                  Create New Project
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white/20 outline-none"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  required
                />

                <textarea
                  placeholder="Description (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white/20 outline-none resize-none"
                  rows="3"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 bg-white text-black py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
                  >
                    {createLoading ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-white/10 text-gray-300 py-2.5 rounded-xl hover:bg-white/20 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((item, index) => (
              <div
                key={item.project?._id}
                onClick={() => navigate(`/project/${item.project?._id}`)}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white text-sm font-bold`}>
                    {getInitials(item.project?.name)}
                  </div>
                  <ChevronRight className="text-gray-500 group-hover:text-white" size={18} />
                </div>

                <h3 className="text-white font-semibold text-base">
                  {item.project?.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1 mb-4">
                  {item.project?.description || "No description"}
                </p>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users size={13} />
                    {item.project?.members || 0}
                  </div>
                  <span className={`px-2 py-1 rounded-full ${roleColor(item.role)}`}>
                    {item.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;