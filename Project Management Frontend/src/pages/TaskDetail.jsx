import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getTaskById,
  updateTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  uploadTaskAttachment,
} from "../api/task.api";
import { getProjectMembers } from "../api/project.api";
import {
  ChevronLeft,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Circle,
  Paperclip,
  CheckSquare,
  Square,
  FileText,
} from "lucide-react";

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [newSubTask, setNewSubTask] = useState({ title: "" });
  const [subTaskLoading, setSubTaskLoading] = useState(false);

  const [showFileForm, setShowFileForm] = useState(false);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  const [userRole, setUserRole] = useState(null);

  const isAdminOrProjectAdmin =
    userRole === "admin" || userRole === "project_admin";

  const fetchTask = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTaskById(projectId, taskId);
      setTask(res.data.data);
    } catch (err) {
      setError("Task load nahi hua");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchTask();
    fetchUserRole();
  }, [taskId]);

  const handleStatusChange = async (status) => {
    try {
      await updateTask(projectId, taskId, { status });
      fetchTask();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleCreateSubTask = async (e) => {
    e.preventDefault();
    setSubTaskLoading(true);
    setError("");
    try {
      await createSubTask(projectId, taskId, newSubTask);
      setNewSubTask({ title: "" });
      setShowSubTaskForm(false);
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubTaskLoading(false);
    }
  };

  const handleToggleSubTask = async (subTaskId, isCompleted) => {
    try {
      await updateSubTask(projectId, subTaskId, {
        isCompleted: !isCompleted,
      });
      fetchTask();
    } catch (err) {
      setError("Subtask update nahi hua");
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    if (!window.confirm("Subtask delete karna chahte ho?")) return;
    try {
      await deleteSubTask(projectId, subTaskId);
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || "Subtask delete nahi hua");
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setFileLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("attachments", file);
      await uploadTaskAttachment(projectId, taskId, formData);
      setFile(null);
      setShowFileForm(false);
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || "File upload nahi hua");
    } finally {
      setFileLoading(false);
    }
  };

  const completedSubTasks =
    task?.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubTasks = task?.subtasks?.length || 0;
  const progressPercent =
    totalSubTasks > 0
      ? Math.round((completedSubTasks / totalSubTasks) * 100)
      : 0;

  const statusConfig = {
    todo: { label: "Todo", color: "bg-gray-500/20 text-gray-300" },
    in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-300" },
    done: { label: "Done", color: "bg-green-500/20 text-green-300" },
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0f1117" }}>
        <nav
          className="px-6 py-4 border-b border-white/5"
          style={{ backgroundColor: "#1a1d27" }}
        >
          <div className="h-5 bg-white/10 rounded w-32 animate-pulse" />
        </nav>
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border border-white/5 animate-pulse"
              style={{ backgroundColor: "#1a1d27" }}
            >
              <div className="h-5 bg-white/10 rounded w-1/2 mb-3" />
              <div className="h-3 bg-white/10 rounded w-full mb-2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0f1117" }}
      >
        <div className="text-center">
          <p className="text-red-400 font-medium">No task was assigned</p>
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="mt-4 text-indigo-400 hover:underline text-sm"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f1117" }}>

      {/* Navbar */}
      <nav
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/5"
        style={{ backgroundColor: "#1a1d27" }}
      >
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition font-medium text-sm"
        >
          <ChevronLeft size={18} />
          Back to Project
        </button>
        <span className="text-sm text-gray-600 font-medium">Task Detail</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl flex items-center justify-between border border-red-500/20">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Task Info Card */}
        <div
          className="rounded-2xl border border-white/5 p-6"
          style={{ backgroundColor: "#1a1d27" }}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{task.title}</h2>
              {task.description && (
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                  {task.description}
                </p>
              )}
              {task.assignedTo && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                    {task.assignedTo?.fullName?.[0]?.toUpperCase() ||
                      task.assignedTo?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-500">
                    {task.assignedTo?.fullName || task.assignedTo?.username}
                  </span>
                </div>
              )}
            </div>

            {/* Status Selector */}
            <select
              className={`text-xs px-3 py-1.5 rounded-xl font-medium border-0 cursor-pointer ${statusConfig[task.status]?.color}`}
              style={{ backgroundColor: "transparent" }}
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="todo" style={{ backgroundColor: "#1a1d27" }}>Todo</option>
              <option value="in_progress" style={{ backgroundColor: "#1a1d27" }}>In Progress</option>
              <option value="done" style={{ backgroundColor: "#1a1d27" }}>Done</option>
            </select>
          </div>
        </div>

        {/* Subtasks Card */}
        <div
          className="rounded-2xl border border-white/5 p-6"
          style={{ backgroundColor: "#1a1d27" }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-indigo-400" />
              <h3 className="font-bold text-white">Subtasks</h3>
              <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                {completedSubTasks}/{totalSubTasks}
              </span>
            </div>
            {isAdminOrProjectAdmin && (
              <button
                onClick={() => setShowSubTaskForm(!showSubTaskForm)}
                className="flex items-center gap-1.5 text-indigo-400 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition text-sm font-medium"
              >
                <Plus size={15} />
                Add
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {totalSubTasks > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>Progress</span>
                <span className="font-medium text-indigo-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Subtask Form */}
          {showSubTaskForm && (
            <form onSubmit={handleCreateSubTask} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Subtask title"
                className="flex-1 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white border border-white/10"
                style={{ backgroundColor: "#0f1117" }}
                value={newSubTask.title}
                onChange={(e) => setNewSubTask({ title: e.target.value })}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={subTaskLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition font-medium"
              >
                {subTaskLoading ? "..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowSubTaskForm(false)}
                className="text-gray-400 px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition border border-white/10"
              >
                <X size={16} />
              </button>
            </form>
          )}

          {/* Subtasks List */}
          {task.subtasks?.length === 0 ? (
            <div className="text-center py-6">
              <Square size={24} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">There are no subtasks at the moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div
                  key={subtask._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition group"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() =>
                      handleToggleSubTask(subtask._id, subtask.isCompleted)
                    }
                  >
                    {subtask.isCompleted ? (
                      <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        subtask.isCompleted
                          ? "line-through text-gray-600"
                          : "text-gray-300"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                  {isAdminOrProjectAdmin && (
                    <button
                      onClick={() => handleDeleteSubTask(subtask._id)}
                      className="text-gray-700 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments Card */}
        <div
          className="rounded-2xl border border-white/5 p-6"
          style={{ backgroundColor: "#1a1d27" }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Paperclip size={18} className="text-indigo-400" />
              <h3 className="font-bold text-white">Attachments</h3>
              {task.attachments?.length > 0 && (
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                  {task.attachments.length}
                </span>
              )}
            </div>
            {isAdminOrProjectAdmin && (
              <button
                onClick={() => setShowFileForm(!showFileForm)}
                className="flex items-center gap-1.5 text-indigo-400 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition text-sm font-medium"
              >
                <Plus size={15} />
                Add File
              </button>
            )}
          </div>

          {/* File Upload Form */}
          {showFileForm && (
            <form onSubmit={handleFileUpload} className="flex gap-2 mb-4">
              <input
                type="file"
                className="flex-1 rounded-xl px-3 py-2 text-sm text-gray-400 border border-white/10 focus:outline-none"
                style={{ backgroundColor: "#0f1117" }}
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button
                type="submit"
                disabled={fileLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition font-medium"
              >
                {fileLoading ? "..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFileForm(false);
                  setFile(null);
                }}
                className="text-gray-400 px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition border border-white/10"
              >
                <X size={16} />
              </button>
            </form>
          )}

          {/* Attachments List */}
          {!task.attachments?.length ? (
            <div className="text-center py-6">
              <FileText size={24} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">There are no attachments</p>
            </div>
          ) : (
            <div className="space-y-2">
              {task.attachments?.map((file, index) => (
                
                 <a key={index}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition group"
                >
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Paperclip size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-indigo-400 font-medium truncate">
                      {file.url?.split("/").pop()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {file.mimeType}
                      {file.size ? ` — ${Math.round(file.size / 1024)} KB` : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;