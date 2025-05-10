import time
import re # Regular expressions
from urllib.request import urlopen # URL request lib.
from bs4 import BeautifulSoup # BeautifulSoup lib.

headers = {
    'User-Agent': 'NewsSceraperBot/1.0 (news.yuanhau.com)'
}

#url = "https://tw.news.yahoo.com/"
url = "https://news.google.com/home?hl=zh-TW&gl=TW&ceid=TW:zh-Hant"

page = urlopen(url)
html_bytes = page.read()
html = html_bytes.decode("utf-8")
soup = BeautifulSoup(html, "html.parser")

print(soup.find_all("article"))
