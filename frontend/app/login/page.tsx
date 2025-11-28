// frontend/app/login/page.tsx
"use client";

/**
 * Multi-step login / signup flow for the CSE 230 portal.
 *
 * Views:
 * - "welcome"                → Sign Up / Sign In choice
 * - "signin-role"            → choose Student / Professor for sign in
 * - "signin-student"         → student sign-in form
 * - "signin-professor"       → professor sign-in form
 * - "signup-role"            → choose Student / Professor for sign up
 * - "signup-professor"       → professor sign-up (with key)
 * - "signup-student-journey" → choose CS / Cybersecurity
 * - "signup-student-form"    → student sign-up form
 *
 * Successful auth routes to:
 * - /student
 * - /teacher
 */

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

// Your custom auth hook (login, etc.)
import { useAuth, UserRole } from "./hooks/useAuth";

// Login-specific UI components
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";

import { AlertCircle } from "lucide-react";

/** All possible screen states for this page */
type View =
  | "welcome"
  | "signin-role"
  | "signin-student"
  | "signin-professor"
  | "signup-role"
  | "signup-professor"
  | "signup-student-journey"
  | "signup-student-form";

/** Student journey options for sign-up */
type StudentJourney = "cs" | "cyber";

export default function LoginMultiStepPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Which "screen" we’re currently showing
  const [view, setView] = useState<View>("welcome");

  // CS vs Cyber when signing up as a student
  const [selectedJourney, setSelectedJourney] =
    useState<StudentJourney | null>(null);

  // Global error + loading state shared by forms
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ---------- FORM STATE ----------

  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  const [profSignupForm, setProfSignupForm] = useState({
    professorKey: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [studentSignupForm, setStudentSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------- HELPERS ----------

  const resetErrors = () => setError("");

  const handleSigninChange =
    (field: "email" | "password") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setSigninForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleProfSignupChange =
    (field: keyof typeof profSignupForm) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setProfSignupForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleStudentSignupChange =
    (field: keyof typeof studentSignupForm) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setStudentSignupForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const goToSignIn = () => {
    resetErrors();
    setView("signin-role");
  };

  const goToSignUp = () => {
    resetErrors();
    setView("signup-role");
  };

  const goBackToWelcome = () => {
    resetErrors();
    setView("welcome");
  };

  // ---------- SUBMIT HANDLERS ----------

  /** Shared sign-in for both roles */
  const submitSignin = async (e: FormEvent<HTMLFormElement>, role: UserRole) => {
    e.preventDefault();
    resetErrors();

    if (!signinForm.email || !signinForm.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const result = await login(signinForm.email, signinForm.password, role);

    if (result.success) {
      router.push(role === "professor" ? "/teacher" : "/student");
    } else {
      setError(result.error || "Sign in failed.");
      setIsLoading(false);
    }
  };

  /** Professor sign-up – currently only front-end validation */
  const submitProfessorSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    const { professorKey, name, email, password, confirmPassword } =
      profSignupForm;

    if (!professorKey || !name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: call backend to validate professor key + register user
    router.push("/teacher");
  };

  /** Student sign-up – choose journey + basic validation */
  const submitStudentSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetErrors();

    const { name, email, password, confirmPassword } = studentSignupForm;

    if (!selectedJourney) {
      setError("Please select your journey.");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: send selectedJourney + data to backend
    router.push("/student");
  };

  /** Shared error banner for all forms */
  const renderError = () =>
    error && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4 mt-[2px]" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  // ---------- SCREENS ----------

  /** 1. Welcome screen: Sign Up / Sign In choice */
  const renderWelcome = () => (
    <Card className="w-full max-w-md bg-white shadow-sm">
      <CardContent className="pt-10 pb-8 space-y-6">
        {/* Logo + heading */}
        <div className="text-center space-y-3">
          <div className="mb-2 text-4xl">🎓</div>
          <h2 className="text-[22px] font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-[13px] text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        {/* Welcome text – **dark** on purpose */}
        <div className="text-center space-y-1 mt-2">
          <h3 className="text-xl font-semibold text-[#3b2f2a]">
            Welcome
          </h3>
          <p className="text-sm text-[#5a4740]">
            Choose an option to continue
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-3">
          <Button
            type="button"
            className="w-full bg-[#8C1D40] hover:bg-[#6e1632] text-white"
            onClick={goToSignUp}
          >
            Sign Up
          </Button>

          <Button
            type="button"
            className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
            onClick={goToSignIn}
          >
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  /** 2. Choose Student / Professor for Sign-in */
  const renderSigninRole = () => (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="pt-8 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-xs text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-[#3b2f2a] mb-1">
            Sign In
          </h3>
          <p className="text-sm text-[#5a4740]">
            Select your role to continue
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
            onClick={() => {
              resetErrors();
              setView("signin-student");
            }}
          >
            Student
          </Button>
          <Button
            type="button"
            className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
            onClick={() => {
              resetErrors();
              setView("signin-professor");
            }}
          >
            Professor
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-[#5a4740]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="underline text-[#8C1D40]"
            onClick={goToSignUp}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );

  /** 3. Shared sign-in form (Student or Professor) */
  const renderSigninForm = (role: UserRole) => (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="pt-8 pb-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-xs text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm text-[#3b2f2a]">
              Sign in as {role === "student" ? "Student" : "Professor"}
            </h3>
            <p className="text-xs text-[#5a4740]">
              Enter your credentials to continue
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#8C1D40] underline"
            onClick={() => {
              resetErrors();
              setView("signin-role");
            }}
          >
            Change
          </button>
        </div>

        {renderError()}

        <form
          onSubmit={(e) => submitSignin(e, role)}
          className="space-y-3 mt-2"
        >
          <div className="space-y-1">
            <Label htmlFor="signin-email">ASU Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="asurite@asu.edu"
              value={signinForm.email}
              onChange={handleSigninChange("email")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              placeholder="••••••••"
              value={signinForm.password}
              onChange={handleSigninChange("password")}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#8C1D40] hover:bg-[#6e1632] text-white mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-2 text-center text-xs text-[#5a4740]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="underline text-[#8C1D40]"
            onClick={goToSignUp}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );

  /** 4. Choose Student / Professor for Sign-up */
  const renderSignupRole = () => (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="pt-8 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-xs text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-[#3b2f2a]">
            Create an account
          </h3>
          <p className="text-sm text-[#5a4740]">
            Enter your information to create your account
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
            onClick={() => {
              resetErrors();
              setView("signup-professor");
            }}
          >
            Professor
          </Button>
          <Button
            type="button"
            className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
            onClick={() => {
              resetErrors();
              setSelectedJourney(null);
              setView("signup-student-journey");
            }}
          >
            Student
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-[#5a4740]">
          Already have an account?{" "}
          <button
            type="button"
            className="underline text-[#8C1D40]"
            onClick={goToSignIn}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );

  /** 5. Professor sign-up form */
  const renderProfessorSignup = () => (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="pt-8 pb-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-xs text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm text-[#3b2f2a]">
              Create an account
            </h3>
            <p className="text-xs text-[#5a4740]">
              Enter your information to create your account
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#8C1D40] underline"
            onClick={() => setView("signup-role")}
          >
            Change
          </button>
        </div>

        <div className="text-xs font-medium bg-rose-50 text-[#8C1D40] px-3 py-2 rounded-md">
          Professor
        </div>

        {renderError()}

        <form onSubmit={submitProfessorSignup} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label htmlFor="prof-key">Professor Key</Label>
            <Input
              id="prof-key"
              placeholder="Enter professor key"
              value={profSignupForm.professorKey}
              onChange={handleProfSignupChange("professorKey")}
            />
            <p className="text-xs text-[#7a645a]">
              Contact your administrator for the professor key.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="prof-name">Name</Label>
            <Input
              id="prof-name"
              placeholder="First Last"
              value={profSignupForm.name}
              onChange={handleProfSignupChange("name")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prof-email">ASU Email</Label>
            <Input
              id="prof-email"
              type="email"
              placeholder="asurite@asu.edu"
              value={profSignupForm.email}
              onChange={handleProfSignupChange("email")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prof-password">Password</Label>
            <Input
              id="prof-password"
              type="password"
              placeholder="••••••••"
              value={profSignupForm.password}
              onChange={handleProfSignupChange("password")}
            />
            <p className="text-xs text-[#7a645a]">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="prof-confirm">Confirm Password</Label>
            <Input
              id="prof-confirm"
              type="password"
              placeholder="••••••••"
              value={profSignupForm.confirmPassword}
              onChange={handleProfSignupChange("confirmPassword")}
            />
          </div>

          <Button className="w-full bg-[#8C1D40] hover:bg-[#6e1632] text-white mt-2">
            Sign Up
          </Button>
        </form>

        <div className="mt-2 text-center text-xs text-[#5a4740]">
          Already have an account?{" "}
          <button
            type="button"
            className="underline text-[#8C1D40]"
            onClick={goToSignIn}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );

  /** 6. Student journey choice (CS vs Cybersecurity) */
  const renderStudentJourney = () => (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="pt-8 pb-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#8C1D40]">
            Arizona State University
          </h2>
          <p className="text-xs text-[#4c3a34]">
            CSE 230: Computer Org/Assemb Lang Prog
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm text-[#3b2f2a]">
              Create an account
            </h3>
            <p className="text-xs text-[#5a4740]">
              Enter your information to create your account
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-[#8C1D40] underline"
            onClick={() => setView("signup-role")}
          >
            Back
          </button>
        </div>

        <div className="mt-2">
          <p className="text-xs font-medium mb-2 text-[#3b2f2a]">
            Choose Your Journey:
          </p>
          <div className="space-y-3">
            <Button
              type="button"
              className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
              onClick={() => {
                setSelectedJourney("cs");
                resetErrors();
                setView("signup-student-form");
              }}
            >
              Computer Science
            </Button>
            <Button
              type="button"
              className="w-full bg-white text-[#8C1D40] border border-[#8C1D40] hover:bg-[#f8e9e9]"
              onClick={() => {
                setSelectedJourney("cyber");
                resetErrors();
                setView("signup-student-form");
              }}
            >
              Cybersecurity
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-[#5a4740]">
          Already have an account?{" "}
          <button
            type="button"
            className="underline text-[#8C1D40]"
            onClick={goToSignIn}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );

  /** 7. Student sign-up form after they choose CS / Cyber */
  const renderStudentSignupForm = () => {
    const journeyLabel =
      selectedJourney === "cs" ? "Computer Science" : "Cybersecurity";

    return (
      <Card className="w-full max-w-md bg-white">
        <CardContent className="pt-8 pb-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#8C1D40]">
              Arizona State University
            </h2>
            <p className="text-xs text-[#4c3a34]">
              CSE 230: Computer Org/Assemb Lang Prog
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm text-[#3b2f2a]">
                Create an account
              </h3>
              <p className="text-xs text-[#5a4740]">
                Enter your information to create your account
              </p>
            </div>
            <button
              type="button"
              className="text-xs text-[#8C1D40] underline"
              onClick={() => {
                resetErrors();
                setView("signup-student-journey");
              }}
            >
              Change
            </button>
          </div>

          <div className="text-xs font-medium bg-rose-50 text-[#8C1D40] px-3 py-2 rounded-md">
            Student – {journeyLabel}
          </div>

          {renderError()}

          <form onSubmit={submitStudentSignup} className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label htmlFor="student-name">Name</Label>
              <Input
                id="student-name"
                placeholder="First Last"
                value={studentSignupForm.name}
                onChange={handleStudentSignupChange("name")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="student-email">ASU Email</Label>
              <Input
                id="student-email"
                type="email"
                placeholder="asurite@asu.edu"
                value={studentSignupForm.email}
                onChange={handleStudentSignupChange("email")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="student-password">Password</Label>
              <Input
                id="student-password"
                type="password"
                placeholder="••••••••"
                value={studentSignupForm.password}
                onChange={handleStudentSignupChange("password")}
              />
              <p className="text-xs text-[#7a645a]">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="student-confirm">Confirm Password</Label>
              <Input
                id="student-confirm"
                type="password"
                placeholder="••••••••"
                value={studentSignupForm.confirmPassword}
                onChange={handleStudentSignupChange("confirmPassword")}
              />
            </div>

            <Button className="w-full bg-[#8C1D40] hover:bg-[#6e1632] text-white mt-2">
              Sign Up
            </Button>
          </form>

          <div className="mt-2 text-center text-xs text-[#5a4740]">
            Already have an account?{" "}
            <button
              type="button"
              className="underline text-[#8C1D40]"
              onClick={goToSignIn}
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ---------- MAIN RENDER ----------

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe4] px-4">
      {view === "welcome" && renderWelcome()}
      {view === "signin-role" && renderSigninRole()}
      {view === "signin-student" && renderSigninForm("student")}
      {view === "signin-professor" && renderSigninForm("professor")}
      {view === "signup-role" && renderSignupRole()}
      {view === "signup-professor" && renderProfessorSignup()}
      {view === "signup-student-journey" && renderStudentJourney()}
      {view === "signup-student-form" && renderStudentSignupForm()}

      {/* Back-to-welcome helper in the bottom-left corner */}
      {view !== "welcome" && (
        <button
          type="button"
          className="fixed bottom-4 left-4 text-xs text-[#5a4740] underline"
          onClick={goBackToWelcome}
        >
          Back to welcome
        </button>
      )}
    </div>
  );
}
