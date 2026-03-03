from PIL import Image
img = Image.new('RGB',(100,100),color='purple')
img.save('public/catalina.jpg','JPEG')
print('created placeholder catalina.jpg')
