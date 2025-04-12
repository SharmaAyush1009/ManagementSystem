import { useState } from "react";

const ScoreCardPage = () => {
  const [filters, setFilters] = useState({
    department: "",
    gender: "",
    cpiRange: "",
  });

  const [students, setStudents] = useState([
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const filteredStudents = students.filter((student) => {
    return (
      (filters.department === "" || student.department === filters.department) &&
      (filters.gender === "" || student.gender === filters.gender) &&
      (filters.cpiRange === "" || parseFloat(student.cpi) >= parseFloat(filters.cpiRange))
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Filter Section */}
      <div className="w-1/3 p-6 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <label className="block mb-2">Department:</label>
        <select name="department" value={filters.department} onChange={handleFilterChange} className="border p-2 w-full rounded">
          <option value="">All</option>
          <option value="Mathematics and Computing">Mathematics and Computing</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical">Electrical</option>
          <option value="Mechanical">Mechanical</option>
        </select>

        <label className="block mt-4 mb-2">Gender:</label>
        <select name="gender" value={filters.gender} onChange={handleFilterChange} className="border p-2 w-full rounded">
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label className="block mt-4 mb-2">CPI Range:</label>
        <select name="cpiRange" value={filters.cpiRange} onChange={handleFilterChange} className="border p-2 w-full rounded">
          <option value="">All</option>
          <option value="8">8+</option>
          <option value="8.5">8.5+</option>
          <option value="9">9+</option>
        </select>
      </div>

      {/* Students List Section */}
      <div className="w-2/3 p-6">
        <h2 className="text-2xl font-semibold mb-4">Score Card</h2>
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="flex items-center bg-white p-4 rounded-lg shadow-md relative">
              <div className="w-1/5">
                <img src="https://via.placeholder.com/100" alt="Profile" className="w-20 h-20 rounded-full" />
              </div>
              <div className="w-4/5 pl-4">
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p>Roll No: {student.rollNo}</p>
                <p>Department: {student.department}</p>
                <p>CPI: {student.cpi}</p>
              </div>
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveStudent(student.id)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCardPage;
