// Trying out the ahocorasick algorithm
// Recommended by: https://www.threads.com/@hsinspeng/post/DJ3yVGQxBg7
import AhoCorasick from "ahocorasick";

async function checkUnsafeContent(title: string) {
  try {
    const req = await fetch("/api/contentcheck/kidunfriendlycontent");
    const res = await req.json();
    console.log(res.words);
    const ac = new AhoCorasick(res.words);
    const kidfriendly = ac.search(title);
    console.log(kidfriendly);
    return kidfriendly;
  } catch (e) {
    console.log(e);
  }
}

export default checkUnsafeContent;
