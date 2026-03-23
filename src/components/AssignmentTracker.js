import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://assignment-backend-ram9.onrender.com/api/assignments";

function AssignmentTracker() {
  const [assignments, setAssignments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [projectName, setProjectName] = useState("");

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(API_URL);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching data", error);
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
      await axios.post(API_URL, {
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
      await axios.put(`${API_URL}/${id}`, {
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
      await axios.delete(`${API_URL}/${id}`);
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
                  onClick={() => deleteAssignment(a.id)}
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
