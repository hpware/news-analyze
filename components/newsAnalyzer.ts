// News Analyzer Class
class NewsAnalyzer {
  private sensitivePatterns: RegExp[];
  constructor() {
    this.sensitivePatterns = [];
  }

  isKidFriendly(title) {
    for (let pattern of this.sensitivePatterns) {
      if (pattern.test(title)) return false;
    }
    return true;
  }

  public setSensitivePatterns(patterns: RegExp[]): void {
    this.sensitivePatterns = patterns;
  }
}

export default NewsAnalyzer;
