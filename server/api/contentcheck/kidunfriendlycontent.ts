let cachedWords: content | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 3; // Updates every 3 hours.

interface content {
  data: string[];
}

export default defineEventHandler(async (event) => {
  const currentTime = Date.now();
  if (
    cachedWords &&
    lastFetchTime &&
    currentTime - lastFetchTime < CACHE_DURATION
  ) {
    return cachedWords;
  }
  const fetchWordsFromGitHub = await fetch(
    "https://raw.githubusercontent.com/hpware/news-analyze/refs/heads/master/words.json",
  );
  cachedWords = await fetchWordsFromGitHub.json();
  lastFetchTime = currentTime;
  return cachedWords;
});
