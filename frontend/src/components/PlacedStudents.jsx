import { useState, useEffect } from "react";

const PlacedStudentsPage = () => {
  const [filters, setFilters] = useState({
    branch: "",
    gender: "",
    packageRange: "",
    batch: ""
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/placements`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching placement data:", error);
        setError("Failed to load placement data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      branch: "",
      gender: "",
      packageRange: "",
      batch: ""
    });
  };

  // Get unique batches for the filter dropdown
  const uniqueBatches = [...new Set(students.map(student => student.batch))].sort((a, b) => b - a);

  const filteredStudents = students.filter((student) => {
    return (
      (filters.branch === "" || student.branch === filters.branch) &&
      (filters.gender === "" || student.gender === filters.gender) &&
      (filters.batch === "" || student.batch.toString() === filters.batch) &&
      (filters.packageRange === "" ||
        (filters.packageRange === "Less than 10 Lakh" && student.package < 10) ||
        (filters.packageRange === "10 Lakh+" && student.package >= 10) ||
        (filters.packageRange === "20 Lakh+" && student.package >= 20) ||
        (filters.packageRange === "30 Lakh+" && student.package >= 30) ||
        (filters.packageRange === "40 Lakh+" && student.package >= 40) ||
        (filters.packageRange === "50 Lakh+" && student.package >= 50) ||
        (filters.packageRange === "60 Lakh+" && student.package >= 60) ||
        (filters.packageRange === "80 Lakh+" && student.package >= 80) ||
        (filters.packageRange === "1 Crore+" && student.package >= 100))
    );
  });

  // Sort by package (highest first)
  const sortedStudents = [...filteredStudents].sort((a, b) => b.package - a.package);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gray-100 p-6">
  //     <h1 className="text-3xl font-bold text-center mb-8">Placement Records</h1>
      
  //     <div className="flex flex-col md:flex-row gap-6">
  //       {/* Filter Section - Fixed height */}
  //       <div className="w-full md:w-1/4">
  //         <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
  //           <div className="flex justify-between items-center mb-4">
  //             <h2 className="text-xl font-semibold">Filters</h2>
  //             <button 
  //               onClick={clearFilters}
  //               className="text-sm text-blue-600 hover:text-blue-800"
  //             >
  //               Clear All
  //             </button>
  //           </div>
            
  //           <div className="space-y-4">
  //             <div>
  //               <label className="block mb-2 font-medium">Batch:</label>
  //               <select 
  //                 name="batch" 
  //                 value={filters.batch} 
  //                 onChange={handleFilterChange} 
  //                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="">All Batches</option>
  //                 {uniqueBatches.map(batch => (
  //                   <option key={batch} value={batch}>{batch}</option>
  //                 ))}
  //               </select>
  //             </div>

  //             <div>
  //               <label className="block mb-2 font-medium">Branch:</label>
  //               <select 
  //                 name="branch" 
  //                 value={filters.branch} 
  //                 onChange={handleFilterChange} 
  //                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="">All Branches</option>
  //                 <option value="Computer Science">Computer Science</option>
  //                 <option value="Electrical">Electrical</option>
  //                 <option value="Mechanical">Mechanical</option>
  //                 <option value="Mathematics and Computing">Mathematics and Computing</option>
  //                 <option value="Civil">Civil</option>
  //                 <option value="Electronics">Electronics</option>
  //                 <option value="Chemical">Chemical</option>
  //               </select>
  //             </div>

  //             <div>
  //               <label className="block mb-2 font-medium">Gender:</label>
  //               <select 
  //                 name="gender" 
  //                 value={filters.gender} 
  //                 onChange={handleFilterChange} 
  //                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="">All Genders</option>
  //                 <option value="Male">Male</option>
  //                 <option value="Female">Female</option>
  //                 <option value="Other">Other</option>
  //               </select>
  //             </div>

  //             <div>
  //               <label className="block mb-2 font-medium">Package Range:</label>
  //               <select 
  //                 name="packageRange" 
  //                 value={filters.packageRange} 
  //                 onChange={handleFilterChange} 
  //                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="">All Packages</option>
  //                 <option value="Less than 10 Lakh">Less than 10 Lakh</option>
  //                 <option value="10 Lakh+">10 Lakh+</option>
  //                 <option value="20 Lakh+">20 Lakh+</option>
  //                 <option value="30 Lakh+">30 Lakh+</option>
  //                 <option value="40 Lakh+">40 Lakh+</option>
  //                 <option value="50 Lakh+">50 Lakh+</option>
  //                 <option value="60 Lakh+">60 Lakh+</option>
  //                 <option value="80 Lakh+">80 Lakh+</option>
  //                 <option value="1 Crore+">1 Crore+</option>
  //               </select>
  //             </div>
  //           </div>
            
  //           <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
  //             <p className="font-medium text-blue-800">Placement Statistics</p>
  //             <p className="mt-2">Total Records: {students.length}</p>
  //             <p>Filtered Records: {sortedStudents.length}</p>
  //             <p>Highest Package: {students.length > 0 ? `${Math.max(...students.map(s => s.package))} LPA` : 'N/A'}</p>
  //             <p>Average Package: {students.length > 0 ? `${(students.reduce((sum, s) => sum + s.package, 0) / students.length).toFixed(2)} LPA` : 'N/A'}</p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Students List Section - Fixed container with scrolling content */}
  //       <div className="w-full md:w-3/4">
  //         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
  //           <h3 className="font-medium text-lg">
  //             {sortedStudents.length === 0 ? 
  //               "No placement records match your filters" : 
  //               `Showing ${sortedStudents.length} placement records`
  //             }
  //           </h3>
  //         </div>
          
  //         <div className="min-h-[400px]"> {/* Minimum height container to prevent layout shift */}
  //           {sortedStudents.length === 0 ? (
  //             <div className="bg-white p-8 rounded-lg shadow-md text-center h-[400px] flex flex-col justify-center items-center">
  //               <p className="text-gray-500">No placement records found with the selected filters.</p>
  //               <button 
  //                 onClick={clearFilters} 
  //                 className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
  //               >
  //                 Clear all filters
  //               </button>
  //             </div>
  //           ) : (
  //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //               {sortedStudents.map((student, index) => (
  //                 <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
  //                   <div className="flex flex-col md:flex-row md:items-center">
  //                     <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
  //                       <div className="relative w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
  //                         {student.name.charAt(0)}
  //                       </div>
  //                     </div>
  //                     <div className="md:w-3/4 md:pl-6">
  //                       <h3 className="text-xl font-semibold">{student.name}</h3>
  //                       <div className="grid grid-cols-2 gap-y-2 mt-2">
  //                         <div>
  //                           <p className="text-sm text-gray-500">Batch</p>
  //                           <p className="font-medium">{student.batch}</p>
  //                         </div>
  //                         <div>
  //                           <p className="text-sm text-gray-500">Branch</p>
  //                           <p className="font-medium">{student.branch}</p>
  //                         </div>
  //                         <div>
  //                           <p className="text-sm text-gray-500">CPI</p>
  //                           <p className="font-medium">{student.cpi}</p>
  //                         </div>
  //                         <div>
  //                           <p className="text-sm text-gray-500">Gender</p>
  //                           <p className="font-medium">{student.gender}</p>
  //                         </div>
  //                         <div className="col-span-2">
  //                           <p className="text-sm text-gray-500">Company</p>
  //                           <p className="font-medium">{student.company}</p>
  //                         </div>
  //                         <div className="col-span-2">
  //                           <p className="text-sm text-gray-500">Package</p>
  //                           <p className="text-lg font-bold text-green-600">{student.package} LPA</p>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        Placement Records
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Filter Section - Now more compact on mobile */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 sticky top-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: "batch", label: "Batch", options: ["", ...uniqueBatches] },
                { 
                  name: "branch", 
                  label: "Branch", 
                  options: [
                    "","Mathematics and Computing", "Computer Science", "Electrical", "Mechanical"
                  ] 
                },
                { name: "gender", label: "Gender", options: ["", "Male", "Female"] },
                { 
                  name: "packageRange", 
                  label: "Package Range", 
                  options: [
                    "", "Less than 10 Lakh", "10 Lakh+", "20 Lakh+", 
                    "30 Lakh+", "40 Lakh+", "50 Lakh+", "60 Lakh+", 
                    "80 Lakh+", "1 Crore+"
                  ] 
                }
              ].map((filter) => (
                <div key={filter.name}>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  <select
                    name={filter.name}
                    value={filters[filter.name]}
                    onChange={handleFilterChange}
                    className="w-full p-2 sm:p-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {filter.options.map(option => (
                      <option key={option} value={option}>
                        {option || `All ${filter.label}s`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="mt-5 p-3 sm:p-4 bg-blue-50 rounded-lg text-xs sm:text-sm">
              <p className="font-medium text-blue-800 mb-2">Statistics</p>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Total:</span>
                <span>{students.length}</span>
                <span className="text-gray-600">Filtered:</span>
                <span>{sortedStudents.length}</span>
                <span className="text-gray-600">Highest:</span>
                <span>{students.length > 0 ? `${Math.max(...students.map(s => s.package))} LPA` : 'N/A'}</span>
                <span className="text-gray-600">Average:</span>
                <span>{students.length > 0 ? `${(students.reduce((sum, s) => sum + s.package, 0) / students.length).toFixed(2)} LPA` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Students List Section */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-200">
            <h3 className="font-medium text-gray-800">
              {sortedStudents.length === 0 ? 
                "No matching records" : 
                `Showing ${sortedStudents.length} of ${students.length} records`
              }
            </h3>
          </div>
          
          {sortedStudents.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[300px] text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 mb-4">No placements match your filters</p>
              <button 
                onClick={clearFilters} 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sortedStudents.map((student) => (
                <div key={`${student.name}-${student.batch}`} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                        student.gender === 'Female' ? 'bg-pink-100 text-pink-600' :
                        student.gender === 'Male' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                        <div>
                          <p className="text-gray-500">Batch</p>
                          <p>{student.batch}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Branch</p>
                          <p>{student.branch}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">CPI</p>
                          <p>{student.cpi}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gender</p>
                          <p>{student.gender}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Company</p>
                          <p className="font-medium">{student.company}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Package</p>
                          <p className="text-xl font-bold text-green-600">{student.package} LPA</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                          Placed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default PlacedStudentsPage;