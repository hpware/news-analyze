import currentVersion from "~/versionTag";
export default async function newestVersion() {
  const current = currentVersion();
  const req = await fetch("/api/version");
  const res = await req.json();
  if (current !== res.version) {
    return false;
  }
  return true;
}
