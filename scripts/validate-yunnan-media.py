from html.parser import HTMLParser
from pathlib import Path
import json
import xml.etree.ElementTree as ET
import subprocess

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag,dict(attrs)))

root=Path.cwd(); errors=[]; checked=0
prefixes=['','cn/','es/','ar/']
slug='insights/yunnan-rooted-cuttings-molded-plugs/'
for prefix in prefixes:
    for relative in [prefix+'index.html',prefix+'insights/index.html',prefix+slug+'index.html']:
        text=(root/relative).read_text(encoding='utf8'); parsed=Page(text); checked+=1
        if sum(t=='h1' for t,a in parsed.tags)!=1: errors.append(relative+': H1')
        for tag,a in parsed.tags:
            for key in ['href','src','poster']:
                u=a.get(key,'')
                if u.startswith('/') and not u.startswith('//'):
                    p=root/u.split('#')[0].split('?')[0].lstrip('/')
                    if not p.exists(): errors.append(relative+': missing '+u)
            if tag=='img' and 'yunnan-rooting' in a.get('src',''):
                if not all(a.get(k) for k in ['alt','width','height','srcset']): errors.append(relative+': image metadata')
        if slug in relative:
            canon=[a['href'] for t,a in parsed.tags if t=='link' and a.get('rel')=='canonical']
            if canon!=['https://www.mccsgrowingmedia.com/'+prefix+slug]:errors.append(relative+': canonical')
            alts=[a.get('hreflang') for t,a in parsed.tags if t=='link' and a.get('rel')=='alternate']
            if set(alts)!=set(['en','zh-CN','es','ar','x-default']):errors.append(relative+': alternates')
            if sum(t=='img' and 'yunnan-rooting' in a.get('src','') for t,a in parsed.tags)!=7:errors.append(relative+': photos')
            if not any(t=='video' and a.get('preload')=='none' and 'controls' in a for t,a in parsed.tags):errors.append(relative+': video')

ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
locs=[e.text for e in ET.parse('sitemap.xml').findall('s:url/s:loc',ns)]
for p in prefixes:
    if locs.count('https://www.mccsgrowingmedia.com/'+p+slug)!=1:errors.append('sitemap '+p)
protected=['data/products.json','vercel.json','admin.html','privacy.html','terms.html']
for p in protected:
    if subprocess.run(['git','diff','--quiet','HEAD','--',p]).returncode:errors.append('protected '+p)
print(json.dumps({'pagesChecked':checked,'sitemapURLs':len(locs),'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
