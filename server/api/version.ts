import versionTag from "~/versionTag";
export default defineEventHandler(() => {
  return {
    version: versionTag(),
  };
});
