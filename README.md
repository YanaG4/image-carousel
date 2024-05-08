# Infinite Image Carousel

## Features
- Swipeable carousel (on touch)
- Drag & drop effect
- Auto swipe banners each 10 seconds
- On screen sizes >= 600 display notification text
- Highlights important text on the banners
- Supports even the smallest screens
- Smooth animation on changing banners
- Tests

## Approach
Infinite carousel:
- Create the duplicates of the 1st and last banners
- If we reach the last banner (the duplicate of the first one) replace it with the real first banner
- Do the same for the very first (the duplicate of the last one) banner
  
![app demo](https://github.com/YanaG4/assets/blob/main/app.gif)
