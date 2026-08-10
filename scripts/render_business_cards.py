#!/usr/bin/env python3
"""Render ATRIX PVC business cards at print-quality 600 DPI (8.5 × 5.4 cm)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "brand"
SRC_LOGO = ROOT / "assets" / "source-cards" / "atrix-technologies-logo.png"

# Physical: 85 mm × 54 mm (8.5 cm × 5.4 cm) at 600 DPI
DPI = 600
W = round(8.5 / 2.54 * DPI)  # 2008
H = round(5.4 / 2.54 * DPI)  # 1276
# ~3.6 mm safe margin from PVC trim
SAFE = round(3.6 / 25.4 * DPI)  # ~85 px

BLUE = (0, 90, 231)  # #005AE7
NAVY = (0, 28, 72)  # #001C48
MIDNIGHT = (0, 12, 36)  # #000C24
BLACK = (12, 16, 24)
GRAY = (90, 96, 108)
LIGHT_GRAY = (210, 214, 222)
MUTED = (120, 126, 136)
WHITE = (255, 255, 255)

C_SOPORTE = (20, 70, 200)
C_CCTV = (46, 140, 70)
C_REDES = (120, 70, 190)
C_SOFT = (230, 95, 45)
C_IT = (40, 130, 185)
C_PRINT = (200, 40, 75)

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def paint_corner(draw: ImageDraw.ImageDraw, corner: str, size: int = 310, band: int = 48) -> None:
    """Paint three diagonal stripe bands in a card corner."""
    layers = [
        (size, BLUE),
        (size - band, NAVY),
        (size - 2 * band, MIDNIGHT),
    ]
    for extent, color in layers:
        if corner == "tl":
            draw.polygon([(0, 0), (extent, 0), (0, extent)], fill=color)
        elif corner == "br":
            draw.polygon([(W, H), (W - extent, H), (W, H - extent)], fill=color)
        elif corner == "bl":
            draw.polygon([(0, H), (extent, H), (0, H - extent)], fill=color)
        elif corner == "tr":
            draw.polygon([(W, 0), (W - extent, 0), (W, extent)], fill=color)


def load_stacked_logo(max_w: int, max_h: int) -> Image.Image:
    """Crop official logo to emblem + ATRIX + TECHNOLOGIES (no motto)."""
    logo = Image.open(SRC_LOGO).convert("RGBA")
    stacked = logo.crop((40, 90, 984, 840))
    datas = stacked.getdata()
    new = []
    for r, g, b, a in datas:
        if r > 245 and g > 245 and b > 245:
            new.append((r, g, b, 0))
        else:
            new.append((r, g, b, a))
    stacked.putdata(new)
    stacked.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    return stacked


def load_mark_watermark(size: int, opacity: int = 18) -> Image.Image:
    """Faint large mark for background watermark."""
    src = Image.open(SRC_LOGO).convert("RGBA")
    mark = src.crop((180, 100, 840, 620))
    datas = mark.getdata()
    new = []
    for r, g, b, a in datas:
        if r > 245 and g > 245 and b > 245:
            new.append((255, 255, 255, 0))
        else:
            new.append((180, 195, 220, opacity if a > 10 else 0))
    mark.putdata(new)
    mark.thumbnail((size, size), Image.Resampling.LANCZOS)
    return mark


def circle_icon(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    r: int,
    kind: str,
) -> None:
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BLUE)
    s = r * 0.55
    lw = max(2, r // 10)
    if kind == "phone":
        pts = [
            (cx - s * 0.55, cy - s * 0.35),
            (cx - s * 0.15, cy - s * 0.7),
            (cx + s * 0.05, cy - s * 0.45),
            (cx - s * 0.15, cy - s * 0.15),
            (cx + s * 0.15, cy + s * 0.15),
            (cx + s * 0.45, cy - s * 0.05),
            (cx + s * 0.7, cy + s * 0.15),
            (cx + s * 0.35, cy + s * 0.55),
            (cx - s * 0.05, cy + s * 0.35),
            (cx - s * 0.55, cy - s * 0.05),
        ]
        draw.polygon(pts, fill=WHITE)
    elif kind == "mail":
        box = (cx - s, cy - s * 0.65, cx + s, cy + s * 0.65)
        draw.rounded_rectangle(box, radius=max(2, r // 8), outline=WHITE, width=lw)
        draw.line(
            [(cx - s, cy - s * 0.65), (cx, cy + s * 0.1), (cx + s, cy - s * 0.65)],
            fill=WHITE,
            width=lw,
        )
    elif kind == "web":
        draw.ellipse((cx - s, cy - s, cx + s, cy + s), outline=WHITE, width=lw)
        draw.ellipse((cx - s * 0.45, cy - s, cx + s * 0.45, cy + s), outline=WHITE, width=max(2, r // 12))
        draw.line([(cx - s, cy), (cx + s, cy)], fill=WHITE, width=max(2, r // 12))
        draw.line([(cx, cy - s), (cx, cy + s)], fill=WHITE, width=max(2, r // 14))
    elif kind == "pin":
        draw.ellipse((cx - s * 0.7, cy - s * 0.85, cx + s * 0.7, cy + s * 0.35), fill=WHITE)
        draw.polygon(
            [(cx - s * 0.55, cy + s * 0.05), (cx + s * 0.55, cy + s * 0.05), (cx, cy + s * 0.95)],
            fill=WHITE,
        )
        draw.ellipse((cx - s * 0.28, cy - s * 0.45, cx + s * 0.28, cy + s * 0.05), fill=BLUE)
    elif kind == "home":
        draw.polygon(
            [(cx, cy - s * 0.85), (cx + s * 0.85, cy - s * 0.05), (cx - s * 0.85, cy - s * 0.05)],
            fill=WHITE,
        )
        draw.rectangle((cx - s * 0.55, cy - s * 0.05, cx + s * 0.55, cy + s * 0.75), fill=WHITE)
        draw.rectangle((cx - s * 0.18, cy + s * 0.15, cx + s * 0.18, cy + s * 0.75), fill=BLUE)
    elif kind == "people":
        for dx in (-s * 0.55, 0, s * 0.55):
            draw.ellipse((cx + dx - s * 0.22, cy - s * 0.7, cx + dx + s * 0.22, cy - s * 0.2), fill=WHITE)
            draw.ellipse((cx + dx - s * 0.38, cy - s * 0.05, cx + dx + s * 0.38, cy + s * 0.75), fill=WHITE)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def service_icon(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    kind: str,
    color: tuple[int, int, int],
    s: int = 38,
) -> None:
    """Line-art service icons sized for the PVC card."""
    w = max(3, s // 12)
    if kind == "monitor":
        draw.rounded_rectangle((cx - s, cy - s * 0.7, cx + s, cy + s * 0.45), radius=6, outline=color, width=w)
        draw.line([(cx - s * 0.35, cy + s * 0.55), (cx + s * 0.35, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx, cy + s * 0.45), (cx, cy + s * 0.55)], fill=color, width=w)
        gx, gy, gr = cx + s * 0.55, cy + s * 0.35, max(12, s // 2.5)
        draw.ellipse((gx - gr, gy - gr, gx + gr, gy + gr), outline=color, width=w)
        ir = max(4, int(gr * 0.35))
        draw.ellipse((gx - ir, gy - ir, gx + ir, gy + ir), outline=color, width=w)
        for ang in range(0, 360, 45):
            rad = math.radians(ang)
            x1 = gx + math.cos(rad) * (gr - 1)
            y1 = gy + math.sin(rad) * (gr - 1)
            x2 = gx + math.cos(rad) * (gr + 5)
            y2 = gy + math.sin(rad) * (gr + 5)
            draw.line([(x1, y1), (x2, y2)], fill=color, width=w)
    elif kind == "cctv":
        draw.rounded_rectangle(
            (cx - s * 0.2, cy - s * 0.35, cx + s * 0.9, cy + s * 0.35),
            radius=7,
            outline=color,
            width=w,
        )
        draw.ellipse((cx + s * 0.35, cy - s * 0.22, cx + s * 0.8, cy + s * 0.22), outline=color, width=w)
        draw.line([(cx - s * 0.2, cy), (cx - s * 0.75, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx - s * 0.9, cy + s * 0.55), (cx - s * 0.55, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx + s * 0.2, cy - s * 0.35), (cx - s * 0.05, cy - s * 0.75)], fill=color, width=w)
    elif kind == "network":
        draw.ellipse((cx - s, cy - s, cx + s, cy + s), outline=color, width=w)
        draw.ellipse((cx - s * 0.4, cy - s, cx + s * 0.4, cy + s), outline=color, width=max(2, w - 1))
        draw.line([(cx - s, cy), (cx + s, cy)], fill=color, width=w)
        nr = max(5, s // 8)
        for dx, dy in [(-0.55, -0.55), (0.55, -0.55), (-0.55, 0.55), (0.55, 0.55), (0, 0)]:
            nx, ny = cx + dx * s * 0.85, cy + dy * s * 0.85
            draw.ellipse((nx - nr, ny - nr, nx + nr, ny + nr), fill=color)
    elif kind == "code":
        draw.rounded_rectangle((cx - s, cy - s * 0.75, cx + s, cy + s * 0.75), radius=7, outline=color, width=w)
        draw.rectangle((cx - s, cy - s * 0.75, cx + s, cy - s * 0.4), outline=color, width=w)
        for dx in (-0.45, 0, 0.45):
            draw.ellipse(
                (cx + dx * s - 4, cy - s * 0.6 - 4, cx + dx * s + 4, cy - s * 0.6 + 4),
                fill=color,
            )
        fnt = font(FONT_BOLD, max(22, int(s * 0.7)))
        tw, th = text_size(draw, "</>", fnt)
        draw.text((cx - tw // 2, cy - th // 2 + 4), "</>", fill=color, font=fnt)
    elif kind == "server":
        for oy in (-0.55, 0, 0.55):
            y0 = cy + oy * s
            hh = max(12, s // 3)
            draw.rounded_rectangle(
                (cx - s * 0.7, y0 - hh, cx + s * 0.7, y0 + hh),
                radius=4,
                outline=color,
                width=w,
            )
            draw.ellipse((cx - s * 0.45, y0 - 5, cx - s * 0.45 + 10, y0 + 5), fill=color)
            draw.line([(cx - s * 0.15, y0), (cx + s * 0.45, y0)], fill=color, width=w)
        sx, sy = cx + s * 0.75, cy + s * 0.55
        draw.polygon(
            [
                (sx, sy - 18),
                (sx + 16, sy - 12),
                (sx + 16, sy + 5),
                (sx, sy + 18),
                (sx - 16, sy + 5),
                (sx - 16, sy - 12),
            ],
            outline=color,
            width=w,
        )
        draw.line([(sx - 5, sy + 1), (sx - 1, sy + 7), (sx + 8, sy - 5)], fill=color, width=w)
    elif kind == "printer":
        draw.rounded_rectangle(
            (cx - s * 0.55, cy - s * 0.85, cx + s * 0.55, cy - s * 0.15),
            radius=4,
            outline=color,
            width=w,
        )
        draw.rounded_rectangle(
            (cx - s * 0.85, cy - s * 0.25, cx + s * 0.85, cy + s * 0.45),
            radius=6,
            outline=color,
            width=w,
        )
        draw.rounded_rectangle(
            (cx - s * 0.5, cy + s * 0.15, cx + s * 0.5, cy + s * 0.85),
            radius=3,
            outline=color,
            width=w,
        )
        draw.ellipse((cx + s * 0.5, cy - s * 0.05, cx + s * 0.7, cy + s * 0.15), fill=color)


def wrap_center(
    draw: ImageDraw.ImageDraw,
    text: str,
    cx: int,
    y: int,
    fnt: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    max_w: int,
    line_gap: int = 4,
) -> int:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        tw, _ = text_size(draw, trial, fnt)
        if tw <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    yy = y
    for line in lines:
        tw, th = text_size(draw, line, fnt)
        draw.text((cx - tw // 2, yy), line, fill=fill, font=fnt)
        yy += th + line_gap
    return yy


def render_front() -> Image.Image:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    wm = load_mark_watermark(720, opacity=20)
    img.paste(wm, (W - wm.width - SAFE - 20, (H - wm.height) // 2 - 20), wm)

    paint_corner(draw, "tl", size=320, band=52)
    paint_corner(draw, "br", size=360, band=56)

    # Left stacked logo — keep inside safe area, leave room for motto
    logo = load_stacked_logo(580, 780)
    logo_x = SAFE + 25
    logo_y = SAFE + 28
    img.paste(logo, (logo_x, logo_y), logo)

    # Motto bottom-left (above safe / corner)
    parts = ["TECNOLOGÍA", "INNOVACIÓN", "RENDIMIENTO"]
    mx, my = SAFE + 25, H - SAFE - 36
    bf = font(FONT_BOLD, 16)
    x = mx
    for i, part in enumerate(parts):
        draw.text((x, my), part, fill=BLACK, font=bf)
        tw, _ = text_size(draw, part, bf)
        x += tw
        if i < len(parts) - 1:
            draw.text((x, my), "  •  ", fill=BLUE, font=bf)
            bw, _ = text_size(draw, "  •  ", bf)
            x += bw

    # Vertical divider — split ~40% logo / 60% contact for 8.5×5.4
    div_x = 790
    draw.line([(div_x, SAFE + 50), (div_x, H - SAFE - 50)], fill=BLUE, width=3)

    # Right contact block — print-sized type (~6–8 pt at 600 DPI)
    rx = div_x + 48
    name_f = font(FONT_BOLD, 44)
    title_f = font(FONT_REG, 26)
    info_f = font(FONT_REG, 28)
    info_sm = font(FONT_REG, 24)

    draw.text((rx, SAFE + 72), "Ing. Néstor J. Resendiz, MBA", fill=BLACK, font=name_f)
    draw.text((rx, SAFE + 132), "Ingeniero en sistemas", fill=BLUE, font=title_f)

    rows = [
        ("phone", "+52 867 179 3155", None),
        ("mail", "atrix.techno@gmail.com", None),
        ("web", "atrixnld.com", None),
        ("pin", "Nuevo Laredo, Tamps.", "Laredo, TX"),
    ]
    y = SAFE + 210
    icon_r = 26
    for kind, line1, line2 in rows:
        circle_icon(draw, rx + icon_r, y + icon_r, icon_r, kind)
        tx = rx + icon_r * 2 + 22
        if line2:
            draw.text((tx, y - 2), line1, fill=BLACK, font=info_f)
            draw.text((tx, y + 34), line2, fill=BLACK, font=info_sm)
            y += 98
        else:
            draw.text((tx, y + 6), line1, fill=BLACK, font=info_f)
            y += 82

    return img


def render_back() -> Image.Image:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    wm = load_mark_watermark(640, opacity=14)
    img.paste(wm, (W - wm.width - 40, 20), wm)

    paint_corner(draw, "tl", size=260, band=44)
    paint_corner(draw, "bl", size=240, band=42)
    paint_corner(draw, "br", size=280, band=46)

    # Title — centered in safe zone
    title_f = font(FONT_BLACK, 42)
    sub_f = font(FONT_BOLD, 22)
    t1 = "SOLUCIONES TECNOLÓGICAS"
    t2 = "PARA HOGARES Y EMPRESAS"
    tw, _ = text_size(draw, t1, title_f)
    draw.text(((W - tw) // 2, SAFE + 20), t1, fill=NAVY, font=title_f)
    tw2, _ = text_size(draw, t2, sub_f)
    draw.text(((W - tw2) // 2, SAFE + 74), t2, fill=MUTED, font=sub_f)
    draw.line([(W // 2 - 48, SAFE + 114), (W // 2 + 48, SAFE + 114)], fill=BLUE, width=3)

    services = [
        ("monitor", C_SOPORTE, "SOPORTE TÉCNICO", "Computadoras, Laptops Mantenimiento y Reparación"),
        ("cctv", C_CCTV, "CCTV Y SEGURIDAD", "Instalación, Monitoreo y Acceso Remoto"),
        ("network", C_REDES, "REDES E INFRAESTRUCTURA", "Cableado Estructurado WiFi, Routers, Switches y más"),
        ("code", C_SOFT, "DESARROLLO DE SOFTWARE", "Sitios Web, Sistemas a la Medida, Paneles y Plataformas"),
        ("server", C_IT, "SOPORTE IT EMPRESARIAL", "Mantenimiento, Respaldos, Seguridad y Optimización"),
        ("printer", C_PRINT, "IMPRESORAS Y PERIFÉRICOS", "Instalación, Configuración y Soporte"),
    ]

    margin_x = SAFE
    usable = W - margin_x * 2
    col_w = usable // 6
    title_font = font(FONT_BOLD, 15)
    desc_font = font(FONT_REG, 13)
    icon_y = SAFE + 200
    text_top = SAFE + 278
    col_bottom = H - SAFE - 168

    for i, (kind, color, title, desc) in enumerate(services):
        cx = margin_x + col_w * i + col_w // 2
        service_icon(draw, cx, icon_y, kind, color, s=34)
        if i > 0:
            sx = margin_x + col_w * i
            draw.line([(sx, SAFE + 140), (sx, col_bottom)], fill=LIGHT_GRAY, width=2)

        ty = wrap_center(draw, title, cx, text_top, title_font, color, col_w - 16, line_gap=2)
        dy = ty + 14
        draw.line([(cx - col_w * 0.26, dy), (cx + col_w * 0.26, dy)], fill=color, width=2)
        draw.ellipse((cx - 4, dy - 4, cx + 4, dy + 4), fill=color)
        wrap_center(draw, desc, cx, dy + 14, desc_font, GRAY, col_w - 18, line_gap=2)

    # Footer bar
    bar_m = SAFE + 50
    bar_y0, bar_y1 = H - SAFE - 110, H - SAFE - 18
    draw.rounded_rectangle((bar_m, bar_y0, W - bar_m, bar_y1), radius=12, outline=BLUE, width=3)

    footer_items = [
        ("home", "SOPORTE A DOMICILIO\nY REMOTO"),
        ("people", "PROYECTOS\nEMPRESARIALES"),
        ("web", "atrixnld.com"),
    ]
    seg_w = (W - 2 * bar_m) // 3
    foot_f = font(FONT_BOLD, 15)
    url_f = font(FONT_BOLD, 20)
    for i, (kind, label) in enumerate(footer_items):
        cx = bar_m + seg_w * i + seg_w // 2
        if i > 0:
            sx = bar_m + seg_w * i
            draw.line([(sx, bar_y0 + 18), (sx, bar_y1 - 18)], fill=LIGHT_GRAY, width=2)
        mid_y = (bar_y0 + bar_y1) // 2
        icon_r = 18
        if label == "atrixnld.com":
            block_w = icon_r * 2 + 16 + text_size(draw, label, url_f)[0]
            icon_cx = cx - block_w // 2 + icon_r
            circle_icon(draw, icon_cx, mid_y, icon_r, kind)
            tw, th = text_size(draw, label, url_f)
            draw.text((icon_cx + icon_r + 16, mid_y - th // 2), label, fill=BLACK, font=url_f)
        else:
            lines = label.split("\n")
            heights = [text_size(draw, ln, foot_f)[1] for ln in lines]
            total_h = sum(heights) + 3 * (len(lines) - 1)
            max_line_w = max(text_size(draw, ln, foot_f)[0] for ln in lines)
            block_w = icon_r * 2 + 14 + max_line_w
            icon_cx = cx - block_w // 2 + icon_r
            circle_icon(draw, icon_cx, mid_y, icon_r, kind)
            tx = icon_cx + icon_r + 14
            yy = mid_y - total_h // 2
            for ln in lines:
                draw.text((tx, yy), ln, fill=BLACK, font=foot_f)
                yy += text_size(draw, ln, foot_f)[1] + 3

    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    front = render_front()
    back = render_back()
    front_path = OUT_DIR / "tarjeta-atrix-frente.png"
    back_path = OUT_DIR / "tarjeta-atrix-reverso.png"
    # Primary: sharp 600 DPI PNGs for PVC print
    front.save(front_path, "PNG", optimize=True, dpi=(DPI, DPI))
    back.save(back_path, "PNG", optimize=True, dpi=(DPI, DPI))
    print(f"Wrote {front_path} {front.size} @ {DPI} DPI ({8.5}×{5.4} cm)")
    print(f"Wrote {back_path} {back.size} @ {DPI} DPI ({8.5}×{5.4} cm)")

    # Optional 300 DPI exports alongside (not used by site download links)
    dpi300_w = round(8.5 / 2.54 * 300)
    dpi300_h = round(5.4 / 2.54 * 300)
    for src, name in ((front, "tarjeta-atrix-frente-300dpi.png"), (back, "tarjeta-atrix-reverso-300dpi.png")):
        small = src.resize((dpi300_w, dpi300_h), Image.Resampling.LANCZOS)
        out = OUT_DIR / name
        small.save(out, "PNG", optimize=True, dpi=(300, 300))
        print(f"Wrote {out} {small.size} @ 300 DPI")


if __name__ == "__main__":
    main()
