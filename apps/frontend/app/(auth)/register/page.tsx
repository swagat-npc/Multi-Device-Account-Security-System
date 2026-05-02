"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const errorList = [];
    if (firstName.length < 2) errorList.push("First name must be at least 2 characters");
    if (lastName.length < 2) errorList.push("Last name must be at least 2 characters");
    if (username.length < 2) errorList.push("Username must be at least 2 characters");
    if (!email.includes("@")) errorList.push("Invalid email");
    if (password.length < 6) errorList.push("Password too short");
    if (password !== confirmPassword) errorList.push("Passwords do not match");
    return errorList;
  };

  const createUser = async () => {
    const validationError = validate();
    if (validationError.length > 0) {
      setError(validationError.join(", "));
      return;
    }

    setError("");

    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || "Registration failed");
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900">
      <section className="border-red-500 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 p-5 flex rounded-2xl shadow-lg max-w-3xl">
          <div className="px-5">
            <h2 className="text-2xl font-bold text-[#002D74]">Register</h2>
            <form className="mt-6">
              <div className="flex gap-6">
                <div className="mt-4">
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">LastName</label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                />
              </div>

            </form>
            <button
            type="submit"
            onClick={createUser}
            className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
            Register
            </button>

            <div className="error-container">
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            <div className="text-sm flex justify-between items-center mt-3">
              <p>If you already have an account...</p>
              <Link href="/login">
                <button className="py-2 px-5 ml-3 bg-white border cursor-pointer rounded-xl hover:scale-110 duration-300 border-blue-400  ">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
