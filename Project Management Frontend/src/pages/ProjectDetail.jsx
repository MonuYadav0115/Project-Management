import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task.api";
import {
  getProjectById,
  getProjectMembers,
} from "../api/project.api";
import {
  Plus,
  Trash2,
  ChevronLeft,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Circle,
  X,
  Layers,
  FolderOpen,
} from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
  });
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const isAdminOrProjectAdmin =
    userRole === "admin" || userRole === "project_admin";

  const fetchProject = async () => {
    try {
      const res = await getProjectById(projectId);
      setProject(res.data.data);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const fetchUserRole = async () => {
    try {
      const membersRes = await getProjectMembers(projectId);
      const members = membersRes.data.data;
      const currentMember = members.find(
        (m) => String(m.user?._id) === String(user?._id)
      );
      if (currentMember) {
        setUserRole(currentMember.role);
      } else {
        setUserRole("admin");
      }
    } catch (err) {
      setUserRole("admin");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getAllTasks(projectId);
      setTasks(res.data.data);
    } catch (err) {
      setError("Tasks load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUserRole();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError("");
    try {
      await createTask(projectId, newTask);
      setNewTask({ title: "", description: "", status: "todo" });
      setShowTaskForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status, e) => {
    e.stopPropagation();
    try {
      await updateTask(projectId, taskId, { status });
      fetchTasks();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (!window.confirm("Task delete karna chahte ho?")) return;
    try {
      await deleteTask(projectId, taskId);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task delete nahi hua");
    }
  };

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const statusConfig = {
    todo: {
      label: "Todo",
      color: "bg-gray-500/20 text-gray-300",
    },
    in_progress: {
      label: "In Progress",
      color: "bg-yellow-500/20 text-yellow-300",
    },
    done: {
      label: "Done",
      color: "bg-green-500/20 text-green-300",
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f1117" }}>

      {/* Navbar */}
      <nav
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/5"
        style={{ backgroundColor: "#1a1d27" }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition font-medium text-sm"
        >
          <ChevronLeft size={18} />
          Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/project/${projectId}/members`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium"
          >
            <Users size={16} />
            Members
          </button>
          <button
            onClick={() => navigate(`/project/${projectId}/notes`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium"
          >
            <FileText size={16} />
            Notes
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Project Info */}
        {project && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FolderOpen size={16} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{project.name}</h2>
            </div>
            <p className="text-gray-500 text-sm ml-12">
              {project.description || "No description"}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setFilterStatus(filterStatus === "todo" ? "all" : "todo")}
            className={`rounded-2xl p-4 border cursor-pointer transition hover:border-gray-500 ${
              filterStatus === "todo"
                ? "border-gray-400"
                : "border-white/5"
            }`}
            style={{ backgroundColor: "#1a1d27" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Circle size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Todo</span>
            </div>
            <p className="text-2xl font-bold text-white">{todoCount}</p>
          </div>

          <div
            onClick={() => setFilterStatus(filterStatus === "in_progress" ? "all" : "in_progress")}
            className={`rounded-2xl p-4 border cursor-pointer transition hover:border-yellow-500/50 ${
              filterStatus === "in_progress"
                ? "border-yellow-500/50"
                : "border-white/5"
            }`}
            style={{ backgroundColor: "#1a1d27" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-yellow-400" />
              <span className="text-xs font-medium text-gray-500">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-white">{inProgressCount}</p>
          </div>

          <div
            onClick={() => setFilterStatus(filterStatus === "done" ? "all" : "done")}
            className={`rounded-2xl p-4 border cursor-pointer transition hover:border-green-500/50 ${
              filterStatus === "done"
                ? "border-green-500/50"
                : "border-white/5"
            }`}
            style={{ backgroundColor: "#1a1d27" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-green-400" />
              <span className="text-xs font-medium text-gray-500">Done</span>
            </div>
            <p className="text-2xl font-bold text-white">{doneCount}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 flex items-center justify-between border border-red-500/20">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Tasks Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Tasks</h3>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-xs text-indigo-400 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          {isAdminOrProjectAdmin && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
            >
              <Plus size={16} />
              New Task
            </button>
          )}
        </div>

        {/* Create Task Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div
              className="rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10"
              style={{ backgroundColor: "#1a1d27" }}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white">New Task</h3>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Task title"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                    style={{ backgroundColor: "#0f1117" }}
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Description
                    <span className="text-gray-600 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="Task description"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10 resize-none"
                    style={{ backgroundColor: "#0f1117" }}
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Status
                  </label>
                  <select
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                    style={{ backgroundColor: "#0f1117" }}
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                  >
                    <option value="todo" style={{ backgroundColor: "#0f1117" }}>Todo</option>
                    <option value="in_progress" style={{ backgroundColor: "#0f1117" }}>In Progress</option>
                    <option value="done" style={{ backgroundColor: "#0f1117" }}>Done</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
                  >
                    {createLoading ? "Creating..." : "Create Task"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1 text-gray-300 py-2.5 rounded-xl font-medium transition text-sm border border-white/10 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 border border-white/5 animate-pulse"
                style={{ backgroundColor: "#1a1d27" }}
              >
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers size={28} className="text-indigo-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {filterStatus === "all"
                ? "No tasks yet"
                : `No ${filterStatus}  tasks yet`}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {filterStatus === "all"
                ? "Create your first task!"
                : "Clear the filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() =>
                  navigate(`/project/${projectId}/tasks/${task._id}`)
                }
                className="p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                style={{ backgroundColor: "#1a1d27" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-indigo-400 transition text-sm">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    {task.subtasks?.length > 0 && (
                      <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                        <Layers size={11} />
                        {task.subtasks.length} subtasks
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <select
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border-0 cursor-pointer ${
                        statusConfig[task.status]?.color
                      }`}
                      style={{ backgroundColor: "transparent" }}
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value, e)
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="todo" style={{ backgroundColor: "#1a1d27" }}>Todo</option>
                      <option value="in_progress" style={{ backgroundColor: "#1a1d27" }}>In Progress</option>
                      <option value="done" style={{ backgroundColor: "#1a1d27" }}>Done</option>
                    </select>

                    {isAdminOrProjectAdmin && (
                      <button
                        onClick={(e) => handleDeleteTask(task._id, e)}
                        className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;