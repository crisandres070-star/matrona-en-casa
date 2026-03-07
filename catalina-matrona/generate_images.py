from PIL import Image
img = Image.new('RGB', (600,400), color='red')
img.save('public/hero.jpg','JPEG')
img2 = Image.new('RGB', (100,100), color='blue')
img2.save('public/catalina.jpg','JPEG')
