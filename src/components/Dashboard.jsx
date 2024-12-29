import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECF4FC]">
      {/* Header */}
      <div className="w-full bg-[#9AC7E5] flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold font-[Caveat] text-white">SahabatDiri</h1>
        {/* Profile Picture */}
        <div className="relative">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex flex-col bg-[#9AC7E5] flex-shrink-0 w-full max-w-[250px] md:w-[20%] p-4">
          {/* Logo */}
          <div className="flex items-center mb-12 pl-4">
            <img src="/logo.png" alt="Logo" className="h-12 mr-3" />
            <h1 className="text-3xl font-extrabold font-[Caveat] text-white">
              SahabatDiri
            </h1>
          </div>

          {/* Navigation */}
          <div className="space-y-4 w-full">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 py-3 px-4 hover:bg-[#77ACD6] rounded-lg text-white w-full"
            >
              <div className="w-6 h-6 bg-white rounded-md"></div>
              <span className="text-lg font-medium">Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold text-[#2C3A47] mb-6">Dashboard</h1>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md">
              <p className="text-lg font-bold">Reminder Your Task</p>
            </div>
            <div className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md">
              <p className="text-lg font-bold">Daily Note</p>
            </div>
            <div className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md">
              <p className="text-lg font-bold">Visit Calender Wishlist</p>
            </div>
            <div className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md">
              <p className="text-lg font-bold">Room Healthy</p>
            </div>
            <div className="bg-[#BFD8EB] text-[#2C3A47] p-8 rounded-xl text-center shadow-md col-span-2">
              <p className="text-lg font-bold">Love Massage and Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
