# BROKEN
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

# Load environment variables from .env file
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


url = "https://tw.news.yahoo.com/%E5%93%BD%E5%92%BD%E7%A8%B1%E8%80%81%E5%90%8C%E5%AD%B8%E6%9D%8E%E6%96%87%E5%AE%97-%E8%A2%AB%E5%86%A4%E7%8D%84-%E6%9F%AF%E6%96%87%E5%93%B2-%E4%BD%A0%E5%80%91%E5%8F%AA%E6%98%AF%E8%A6%81%E6%8A%BC%E6%88%91-%E5%85%B6%E4%BB%96%E5%85%88%E6%94%BE%E8%B5%B0-122535612.html"

try:
    req = Request(url, headers=headers)
    response = urlopen(req)
    if response.info().get('Content-Encoding') == 'gzip':
        gzip_file = gzip.GzipFile(fileobj=io.BytesIO(response.read()))
        html = gzip_file.read().decode('utf-8')
    else:
        html = response.read().decode('utf-8')
    
    
    soup = BeautifulSoup(html, "html.parser")
    
    # Extract content
    title = soup.find('h1', attrs={"data-test-locator": "headline"}) 
    title_text = title.text.strip() if title else "No title found"

    article = soup.find('div', class_="caas-body")
    paragraph = article.text.strip() if article else ""
    
    # Print results
    print(f"Title: {title_text}")
    print(f"Content: {paragraph}")
    
except Exception as e:
    print(f"Error: {str(e)}")
