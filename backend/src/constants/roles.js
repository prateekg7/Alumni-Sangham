export const ROLES = {
  STUDENT: "student",
  ALUMNI: "alumni",
};

export const ROLE_VALUES = Object.values(ROLES);
export const isStudent = (role) => role === ROLES.STUDENT;
export const isAlumni = (role) => role === ROLES.ALUMNI;