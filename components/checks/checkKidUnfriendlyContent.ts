import NewsAnalyzer from "~/components/newsAnalyzer";
const newsAnalyzer = new NewsAnalyzer();
async function checkUnsafeContent(title: string) {
  try {
    const req = await fetch("/api/contentcheck/kidunfriendlycontent");
    const res = await req.json();
    const patterns = res.words.map((word) => new RegExp(word, "i"));
    console.log(patterns);
    newsAnalyzer.setSensitivePatterns(patterns);
    const kidfriendly = newsAnalyzer.isKidFriendly(title);
    return !kidfriendly;
  } catch (e) {
    console.log(e);
  }
}

export default checkUnsafeContent;
