"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [birthDate, setBirthDate] = useState("");
const [birthTime, setBirthTime] = useState("");
const [birthPlace, setBirthPlace] = useState("");

  const handleContinue = () => {
    const formData = {
  fullName,
  email,
  birthDate,
  birthTime,
  birthPlace,
};

    localStorage.setItem("lifeBlueprintFormData", JSON.stringify(formData));

    window.location.href = "https://buy.stripe.com/test_5kQ9AT7nWcoF1xb0FqeME00";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold">Life Blueprint</h1>

      <p className="mt-4 text-gray-600">
        Discover your life path using astrology, numerology and ancient systems.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Get Your Personalized Report
      </button>

      {open && (
        <form
          className="mt-6 space-y-4 w-full max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border p-2 w-full"
          />
          <input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="border p-2 w-full"
/>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Place of Birth (City, Country)"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            className="border p-2 w-full"
          />

          <button
            type="button"
            onClick={handleContinue}
            className="block bg-green-600 text-white px-4 py-2 w-full text-center rounded"
          >
            Continue to Payment
          </button>
        </form>
      )}
    </main>
  );
}