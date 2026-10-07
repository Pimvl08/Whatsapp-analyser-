# Usage: python3 run.py <logo.png> <output.pdf>
# Runs the bundled generatePdf() in headless Chromium and saves the PDF.
import base64, json, os, sys
from playwright.sync_api import sync_playwright

here = os.path.dirname(os.path.abspath(__file__))
logo_path, out = sys.argv[1], sys.argv[2]
quote = json.load(open(os.path.join(here, 'quote.json'), encoding='utf-8'))
logo = base64.b64encode(open(logo_path, 'rb').read()).decode()
quote['company']['logo'] = 'data:image/png;base64,' + logo

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('about:blank')
    page.add_script_tag(content=open(os.path.join(here, 'bundle.js'), encoding='utf-8').read())
    res = page.evaluate('q => window.makeDemo(q)', quote)
    b.close()

open(out, 'wb').write(base64.b64decode(res['pdf']))
print('pages', res['pages'], 'totals', res['totals'])
