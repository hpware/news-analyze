// Trying out the ahocorasick algorithm
// Recommended by: https://www.threads.com/@hsinspeng/post/DJ3yVGQxBg7
import { AhoCorasick } from "@monyone/aho-corasick";

async function checkUnsafeContent(title: string) {
  try {
    const req = await fetch("/api/contentcheck/kidunfriendlycontent");
    const res = await req.json();
    const ac = new AhoCorasick(res.words);
    const kidfriendly = ac.hasKeywordInText(title);
    return kidfriendly;
  } catch (e) {
    console.log(e);
  }
}

export default checkUnsafeContent;
