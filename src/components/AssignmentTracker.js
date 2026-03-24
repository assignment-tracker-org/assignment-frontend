import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PRIMARY_API_URL = process.env.REACT_APP_PRIMARY_API_URL || "https://assignment-tracker-backend-e9bmgrh7cneeg9hb.southeastasia-01.azurewebsites.net/api/assignments";
const FALLBACK_API_URL = process.env.REACT_APP_FALLBACK_API_URL || "https://assignment-backend-ram9.onrender.com/api/assignments";

const makeRequest = async (method, url, data = null) => {
  try {
    const config = { method, url, data };
    return await axios(config);
  } catch (error) {
    console.warn(`Primary API failed, trying fallback: ${error.message}`);
    const fallbackUrl = url.replace(PRIMARY_API_URL, FALLBACK_API_URL);
    return await axios({ method, url: fallbackUrl, data });
  }
};

function AssignmentTracker() {
  const [assignments, setAssignments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [projectName, setProjectName] = useState("");

  const fetchAssignments = async () => {
    try {
      const res = await makeRequest('get', PRIMARY_API_URL);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching data from both APIs", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const addAssignment = async () => {
    if (!studentName || !projectName) {
      alert("Enter all fields");
      return;
    }

    try {
      await makeRequest('post', PRIMARY_API_URL, {
        studentName,
        projectName
      });
      setStudentName("");
      setProjectName("");
      fetchAssignments();
    } catch (error) {
      console.error("Error adding assignment", error);
    }
  };

  const updateStatus = async (id) => {
    const assignment = assignments.find(a => a.id === id);

    try {
      await makeRequest('put', `${PRIMARY_API_URL}/${id}`, {
        ...assignment,
        status: "Completed"
      });
      fetchAssignments();
    } catch (error) {
      console.error("Error updating assignment", error);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await makeRequest('delete', `${PRIMARY_API_URL}/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment", error);
    }
  };


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Assignment Tracker</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={addAssignment}>
          Add Assignment
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Project</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.studentName}</td>
              <td>{a.projectName}</td>
              <td>{a.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  disabled={a.status === "Completed"}
                  onClick={() => updateStatus(a.id)}
                >
                  Complete
                </button>
              </td>
              <td>
            <button
  className="btn btn-danger btn-sm"
  onClick={() => {
    const password = prompt("Enter password to delete:");

    if (password === "2005") {
      deleteAssignment(a.id);
    } else if (password !== null) {
      alert("Incorrect password!");
    }
  }}
>
  Delete
</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentTracker;
