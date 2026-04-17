import React, { useEffect } from "react";

function Dashboard() {
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    alert("Logged out");
    window.location.href = "/login";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Dashboard</h1>
      <h2>Welcome {username}</h2>

      <div style={{ marginTop: "20px" }}>
        <a href="/" style={{ marginRight: "15px" }}>Go to Upload Page</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;