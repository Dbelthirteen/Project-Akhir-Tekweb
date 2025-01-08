import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import homeIcon from "../homeIcon.png";

const LoveMessage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "Feedback",
    message: "",
  });
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State untuk modal pemberitahuan
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      messageType: "Feedback",
      message: "",
    });
    setShowSuccessModal(true); // Tampilkan modal pemberitahuan
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Tutup modal setelah beberapa detik
  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[#ECF4FC]">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ${
          sidebarVisible ? "md:ml-[250px]" : "md:ml-16"
        }`}
      >
        {/* Header */}
        <div
          className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
            sidebarVisible ? "md:left-[250px]" : "md:left-16"
          } bg-[#9AC7E5] flex justify-between items-center px-6 py-4 z-40 h-[72px]`}
        >
          <h1 className="text-lg font-bold text-white">Love Message</h1>
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

        {/* Content */}
        <div className="pt-[88px] p-8">
          <h1 className="text-2xl font-bold text-[#2C3A47] mb-6">Love Message</h1>
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Message Type
                </label>
                <select
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Feedback">Feedback</option>
                  <option value="Criticism">Criticism</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Love Message">Love Message</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your message here"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for Success Message */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-center text-gray-700 mb-4">
              Thank you for your message. We will get back to you soon.
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveMessage;
