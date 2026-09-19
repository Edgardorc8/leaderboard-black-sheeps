import sys
from pathlib import Path
from PIL import Image
from rembg import remove

def process_image(input_path: str, output_path: str, crop_square: bool = False):
    input_p = Path(input_path)
    output_p = Path(output_path)
    output_p.parent.mkdir(parents=True, exist_ok=True)
    
    print(f"Reading {input_p}...")
    img = Image.open(input_p)
    print("Removing background with rembg...")
    output = remove(img)
    
    if crop_square:
        # Recortar cuadrado centrado
        w, h = output.size
        size = min(w, h)
        left = (w - size) // 2
        top = (h - size) // 2
        output = output.crop((left, top, left + size, top + size))
        
    output.save(output_p, "PNG")
    print(f"Saved transparent PNG to {output_p}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input> <output> [--square]")
        sys.exit(1)
    crop = "--square" in sys.argv
    process_image(sys.argv[1], sys.argv[2], crop_square=crop)
