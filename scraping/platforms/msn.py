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


url = "https://www.msn.com/zh-tw/news/living/%E7%99%BD%E5%A4%A9-%E6%99%9A%E4%B8%8A%E9%81%8B%E5%8B%95%E5%93%AA%E5%80%8B%E5%A5%BD-%E9%86%AB%E6%8F%AD-1%E9%97%9C%E9%8D%B5-%E6%AF%94%E6%8C%91%E6%99%82%E9%96%93%E6%9B%B4%E9%87%8D%E8%A6%81/ar-AA1D4zTQ"

try:
    req = Request(url, headers=headers)
    response = urlopen(req)
    if response.info().get('Content-Encoding') == 'gzip':
        gzip_file = gzip.GzipFile(fileobj=io.BytesIO(response.read()))
        html = gzip_file.read().decode('utf-8')
    else:
        html = response.read().decode('utf-8')
    
    
    soupsoup = BeautifulSoup(html, "html.parser")
    soup = soupsoup.find('views-header-wc')
    # Extract content
    title = soup.find('h1', class_='viewsHeaderText') 
    title_text = title.text.strip() if title else "No title found"

    article = soup.find('body', class_="article-body")
    paragraph = article.text.strip() if article else ""
    
    # Print results
    print(f"Title: {title_text}")
    print(f"Content: {paragraph}")
    
except Exception as e:
    print(f"Error: {str(e)}")
