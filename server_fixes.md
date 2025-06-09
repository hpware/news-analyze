# Server Fixed
(This file is NOT related to neighbourhood, but it is some stuff I learned during the down time of the server)

## Timeline
Aprox. 10 PM UTC+8 - I found out that the server is running an outdated version of the app and tried using `docker compose pull`, but saw 192.168.1.1:53 is not a Server, and tried to fix it, and broke off the connection to the internet.

11:40-ish PM UTC+8 Server is back online.

## So what is the issue?
Well, My issue is one of my config files included a "on", which is why the PPPoE conenction does not work anymore.

Image:
![](/.github/OTHER/ig_story_58m.png)

And also I wrote a super stupid cron fix, which is below.

## My stupid cron fix:
Cron Job:
```
0 1 * * * "bun run /hardpushrevolvconf.ts" > /dev/null
```

Here is the script I used to force the change of my resolv.conf file:
```typescript
import { file, $ } from "bun";

function sendDataToSlack(text: string) {
	fetch("{slack_web_hook_to_one_of_my_channels_in_hackclub}", {
		method: "POST",
		headers: {
			"Content-Type": "application-json"
		},
		body: JSON.stringify({ text: text })
	})
	return;
}

const resolvConfPath = "/etc/resolv.conf";
const resolvConf = file(resolvConfPath);
const resolvConfText = await resolvConf.text();

if (resolvConfText.includes("192.168.1.1")) {
   // Auto git config
  await $`git add .`
  await $`git commit -a -m "Auto Commit by the server ${Date().now}, before doing stuff into resolvConf"`
  try {
    await resolvConf.write("nameserver 8.8.8.8\n");
    sendDataToSlack(`${resolvConfPath} updated successfully.`);
  } catch (error) {
    sendDataToSlack(`Failed to write to ${resolvConfPath}:`, error);
    sendDataToSlack(
      "This likely happened because you didn't run the script with root privileges (e.g., 'sudo bun run script.ts')."
    );
  }
  await $`git add .`
  await $`git commit -a -m "Auto Commit by the server ${Date().now}, after doing stuff into resolvConf"`
  await $`git push`
} else {
  sendDataToSlack(
    "Did not find '192.168.1.1'. No changes have been made."
  );
}

```
