import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete user handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  // ✅ Filter by search input
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <motion.div
      className="user-list-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="user-header">
        <h2>👥 Registered Users</h2>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="user-search"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role || "User"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default UserList;
