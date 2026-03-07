from PIL import Image
import os

for fn in ['public/hero-banner.jpg.png','public/about.jpg.png']:
    if os.path.exists(fn):
        img=Image.open(fn)
        rgb=img.convert('RGB')
        out=fn.replace('.png','')
        rgb.save(out,'JPEG')
        print(f'converted {fn} to {out}')
    else:
        print(f'{fn} missing')
