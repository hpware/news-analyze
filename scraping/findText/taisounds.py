import re
from urllib.request import urlopen, Request
import chardet
from bs4 import BeautifulSoup
import json
import psycopg2
import pandas as pd
import dotenv
import os
import gzip
import io

dotenv.load_dotenv()

headers = {
    #'User-Agent': 'NewsSceraperBot/1.0 (https://github.com/hpware/news-analyze)',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Cache-Control': 'max-age=0',
}

url = "https://www.taisounds.com/news/content/84/189872"


try:
    req = Request(url, headers=headers)
    response = urlopen(req)
    if response.info().get('Content-Encoding') == 'gzip':
        gzip_file = gzip.GzipFile(fileobj=io.BytesIO(response.read()))
        html = gzip_file.read().decode('utf-8')
    else:
        html = response.read().decode('utf-8')
    
    soup = BeautifulSoup(html, "html.parser")
    
    title = soup.find('h1') 
    title_text = title.text.strip() if title else "No title found"
    
    #author = soup.find('div', class_='publish')
    #author_text = author.text.strip().soup.find('a').text.strip() if author else "No author found"

    article = soup.find('div', class_='news-box-text') 
    content = article.text.strip() if article else "No content found"
    
    # Print results
    print(f"Title: {title_text}")
    #print(f"Author: {author_text}")
    print(f"Content: {content}")
    
except Exception as e:
    print(f"Error: {str(e)}")
    if 'soup' in locals():
        print("\nAvailable classes in HTML:")
        for tag in soup.find_all(class_=True):
            print(f"Tag: {tag.name}, Class: {tag['class']}")