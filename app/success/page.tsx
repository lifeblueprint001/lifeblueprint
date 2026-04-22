"use client";

import { useEffect, useRef, useState } from "react";

type FormData = {
  fullName: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

type ProcessPayload = FormData & {
  sessionId: string;
};

export default function SuccessPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportError, setReportError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const hasProcessed = useRef(false);

  const processReport = async (data: ProcessPayload) => {
    setLoading(true);
    setReportError(false);
    setEmailSent(false);
    setEmailError(false);

    try {
      const response = await fetch("/api/process-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthPlace: data.birthPlace,
          sessionId: data.sessionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to process report");
      }

      setReport(result.report || "No report generated.");

      if (result.userResult) {
        setEmailSent(true);
      } else {
        setEmailError(true);
      }
    } catch (error) {
      console.error("Process failed:", error);
      setReportError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      console.error("Missing session_id in URL");
      setLoading(false);
      setReportError(true);
      return;
    }

    const saved = localStorage.getItem("lifeBlueprintFormData");

    if (!saved) {
      console.error("Missing lifeBlueprintFormData in localStorage");
      setLoading(false);
      setReportError(true);
      return;
    }

    try {
      const parsed: FormData = JSON.parse(saved);
      setFormData(parsed);
      hasProcessed.current = true;

      processReport({
        ...parsed,
        sessionId,
      });
    } catch (error) {
      console.error("Failed to parse saved form data:", error);
      setLoading(false);
      setReportError(true);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>

      <p className="mt-4 text-gray-600 max-w-2xl">
        Your order has been received. Your personalized Life Blueprint report is now being prepared.
      </p>

      {loading && (
        <div className="mt-6">
          <p className="text-gray-600 font-medium">
            Generating your personalized report...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments.
          </p>
        </div>
      )}

      {emailSent && !loading && (
        <p className="mt-4 text-green-600">
          Your report has been sent successfully to your email.
        </p>
      )}

      {emailError && !loading && report && (
        <p className="mt-4 text-amber-600">
          Your report was generated, but there was a problem sending it by email.
        </p>
      )}

      {formData && (
        <div className="mt-8 w-full max-w-md rounded border p-4 text-left">
          <h2 className="mb-4 text-xl font-semibold">Your submitted details</h2>

          <p><strong>Full name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Date of birth:</strong> {formData.birthDate}</p>
          <p><strong>Time of birth:</strong> {formData.birthTime}</p>
          <p><strong>Place of birth:</strong> {formData.birthPlace}</p>
        </div>
      )}

      {reportError && !loading && (
        <p className="mt-6 text-red-600">
          There was a problem verifying your payment or generating your report.
        </p>
      )}

      {report && !loading && (
        <div className="mt-10 w-full max-w-3xl rounded border p-6 text-left">
          <h2 className="mb-4 text-2xl font-bold">Your Life Blueprint Report</h2>
          <div className="whitespace-pre-wrap leading-7">
            {report}
          </div>
        </div>
      )}
    </main>
  );
}