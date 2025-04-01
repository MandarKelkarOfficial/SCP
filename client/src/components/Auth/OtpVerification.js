// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   EnvelopeIcon,
//   LockClosedIcon,
//   ArrowPathIcon,
// } from "@heroicons/react/24/outline";

// function OtpVerification() {
//   const [enteredOtp, setEnteredOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;
//   const registrationData = JSON.parse(sessionStorage.getItem("userData"));

//   // Define the saveRegistrationData function
//   const saveRegistrationData = async () => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/register", {
//         ...registrationData,
//         email,
//       });
//       if (response.data.success) {
//         console.log("Registration data saved successfully");
//         // Clear session storage after successful registration
//         sessionStorage.removeItem("userData");
//       } else {
//         console.error(
//           "Failed to save registration data:",
//           response.data.message
//         );
//         setError("Failed to complete registration. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error saving registration data:", error);
//       setError("Failed to complete registration. Please try again.");
//     }
//   };

//   const sendOtp = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/send-email",
//         { email }
//       );
//       if (response.data.success) {
//         console.log(`OTP sent to ${email}`);
//         startCountdown();
//       } else {
//         setError("Failed to send OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setError("Failed to send OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startCountdown = () => {
//     setResendDisabled(true);
//     setCountdown(30);
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setResendDisabled(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   useEffect(() => {
//     if (email) {
//       sendOtp();
//     }
//   }, [email]);

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/verify-otp",
//         {
//           email,
//           enteredOtp,
//         }
//       );
//       if (response.data.success) {
//         setOtpVerified(true);
//         setError("");
//         await saveRegistrationData(); // Now properly defined
//         navigate("/");
//       } else {
//         setError("Invalid OTP, please try again.");
//         setOtpVerified(false);
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Failed to verify OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     await sendOtp();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100">
//             <LockClosedIcon className="h-8 w-8 text-purple-600" />
//           </div>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             OTP Verification
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter the 6-digit OTP sent to{" "}
//             <span className="font-medium text-purple-600">{email}</span>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="otp" className="sr-only">
//                 OTP Code
//               </label>
//               <input
//                 id="otp"
//                 name="otp"
//                 type="text"
//                 required
//                 maxLength="6"
//                 value={enteredOtp}
//                 onChange={(e) => setEnteredOtp(e.target.value)}
//                 className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
//                 placeholder="Enter 6-digit OTP"
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="text-red-500 text-sm text-center">{error}</div>
//           )}

//           {otpVerified && (
//             <div className="text-green-500 text-sm text-center">
//               OTP Verified Successfully!
//             </div>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
//                 isLoading ? "opacity-75 cursor-not-allowed" : ""
//               }`}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Verifying...
//                 </span>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="text-center text-sm text-gray-500">
//           Didn't receive OTP?{" "}
//           <button
//             onClick={handleResendOtp}
//             disabled={resendDisabled}
//             className={`font-medium ${
//               resendDisabled
//                 ? "text-gray-400 cursor-not-allowed"
//                 : "text-purple-600 hover:text-purple-500"
//             }`}
//           >
//             {resendDisabled ? (
//               `Resend in ${countdown}s`
//             ) : (
//               <span className="flex items-center justify-center">
//                 <ArrowPathIcon className="h-4 w-4 mr-1" />
//                 Resend OTP
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OtpVerification;



import React, { useState, useEffect,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LockClosedIcon,
} from "@heroicons/react/24/outline";

function OtpVerification() {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const registrationData = JSON.parse(sessionStorage.getItem("userData"));

  const otpSent = useRef(false); 

  useEffect(() => {
    if (email && !otpSent.current) {
      otpSent.current = true; // Mark OTP as sent
      sendOtp();
    }
  }, [email]); // Ensure OTP is sent only once when the component mounts

  const saveRegistrationData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        ...registrationData,
        email,
      });
      if (response.data.success) {
        console.log("Registration data saved successfully");
        sessionStorage.removeItem("userData");
      } else {
        console.error("Failed to save registration data:", response.data.message);
        setError("Failed to complete registration. Please try again.");
      }
    } catch (error) {
      console.error("Error saving registration data:", error);
      setError("Failed to complete registration. Please try again.");
    }
  };

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/send-email", { email });
      if (response.data.success) {
        console.log(`OTP sent to ${email}`);
        startCountdown();
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        enteredOtp,
      });
      if (response.data.success) {
        setOtpVerified(true);
        setError("");
        await saveRegistrationData();
        navigate("/");
      } else {
        setError("Invalid OTP, please try again.");
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await sendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100">
            <LockClosedIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">OTP Verification</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit OTP sent to <span className="font-medium text-purple-600">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="otp" className="sr-only">OTP Code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {otpVerified && <div className="text-green-500 text-sm text-center">OTP Verified Successfully!</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
