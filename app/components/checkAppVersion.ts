import currentVersion from "~/versionTag";
export default async function newestVersion() {
  const current = currentVersion();
  const req = await fetch("/api/version");
  if (!req.ok) {
    console.error("Version check failed:", req.statusText);
    return true; // fail-closed → pretend we are up-to-date
  }

  const { version: latest } = await req.json();
  return current === latest; // `true`  ➜ up-to-date
}
