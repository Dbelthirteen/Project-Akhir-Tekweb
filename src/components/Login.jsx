import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "../firebaseConfig"; // Import konfigurasi Firebase
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Handle Login with Email and Password
  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Signed in with Google!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(`Google Sign-In failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone Number Login
  const handlePhoneNumberSubmit = async () => {
    setLoading(true);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        auth
      );
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      alert("OTP sent to your phone!");
    } catch (error) {
      alert(`Failed to send OTP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await auth.signInWithCredential(credential);
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      alert(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      {/* Header */}
      <div className="w-full max-w-4xl bg-white rounded-md shadow-md">
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="h-10" />
              <h1 className="text-2xl font-bold font-custom text-textPrimary">
                SahabatDiri
              </h1>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex">
          {/* Left Section */}
          <div className="flex-1 p-10">
            <div className="bg-blue-200 p-5 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-textPrimary mb-3">
                Care ur selff
              </h2>
              <img
                src="/illustration.png"
                alt="Illustration"
                className="h-40 mx-auto"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 p-10">
            <h2 className="text-xl font-semibold text-textPrimary mb-5">
              Welcome Back To SahabatDiri
            </h2>

            {/* Google Sign-In */}
            <button
              className="w-full bg-gray-300 py-2 rounded-md mb-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue With Google"}
            </button>

            {/* Email and Password Fields */}
            <div className="mt-5">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2 mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded-md p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-button text-white py-2 rounded-md mt-5"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Phone Login */}
            <div className="mt-5">
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-md p-2 mb-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button
                className="w-full bg-button text-white py-2 rounded-md mb-3"
                onClick={handlePhoneNumberSubmit}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border border-gray-300 rounded-md p-2 mb-3"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-full bg-button text-white py-2 rounded-md"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <div id="recaptcha-container"></div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-textSecondary mt-5">
              Don't have an account?{" "}
              <Link to="/create-account" className="text-button underline">
                Sign Up Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;