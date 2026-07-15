export function projectStatus(): string {
  return JSON.stringify({ status: "ready", updatedAt: new Date().toISOString() });
}
