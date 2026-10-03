import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";

import {
  saveUser,
  getUser,
  saveSession,
  getSession,
  saveProfile,
  saveAnalysis,
  getAnalysis,
} from "./utils/storage";

function App() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(getSession());
  const [showDashboard, setShowDashboard] = useState(getSession());

  // Stores the account created through Signup
  const [registeredUser, setRegisteredUser] = useState(getUser());

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Roadmap is only loaded into the UI after login.
// This prevents saved roadmaps from appearing on the public homepage.
const [analysis, setAnalysis] = useState(
  getSession() ? getAnalysis() : null
);
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // INITIAL FORM DATA
  // ============================================================

  const initialFormData = {
    educationLevel: "",
    education: "",
    stream: "",
    subjects: "",
    targetExam: "",
    degree: "",
    branch: "",
    year: "",
    specialization: "",
    highestQualification: "",
    currentRole: "",
    experience: "",
    otherEducation: "",
    skills: "",
    interests: "",
    careerGoal: "",
    resume: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  // ============================================================
  // SAFE HELPERS
  // ============================================================

  const safeString = (value, fallback = "") => {
    if (typeof value === "string") {
      return value.trim();
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    return fallback;
  };

  const safeArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
      )
      .map((item) => String(item));
  };

  const safeObject = (value) => {
    return value &&
      typeof value === "object" &&
      !Array.isArray(value)
      ? value
      : {};
  };

  // ============================================================
  // NORMALIZE AI ANALYSIS
  // ============================================================

  const normalizeFrontendAnalysis = (raw) => {
    if (!raw) {
      return null;
    }

    let data = raw;

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return {
          type: "text",
          content: data,
        };
      }
    }

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      return {
        type: "text",
        content: String(data),
      };
    }

    const careerRecommendation =
      safeObject(data.careerRecommendation);

    let matchPercentage = Number(
      careerRecommendation.matchPercentage
    );

    if (!Number.isFinite(matchPercentage)) {
      matchPercentage = 0;
    }

    matchPercentage = Math.min(
      100,
      Math.max(0, Math.round(matchPercentage))
    );

    const roadmap = Array.isArray(data.roadmap)
      ? data.roadmap
          .filter(
            (phase) =>
              phase &&
              typeof phase === "object" &&
              !Array.isArray(phase)
          )
          .map((phase, index) => ({
            phase:
              safeString(phase.phase) ||
              `Phase ${index + 1}`,

            title:
              safeString(phase.title) ||
              "Career Development Phase",

            duration:
              safeString(phase.duration) ||
              "To be determined",

            goals: safeArray(phase.goals),

            skills: safeArray(phase.skills),

            actions: safeArray(phase.actions),
          }))
      : [];

    return {
      type: "structured",

      profileSummary: safeString(
        data.profileSummary,
        "Pathora could not generate a profile summary."
      ),

      careerRecommendation: {
        career: safeString(
          careerRecommendation.career,
          "Career direction not determined"
        ),

        reason: safeString(
          careerRecommendation.reason,
          "The recommendation is based on the available profile information."
        ),

        matchPercentage,
      },

      strengths: safeArray(data.strengths),

      skillGaps: safeArray(data.skillGaps),

      roadmap,

      examsAndCertifications: safeArray(
        data.examsAndCertifications
      ),

      projects: safeArray(data.projects),

      shortTermGoals: safeArray(
        data.shortTermGoals
      ),

      longTermGoals: safeArray(
        data.longTermGoals
      ),

      finalAdvice: safeString(
        data.finalAdvice,
        "Focus on building strong fundamentals, developing practical skills, and consistently working toward your chosen career direction."
      ),
    };
  };

  // ============================================================
  // OPEN ROADMAP BUILDER
  // ============================================================

  const openBuilder = () => {
    setShowDashboard(false);
    setShowBuilder(true);
    setErrorMessage("");

    setTimeout(() => {
      document
        .getElementById("roadmap-builder")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // ============================================================
  // OPEN LOGIN
  // ============================================================

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setShowForgotPassword(false);
  };

  // ============================================================
  // OPEN SIGNUP
  // ============================================================

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setShowForgotPassword(false);
  };

  // ============================================================
  // OPEN FORGOT PASSWORD
  // ============================================================

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setShowSignup(false);
  };

  // ============================================================
  // ACCOUNT CREATED
  // ============================================================

  const handleAccountCreated = (userData) => {
    setRegisteredUser(userData);

    // Save the account so it survives a browser refresh.
    saveUser(userData);

    // A newly created account still needs to log in.
    saveSession(false);
    setIsLoggedIn(false);
    setShowDashboard(false);

    // After creating account, open Login page
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  // ============================================================
  // SUCCESSFUL LOGIN
  // ============================================================

  const handleLoginSuccess = () => {
  // Restore the user's saved roadmap after successful login.
  const savedAnalysis = getAnalysis();

  setAnalysis(savedAnalysis);

  setIsLoggedIn(true);
  setShowLogin(false);
  setShowSignup(false);
  setShowForgotPassword(false);
  setShowDashboard(true);

  // Keep the login session after a browser refresh.
  saveSession(true);

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
};

  // ============================================================
  // PASSWORD RESET
  // ============================================================

  const handlePasswordReset = (newPassword) => {
    if (!registeredUser) {
      return;
    }

    const updatedUser = {
      ...registeredUser,
      password: newPassword,
    };

    setRegisteredUser(updatedUser);
    saveUser(updatedUser);

    setShowForgotPassword(false);
    setShowLogin(true);
  };

  // ============================================================
  // BACK FROM FORGOT PASSWORD
  // ============================================================

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  // ============================================================
  // OPEN DASHBOARD
  // ============================================================

    const openDashboard = () => {
  if (!isLoggedIn) {
    openLogin();
    return;
  }

  // Reload the saved roadmap from storage.
  setAnalysis(getAnalysis());

  setShowDashboard(true);
  setShowLogin(false);
  setShowSignup(false);
  setShowForgotPassword(false);
  setShowBuilder(false);

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
};


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    setIsLoggedIn(false);
    setShowDashboard(false);
    setShowBuilder(false);

    // Logout ends the session but keeps the account saved.
    saveSession(false);
    setAnalysis(null);
    setErrorMessage("");
    setFormData(initialFormData);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // BACK FROM LOGIN
  // ============================================================

  const closeLogin = () => {
    setShowLogin(false);
  };

  // ============================================================
  // BACK FROM SIGNUP
  // ============================================================

  const closeSignup = () => {
    setShowSignup(false);
  };

  // ============================================================
  // START NEW PROFILE
  // ============================================================

  const analyzeAnotherProfile = () => {
    setFormData(initialFormData);
    setAnalysis(null);
    setErrorMessage("");
    setShowBuilder(true);

    const resumeInput =
      document.getElementById("resume");

    if (resumeInput) {
      resumeInput.value = "";
    }

    setTimeout(() => {
      document
        .getElementById("roadmap-builder")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 150);
  };

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // HANDLE EDUCATION LEVEL
  // ============================================================

  const handleEducationLevelChange = (e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,

      educationLevel: value,

      education: "",
      stream: "",
      subjects: "",
      targetExam: "",
      degree: "",
      branch: "",
      year: "",
      specialization: "",
      highestQualification: "",
      currentRole: "",
      experience: "",
      otherEducation: "",
    }));
  };

  // ============================================================
  // BUILD EDUCATION SUMMARY
  // ============================================================

  const buildEducationSummary = () => {
    const level = formData.educationLevel;

    if (!level) {
      return formData.education.trim();
    }

    const details = [];

    details.push(`Education Level: ${level}`);

    // SCHOOL STUDENTS
    if (
      level === "Class 10" ||
      level === "Class 11" ||
      level === "Class 12"
    ) {
      if (formData.stream.trim()) {
        details.push(
          `Stream: ${formData.stream.trim()}`
        );
      }

      if (formData.subjects.trim()) {
        details.push(
          `Subjects: ${formData.subjects.trim()}`
        );
      }

      if (formData.targetExam.trim()) {
        details.push(
          `Target Exam / Goal: ${formData.targetExam.trim()}`
        );
      }
    }

    // DIPLOMA
    if (level === "Diploma") {
      if (formData.degree.trim()) {
        details.push(
          `Diploma: ${formData.degree.trim()}`
        );
      }

      if (formData.branch.trim()) {
        details.push(
          `Branch / Specialization: ${formData.branch.trim()}`
        );
      }

      if (formData.year.trim()) {
        details.push(
          `Year: ${formData.year.trim()}`
        );
      }
    }

    // UNDERGRADUATE
    if (
      level ===
      "Undergraduate / College Student"
    ) {
      if (formData.degree.trim()) {
        details.push(
          `Degree: ${formData.degree.trim()}`
        );
      }

      if (formData.branch.trim()) {
        details.push(
          `Branch / Specialization: ${formData.branch.trim()}`
        );
      }

      if (formData.year.trim()) {
        details.push(
          `Current Year: ${formData.year.trim()}`
        );
      }
    }

    // POSTGRADUATE
    if (level === "Postgraduate") {
      if (formData.degree.trim()) {
        details.push(
          `Degree: ${formData.degree.trim()}`
        );
      }

      if (formData.specialization.trim()) {
        details.push(
          `Specialization: ${formData.specialization.trim()}`
        );
      }

      if (formData.year.trim()) {
        details.push(
          `Current Year: ${formData.year.trim()}`
        );
      }
    }

    // GRADUATE / JOB SEEKER
    if (
      level ===
      "Graduate / Job Seeker"
    ) {
      if (
        formData.highestQualification.trim()
      ) {
        details.push(
          `Highest Qualification: ${formData.highestQualification.trim()}`
        );
      }

      if (formData.branch.trim()) {
        details.push(
          `Specialization / Branch: ${formData.branch.trim()}`
        );
      }
    }

    // WORKING PROFESSIONAL
    if (
      level ===
      "Working Professional"
    ) {
      if (formData.currentRole.trim()) {
        details.push(
          `Current Role: ${formData.currentRole.trim()}`
        );
      }

      if (formData.experience.trim()) {
        details.push(
          `Work Experience: ${formData.experience.trim()}`
        );
      }

      if (
        formData.highestQualification.trim()
      ) {
        details.push(
          `Highest Qualification: ${formData.highestQualification.trim()}`
        );
      }
    }

    // OTHER
    if (level === "Other") {
      if (formData.otherEducation.trim()) {
        details.push(
          `Details: ${formData.otherEducation.trim()}`
        );
      }
    }

    return details.join(" | ");
  };

  // ============================================================
  // HANDLE RESUME
  // ============================================================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        resume: null,
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Resume file is too large. Please upload a file smaller than 5 MB."
      );

      e.target.value = "";

      setFormData((prev) => ({
        ...prev,
        resume: null,
      }));

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Unsupported resume format. Please upload a PDF or DOCX file."
      );

      e.target.value = "";

      setFormData((prev) => ({
        ...prev,
        resume: null,
      }));

      return;
    }

    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  // ============================================================
  // REMOVE RESUME
  // ============================================================

  const removeResume = () => {
    setFormData((prev) => ({
      ...prev,
      resume: null,
    }));

    const resumeInput =
      document.getElementById("resume");

    if (resumeInput) {
      resumeInput.value = "";
    }
  };

  // ============================================================
  // ANALYZE PROFILE
  // ============================================================

  const handleAnalyze = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    const educationSummary =
      buildEducationSummary();

    if (
      !educationSummary.trim() &&
      !formData.skills.trim() &&
      !formData.interests.trim() &&
      !formData.careerGoal.trim() &&
      !formData.resume
    ) {
      setErrorMessage(
        "Please enter at least one detail about your education, skills, interests, career goal, or upload a resume."
      );

      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const data = new FormData();

      data.append(
        "education",
        educationSummary.trim()
      );

      data.append(
        "skills",
        formData.skills.trim()
      );

      data.append(
        "interests",
        formData.interests.trim()
      );

      data.append(
        "careerGoal",
        formData.careerGoal.trim()
      );

      if (formData.resume) {
        data.append(
          "resume",
          formData.resume
        );
      }

      console.log(
        "Education sent to Pathora:",
        educationSummary
      );

      console.log(
        "Sending profile to Pathora backend..."
      );

      const response = await fetch(
       "https://pathora-backend-ud61.onrender.com/api/analyze",
        {
          method: "POST",
          body: data,
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let result;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        result =
          await response.json();
      } else {
        const text =
          await response.text();

        throw new Error(
          text ||
            "Backend returned an invalid response."
        );
      }

      console.log(
        "PATHORA BACKEND RESPONSE:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Pathora could not analyze your profile."
        );
      }

      if (
        result.analysis === undefined ||
        result.analysis === null
      ) {
        throw new Error(
          "Pathora received an empty AI analysis."
        );
      }

      const receivedAnalysis =
        normalizeFrontendAnalysis(
          result.analysis
        );

      console.log(
        "PATHORA FINAL ANALYSIS:",
        receivedAnalysis
      );

      if (!receivedAnalysis) {
        throw new Error(
          "Pathora could not process the AI analysis."
        );
      }

      setAnalysis(
        receivedAnalysis
      );

      // Save the latest profile and AI roadmap so the
      // user's Dashboard can show it later. File objects
      // cannot be stored directly in localStorage.
      saveProfile({
        ...formData,
        education: educationSummary.trim(),
        resume: null,
      });

      saveAnalysis(receivedAnalysis);

      setTimeout(() => {
        document
          .getElementById(
            "analysis-result"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 200);

    } catch (error) {
      console.error(
        "PATHORA ANALYSIS ERROR:",
        error
      );

      setAnalysis(null);

      setErrorMessage(
        error?.message ||
          "Unable to connect to Pathora AI backend. Please make sure the backend is running on port 5000."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================================
  // RENDER AI ANALYSIS
  // ============================================================

  const renderAnalysis = () => {
    if (!analysis) {
      return null;
    }

    if (
      analysis.type === "text"
    ) {
      return (
        <div className="analysis-content">
          <p>
            {analysis.content}
          </p>
        </div>
      );
    }

    return (
      <div className="structured-analysis">

        {analysis.profileSummary && (
          <div className="analysis-section profile-summary-section">

            <div className="analysis-section-title">
              <span>👤</span>
              <h3>
                Profile Summary
              </h3>
            </div>

            <p>
              {analysis.profileSummary}
            </p>

          </div>
        )}

        <div className="career-recommendation">

          <div className="analysis-section-title">
            <span>🎯</span>
            <h3>
              Recommended Career
            </h3>
          </div>

          <div className="career-main">

            <div className="career-details">

              <h2>
                {
                  analysis
                    .careerRecommendation
                    .career
                }
              </h2>

              <p>
                {
                  analysis
                    .careerRecommendation
                    .reason
                }
              </p>

            </div>

            <div className="match-score">

              <strong>
                {
                  analysis
                    .careerRecommendation
                    .matchPercentage
                }%
              </strong>

              <span>
                Profile Match
              </span>

            </div>

          </div>

        </div>

        {analysis.strengths.length > 0 && (
          <div className="analysis-section">

            <div className="analysis-section-title">
              <span>💪</span>
              <h3>
                Your Strengths
              </h3>
            </div>

            <div className="analysis-list strengths-list">

              {analysis.strengths.map(
                (strength, index) => (
                  <div
                    className="analysis-list-item"
                    key={`strength-${index}`}
                  >
                    <span>✓</span>

                    <p>
                      {strength}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {analysis.skillGaps.length > 0 && (
          <div className="analysis-section">

            <div className="analysis-section-title">
              <span>📈</span>

              <h3>
                Skills You Need to Develop
              </h3>
            </div>

            <div className="analysis-list">

              {analysis.skillGaps.map(
                (gap, index) => (
                  <div
                    className="analysis-list-item"
                    key={`gap-${index}`}
                  >
                    <span>→</span>

                    <p>
                      {gap}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {analysis.roadmap.length > 0 && (
          <div className="analysis-section roadmap-section">

            <div className="analysis-section-title">
              <span>🧭</span>

              <h3>
                Your Career Roadmap
              </h3>
            </div>

            <div className="roadmap-timeline">

              {analysis.roadmap.map(
                (phase, index) => (
                  <div
                    className="roadmap-phase"
                    key={`phase-${index}`}
                  >

                    <div className="phase-number">
                      {index + 1}
                    </div>

                    <div className="phase-content">

                      <div className="phase-header">

                        <div>

                          <span className="phase-label">
                            {phase.phase}
                          </span>

                          <h3>
                            {phase.title}
                          </h3>

                        </div>

                        {phase.duration && (
                          <span className="phase-duration">
                            ⏱ {phase.duration}
                          </span>
                        )}

                      </div>

                      {phase.goals.length > 0 && (
                        <div className="phase-block">

                          <h4>
                            🎯 Goals
                          </h4>

                          <ul>

                            {phase.goals.map(
                              (
                                goal,
                                goalIndex
                              ) => (
                                <li
                                  key={`goal-${index}-${goalIndex}`}
                                >
                                  {goal}
                                </li>
                              )
                            )}

                          </ul>

                        </div>
                      )}

                      {phase.skills.length > 0 && (
                        <div className="phase-block">

                          <h4>
                            💻 Skills
                          </h4>

                          <div className="skill-tags">

                            {phase.skills.map(
                              (
                                skill,
                                skillIndex
                              ) => (
                                <span
                                  key={`skill-${index}-${skillIndex}`}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>

                        </div>
                      )}

                      {phase.actions.length > 0 && (
                        <div className="phase-block">

                          <h4>
                            🚀 Actions
                          </h4>

                          <ul>

                            {phase.actions.map(
                              (
                                action,
                                actionIndex
                              ) => (
                                <li
                                  key={`action-${index}-${actionIndex}`}
                                >
                                  {action}
                                </li>
                              )
                            )}

                          </ul>

                        </div>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {analysis.examsAndCertifications.length > 0 && (
          <div className="analysis-section">

            <div className="analysis-section-title">
              <span>🏆</span>

              <h3>
                Certifications & Exams
              </h3>
            </div>

            <div className="card-grid">

              {analysis.examsAndCertifications.map(
                (item, index) => (
                  <div
                    className="mini-card"
                    key={`cert-${index}`}
                  >

                    <span>
                      🏆
                    </span>

                    <p>
                      {item}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {analysis.projects.length > 0 && (
          <div className="analysis-section">

            <div className="analysis-section-title">

              <span>
                🛠️
              </span>

              <h3>
                Recommended Projects
              </h3>

            </div>

            <div className="card-grid">

              {analysis.projects.map(
                (project, index) => (
                  <div
                    className="mini-card project-card"
                    key={`project-${index}`}
                  >

                    <span>
                      🚀
                    </span>

                    <p>
                      {project}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {(analysis.shortTermGoals.length > 0 ||
          analysis.longTermGoals.length > 0) && (

          <div className="goals-container">

            {analysis.shortTermGoals.length > 0 && (
              <div className="goal-column">

                <div className="analysis-section-title">

                  <span>
                    ⚡
                  </span>

                  <h3>
                    Short-Term Goals
                  </h3>

                </div>

                <ul>

                  {analysis.shortTermGoals.map(
                    (goal, index) => (
                      <li
                        key={`short-${index}`}
                      >
                        {goal}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {analysis.longTermGoals.length > 0 && (
              <div className="goal-column">

                <div className="analysis-section-title">

                  <span>
                    🌟
                  </span>

                  <h3>
                    Long-Term Goals
                  </h3>

                </div>

                <ul>

                  {analysis.longTermGoals.map(
                    (goal, index) => (
                      <li
                        key={`long-${index}`}
                      >
                        {goal}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

          </div>
        )}

        {analysis.finalAdvice && (
          <div className="final-advice">

            <div className="analysis-section-title">

              <span>
                💡
              </span>

              <h3>
                Pathora's Advice
              </h3>

            </div>

            <p>
              {analysis.finalAdvice}
            </p>

          </div>
        )}

      </div>
    );
  };

  // ============================================================
  // DASHBOARD PAGE
  // ============================================================

  if (showDashboard && isLoggedIn) {
    return (
      <Dashboard
        registeredUser={registeredUser}
        analysis={analysis}
        onBack={() => setShowDashboard(false)}
        onBuildRoadmap={openBuilder}
        onLogout={handleLogout}
      />
    );
  }

  // ============================================================
  // FORGOT PASSWORD PAGE
  // ============================================================

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={closeForgotPassword}
        registeredUser={registeredUser}
        onPasswordReset={handlePasswordReset}
      />
    );
  }

  // ============================================================
  // LOGIN PAGE
  // ============================================================

  if (showLogin) {
    return (
      <Login
        onBack={closeLogin}
        onSignup={openSignup}
        onLogin={handleLoginSuccess}
        registeredUser={registeredUser}
        onForgotPassword={openForgotPassword}
      />
    );
  }

  // ============================================================
  // SIGNUP PAGE
  // ============================================================

  if (showSignup) {
    return (
      <Signup
        onBack={closeSignup}
        onLogin={openLogin}
        onAccountCreated={handleAccountCreated}
      />
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div>

      {/* ========================================================
          NAVBAR
      ======================================================== */}

      <nav className="navbar">

        <div className="logo">

          <img
            src="/pathora-logo.png"
            alt="Pathora AI Logo"
            className="pathora-logo"
          />

          <span>
            Pathora<span>AI</span>
          </span>

        </div>

        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#about">
            About
          </a>

          <a href="#developer">
            Developer
          </a>

        </div>

        {/* ======================================================
            PROFILE / LOGIN / LOGOUT + GET STARTED
        ====================================================== */}

        <div className="nav-actions">

          {!isLoggedIn ? (
            <button
              className="login-nav-button"
              onClick={openLogin}
            >
              Login
            </button>
          ) : (
            <>
              <button
                className="profile-nav-button"
                onClick={openDashboard}
              >
                <span className="profile-nav-icon">👤</span>
                Profile
              </button>

              <button
                className="login-nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          <button
            className="nav-button"
            onClick={openBuilder}
          >
            Get Started
          </button>

        </div>

      </nav>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main>

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="hero">

          <p className="hero-label">
            AI-POWERED CAREER GUIDANCE
          </p>

          <h1>

            Your career path,

            <br />

            <span>
              powered by AI.
            </span>

          </h1>

          <p className="hero-description">

            Pathora doesn't just analyze resumes—it
            creates a personalized career roadmap
            designed around your skills, interests,
            education, and goals.

          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={openBuilder}
            >
              Build My Roadmap →
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Pathora
            </button>

          </div>

        </section>

        {/* ======================================================
            FEATURES
        ====================================================== */}

        <section
          className="features"
          id="features"
        >

          <div className="section-heading">

            <p className="section-label">
              WHAT PATHORA DOES
            </p>

            <h2>
              Everything you need to find your
              direction.
            </h2>

            <p>
              From understanding your current
              skills to planning your next steps,
              Pathora turns career confusion into
              a clear direction.
            </p>

          </div>

          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                📄
              </div>

              <h3>
                Resume Intelligence
              </h3>

              <p>
                AI analyzes your resume,
                identifies your strengths,
                and highlights the skills
                you need to improve.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🧭
              </div>

              <h3>
                Career Discovery
              </h3>

              <p>
                Discover career paths that
                match your skills, interests,
                education, and personal goals.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🚀
              </div>

              <h3>
                Personalized Roadmap
              </h3>

              <p>
                Get a practical step-by-step
                roadmap showing what to learn,
                improve, and do next.
              </p>

            </div>

          </div>

        </section>

        {/* ======================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          className="how-it-works"
          id="how-it-works"
        >

          <div className="section-heading">

            <p className="section-label">
              HOW PATHORA WORKS
            </p>

            <h2>
              Your journey from confusion
              to clarity.
            </h2>

            <p>
              Three simple steps to understand
              where you are, where you can go,
              and how to get there.
            </p>

          </div>

          <div className="steps-grid">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                📄
              </div>

              <h3>
                Share Your Profile
              </h3>

              <p>
                Tell Pathora about your education,
                skills, interests, goals, and
                optionally upload your resume.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                🧠
              </div>

              <h3>
                AI Analyzes Your Profile
              </h3>

              <p>
                Pathora analyzes your skills,
                strengths, gaps, interests,
                and potential career paths.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                🚀
              </div>

              <h3>
                Get Your Roadmap
              </h3>

              <p>
                Receive a personalized roadmap
                showing what to learn, improve,
                and do next.
              </p>

            </div>

          </div>

        </section>

        {/* ======================================================
            ABOUT
        ====================================================== */}

        <section
          className="about"
          id="about"
        >

          <div className="about-content">

            <div className="about-text">

              <p className="section-label">
                ABOUT PATHORA
              </p>

              <h2>
                Turn career confusion into
                a clear direction.
              </h2>

              <p>
                Pathora is an AI-powered career
                guidance platform designed to
                help students and early-career
                professionals understand their
                strengths and discover suitable
                career opportunities.
              </p>

              <p>
                Instead of simply analyzing a
                resume, Pathora connects your
                skills, interests, education,
                and goals to create a personalized
                career roadmap.
              </p>

              <button
                className="primary-button"
                onClick={openBuilder}
              >
                Start Your Journey →
              </button>

            </div>

            <div className="about-card">

              <div className="about-icon">
                🧭
              </div>

              <h3>
                Our Vision
              </h3>

              <p>
                Make career guidance more
                accessible, personalized,
                and actionable for every
                student.
              </p>

              <div className="vision-points">

                <div>
                  ✓ Personalized guidance
                </div>

                <div>
                  ✓ Skill-based career discovery
                </div>

                <div>
                  ✓ Step-by-step roadmaps
                </div>

                <div>
                  ✓ AI-powered insights
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            ABOUT THE DEVELOPER
        ====================================================== */}

        <section
          className="developer-section"
          id="developer"
        >

          <div className="developer-container">

            <div className="section-heading">
              <p className="section-label">
                ABOUT THE DEVELOPER
              </p>

              <h2>
                Meet the developer behind Pathora.
              </h2>

              <p>
                Pathora is built with the goal of making
                career guidance more personal, practical,
                and accessible for students.
              </p>
            </div>

            <div className="developer-card">

              <div className="developer-photo-wrapper">
                <img
                  src="/developer-photo.jpg"
                  alt="Pathora developer"
                  className="developer-photo"
                  loading="lazy"
                />
              </div>

              <div className="developer-info">

                <p className="developer-label">
                  DEVELOPER & CREATOR
                </p>

                <h3>
                  Tanmay Mishra
                </h3>

                <p className="developer-role">
                  B.Tech CSE-AIML Student at Axis Colleges | Developer & AI Enthusiast
                </p>

                <p>
                  Hi! I'm Tanmay, the developer behind Pathora.
                  I created Pathora as a project focused on helping
                  students understand their strengths, explore
                  suitable career directions, and turn uncertainty
                  into a practical roadmap.
                </p>

                <p>
                  If you have a question, suggestion, feedback,
                  or simply want to get in touch, feel free to
                  reach out by email.
                </p>

                <a
                  className="developer-email"
                  href="mailto:mishratanmay164@gmail.com"
                >
                  ✉ mishratanmay164@gmail.com
                </a>

              </div>

            </div>

          </div>

        </section>

            {/* =====================================================
            AXIS COLLEGES — EXPLORE
        ===================================================== */}

        <section
          className="about college-section"
          id="college"
        >

          <div className="about-content">

            <div className="about-text">

              <p className="section-label">
                EXPLORE →
              </p>

              <h2>
                Want to know a little more about the college where
                <span> Pathora was created?</span>
              </h2>

              <p>
                Pathora was developed as a college project at
                <strong> Axis Colleges</strong>, Kanpur.
              </p>

              <p>
                If you're exploring colleges and looking for a place where
                students can work on technology, innovation, and practical
                projects, you can explore Axis Colleges and learn more about
                its academic environment and opportunities.
              </p>

              <a
                href="https://axiscolleges.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
              >
                Explore Axis Colleges →
              </a>

            </div>


            <div className="about-card">

              <div className="about-icon">
                🎓
              </div>

              <h3>
                Axis Colleges
              </h3>

              <p>
                A place where Pathora took shape as a student project,
                combining technology, learning, and practical development.
              </p>

              <div className="vision-points">

                <div>
                  ✓ Technology-focused learning
                </div>

                <div>
                  ✓ Practical project development
                </div>

                <div>
                  ✓ Student innovation
                </div>

                <div>
                  ✓ Career-oriented education
                </div>

              </div>

            </div>

          </div>

        </section>


     

<div className="axis-achievements-layout">

  <div className="axis-achievements-header">
    <div className="axis-panel-kicker">Academic Achievements</div>

    <h3>
      Building <span>Knowledge, Skills & Excellence</span>
    </h3>

    <p>
      Axis Colleges focuses on academic development, competitive
      preparation, technical skills and industry-oriented learning.
    </p>
  </div>

  <div className="axis-achievement-grid">

    <div className="axis-achievement-card">
      <h4>🏆 GATE Success</h4>
      <p>
        Engineering students have demonstrated strong performance in
        competitive examinations. In GATE 2026, 15 CSE/IT students
        qualified, including students securing national ranks such as
        AIR 593 and AIR 665.
      </p>
    </div>

    <div className="axis-achievement-card">
      <h4>🎓 AKTU-Aligned Education</h4>
      <p>
        The engineering curriculum follows the academic framework of
        Dr. A.P.J. Abdul Kalam Technical University (AKTU), supported
        by AICTE-approved programs.
      </p>
    </div>

    <div className="axis-achievement-card">
      <h4>💻 Technical Learning</h4>
      <p>
        Students receive opportunities to strengthen technical
        knowledge through coding activities, practical laboratories,
        projects, technical training and skill-development programs.
      </p>
    </div>

    <div className="axis-achievement-card">
      <h4>🚀 Innovation & Hackathons</h4>
      <p>
        The institution encourages students to participate in
        technology-focused activities and events, including screening
        and participation opportunities connected with initiatives
        such as Smart India Hackathon.
      </p>
    </div>

    <div className="axis-achievement-card">
      <h4>🏅 Institutional Recognition</h4>
      <p>
        Axis Colleges has received academic and institutional
        recognition, including recognition associated with the
        QS I-Gauge and ASSOCHAM academic excellence initiatives.
      </p>
    </div>

    <div className="axis-achievement-card">
      <h4>📚 Diverse Programs</h4>
      <p>
        The engineering wing offers B.Tech programs across CSE,
        AI & ML, Data Science, IT, ECE, Electrical, Mechanical and
        Civil Engineering, along with postgraduate and diploma-level
        technical education.
      </p>
    </div>

  </div>

  <div className="axis-package-highlight">
    <strong>63-Acre Campus</strong>
    <span>
      A technology-focused learning environment at Axis Knowledge City,
      Rooma, Kanpur.
    </span>
  </div>

</div>




        {/* ======================================================
            ROADMAP BUILDER
        ====================================================== */}

        {showBuilder && (
          <section
            className="roadmap-builder"
            id="roadmap-builder"
          >

            <div className="builder-container">

              <div className="section-heading">

                <p className="section-label">
                  PATHORA ROADMAP BUILDER
                </p>

                <h2>
                  Build your personalized
                  career roadmap.
                </h2>

                <p>
                  Tell Pathora about yourself.
                  Your education details help
                  Pathora understand your current
                  level and create better guidance.
                </p>

              </div>

              {/* ERROR */}

              {errorMessage && (
                <div
                  className="analysis-error"
                  role="alert"
                >

                  <strong>
                    Pathora couldn't complete the analysis.
                  </strong>

                  <p>
                    {errorMessage}
                  </p>

                </div>
              )}

              {/* ==================================================
                  BUILDER FORM
              ================================================== */}

              <form
                className="builder-form"
                onSubmit={handleAnalyze}
              >

                {/* RESUME */}

                <div className="form-group">

                  <label htmlFor="resume">
                    📄 Upload Your Resume
                  </label>

                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeChange}
                  />

                  {formData.resume && (
                    <div className="file-selected">

                      <p className="file-name">
                        Selected:{" "}
                        {formData.resume.name}
                      </p>

                      <button
                        type="button"
                        className="remove-resume-button"
                        onClick={removeResume}
                      >
                        ✕ Remove Resume
                      </button>

                    </div>
                  )}

                  <small className="file-info">
                    Supported formats: PDF, DOCX
                  </small>

                  <small className="file-info">
                    Resume is optional. You can
                    continue without one.
                  </small>

                </div>

                {/* EDUCATION LEVEL */}

                <div className="form-group">

                  <label htmlFor="educationLevel">
                    🎓 Education Level
                  </label>

                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleEducationLevelChange}
                  >

                    <option value="">
                      Select your current education level
                    </option>

                    <option value="Class 10">
                      Class 10
                    </option>

                    <option value="Class 11">
                      Class 11
                    </option>

                    <option value="Class 12">
                      Class 12
                    </option>

                    <option value="Diploma">
                      Diploma
                    </option>

                    <option value="Undergraduate / College Student">
                      Undergraduate / College Student
                    </option>

                    <option value="Postgraduate">
                      Postgraduate
                    </option>

                    <option value="Graduate / Job Seeker">
                      Graduate / Job Seeker
                    </option>

                    <option value="Working Professional">
                      Working Professional
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* SCHOOL */}

                {(formData.educationLevel === "Class 10" ||
                  formData.educationLevel === "Class 11" ||
                  formData.educationLevel === "Class 12") && (
                  <>

                    <div className="form-group">

                      <label htmlFor="stream">
                        📚 Stream
                      </label>

                      <input
                        id="stream"
                        name="stream"
                        type="text"
                        placeholder="Example: Science, Commerce, Arts"
                        value={formData.stream}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="subjects">
                        📖 Strong / Preferred Subjects
                      </label>

                      <textarea
                        id="subjects"
                        name="subjects"
                        placeholder="Example: Mathematics, Physics, Computer Science"
                        value={formData.subjects}
                        onChange={handleInputChange}
                        rows="3"
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="targetExam">
                        🎯 Target Exam or Future Goal
                      </label>

                      <input
                        id="targetExam"
                        name="targetExam"
                        type="text"
                        placeholder="Example: JEE, NEET, CUET, IIT, Engineering"
                        value={formData.targetExam}
                        onChange={handleInputChange}
                      />

                    </div>

                  </>
                )}

                {/* DIPLOMA */}

                {formData.educationLevel === "Diploma" && (
                  <>

                    <div className="form-group">

                      <label htmlFor="degree">
                        🎓 Diploma Program
                      </label>

                      <input
                        id="degree"
                        name="degree"
                        type="text"
                        placeholder="Example: Diploma in Computer Science"
                        value={formData.degree}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="branch">
                        💻 Branch / Specialization
                      </label>

                      <input
                        id="branch"
                        name="branch"
                        type="text"
                        placeholder="Example: Computer Engineering"
                        value={formData.branch}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="year">
                        📅 Current Year
                      </label>

                      <input
                        id="year"
                        name="year"
                        type="text"
                        placeholder="Example: 2nd Year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />

                    </div>

                  </>
                )}

                {/* UNDERGRADUATE */}

                {formData.educationLevel ===
                  "Undergraduate / College Student" && (
                  <>

                    <div className="form-group">

                      <label htmlFor="degree">
                        🎓 Degree
                      </label>

                      <input
                        id="degree"
                        name="degree"
                        type="text"
                        placeholder="Example: B.Tech, BCA, B.Sc"
                        value={formData.degree}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="branch">
                        💻 Branch / Specialization
                      </label>

                      <input
                        id="branch"
                        name="branch"
                        type="text"
                        placeholder="Example: Computer Science, AI/ML, IT"
                        value={formData.branch}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="year">
                        📅 Current Year
                      </label>

                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      >

                        <option value="">
                          Select your year
                        </option>

                        <option value="1st Year">
                          1st Year
                        </option>

                        <option value="2nd Year">
                          2nd Year
                        </option>

                        <option value="3rd Year">
                          3rd Year
                        </option>

                        <option value="4th Year">
                          4th Year
                        </option>

                        <option value="Final Year">
                          Final Year
                        </option>

                      </select>

                    </div>

                  </>
                )}

                {/* POSTGRADUATE */}

                {formData.educationLevel ===
                  "Postgraduate" && (
                  <>

                    <div className="form-group">

                      <label htmlFor="degree">
                        🎓 Degree
                      </label>

                      <input
                        id="degree"
                        name="degree"
                        type="text"
                        placeholder="Example: M.Tech, MCA, MBA, M.Sc"
                        value={formData.degree}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="specialization">
                        🔬 Specialization
                      </label>

                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        placeholder="Example: Artificial Intelligence"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="year">
                        📅 Current Year
                      </label>

                      <input
                        id="year"
                        name="year"
                        type="text"
                        placeholder="Example: 1st Year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />

                    </div>

                  </>
                )}

                {/* GRADUATE */}

                {formData.educationLevel ===
                  "Graduate / Job Seeker" && (
                  <>

                    <div className="form-group">

                      <label htmlFor="highestQualification">
                        🎓 Highest Qualification
                      </label>

                      <input
                        id="highestQualification"
                        name="highestQualification"
                        type="text"
                        placeholder="Example: B.Tech in Computer Science"
                        value={formData.highestQualification}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="branch">
                        💻 Specialization / Branch
                      </label>

                      <input
                        id="branch"
                        name="branch"
                        type="text"
                        placeholder="Example: Computer Science, Mechanical Engineering"
                        value={formData.branch}
                        onChange={handleInputChange}
                      />

                    </div>

                  </>
                )}

                {/* WORKING PROFESSIONAL */}

                {formData.educationLevel ===
                  "Working Professional" && (
                  <>

                    <div className="form-group">

                      <label htmlFor="currentRole">
                        💼 Current Role
                      </label>

                      <input
                        id="currentRole"
                        name="currentRole"
                        type="text"
                        placeholder="Example: Software Developer"
                        value={formData.currentRole}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="experience">
                        ⏳ Work Experience
                      </label>

                      <input
                        id="experience"
                        name="experience"
                        type="text"
                        placeholder="Example: 2 years"
                        value={formData.experience}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="form-group">

                      <label htmlFor="highestQualification">
                        🎓 Highest Qualification
                      </label>

                      <input
                        id="highestQualification"
                        name="highestQualification"
                        type="text"
                        placeholder="Example: B.Tech in Computer Science"
                        value={formData.highestQualification}
                        onChange={handleInputChange}
                      />

                    </div>

                  </>
                )}

                {/* OTHER */}

                {formData.educationLevel === "Other" && (
                  <div className="form-group">

                    <label htmlFor="otherEducation">
                      🎓 Education Details
                    </label>

                    <textarea
                      id="otherEducation"
                      name="otherEducation"
                      placeholder="Tell Pathora about your current education or learning background."
                      value={formData.otherEducation}
                      onChange={handleInputChange}
                      rows="4"
                    />

                  </div>
                )}

                {/* SKILLS */}

                <div className="form-group">

                  <label htmlFor="skills">
                    💻 Your Skills
                  </label>

                  <textarea
                    id="skills"
                    name="skills"
                    placeholder="Example: Python, Java, SQL, React, Machine Learning"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows="4"
                  />

                </div>

                {/* INTERESTS */}

                <div className="form-group">

                  <label htmlFor="interests">
                    💡 Your Interests
                  </label>

                  <textarea
                    id="interests"
                    name="interests"
                    placeholder="Example: AI, Web Development, Data Science, Startups"
                    value={formData.interests}
                    onChange={handleInputChange}
                    rows="4"
                  />

                </div>

                {/* CAREER GOAL */}

                <div className="form-group">

                  <label htmlFor="careerGoal">
                    🎯 Career Goal
                  </label>

                  <textarea
                    id="careerGoal"
                    name="careerGoal"
                    placeholder="Tell us what career you want to pursue or what you are currently confused about."
                    value={formData.careerGoal}
                    onChange={handleInputChange}
                    rows="4"
                  />

                </div>

                {/* ANALYZE */}

                <button
                  type="submit"
                  className="primary-button analyze-button"
                  disabled={isAnalyzing}
                >

                  {isAnalyzing ? (
                    <>
                      🧠 Analyzing Profile...
                    </>
                  ) : (
                    <>
                      Analyze My Profile →
                    </>
                  )}

                </button>

              </form>

            </div>

          </section>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {isAnalyzing && (
          <section className="analysis-result">

            <div className="analysis-container">

              <div className="analysis-card">

                <div className="analysis-icon">
                  🧭
                </div>

                <div className="analysis-loading">

                  <h2>
                    Pathora is analyzing your profile...
                  </h2>

                  <p>
                    Gemini AI is evaluating your
                    education, skills, interests,
                    career goal, and resume.
                  </p>

                  <p>
                    This may take a few seconds.
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ======================================================
            ANALYSIS RESULT
        ====================================================== */}

        {analysis && !isAnalyzing && (
          <section
            className="analysis-result"
            id="analysis-result"
          >

            <div className="analysis-container">

              <div className="section-heading">

                <p className="section-label">
                  PATHORA AI ANALYSIS
                </p>

                <h2>
                  Your Personalized
                  Career Roadmap
                </h2>

                <p>
                  Based on the information you
                  provided, Pathora has created
                  the following career guidance
                  for you.
                </p>

              </div>

              <div className="analysis-card">

                <div className="analysis-icon">
                  🧭
                </div>

                {renderAnalysis()}

              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                }}
              >

                <button
                  className="primary-button"
                  onClick={analyzeAnotherProfile}
                >
                  Analyze Another Profile →
                </button>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;