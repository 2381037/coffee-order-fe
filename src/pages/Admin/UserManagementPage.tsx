// src/pages/Admin/UserManagementPage.tsx (Frontend)
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  getUsers,
  deleteUser,
  updateUser,
  UpdateUserPayload,
} from "../../api/userApi";
import { User, UserRole } from "../../types";
import styles from "../styles/ManagementPage.module.css";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // FIX: Inisialisasi state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers({ limit: 100 }); // Sesuaikan limit jika perlu
      // FIX: Cek response dan response.data sebelum akses
      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
        setError("Received invalid data structure for users.");
      }
    } catch (err: any) {
      console.error("Fetch users error:", err);
      setError(
        `Failed to load users: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setUsers([]); // FIX: Set ke array kosong jika fetch gagal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
        alert("User deleted successfully.");
      } catch (err: any) {
        console.error("Delete user error:", err);
        alert(
          `Failed to delete user: ${err.response?.data?.message || err.message}`
        );
      }
    }
  };

  const handleRoleChange = async (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const newRole = e.target.value as UserRole;
    try {
      const payload: UpdateUserPayload = { role: newRole };
      await updateUser(id, payload);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      alert("User role updated successfully.");
    } catch (err: any) {
      console.error("Update role error:", err);
      alert(err.response?.data?.message || "Failed to update user role.");
    }
  };

  // --- JSX ---
  return (
    <div>
      <h2>Manage Users</h2>
      {loading && <p>Loading users...</p>}
      {/* Tampilkan error fetch utama */}
      {error && <p className="alert alert-danger">{error}</p>}
      {/* FIX: Pengecekan users.length sekarang aman */}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable}>
            {/* ... thead tabel ... */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e)}
                      className={styles.roleSelect}
                    >
                      <option value={UserRole.CUSTOMER}>Customer</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
