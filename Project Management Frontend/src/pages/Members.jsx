import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getProjectMembers,
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
} from "../api/project.api";
import {
  ChevronLeft,
  Plus,
  X,
  UserMinus,
  Shield,
  User,
  Crown,
  Users,
} from "lucide-react";

const Members = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    role: "member",
  });
  const [userRole, setUserRole] = useState(null);

  const isAdmin = userRole === "admin";

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProjectMembers(projectId);
      setMembers(res.data.data);
      const currentMember = res.data.data.find(
        (m) => String(m.user?._id) === String(user?._id)
      );
      if (currentMember) {
        setUserRole(currentMember.role);
      } else {
        setUserRole("admin");
      }
    } catch (err) {
      setError("Members load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");
    try {
      await addProjectMember(projectId, newMember);
      setNewMember({ email: "", role: "member" });
      setShowAddForm(false);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateMemberRole(projectId, userId, { newRole: role });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Role update nahi hua");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Member ko remove karna chahte ho?")) return;
    try {
      await removeProjectMember(projectId, userId);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Member remove nahi hua");
    }
  };

  const roleConfig = {
    admin: {
      label: "Admin",
      color: "bg-purple-500/20 text-purple-300",
      icon: <Crown size={13} />,
    },
    project_admin: {
      label: "Project Admin",
      color: "bg-blue-500/20 text-blue-300",
      icon: <Shield size={13} />,
    },
    member: {
      label: "Member",
      color: "bg-gray-500/20 text-gray-300",
      icon: <User size={13} />,
    },
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors = [
    "bg-purple-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-orange-600",
    "bg-pink-600",
    "bg-teal-600",
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0f1117" }}>

      {/* Sidebar */}
      <div
        className="w-64 flex-shrink-0 flex flex-col py-6 px-4"
        style={{ backgroundColor: "#1a1d27" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-base">Members</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm px-2 py-2 rounded-lg hover:bg-white/5 mb-4"
        >
          <ChevronLeft size={16} />
          Back to Project
        </button>

        {/* Add Member Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition font-medium text-sm mt-2"
          >
            <Plus size={16} />
            Add Member
          </button>
        )}

        {/* Member count */}
        <div className="mt-auto px-2">
          <p className="text-gray-500 text-xs">
            {members.length} member{members.length !== 1 ? "s" : ""} total
          </p>
          <p className="text-gray-600 text-xs mt-1">Manage your team</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Team Members</h2>
          <p className="text-gray-500 text-sm mt-1">Manage roles & access</p>
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

        {/* Add Member Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div
              className="rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10"
              style={{ backgroundColor: "#1a1d27" }}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white">
                  Add New Member
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMember({ email: "", role: "member" });
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter member email"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                    style={{ backgroundColor: "#0f1117" }}
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Role
                  </label>
                  <select
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                    style={{ backgroundColor: "#0f1117" }}
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({ ...newMember, role: e.target.value })
                    }
                  >
                    <option value="member">Member</option>
                    <option value="project_admin">Project Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
                  >
                    {addLoading ? "Adding..." : "Add Member"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMember({ email: "", role: "member" });
                    }}
                    className="flex-1 text-gray-300 py-2.5 rounded-xl font-medium transition text-sm border border-white/10 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Members List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 flex items-center gap-4 animate-pulse border border-white/5"
                style={{ backgroundColor: "#1a1d27" }}
              >
                <div className="w-11 h-11 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-indigo-400" />
            </div>
            <p className="text-gray-400 font-medium">There are no members</p>
            <p className="text-gray-600 text-sm mt-1">
              Invite them using the ‘Add Member’ option
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member, index) => (
              <div
                key={member.user?._id}
                className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200 flex items-center justify-between group"
                style={{ backgroundColor: "#1a1d27" }}
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      avatarColors[index % avatarColors.length]
                    }`}
                  >
                    {getInitials(
                      member.user?.fullName || member.user?.username
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {member.user?.fullName || member.user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                {/* Role + Actions */}
                <div className="flex items-center gap-3">
                  {isAdmin &&
                  String(member.user?._id) !== String(user?._id) ? (
                    <select
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border-0 cursor-pointer ${
                        roleConfig[member.role]?.color
                      }`}
                      style={{ backgroundColor: "transparent" }}
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.user?._id, e.target.value)
                      }
                    >
                      <option
                        value="member"
                        style={{ backgroundColor: "#1a1d27" }}
                      >
                        Member
                      </option>
                      <option
                        value="project_admin"
                        style={{ backgroundColor: "#1a1d27" }}
                      >
                        Project Admin
                      </option>
                      <option
                        value="admin"
                        style={{ backgroundColor: "#1a1d27" }}
                      >
                        Admin
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium ${
                        roleConfig[member.role]?.color
                      }`}
                    >
                      {roleConfig[member.role]?.icon}
                      {roleConfig[member.role]?.label}
                    </span>
                  )}

                  {isAdmin &&
                    String(member.user?._id) !== String(user?._id) && (
                      <button
                        onClick={() => handleRemoveMember(member.user?._id)}
                        className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10"
                      >
                        <UserMinus size={15} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
