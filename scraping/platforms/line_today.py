# THIS WORKS :D
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
import argparse

parser = argparse.ArgumentParser(description="A LINE Today Scraper.")
parser.add_argument("-s", "--slug", type=str, help="The article URL like: oqmazXP")
args = parser.parse_args()

if not args.slug:
    print("No Slug entered, please use -s oqmazXP as a demo.")
    exit(1)

# Load environment variables from .env file
dotenv.load_dotenv()

headers = {
    #'User-Agent': 'NewsSceraperBot/1.0 (https://github.com/hpware/news-analyze) (A little note: If you see this, It means that your website is being scraped by other people, not the user hpware. Please keep that in mind at don't spam issues, I can't fix it.)',
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


try:
    url = "https://today.line.me/tw/v2/article/" + args.slug
    req = Request(url, headers=headers)
    response = urlopen(req)
    if response.info().get('Content-Encoding') == 'gzip':
        print("GZIP")
        gzip_file = gzip.GzipFile(fileobj=io.BytesIO(response.read()))
        html = gzip_file.read().decode('utf-8')
    else:
        print("Not GZIP")
        html = response.read().decode('utf-8')


    soup = BeautifulSoup(html, "html.parser")

    # Extract content
    title = soup.find('h1', class_="entityTitle")
    title_text = title.text.strip() if title else "No title found"

    article = soup.find('article', class_="news-content")
    paragraph = article.text.strip() if article else ""

    # Print results
    print(f"Title: {title_text}")
    print(f"Content: {paragraph}")

except Exception as e:
    print(f"Error: {str(e)}")
