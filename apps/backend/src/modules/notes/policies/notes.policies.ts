export const canViewNote = (user: any, note: any) =>
  note.userId.equals(user.sub) ||
  note.permission === "VIEW" ||
  note.permission === "EDIT" ||
  note.permission === "FULL";

export const canEditNote = (user: any, note: any) =>
  note.userId.equals(user.sub) ||
  note.permission === "EDIT" ||
  note.permission === "FULL";

export const canDeleteNote = (user: any, note: any) =>
  note.userId.equals(user.sub);