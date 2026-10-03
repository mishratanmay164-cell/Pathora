import { useState } from "react";
import "./Dashboard.css";

function Dashboard({
  registeredUser,
  analysis,
  onBack,
  onBuildRoadmap,
  onLogout,
}) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const hasRoadmap =
    analysis &&
    analysis.type === "structured" &&
    analysis.careerRecommendation;

  const career = hasRoadmap
    ? analysis.careerRecommendation.career
    : "";

  const match = hasRoadmap
    ? analysis.careerRecommendation.matchPercentage
    : 0;

  const roadmapCount = hasRoadmap
    ? analysis.roadmap?.length || 0
    : 0;

  const handleViewRoadmap = () => {
    setShowFullAnalysis(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleBackToDashboard = () => {
    setShowFullAnalysis(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  /*
   * FULL SAVED ANALYSIS VIEW
   */
  if (showFullAnalysis && hasRoadmap) {
    return (
      <div className="dashboard-page">
        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            <img
              src="/pathora-logo.png"
              alt="Pathora AI Logo"
            />

            <span>
              Path<span>oraAI</span>
            </span>
          </div>

          <div className="dashboard-nav-actions">
            <button
              className="dashboard-back-button"
              onClick={handleBackToDashboard}
            >
              ← Dashboard
            </button>

            <button
              className="dashboard-logout-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-label">
                SAVED AI ANALYSIS
              </p>

              <h1>
                Your Career
                <span> Roadmap 🎯</span>
              </h1>

              <p>
                Your personalized Pathora AI analysis,
                saved and ready whenever you need it.
              </p>
            </div>
          </section>

          {/* CAREER RECOMMENDATION */}
          <section className="dashboard-card full-analysis-career-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                🎯
              </div>

              <div>
                <h2>Recommended Career</h2>
                <p>
                  Pathora's strongest career match for you
                </p>
              </div>
            </div>

            <div className="full-career-result">
              <h3>{career}</h3>

              <div className="full-career-match">
                <strong>{match}%</strong>
                <span>Career Match</span>
              </div>
            </div>
          </section>

          {/* PROFILE SUMMARY */}
          {analysis.profileSummary && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  🧠
                </div>

                <div>
                  <h2>Profile Summary</h2>
                  <p>
                    How Pathora understands your profile
                  </p>
                </div>
              </div>

              <p className="analysis-description">
                {analysis.profileSummary}
              </p>
            </section>
          )}

          {/* STRENGTHS */}
          {analysis.strengths?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  💪
                </div>

                <div>
                  <h2>Your Strengths</h2>
                  <p>
                    Skills and qualities that support your
                    career direction
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.strengths.map(
                  (strength, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>✓</span>
                      <p>{strength}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* SKILL GAPS */}
          {analysis.skillGaps?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  📚
                </div>

                <div>
                  <h2>Skill Gaps</h2>
                  <p>
                    Skills you should develop next
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.skillGaps.map(
                  (gap, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>→</span>
                      <p>{gap}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* ROADMAP */}
          {analysis.roadmap?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  🧭
                </div>

                <div>
                  <h2>Career Roadmap</h2>
                  <p>
                    Your personalized step-by-step journey
                  </p>
                </div>
              </div>

              <div className="full-roadmap-list">
                {analysis.roadmap.map(
                  (phase, index) => (
                    <div
                      className="full-roadmap-item"
                      key={index}
                    >
                      <div className="roadmap-number">
                        {index + 1}
                      </div>

                      <div className="roadmap-phase-content">
                        <h3>
                          {phase.phase ||
                            phase.title ||
                            `Phase ${index + 1}`}
                        </h3>

                        {phase.duration && (
                          <span className="roadmap-duration">
                            {phase.duration}
                          </span>
                        )}

                        {phase.description && (
                          <p>
                            {phase.description}
                          </p>
                        )}

                        {phase.skills?.length > 0 && (
                          <div className="roadmap-skills">
                            {phase.skills.map(
                              (skill, skillIndex) => (
                                <span key={skillIndex}>
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        {phase.actions?.length > 0 && (
                          <div className="roadmap-actions-list">
                            {phase.actions.map(
                              (
                                action,
                                actionIndex
                              ) => (
                                <div
                                  key={actionIndex}
                                >
                                  ✓ {action}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS & EXAMS */}
          {analysis.certificationsExams?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  🎓
                </div>

                <div>
                  <h2>
                    Certifications & Exams
                  </h2>
                  <p>
                    Recommended credentials and
                    examinations
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.certificationsExams.map(
                  (item, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>🎓</span>
                      <p>{item}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {analysis.recommendedProjects?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  🛠️
                </div>

                <div>
                  <h2>
                    Recommended Projects
                  </h2>
                  <p>
                    Projects that can strengthen your
                    portfolio
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.recommendedProjects.map(
                  (project, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>🚀</span>
                      <p>{project}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* SHORT TERM GOALS */}
          {analysis.shortTermGoals?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  ⚡
                </div>

                <div>
                  <h2>Short-Term Goals</h2>
                  <p>
                    What you should focus on next
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.shortTermGoals.map(
                  (goal, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>→</span>
                      <p>{goal}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* LONG TERM GOALS */}
          {analysis.longTermGoals?.length > 0 && (
            <section className="dashboard-card full-analysis-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">
                  🏆
                </div>

                <div>
                  <h2>Long-Term Goals</h2>
                  <p>
                    Where your career path can lead
                  </p>
                </div>
              </div>

              <div className="analysis-list">
                {analysis.longTermGoals.map(
                  (goal, index) => (
                    <div
                      className="analysis-list-item"
                      key={index}
                    >
                      <span>★</span>
                      <p>{goal}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* PATHORA'S ADVICE */}
          {analysis.advice && (
            <section className="dashboard-next full-advice-card">
              <div className="dashboard-next-icon">
                ✨
              </div>

              <div>
                <p className="dashboard-label">
                  PATHORA'S ADVICE
                </p>

                <h2>
                  Your next move matters.
                </h2>

                <p>
                  {analysis.advice}
                </p>
              </div>
            </section>
          )}

          <div className="full-analysis-bottom-actions">
            <button
              className="dashboard-primary-button"
              onClick={handleBackToDashboard}
            >
              ← Back to Dashboard
            </button>

            <button
              className="dashboard-secondary-button"
              onClick={onBuildRoadmap}
            >
              Build New Roadmap
            </button>
          </div>
        </main>
      </div>
    );
  }

  /*
   * NORMAL DASHBOARD VIEW
   */
  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <img
            src="/pathora-logo.png"
            alt="Pathora AI Logo"
          />

          <span>
            Path<span>oraAI</span>
          </span>
        </div>

        <div className="dashboard-nav-actions">
          <button
            className="dashboard-back-button"
            onClick={onBack}
          >
            ← Back to Pathora
          </button>

          <button
            className="dashboard-logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-label">
              PATHORA DASHBOARD
            </p>

            <h1>
              Welcome back,
              <span>
                {" "}
                {registeredUser?.name ||
                  "Pathora User"}{" "}
                👋
              </span>
            </h1>

            <p>
              Your personalized career journey,
              all in one place.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          {/* PROFILE CARD */}
          <div className="dashboard-card profile-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                👤
              </div>

              <div>
                <h2>My Profile</h2>
                <p>
                  Your Pathora account information
                </p>
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-detail">
                <span>Full Name</span>

                <strong>
                  {registeredUser?.name ||
                    "Not available"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Email Address</span>

                <strong>
                  {registeredUser?.email ||
                    "Not available"}
                </strong>
              </div>
            </div>
          </div>

          {/* ROADMAP CARD */}
          <div className="dashboard-card roadmap-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon">
                🧭
              </div>

              <div>
                <h2>My Career Roadmap</h2>
                <p>
                  Your personalized Pathora journey
                </p>
              </div>
            </div>

            {hasRoadmap ? (
              <div className="saved-roadmap-state">
                <div className="saved-roadmap-icon">
                  🎯
                </div>

                <p className="saved-roadmap-label">
                  LATEST RECOMMENDATION
                </p>

                <h3>{career}</h3>

                <div className="roadmap-stats">
                  <div>
                    <strong>{match}%</strong>
                    <span>Match</span>
                  </div>

                  <div>
                    <strong>
                      {roadmapCount}
                    </strong>

                    <span>
                      Roadmap Phases
                    </span>
                  </div>
                </div>

                <div className="roadmap-dashboard-actions">
                  <button
                    className="dashboard-primary-button"
                    onClick={handleViewRoadmap}
                  >
                    View Full Roadmap →
                  </button>

                  <button
                    className="dashboard-secondary-button"
                    onClick={onBuildRoadmap}
                  >
                    Build New Roadmap
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-dashboard-state">
                <div className="empty-icon">
                  🚀
                </div>

                <h3>
                  No roadmap saved yet
                </h3>

                <p>
                  Build your personalized roadmap
                  and it will appear here.
                </p>

                <button
                  className="dashboard-primary-button"
                  onClick={onBuildRoadmap}
                >
                  Build My Roadmap →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <p className="dashboard-label">
              QUICK ACTIONS
            </p>

            <h2>
              Continue your journey
            </h2>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action-card"
              onClick={onBuildRoadmap}
            >
              <span>🧠</span>

              <div>
                <h3>
                  Analyze My Profile
                </h3>

                <p>
                  Get AI-powered career guidance
                </p>
              </div>

              <strong>→</strong>
            </button>

            <button
              className="quick-action-card"
              onClick={onBuildRoadmap}
            >
              <span>🧭</span>

              <div>
                <h3>
                  Build a Roadmap
                </h3>

                <p>
                  Create your personalized
                  career path
                </p>
              </div>

              <strong>→</strong>
            </button>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="dashboard-next">
          <div className="dashboard-next-icon">
            ✨
          </div>

          <div>
            <p className="dashboard-label">
              PATHORA PROGRESS
            </p>

            <h2>
              Your career journey is just
              getting started.
            </h2>

            <p>
              Your latest AI career analysis is
              now saved to your Pathora dashboard.
              You can return anytime to review
              your recommendation or create a
              new roadmap.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;