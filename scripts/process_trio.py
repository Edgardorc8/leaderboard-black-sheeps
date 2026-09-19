import sys
from pathlib import Path
from PIL import Image
from rembg import remove

def process_character_trio(fullbody_input: str, output_dir: str):
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading {fullbody_input}...")
    raw_img = Image.open(fullbody_input)
    
    print("Removing background for fullbody...")
    fullbody = remove(raw_img)
    fullbody_path = out_dir / "fullbody.png"
    fullbody.save(fullbody_path, "PNG")
    print(f"Saved: {fullbody_path}")
    
    # Obtener bbox del contenido no transparente
    bbox = fullbody.getbbox()
    if not bbox:
        bbox = (0, 0, fullbody.width, fullbody.height)
    
    bx0, by0, bx1, by1 = bbox
    bw = bx1 - bx0
    bh = by1 - by0
    
    # 1. CARD: Busto (parte superior hasta el 60% del alto del personaje)
    card_top = max(0, by0 - int(bh * 0.05))
    card_bottom = min(fullbody.height, by0 + int(bh * 0.62))
    card_left = max(0, bx0 - int(bw * 0.08))
    card_right = min(fullbody.width, bx1 + int(bw * 0.08))
    card_img = fullbody.crop((card_left, card_top, card_right, card_bottom))
    card_path = out_dir / "card.png"
    card_img.save(card_path, "PNG")
    print(f"Saved: {card_path}")
    
    # 2. AVATAR: Cabeza y cuernos (parte superior hasta el 38% del alto, centrado en cuadrado 1:1)
    head_top = max(0, by0 - int(bh * 0.02))
    head_bottom = min(fullbody.height, by0 + int(bh * 0.40))
    head_height = head_bottom - head_top
    head_center_x = (bx0 + bx1) // 2
    avatar_half_size = int(head_height * 0.60)
    
    av_left = max(0, head_center_x - avatar_half_size)
    av_right = min(fullbody.width, head_center_x + avatar_half_size)
    av_top = head_top
    av_bottom = min(fullbody.height, head_top + (av_right - av_left))
    
    avatar_img = fullbody.crop((av_left, av_top, av_right, av_bottom))
    avatar_img = avatar_img.resize((512, 512), Image.Resampling.LANCZOS)
    avatar_path = out_dir / "avatar.png"
    avatar_img.save(avatar_path, "PNG")
    print(f"Saved: {avatar_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_trio.py <fullbody_jpg> <output_dir>")
        sys.exit(1)
    process_character_trio(sys.argv[1], sys.argv[2])
