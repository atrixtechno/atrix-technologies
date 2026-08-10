#!/usr/bin/env python3
"""Re-render ATRIX business cards at print-quality HD (vector-sharp, not upscaled WhatsApp)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "brand"
SRC_LOGO = ROOT / "assets" / "source-cards" / "atrix-technologies-logo.png"
SRC_LOGO_V8 = ROOT / "public" / "brand" / "atrix-logo-v8.png"

# Standard card proportion ~3.5 × 2 → 3000 × 1714
W, H = 3000, 1714

BLUE = (0, 90, 231)  # #005AE7
NAVY = (0, 28, 72)  # #001C48
MIDNIGHT = (0, 12, 36)  # #000C24
BLACK = (12, 16, 24)
GRAY = (90, 96, 108)
LIGHT_GRAY = (210, 214, 222)
MUTED = (120, 126, 136)
WHITE = (255, 255, 255)

# Service palette (matched to source flyer)
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


def draw_corner_stripes(
    draw: ImageDraw.ImageDraw,
    corner: str,
    size: int = 420,
    band: int = 78,
) -> None:
    """Three diagonal color bands in a card corner (blue / navy / midnight)."""
    colors = [BLUE, NAVY, MIDNIGHT]
    for i, color in enumerate(colors):
        o = i * band
        if corner == "tl":
            # Triangle growing from top-left
            pts = [
                (0, 0),
                (size - o, 0),
                (0, size - o),
            ]
            if i < 2:
                inner = [
                    (0, 0),
                    (size - o - band, 0),
                    (0, size - o - band),
                ]
                draw.polygon(pts, fill=color)
                draw.polygon(inner, fill=WHITE if i == 0 else colors[i + 1] if False else WHITE)
                # redraw proper layered stripes as thick diagonals
        elif corner == "br":
            pts = [
                (W, H),
                (W - (size - o), H),
                (W, H - (size - o)),
            ]
            draw.polygon(pts, fill=color)
        elif corner == "bl":
            pts = [
                (0, H),
                (size - o, H),
                (0, H - (size - o)),
            ]
            draw.polygon(pts, fill=color)
        elif corner == "tr":
            pts = [
                (W, 0),
                (W - (size - o), 0),
                (W, size - o),
            ]
            draw.polygon(pts, fill=color)

    # Clean layered approach: draw largest to smallest so stripes show
    # Re-implement properly below via helper that paints bands as trapezoids.


def paint_corner(draw: ImageDraw.ImageDraw, corner: str, size: int = 460, band: int = 72) -> None:
    """Paint three diagonal stripe bands that look like the source cards."""
    # Outer → inner colors for corner tip
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
    # Content roughly y=90..840 for stacked without motto
    stacked = logo.crop((40, 90, 984, 840))
    # Make near-white transparent for clean composite
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
    # Emblem only region
    mark = src.crop((180, 100, 840, 620))
    datas = mark.getdata()
    new = []
    for r, g, b, a in datas:
        if r > 245 and g > 245 and b > 245:
            new.append((255, 255, 255, 0))
        else:
            # Light blue-gray watermark
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
    # white glyph
    s = r * 0.55
    if kind == "phone":
        # simplified handset as thick rounded path approx via polygon
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
        draw.rounded_rectangle(box, radius=4, outline=WHITE, width=max(3, r // 10))
        draw.line([(cx - s, cy - s * 0.65), (cx, cy + s * 0.1), (cx + s, cy - s * 0.65)], fill=WHITE, width=max(3, r // 10))
    elif kind == "web":
        draw.ellipse((cx - s, cy - s, cx + s, cy + s), outline=WHITE, width=max(3, r // 10))
        draw.ellipse((cx - s * 0.45, cy - s, cx + s * 0.45, cy + s), outline=WHITE, width=max(2, r // 12))
        draw.line([(cx - s, cy), (cx + s, cy)], fill=WHITE, width=max(2, r // 12))
        draw.line([(cx, cy - s), (cx, cy + s)], fill=WHITE, width=max(2, r // 14))
    elif kind == "pin":
        # teardrop pin
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


def render_front() -> Image.Image:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Watermark
    wm = load_mark_watermark(1100, opacity=22)
    img.paste(wm, (W - wm.width - 180, (H - wm.height) // 2 - 40), wm)

    paint_corner(draw, "tl", size=480, band=78)
    paint_corner(draw, "br", size=560, band=86)

    # Left stacked logo
    logo = load_stacked_logo(780, 980)
    img.paste(logo, (160, 180), logo)

    # Motto bottom-left
    motto_f = font(FONT_BOLD, 28)
    motto = "TECNOLOGÍA  •  INNOVACIÓN  •  RENDIMIENTO"
    # blue bullets via separate draw
    parts = ["TECNOLOGÍA", "INNOVACIÓN", "RENDIMIENTO"]
    mx, my = 160, H - 160
    # measure total
    gap = "   "
    bullet = "  •  "
    full = bullet.join(parts)
    # draw with blue bullets
    x = mx
    bf = font(FONT_BOLD, 26)
    for i, part in enumerate(parts):
        draw.text((x, my), part, fill=BLACK, font=bf)
        tw, _ = text_size(draw, part, bf)
        x += tw
        if i < len(parts) - 1:
            draw.text((x, my), "  •  ", fill=BLUE, font=bf)
            bw, _ = text_size(draw, "  •  ", bf)
            x += bw

    # Vertical divider
    div_x = 1180
    draw.line([(div_x, 220), (div_x, H - 220)], fill=BLUE, width=4)

    # Right contact block
    rx = div_x + 90
    name_f = font(FONT_BOLD, 52)
    title_f = font(FONT_REG, 34)
    info_f = font(FONT_REG, 36)
    info_sm = font(FONT_REG, 32)

    draw.text((rx, 280), "Ing. Néstor J. Resendiz, MBA", fill=BLACK, font=name_f)
    draw.text((rx, 360), "Ingeniero en sistemas", fill=BLUE, font=title_f)

    rows = [
        ("phone", "+52 867 179 3155", None),
        ("mail", "atrix.techno@gmail.com", None),
        ("web", "atrixnld.com", None),
        ("pin", "Nuevo Laredo, Tamps.", "Laredo, TX"),
    ]
    y = 470
    icon_r = 34
    for kind, line1, line2 in rows:
        circle_icon(draw, rx + icon_r, y + icon_r, icon_r, kind)
        tx = rx + icon_r * 2 + 36
        draw.text((tx, y + 8 if not line2 else y - 2), line1, fill=BLACK, font=info_f)
        if line2:
            draw.text((tx, y + 48), line2, fill=BLACK, font=info_sm)
            y += 130
        else:
            y += 110

    return img


def service_icon(draw: ImageDraw.ImageDraw, cx: int, cy: int, kind: str, color: tuple[int, int, int]) -> None:
    """Line-art service icons."""
    w = 4
    s = 55
    if kind == "monitor":
        draw.rounded_rectangle((cx - s, cy - s * 0.7, cx + s, cy + s * 0.45), radius=8, outline=color, width=w)
        draw.line([(cx - s * 0.35, cy + s * 0.55), (cx + s * 0.35, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx, cy + s * 0.45), (cx, cy + s * 0.55)], fill=color, width=w)
        # gear
        gx, gy, gr = cx + s * 0.55, cy + s * 0.35, 22
        draw.ellipse((gx - gr, gy - gr, gx + gr, gy + gr), outline=color, width=w)
        draw.ellipse((gx - 8, gy - 8, gx + 8, gy + 8), outline=color, width=w)
        for ang in range(0, 360, 45):
            rad = math.radians(ang)
            x1 = gx + math.cos(rad) * (gr - 2)
            y1 = gy + math.sin(rad) * (gr - 2)
            x2 = gx + math.cos(rad) * (gr + 8)
            y2 = gy + math.sin(rad) * (gr + 8)
            draw.line([(x1, y1), (x2, y2)], fill=color, width=w)
    elif kind == "cctv":
        # camera body
        draw.rounded_rectangle((cx - s * 0.2, cy - s * 0.35, cx + s * 0.9, cy + s * 0.35), radius=10, outline=color, width=w)
        draw.ellipse((cx + s * 0.35, cy - s * 0.22, cx + s * 0.8, cy + s * 0.22), outline=color, width=w)
        draw.line([(cx - s * 0.2, cy), (cx - s * 0.75, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx - s * 0.9, cy + s * 0.55), (cx - s * 0.55, cy + s * 0.55)], fill=color, width=w)
        draw.line([(cx + s * 0.2, cy - s * 0.35), (cx - s * 0.05, cy - s * 0.75)], fill=color, width=w)
    elif kind == "network":
        draw.ellipse((cx - s, cy - s, cx + s, cy + s), outline=color, width=w)
        draw.ellipse((cx - s * 0.4, cy - s, cx + s * 0.4, cy + s), outline=color, width=max(2, w - 1))
        draw.line([(cx - s, cy), (cx + s, cy)], fill=color, width=w)
        # nodes
        for dx, dy in [(-0.55, -0.55), (0.55, -0.55), (-0.55, 0.55), (0.55, 0.55), (0, 0)]:
            nx, ny = cx + dx * s * 0.85, cy + dy * s * 0.85
            draw.ellipse((nx - 8, ny - 8, nx + 8, ny + 8), fill=color)
    elif kind == "code":
        draw.rounded_rectangle((cx - s, cy - s * 0.75, cx + s, cy + s * 0.75), radius=10, outline=color, width=w)
        draw.rectangle((cx - s, cy - s * 0.75, cx + s, cy - s * 0.4), outline=color, width=w)
        for i, dx in enumerate([-0.45, 0, 0.45]):
            draw.ellipse((cx + dx * s - 6, cy - s * 0.6 - 6, cx + dx * s + 6, cy - s * 0.6 + 6), fill=color)
        # </>
        fnt = font(FONT_BOLD, 42)
        draw.text((cx - 36, cy - 18), "</>", fill=color, font=fnt)
    elif kind == "server":
        for i, oy in enumerate([-0.55, 0, 0.55]):
            y0 = cy + oy * s
            draw.rounded_rectangle((cx - s * 0.7, y0 - 22, cx + s * 0.7, y0 + 22), radius=6, outline=color, width=w)
            draw.ellipse((cx - s * 0.45, y0 - 7, cx - s * 0.45 + 14, y0 + 7), fill=color)
            draw.line([(cx - s * 0.15, y0), (cx + s * 0.45, y0)], fill=color, width=w)
        # shield
        sx, sy = cx + s * 0.75, cy + s * 0.55
        draw.polygon(
            [(sx, sy - 28), (sx + 24, sy - 18), (sx + 24, sy + 8), (sx, sy + 28), (sx - 24, sy + 8), (sx - 24, sy - 18)],
            outline=color,
            width=w,
        )
        draw.line([(sx - 8, sy + 2), (sx - 1, sy + 10), (sx + 12, sy - 8)], fill=color, width=w)
    elif kind == "printer":
        draw.rounded_rectangle((cx - s * 0.55, cy - s * 0.85, cx + s * 0.55, cy - s * 0.15), radius=6, outline=color, width=w)
        draw.rounded_rectangle((cx - s * 0.85, cy - s * 0.25, cx + s * 0.85, cy + s * 0.45), radius=8, outline=color, width=w)
        draw.rounded_rectangle((cx - s * 0.5, cy + s * 0.15, cx + s * 0.5, cy + s * 0.85), radius=4, outline=color, width=w)
        draw.ellipse((cx + s * 0.5, cy - s * 0.05, cx + s * 0.7, cy + s * 0.15), fill=color)


def wrap_center(
    draw: ImageDraw.ImageDraw,
    text: str,
    cx: int,
    y: int,
    fnt: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    max_w: int,
    line_gap: int = 8,
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


def render_back() -> Image.Image:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    wm = load_mark_watermark(1000, opacity=16)
    img.paste(wm, (W - wm.width - 80, 40), wm)

    paint_corner(draw, "tl", size=400, band=70)
    paint_corner(draw, "bl", size=360, band=64)
    paint_corner(draw, "br", size=420, band=70)

    # Title
    title_f = font(FONT_BLACK, 58)
    sub_f = font(FONT_BOLD, 30)
    t1 = "SOLUCIONES TECNOLÓGICAS"
    t2 = "PARA HOGARES Y EMPRESAS"
    tw, _ = text_size(draw, t1, title_f)
    draw.text(((W - tw) // 2, 120), t1, fill=NAVY, font=title_f)
    tw2, _ = text_size(draw, t2, sub_f)
    draw.text(((W - tw2) // 2, 200), t2, fill=MUTED, font=sub_f)
    # underline
    draw.line([(W // 2 - 70, 260), (W // 2 + 70, 260)], fill=BLUE, width=4)

    services = [
        ("monitor", C_SOPORTE, "SOPORTE TÉCNICO", "Computadoras, Laptops Mantenimiento y Reparación"),
        ("cctv", C_CCTV, "CCTV Y SEGURIDAD", "Instalación, Monitoreo y Acceso Remoto"),
        ("network", C_REDES, "REDES E INFRAESTRUCTURA", "Cableado Estructurado WiFi, Routers, Switches y más"),
        ("code", C_SOFT, "DESARROLLO DE SOFTWARE", "Sitios Web, Sistemas a la Medida, Paneles y Plataformas"),
        ("server", C_IT, "SOPORTE IT EMPRESARIAL", "Mantenimiento, Respaldos, Seguridad y Optimización"),
        ("printer", C_PRINT, "IMPRESORAS Y PERIFÉRICOS", "Instalación, Configuración y Soporte"),
    ]

    margin_x = 90
    usable = W - margin_x * 2
    col_w = usable // 6
    title_font = font(FONT_BOLD, 22)
    desc_font = font(FONT_REG, 18)
    icon_y = 400
    text_top = 520

    for i, (kind, color, title, desc) in enumerate(services):
        cx = margin_x + col_w * i + col_w // 2
        service_icon(draw, cx, icon_y, kind, color)
        # vertical separators between columns
        if i > 0:
            sx = margin_x + col_w * i
            draw.line([(sx, 320), (sx, 1180)], fill=LIGHT_GRAY, width=2)

        ty = wrap_center(draw, title, cx, text_top, title_font, color, col_w - 36, line_gap=4)
        # divider with center dot
        dy = ty + 28
        draw.line([(cx - col_w * 0.32, dy), (cx + col_w * 0.32, dy)], fill=color, width=3)
        draw.ellipse((cx - 7, dy - 7, cx + 7, dy + 7), fill=color)
        wrap_center(draw, desc, cx, dy + 28, desc_font, GRAY, col_w - 40, line_gap=4)

    # Footer bar
    bar_m = 160
    bar_y0, bar_y1 = H - 280, H - 140
    draw.rounded_rectangle((bar_m, bar_y0, W - bar_m, bar_y1), radius=18, outline=BLUE, width=4)

    footer_items = [
        ("home", "SOPORTE A DOMICILIO\nY REMOTO"),
        ("people", "PROYECTOS\nEMPRESARIALES"),
        ("web", "atrixnld.com"),
    ]
    seg_w = (W - 2 * bar_m) // 3
    foot_f = font(FONT_BOLD, 22)
    url_f = font(FONT_BOLD, 28)
    for i, (kind, label) in enumerate(footer_items):
        cx = bar_m + seg_w * i + seg_w // 2
        if i > 0:
            sx = bar_m + seg_w * i
            draw.line([(sx, bar_y0 + 28), (sx, bar_y1 - 28)], fill=LIGHT_GRAY, width=2)
        icon_cx = cx - 130 if "\n" in label or kind != "web" else cx - 150
        if kind == "web" and label == "atrixnld.com":
            icon_cx = cx - 160
        mid_y = (bar_y0 + bar_y1) // 2
        circle_icon(draw, icon_cx, mid_y, 28, kind)
        tx = icon_cx + 50
        if label == "atrixnld.com":
            tw, th = text_size(draw, label, url_f)
            draw.text((tx, mid_y - th // 2), label, fill=BLACK, font=url_f)
        else:
            lines = label.split("\n")
            # measure block
            heights = [text_size(draw, ln, foot_f)[1] for ln in lines]
            total_h = sum(heights) + 4 * (len(lines) - 1)
            yy = mid_y - total_h // 2
            for ln in lines:
                draw.text((tx, yy), ln, fill=BLACK, font=foot_f)
                yy += text_size(draw, ln, foot_f)[1] + 4

    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    front = render_front()
    back = render_back()
    front_path = OUT_DIR / "tarjeta-atrix-frente.png"
    back_path = OUT_DIR / "tarjeta-atrix-reverso.png"
    front.save(front_path, "PNG", optimize=True)
    back.save(back_path, "PNG", optimize=True)
    print(f"Wrote {front_path} {front.size}")
    print(f"Wrote {back_path} {back.size}")


if __name__ == "__main__":
    main()
