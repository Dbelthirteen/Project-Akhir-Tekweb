import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import homeIcon from "../homeIcon.png"; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      });
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex min-h-screen bg-[#ECF4FC]">
      <div
        className={`fixed top-0 left-0 h-full bg-[#9CBDD9] transition-all duration-300 ${
          sidebarVisible ? "w-[250px]" : "w-16"
        } z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#77ACD6] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          {sidebarVisible ? "<" : ">"}
        </button>

        <div
          className={`flex items-center h-[72px] w-full px-4 ${
            sidebarVisible ? "justify-start" : "justify-center"
          }`}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className={`object-contain ${sidebarVisible ? "h-30 w-30" : "h-10 w-10"}`}
          />
          {sidebarVisible && (
            <h1 className="text-xl font-extrabold font-[Caveat] text-white ml-4">
              SahabatDiri
            </h1>
          )}
        </div>

        <div className={`space-y-4 w-full mt-8 ${!sidebarVisible && "text-center"}`}>
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 py-3 px-4 hover:bg-[#77ACD6] rounded-lg text-white w-full"
          >
            <img
              src={homeIcon}
              alt="Home Icon"
              className="w-6 h-6 object-contain"
            />
            {sidebarVisible && <span className="text-lg font-medium">Dashboard</span>}
          </Link>
        </div>
      </div>

      <div
        className={`flex-1 ml-0 transition-all duration-300 ${
          sidebarVisible ? "md:ml-[250px]" : "md:ml-16"
        }`}
      >
        <div
          className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
            sidebarVisible ? "md:left-[250px]" : "md:left-16"
          } bg-[#9AC7E5] flex justify-between items-center px-6 py-4 z-40 h-[72px]`}
        >
          <div className="relative ml-auto">
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                {user?.name ? user.name[0] : "U"}
              </div>
            )}
          </div>
        </div>

        <div className="pt-[88px] p-8">
          <h1 className="text-2xl font-bold text-[#2C3A47] mb-6">Dashboard</h1>


          <div className="grid grid-cols-2 gap-6">
          <Link to="/reminder-task" className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md">
          <p className="text-lg font-bold">Reminder Your Task</p>
          </Link>

            <button
              onClick={() => handleNavigation("/daily-note")}
              className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md"
            >
              <p className="text-lg font-bold">Daily Note</p>
            </button>
            <button
              onClick={() => handleNavigation("/love-message")}
              className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md col-span-2"
            >
              <p className="text-lg font-bold">Love Message</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;