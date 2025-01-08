import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha verified");
          },
        },
        auth
      );
    }
  };

  // Handle Registration with Email and Password
  const handleRegister = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/Dashboard");
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
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
      navigate("/Dashboard");
    } catch (error) {
      alert(`Google Sign-In failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone Number Registration
  const handlePhoneSignUp = async () => {
    setLoading(true);
    initializeRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      alert("OTP sent to your phone!");
    } catch (error) {
      alert(`Failed to send OTP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);
      alert("Phone number verified and account created!");
      navigate("/Dashboard");
    } catch (error) {
      alert(`OTP verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-md">
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="logo.png" alt="Logo" className="h-10" />
              <h1 className="text-2xl font-bold font-custom text-textPrimary">
                SahabatDiri
              </h1>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-10">
            <div className="bg-blue-200 p-5 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-textPrimary mb-3">
             
              </h2>
              <img src="/Logo.png" alt="Logo" className="h-40 mx-auto" />
            </div>
          </div>

          <div className="flex-1 p-10">
            <h2 className="text-xl font-semibold text-textPrimary mb-5">
              Welcome To SahabatDiri
            </h2>
            
            <button
              className="w-full bg-gray-300 py-2 rounded-md mb-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue With Google"}
            </button>
            <button className="w-full bg-gray-300 py-2 rounded-md mb-5">
              Continue With Phone Number
            </button>

            <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-textSecondary">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm text-textSecondary">
                I agree to join SahabatDiri mailing list
              </span>
            </label>

            <button
              className="w-full bg-button text-white py-2 rounded-md mt-5"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-textSecondary mt-5">
              Already have an account?{" "}
              <a href="/login" className="text-button underline">
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;