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


url = "https://www.cna.com.tw/news/aspt/202505110112.aspx"
paragraph_css = "paragraph"

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
    title = soup.find('h1').text.strip() if soup.find('h1') else ""
    article = soup.find('div', class_=paragraph_css)
    paragraph = article.text.strip() if article else ""
    
    # Print results
    print(f"Title: {title}")
    print(f"Content: {paragraph}")
    
except Exception as e:
    print(f"Error: {str(e)}")
