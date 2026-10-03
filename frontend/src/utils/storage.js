// ============================================================
// PATHORA LOCAL STORAGE
// Handles persistent user data for the MVP
// ============================================================

const STORAGE_KEYS = {
  USER: "pathora_user",
  SESSION: "pathora_session",
  PROFILE: "pathora_profile",
  ANALYSIS: "pathora_analysis",
};

// ============================================================
// USER
// ============================================================

export const saveUser = (user) => {
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to read Pathora user data:", error);
    return null;
  }
};

// ============================================================
// SESSION
// ============================================================

export const saveSession = (isLoggedIn) => {
  localStorage.setItem(
    STORAGE_KEYS.SESSION,
    JSON.stringify(isLoggedIn)
  );
};

export const getSession = () => {
  const session = localStorage.getItem(
    STORAGE_KEYS.SESSION
  );

  if (!session) {
    return false;
  }

  try {
    return JSON.parse(session);
  } catch (error) {
    console.error("Failed to read Pathora session:", error);
    return false;
  }
};

// ============================================================
// PROFILE
// ============================================================

export const saveProfile = (profile) => {
  localStorage.setItem(
    STORAGE_KEYS.PROFILE,
    JSON.stringify(profile)
  );
};

export const getProfile = () => {
  const profile = localStorage.getItem(
    STORAGE_KEYS.PROFILE
  );

  if (!profile) {
    return null;
  }

  try {
    return JSON.parse(profile);
  } catch (error) {
    console.error("Failed to read Pathora profile:", error);
    return null;
  }
};

// ============================================================
// AI ANALYSIS
// ============================================================

export const saveAnalysis = (analysis) => {
  localStorage.setItem(
    STORAGE_KEYS.ANALYSIS,
    JSON.stringify(analysis)
  );
};

export const getAnalysis = () => {
  const analysis = localStorage.getItem(
    STORAGE_KEYS.ANALYSIS
  );

  if (!analysis) {
    return null;
  }

  try {
    return JSON.parse(analysis);
  } catch (error) {
    console.error("Failed to read Pathora analysis:", error);
    return null;
  }
};

// ============================================================
// CLEAR ALL PATHORA DATA
// ============================================================

export const clearPathoraData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};