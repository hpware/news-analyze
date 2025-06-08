import { $ } from "bun";
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateVersionTag() {
  let slug = "";
  let length = 8;
  for (let times = 0; times < length; times++) {
    slug += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return slug;
}
const tag = generateVersionTag();
// Command
await $`echo 'export default function versionTag() {return "${tag}";}' > ./versionTag.ts`;

console.log("Version Tag:", tag);
