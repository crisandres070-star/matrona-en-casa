from PIL import Image
import os

if os.path.exists('public/hero2.jpg.png'):
    img = Image.open('public/hero2.jpg.png')
    rgb = img.convert('RGB')
    rgb.save('public/hero2.jpg', 'JPEG')
    print('converted hero2.jpg.png to hero2.jpg')
else:
    print('hero2.jpg.png not found')
