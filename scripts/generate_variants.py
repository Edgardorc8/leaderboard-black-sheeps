import colorsys
from pathlib import Path
from PIL import Image, ImageEnhance

def adjust_hsv_and_tint(img: Image.Image, hue_shift: float, sat_mult: float, val_mult: float, tint_rgb=None, tint_strength=0.0):
    """
    Ajusta tonalidades de luces y acentos sin alterar el pelaje negro de la oveja.
    """
    img = img.convert("RGBA")
    r, g, b, a = img.split()
    
    # Procesar píxeles
    r_data = list(r.getdata())
    g_data = list(g.getdata())
    b_data = list(b.getdata())
    a_data = list(a.getdata())
    
    out_r, out_g, out_b = [], [], []
    
    for i in range(len(r_data)):
        alpha = a_data[i]
        if alpha == 0:
            out_r.append(0)
            out_g.append(0)
            out_b.append(0)
            continue
            
        ri, gi, bi = r_data[i] / 255.0, g_data[i] / 255.0, b_data[i] / 255.0
        h, s, v = colorsys.rgb_to_hsv(ri, gi, bi)
        
        # Solo alterar si hay algo de saturación o brillo (luces, runas, armadura, alas)
        # y no el negro profundo puro del pelaje
        if s > 0.15 or v > 0.35:
            h = (h + hue_shift) % 1.0
            s = min(1.0, s * sat_mult)
            v = min(1.0, v * val_mult)
            
            nr, ng, nb = colorsys.hsv_to_rgb(h, s, v)
            
            if tint_rgb and tint_strength > 0:
                tr, tg, tb = [c / 255.0 for c in tint_rgb]
                nr = nr * (1 - tint_strength) + tr * tint_strength
                ng = ng * (1 - tint_strength) + tg * tint_strength
                nb = nb * (1 - tint_strength) + tb * tint_strength
                
            out_r.append(int(nr * 255))
            out_g.append(int(ng * 255))
            out_b.append(int(nb * 255))
        else:
            out_r.append(int(ri * 255))
            out_g.append(int(gi * 255))
            out_b.append(int(bi * 255))
            
    out_img = Image.merge("RGBA", (
        Image.new("L", img.size),
        Image.new("L", img.size),
        Image.new("L", img.size),
        a
    ))
    out_img.putdata(list(zip(out_r, out_g, out_b, a_data)))
    return out_img

def create_character_variant(src_dir: Path, dest_dir: Path, hue_shift: float, sat_mult: float, val_mult: float, tint_rgb=None, tint_strength=0.0):
    dest_dir.mkdir(parents=True, exist_ok=True)
    for filename in ["fullbody.png", "card.png", "avatar.png"]:
        src_file = src_dir / filename
        if src_file.exists():
            img = Image.open(src_file)
            adjusted = adjust_hsv_and_tint(img, hue_shift, sat_mult, val_mult, tint_rgb, tint_strength)
            adjusted.save(dest_dir / filename, "PNG")
            print(f"Created: {dest_dir / filename}")

def main():
    root = Path("public/characters")
    
    # 01 y 02 asegurar nombres estándar
    # Renombrar carpetas si existen
    if (root / "01_alex_closer").exists() and not (root / "01_sheep_alex").exists():
        (root / "01_alex_closer").rename(root / "01_sheep_alex")
    elif not (root / "01_sheep_alex").exists():
        # copiar de 01_alex_closer
        (root / "01_sheep_alex").mkdir(parents=True, exist_ok=True)
        for f in ["fullbody.png", "card.png", "avatar.png"]:
            Image.open(root / "01_alex_closer" / f).save(root / "01_sheep_alex" / f)
            
    if (root / "02_sofia_dealmaker").exists() and not (root / "02_sheep_sofia").exists():
        (root / "02_sofia_dealmaker").rename(root / "02_sheep_sofia")
        
    p1 = root / "01_sheep_alex"
    p2 = root / "02_sheep_sofia"
    p3 = root / "03_sheep_diego"
    p4 = root / "04_sheep_valeria"
    
    print("Generating remaining character rosters with unique battle signatures...")
    
    # 05: Marcos The Iron Ram (Esmeralda / Hierro pesado) -> Base Diego con verde esmeralda
    create_character_variant(p3, root / "05_sheep_marcos", hue_shift=0.35, sat_mult=1.3, val_mult=1.1, tint_rgb=(16, 185, 129), tint_strength=0.25)
    
    # 06: Elena The Diamond Queen (Azul Glaciar / Diamante) -> Base Sofia con tonos cian diamante
    create_character_variant(p2, root / "06_sheep_elena", hue_shift=0.55, sat_mult=1.2, val_mult=1.2, tint_rgb=(56, 189, 248), tint_strength=0.2)
    
    # 07: Javier The Thunder Striker (Plasma Amarillo / Relámpago) -> Base Diego con tonos amarillo eléctrico
    create_character_variant(p3, root / "07_sheep_javier", hue_shift=0.85, sat_mult=1.4, val_mult=1.2, tint_rgb=(250, 204, 21), tint_strength=0.3)
    
    # 08: Mateo The Shadow Rogue (Carmesí Sigiloso / Rojo Sangre) -> Base Alex con detalles rojo carmesí
    create_character_variant(p1, root / "08_sheep_mateo", hue_shift=0.70, sat_mult=1.5, val_mult=0.9, tint_rgb=(239, 68, 68), tint_strength=0.3)
    
    # 09: Camila The Flame Empress (Fuego Volcánico / Naranja Magma) -> Base Valeria con llamas naranjas
    create_character_variant(p4, root / "09_sheep_camila", hue_shift=0.75, sat_mult=1.6, val_mult=1.1, tint_rgb=(249, 115, 22), tint_strength=0.35)
    
    # 10: Lucas The Titan Vanguard (Obsidiana / Amatista Pesado) -> Base Alex con amatista profundo
    create_character_variant(p1, root / "10_sheep_lucas", hue_shift=0.45, sat_mult=1.3, val_mult=1.0, tint_rgb=(168, 85, 247), tint_strength=0.25)
    
    print("ALL 10 CHARACTERS GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
