import { useState, useEffect } from "react";
import { Search, User, Phone, Mail, AtSign, Trash2, Users, UserCheck, Calendar } from "lucide-react";
import { toast } from "sonner";
import { userApi } from "../../api/services/userApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

// FETCH USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsers();
      const userData = response.data.data || [];

      // Transform backend data to match component structure
      const transformedUsers = userData.map((user) => ({
        id: user._id,
        name: user.Name,
        username: user.username,
        email: user.email,
        phone: user.mobile || user.phone,
        registered: new Date(user.createdAt).toLocaleDateString(),
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error while fetching the users", error);
      toast.error("Failed to fetch the Users");
    }
  };

  /* ── Filtered list ── */
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  /* ── Delete user ── */
  const confirmDelete = (user) => setDeleteTarget(user);

  const handleDelete = async () => {
    try {
      await userApi.deleteUser(deleteTarget.id);

      const updated = users.filter((u) => u.id !== deleteTarget.id);
      setUsers(updated);
      
      // Delete would normally call backend API to persist
      toast.success(`User "${deleteTarget.name}" removed successfully.`);
      setDeleteTarget(null);
    }
    catch (error) {
      console.error("Error while deleting the user", error);
      toast.error("Failed to delete the user");      
    }
  };

  /* ── Avatar initial ── */
  const avatar = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  /* ── Color from name for avatar ── */
  const avatarColor = (name = "") => {
    const colors = [
      "bg-emerald-500", "bg-blue-500", "bg-violet-500",
      "bg-amber-500", "bg-pink-500", "bg-teal-500", "bg-orange-500",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground">Registered Users</h2>
        <p className="text-muted-foreground text-sm">
          {users.length} user{users.length !== 1 ? "s" : ""} registered on AgriMart
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-foreground">{users.length}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-foreground">
              {users.filter((u) => u.email).length}
            </div>
            <div className="text-xs text-muted-foreground">With Email</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-foreground">
              {users.filter((u) => u.phone).length}
            </div>
            <div className="text-xs text-muted-foreground">With Phone</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id="user-search"
          placeholder="Search by name, username, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground font-semibold">
            {users.length === 0 ? "No users have registered yet." : "No users match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Username</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Phone</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">User ID</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground">Action</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${
                      i % 2 === 0 ? "" : "bg-muted/10"
                    }`}
                  >
                    {/* Name + Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${avatarColor(u.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                        >
                          {avatar(u.name)}
                        </div>
                        <span className="font-semibold text-foreground">{u.name || "—"}</span>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <AtSign className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{u.username || "—"}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{u.email || "—"}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{u.phone || "—"}</span>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {u.id ? String(u.id).slice(-6) : "—"}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4 text-right">
                      <button
                        id={`delete-user-${u.id}`}
                        onClick={() => confirmDelete(u)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${avatarColor(u.name)} flex items-center justify-center text-white font-bold`}
                    >
                      {avatar(u.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{u.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">@{u.username || "—"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => confirmDelete(u)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground pl-1">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{u.email || "—"}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{u.phone || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-card rounded-2xl border border-input shadow-2xl w-200 max-w-sm p-7"
            style={{ maxWidth: "50%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-1">Delete User</h3>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget.name}</span>? <br></br> This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-user-btn"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
