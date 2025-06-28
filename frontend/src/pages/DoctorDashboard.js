import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarForDoctor from "../components/NavbarForDoctor"; // Import the NavbarForDoctor component
import "../styles/DoctorDashboard.css"; // Your CSS for styling the layout

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null); // State to store doctor details
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [appointmentsPerPage] = useState(4); // Number of appointments per page
  const [error, setError] = useState(null); // Error state for any API calls

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem("doctor_id"); // Get doctor ID from localStorage
        console.log("Doctor ID from localStorage:", doctorId); // Log doctor ID for debugging

        if (!doctorId) {
          setError("Doctor ID is missing in localStorage.");
          return; // Exit early if doctor ID is missing
        }

        // // Fetch doctor details
        // const response = await axios.get(
        //   `http://localhost:5000/api/doctor/${doctorId}`
        // );
        // console.log("Doctor Details:", response.data); // After fetching doctor

        // setDoctor(response.data);

        // Fetch appointments for the doctor
        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/appointments/doctor-appointments?doctorId=${doctorId}`
        );
        console.log("dkfjnrf");
        console.log("Appointments Data:", appointmentsResponse.data); // Log appointments data

        setAppointments(appointmentsResponse.data); // Set appointments data
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error("Error:", err.response || err.message || err); // Log the error for debugging
        setError("Error fetching doctor details or appointments");
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);
  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading state or error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-dashboard">
      <NavbarForDoctor /> {/* NavbarForDoctor component */}
      <div className="dashboard-content">
        {doctor ? (
          <div className="doctor-profile-card">
            <h2>{doctor.user_id.name}'s Dashboard</h2>
            <p>
              <strong>Specialization:</strong> {doctor.specialization}
            </p>
            <p>
              <strong>Email:</strong> {doctor.user_id.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {doctor.contactNumber}
            </p>
            <p>
              <strong>City:</strong> {doctor.city}
            </p>
          </div>
        ) : (
          <p>Doctor details not available.</p>
        )}

        <div className="appointments-section">
          <h3>Appointments</h3>
          {appointments.length > 0 ? (
            <>
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                appointmentsPerPage={appointmentsPerPage}
                totalAppointments={appointments.length}
                paginate={paginate}
              />
            </>
          ) : (
            <p>No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Handle appointment actions (view details, confirm, or cancel)
const handleAppointmentAction = (appointment) => {
  console.log("Appointment Details:", appointment);
  // Handle action based on the appointment (e.g., view details, confirm, or cancel)
};

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate }) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default DoctorDashboard;
