# Going to love the stupid tab tab tab tab system, instead of using brances.
import re # Regular expressions
from urllib.request import urlopen # URL request lib.
from bs4 import BeautifulSoup # BeautifulSoup lib.
import json
import psycopg2
import pandas as pd
import dotenv
import os

# Load environment variables from .env file
dotenv.load_dotenv()

# Connect to PostgresDB
conn = psycopg2.connect(database=os.getenv("POSTGRES_DB"), 
                        user=os.getenv("POSTGRES_USER"),
                        password=os.getenv("POSTGRES_PASSWORD"),
                        host=os.getenv("POSTGRES_HOST"),
                        port=os.getenv("POSTGRES_PORT")
)


headers = {
    'User-Agent': 'NewsSceraperBot/1.0 (https://github.com/hpware/news-analyze)'
}

#url = "https://tw.news.yahoo.com/"
#url = "https://news.google.com/home?hl=zh-TW&gl=TW&ceid=TW:zh-Hant"
url = "https://news.google.com/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNRFptTXpJU0JYcG9MVlJYS0FBUAE?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant"

page = urlopen(url)
html_bytes = page.read()
html = html_bytes.decode("utf-8")
soup = BeautifulSoup(html, "html.parser")
hotarticles = soup.find_all("article")
news_data = []
for article in hotarticles:
    try:
        title_elem = article.find('a', class_='gPFEn')
        title = title_elem.text.strip() if title_elem else ''
        
        source_elem = article.find('div', class_='vr1PYe')
        source = source_elem.text.strip() if source_elem else ''
        
        link_elem = article.find('a', class_='WwrzSb')
        orglink = link_elem['href'] if link_elem else ''
        link = re.sub(r'./read/', 'https://news.google.com/read/', orglink)
        
        article_data = {
            'title': title,
            'source': source,
            'link': link,
        }
        
        news_data.append(article_data)
        
    except Exception as e:
        print(f"Error processing article: {e}")
        continue

with open('news.json', 'w', encoding='utf-8') as f:
    json.dump(news_data, f, ensure_ascii=False, indent=2)

