#!/usr/bin/env python3
"""
Generate placeholder SVG images for each subpage organized in the directory structure
"""

import os
from pathlib import Path

# Configuration
BASE_PATH = r"c:\Users\jaysa\Documents\GitHub\superflow"
PRODUCTS = ['Rice', 'Corn', 'Wheat', 'Cattle', 'Poultry', 'Aqua']

# Color schemes for each product
COLORS = {
    'Rice': {'bg': '#D4AF37', 'accent': '#8B7500'},
    'Corn': {'bg': '#FFD700', 'accent': '#FFA500'},
    'Wheat': {'bg': '#CD853F', 'accent': '#8B4513'},
    'Cattle': {'bg': '#8B4513', 'accent': '#654321'},
    'Poultry': {'bg': '#FF6347', 'accent': '#DC143C'},
    'Aqua': {'bg': '#00BFFF', 'accent': '#0088CC'}
}

ICONS = {
    'Rice': '🌾',
    'Corn': '🌽',
    'Wheat': '🌾',
    'Cattle': '🐄',
    'Poultry': '🐔',
    'Aqua': '🐠'
}

def generate_svg(product, subpage, tab, image_num):
    """Generate SVG content for an image"""
    
    colors = COLORS[product]
    icon = ICONS[product]
    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad_{subpage}_{tab}_{image_num}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{colors['bg']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{colors['accent']};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="url(#grad_{subpage}_{tab}_{image_num})"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.1)"/>
  <circle cx="700" cy="500" r="80" fill="rgba(255,255,255,0.1)"/>
  <circle cx="150" cy="500" r="50" fill="rgba(255,255,255,0.08)"/>
  
  <!-- Icon -->
  <text x="400" y="180" font-size="120" text-anchor="middle" dominant-baseline="middle">
    {icon}
  </text>
  
  <!-- Product Name -->
  <text x="400" y="320" font-size="42" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">
    {product}
  </text>
  
  <!-- Location info -->
  <text x="400" y="380" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">
    Subpage {subpage} | Tab {tab}
  </text>
  
  <!-- Image number -->
  <text x="400" y="430" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">
    Image {image_num}
  </text>
  
  <!-- Border -->
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" rx="10"/>
</svg>
'''
    return svg_content

def main():
    """Generate all placeholder images"""
    
    # Map product names to subpage numbers
    product_map = {product: idx + 1 for idx, product in enumerate(PRODUCTS)}
    
    total_images = 0
    created = 0
    
    for product, subpage_num in product_map.items():
        print(f"\nGenerating images for {product} (Subpage {subpage_num})")
        
        for tab in range(1, 5):  # Tabs 1-4
            # Tab 1-3 have 4 images, Tab 4 has 3 images
            image_count = 4 if tab <= 3 else 3
            
            for img_num in range(1, image_count + 1):
                total_images += 1
                
                # Create directory if it doesn't exist
                dir_path = Path(BASE_PATH) / f"subpage{subpage_num}" / f"tab{tab}"
                dir_path.mkdir(parents=True, exist_ok=True)
                
                # File path
                file_path = dir_path / f"image{img_num}.svg"
                
                # Generate SVG content
                svg_content = generate_svg(product, subpage_num, tab, img_num)
                
                # Write to file
                try:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(svg_content)
                    print(f"  ✓ Created: subpage{subpage_num}/tab{tab}/image{img_num}.svg")
                    created += 1
                except Exception as e:
                    print(f"  ✗ Error creating subpage{subpage_num}/tab{tab}/image{img_num}.svg: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Image Generation Summary")
    print(f"{'='*60}")
    print(f"Total images created: {created}/{total_images}")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
