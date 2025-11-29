// frontend/app/login/page.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * All possible "screens" on the login page.
 */
type View =
  | "welcome"                // Sign Up / Sign In choice
  | "signin-role"            // choose Student / Professor
  | "signin-student"         // student login form
  | "signin-professor"       // professor login form
  | "signup-role"            // create account: choose Student / Professor
  | "signup-professor-form"  // professor signup form (with key)
  | "signup-student-journey" // pick CS / Cyber
  | "signup-student-form";   // student signup form

type UserRole = "student" | "professor";
type StudentJourney = "cs" | "cybersecurity" | null;

// Hard-coded professor key for the demo.
// Change this string to whatever your professor key should be.
const PROFESSOR_KEY = "CSE230KEY";

// Colors and spacing to keep things consistent
const colors = {
  background: "#f7efe6",
  cardBackground: "#ffffff",
  maroon: "#7b1432",
  maroonHover: "#91173b",
  border: "#d8c9b4",
  inputBackground: "#f7efe6",
  text: "#3b3b3b",
  subtle: "#777777",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  padding: 0,
  backgroundColor: colors.background,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const cardStyle: React.CSSProperties = {
  width: "420px",
  maxWidth: "90vw",
  backgroundColor: colors.cardBackground,
  borderRadius: "16px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  padding: "28px 32px 32px",
};

const headerTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: colors.maroon,
  textAlign: "center",
  marginBottom: "4px",
};

const headerSubtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: colors.text,
  textAlign: "center",
  marginBottom: "24px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  color: colors.text,
  marginBottom: "4px",
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: colors.subtle,
  marginBottom: "20px",
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: colors.text,
  marginBottom: "4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBackground,
  fontSize: "14px",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: colors.maroon,
  color: "white",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "18px",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: `1px solid ${colors.maroon}`,
  backgroundColor: "white",
  color: colors.maroon,
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "12px",
};

const subtleLinkStyle: React.CSSProperties = {
  border: "none",
  background: "none",
  padding: 0,
  margin: 0,
  color: colors.maroon,
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const footerTextStyle: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "13px",
  color: colors.subtle,
  textAlign: "center",
};

/**
 * Main Login Page Component
 */
export default function LoginPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("welcome");
  const [role, setRole] = useState<UserRole>("student");
  const [studentJourney, setStudentJourney] = useState<StudentJourney>(null);

  // Shared auth state (email, password, name, etc.)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [professorKey, setProfessorKey] = useState("");

  // -------------------------------
  // Fake "auth" helpers
  // -------------------------------

  const fakeLogin = (r: UserRole, em: string, pw: string): boolean => {
    // You can add real validation here later.
    if (!em || !pw) {
      alert("Please enter email and password.");
      return false;
    }
    return true;
  };

  const fakeSignup = (): boolean => {
    if (!email || !password || !confirmPassword || !name) {
      alert("Please fill in all fields.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };

  // -------------------------------
  // Handlers for each form
  // -------------------------------

  const handleStudentSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!fakeLogin("student", email, password)) return;
    router.push("/login/student");
  };

  const handleProfessorSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!fakeLogin("professor", email, password)) return;
    router.push("/login/teacher");
  };

  const handleProfessorSignup = (e: FormEvent) => {
    e.preventDefault();

    if (professorKey !== PROFESSOR_KEY) {
      alert("Invalid professor key.");
      return;
    }

    if (!fakeSignup()) return;
    router.push("/login/teacher");
  };

  const handleStudentSignup = (e: FormEvent) => {
    e.preventDefault();

    if (!studentJourney) {
      alert("Please select Computer Science or Cybersecurity.");
      return;
    }

    if (!fakeSignup()) return;

    // For now both journeys go to /login/student
    router.push("/login/student");
  };

  // Reset common fields when switching high-level flows
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setProfessorKey("");
  };

  // -------------------------------
  // Render helpers
  // -------------------------------

  const renderHeader = () => (
    <>
      {/* Little cap icon using plain text (you could swap for <img> if you have an SVG) */}
      <div style={{ textAlign: "center", marginBottom: "8px", fontSize: "30px" }}>
        🎓
      </div>

      <div style={headerTitleStyle}>Arizona State University</div>
      <div style={headerSubtitleStyle}>
        CSE 230: Computer Org/Assembl Lang Prog
      </div>
    </>
  );

  const renderWelcome = () => (
    <>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>
          Welcome
        </div>
        <div style={{ fontSize: "14px", color: colors.subtle }}>
          Choose an option to continue
        </div>
      </div>

      <button
        type="button"
        style={primaryButtonStyle}
        onClick={() => {
          resetForm();
          setView("signup-role");
        }}
      >
        Sign Up
      </button>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          resetForm();
          setView("signin-role");
        }}
      >
        Sign In
      </button>
    </>
  );

  const renderSignInRole = () => (
    <>
      <div style={sectionTitleStyle}>Sign In</div>
      <div style={sectionSubtitleStyle}>Select your role to continue</div>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          resetForm();
          setRole("student");
          setView("signin-student");
        }}
      >
        Student
      </button>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          resetForm();
          setRole("professor");
          setView("signin-professor");
        }}
      >
        Professor
      </button>

      <div style={footerTextStyle}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signup-role");
          }}
        >
          Sign up
        </button>
      </div>
    </>
  );

  const renderSignInForm = (currentRole: UserRole) => {
    const isStudent = currentRole === "student";

    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={sectionTitleStyle}>
              Sign in as {isStudent ? "Student" : "Professor"}
            </div>
            <div style={sectionSubtitleStyle}>
              Enter your credentials to continue
            </div>
          </div>

          <button
            type="button"
            style={subtleLinkStyle}
            onClick={() => {
              resetForm();
              setView("signin-role");
            }}
          >
            Change
          </button>
        </div>

        <form onSubmit={isStudent ? handleStudentSignIn : handleProfessorSignIn}>
          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabelStyle}>ASU Email</div>
            <input
              type="email"
              placeholder="asurite@asu.edu"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "4px" }}>
            <div style={fieldLabelStyle}>Password</div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <button type="submit" style={primaryButtonStyle}>
            Sign In
          </button>
        </form>

        <div style={footerTextStyle}>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            style={subtleLinkStyle}
            onClick={() => {
              resetForm();
              setView("signup-role");
            }}
          >
            Sign up
          </button>
        </div>
      </>
    );
  };

  const renderSignupRole = () => (
    <>
      <div style={sectionTitleStyle}>Create an account</div>
      <div style={sectionSubtitleStyle}>
        Enter your information to create your account
      </div>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          resetForm();
          setRole("student");
          setView("signup-student-journey");
        }}
      >
        Student
      </button>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          resetForm();
          setRole("professor");
          setView("signup-professor-form");
        }}
      >
        Professor
      </button>

      <div style={footerTextStyle}>
        Already have an account?{" "}
        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signin-role");
          }}
        >
          Sign in
        </button>
      </div>
    </>
  );

  const renderProfessorSignupForm = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={sectionTitleStyle}>Create an account</div>
          <div style={sectionSubtitleStyle}>
            Enter your information to create your account
          </div>
        </div>

        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signup-role");
          }}
        >
          Change
        </button>
      </div>

      {/* role badge */}
      <div
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: "#fde7e9",
          fontSize: "14px",
          marginBottom: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Professor</span>
      </div>

      <form onSubmit={handleProfessorSignup}>
        <div style={{ marginBottom: "14px" }}>
          <div style={fieldLabelStyle}>Professor Key</div>
          <input
            type="text"
            placeholder="Enter professor key"
            value={professorKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProfessorKey(e.target.value)
            }
            style={inputStyle}
          />
          <div style={{ fontSize: "12px", color: colors.subtle, marginTop: "4px" }}>
            Contact your administrator for the professor key.
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div style={fieldLabelStyle}>Name</div>
          <input
            type="text"
            placeholder="First Last"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div style={fieldLabelStyle}>ASU Email</div>
          <input
            type="email"
            placeholder="asurite@asu.edu"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div style={fieldLabelStyle}>Password</div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "4px" }}>
          <div style={fieldLabelStyle}>Confirm Password</div>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <button type="submit" style={primaryButtonStyle}>
          Sign Up
        </button>
      </form>

      <div style={footerTextStyle}>
        Already have an account?{" "}
        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signin-role");
          }}
        >
          Sign in
        </button>
      </div>
    </>
  );

  const renderStudentJourneyChoice = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={sectionTitleStyle}>Create an account</div>
          <div style={sectionSubtitleStyle}>
            Enter your information to create your account
          </div>
        </div>

        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signup-role");
          }}
        >
          Back
        </button>
      </div>

      <div style={{ marginBottom: "16px", fontSize: "14px", color: colors.text }}>
        Choose Your Journey:
      </div>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          setStudentJourney("cs");
          resetForm();
          setView("signup-student-form");
        }}
      >
        Computer Science
      </button>

      <button
        type="button"
        style={secondaryButtonStyle}
        onClick={() => {
          setStudentJourney("cybersecurity");
          resetForm();
          setView("signup-student-form");
        }}
      >
        Cybersecurity
      </button>

      <div style={footerTextStyle}>
        Already have an account?{" "}
        <button
          type="button"
          style={subtleLinkStyle}
          onClick={() => {
            resetForm();
            setView("signin-role");
          }}
        >
          Sign in
        </button>
      </div>
    </>
  );

  const renderStudentSignupForm = () => {
    const journeyLabel =
      studentJourney === "cs"
        ? "Student – Computer Science"
        : "Student – Cybersecurity";

    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={sectionTitleStyle}>Create an account</div>
            <div style={sectionSubtitleStyle}>
              Enter your information to create your account
            </div>
          </div>

          <button
            type="button"
            style={subtleLinkStyle}
            onClick={() => {
              resetForm();
              setView("signup-student-journey");
            }}
          >
            Change
          </button>
        </div>

        {/* role + journey badge */}
        <div
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: "#fde7e9",
            fontSize: "14px",
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{journeyLabel}</span>
        </div>

        <form onSubmit={handleStudentSignup}>
          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabelStyle}>Name</div>
            <input
              type="text"
              placeholder="First Last"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabelStyle}>ASU Email</div>
            <input
              type="email"
              placeholder="asurite@asu.edu"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabelStyle}>Password</div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "4px" }}>
            <div style={fieldLabelStyle}>Confirm Password</div>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <button type="submit" style={primaryButtonStyle}>
            Sign Up
          </button>
        </form>

        <div style={footerTextStyle}>
          Already have an account?{" "}
          <button
            type="button"
            style={subtleLinkStyle}
            onClick={() => {
              resetForm();
              setView("signin-role");
            }}
          >
            Sign in
          </button>
        </div>
      </>
    );
  };

  // -------------------------------
  // MAIN RENDER
  // -------------------------------

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {renderHeader()}

        {/* Inner content based on current view */}
        {view === "welcome" && renderWelcome()}
        {view === "signin-role" && renderSignInRole()}
        {view === "signin-student" && renderSignInForm("student")}
        {view === "signin-professor" && renderSignInForm("professor")}
        {view === "signup-role" && renderSignupRole()}
        {view === "signup-professor-form" && renderProfessorSignupForm()}
        {view === "signup-student-journey" && renderStudentJourneyChoice()}
        {view === "signup-student-form" && renderStudentSignupForm()}
      </div>
    </div>
  );
}
