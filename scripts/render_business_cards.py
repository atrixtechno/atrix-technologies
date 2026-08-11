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
# ~2.7 mm safe margin from PVC trim
SAFE = round(2.7 / 25.4 * DPI)  # ~64 px

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


def chevron_x_at(y: float) -> float:
    """Right-pointing chevron centerline from reference (normalized → px)."""
    # Tip slightly above mid: ~52.7% W at ~44.6% H
    tip_y = 0.446 * H
    tip_x = 0.527 * W
    top_x = 0.434 * W
    bot_x = 0.433 * W
    if y <= tip_y:
        t = y / tip_y if tip_y else 0.0
        return top_x + (tip_x - top_x) * t
    t = (y - tip_y) / (H - tip_y) if H != tip_y else 1.0
    return tip_x + (bot_x - tip_x) * t


def paint_front_chevron(draw: ImageDraw.ImageDraw) -> None:
    """Navy outer + blue inner right-pointing chevron divider (reference match)."""
    # Draw as thick polylines so the tip stays sharp (no polygon self-fill artifacts)
    navy_w = 44
    blue_w = 15
    step = 2
    ys = list(range(0, H + 1, step))
    if ys[-1] != H:
        ys.append(H)

    # Centerline of blue (rightmost edge of divider stack)
    blue_line = [(int(round(chevron_x_at(y))), y) for y in ys]
    # Navy sits left of blue with a tiny white gap
    navy_line = [(int(round(chevron_x_at(y) - blue_w - 4 - navy_w // 2)), y) for y in ys]
    draw.line(navy_line, fill=NAVY, width=navy_w, joint="curve")
    # Midnight accent along outer (left) edge of navy
    midnight_line = [(p[0] - navy_w // 2 + 4, p[1]) for p in navy_line]
    draw.line(midnight_line, fill=MIDNIGHT, width=10, joint="curve")
    draw.line(blue_line, fill=BLUE, width=blue_w, joint="curve")


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


def left_panel_right_bound(y: int) -> int:
    """Usable right edge of left branding panel (inside chevron navy)."""
    return int(chevron_x_at(y) - 78)


def render_front() -> Image.Image:
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Watermark on right panel first
    tip_x = int(0.527 * W)
    wm = load_mark_watermark(880, opacity=13)
    img.paste(wm, (tip_x + 60, (H - wm.height) // 2 - 10), wm)

    paint_corner(draw, "tl", size=390, band=58)
    paint_corner(draw, "br", size=430, band=62)
    paint_front_chevron(draw)

    # Motto along bottom of left panel
    parts = ["TECNOLOGÍA", "INNOVACIÓN", "RENDIMIENTO"]
    motto_f = font(FONT_BOLD, 25)
    motto_h = text_size(draw, parts[0], motto_f)[1]
    my = H - SAFE - motto_h - 6

    # Left stacked logo — fill the chevron pocket without colliding with divider
    pocket_right = left_panel_right_bound(int(0.40 * H))
    logo_max_w = pocket_right - SAFE - 20
    logo_max_h = my - SAFE - 36
    logo = load_stacked_logo(logo_max_w, logo_max_h)
    logo_x = SAFE + max(0, (pocket_right - SAFE - logo.width) // 2)
    logo_y = SAFE + max(0, (my - SAFE - 28 - logo.height) // 2)
    img.paste(logo, (logo_x, logo_y), logo)

    # Motto centered under logo within left pocket
    motto_w = sum(text_size(draw, p, motto_f)[0] for p in parts)
    motto_w += 2 * text_size(draw, "  •  ", motto_f)[0]
    pocket_r_bot = left_panel_right_bound(my)
    mx = SAFE + max(0, (min(pocket_r_bot, pocket_right) - SAFE - motto_w) // 2)
    x = mx
    for i, part in enumerate(parts):
        draw.text((x, my), part, fill=BLACK, font=motto_f)
        tw, _ = text_size(draw, part, motto_f)
        x += tw
        if i < len(parts) - 1:
            draw.text((x, my), "  •  ", fill=BLUE, font=motto_f)
            bw, _ = text_size(draw, "  •  ", motto_f)
            x += bw

    # Right contact block — large print-readable type
    rx = tip_x + 48
    name_f = font(FONT_BOLD, 76)
    title_f = font(FONT_REG, 48)
    info_f = font(FONT_REG, 52)
    info_sm = font(FONT_REG, 48)

    name = "Ing. Néstor J. Resendiz, MBA"
    while text_size(draw, name, name_f)[0] > W - SAFE - 12 - rx and name_f.size > 56:
        name_f = font(FONT_BOLD, name_f.size - 2)

    name_y = SAFE + 20
    draw.text((rx, name_y), name, fill=BLACK, font=name_f)
    _, name_h = text_size(draw, name, name_f)

    title = "Ingeniero en sistemas"
    title_y = name_y + name_h + 12
    draw.text((rx, title_y), title, fill=BLUE, font=title_f)
    tw, title_h = text_size(draw, title, title_f)
    ul_y = title_y + title_h + 10
    draw.line([(rx, ul_y), (rx + max(tw, 280), ul_y)], fill=BLUE, width=4)

    rows = [
        ("phone", "+52 867 179 3155", None),
        ("mail", "atrix.techno@gmail.com", None),
        ("web", "atrixnld.com", None),
        ("pin", "Nuevo Laredo, Tamps.", "Laredo, TX"),
    ]
    icon_r = 50
    contacts_top = ul_y + 30
    contacts_bottom = H - SAFE - 14
    weights = [1.0, 1.0, 1.0, 1.35]
    total_w = sum(weights)
    usable_h = contacts_bottom - contacts_top
    y = contacts_top
    for i, (kind, line1, line2) in enumerate(rows):
        slot = usable_h * (weights[i] / total_w)
        cy = int(y + icon_r + 2)
        circle_icon(draw, rx + icon_r, cy, icon_r, kind)
        tx = rx + icon_r * 2 + 22
        if line2:
            draw.text((tx, int(y + 6)), line1, fill=BLACK, font=info_f)
            draw.text((tx, int(y + 64)), line2, fill=BLACK, font=info_sm)
        else:
            th = text_size(draw, line1, info_f)[1]
            draw.text((tx, cy - th // 2), line1, fill=BLACK, font=info_f)
        y += slot

    return img


def render_back() -> Image.Image:
    """Reverse: 2×3 service grid fills height between header and footer (print-readable)."""
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    wm = load_mark_watermark(780, opacity=11)
    img.paste(wm, (W - wm.width - 8, (H - wm.height) // 2 - 40), wm)

    # Match reference: TL + BR corners (no BL)
    paint_corner(draw, "tl", size=300, band=50)
    paint_corner(draw, "br", size=320, band=52)

    title_f = font(FONT_BLACK, 64)
    sub_f = font(FONT_BOLD, 34)
    t1 = "SOLUCIONES TECNOLÓGICAS"
    t2 = "PARA HOGARES Y EMPRESAS"
    tw, th1 = text_size(draw, t1, title_f)
    draw.text(((W - tw) // 2, SAFE - 4), t1, fill=NAVY, font=title_f)
    tw2, th2 = text_size(draw, t2, sub_f)
    sub_y = SAFE - 4 + th1 + 6
    draw.text(((W - tw2) // 2, sub_y), t2, fill=MUTED, font=sub_f)
    rule_y = sub_y + th2 + 10
    draw.line([(W // 2 - 90, rule_y), (W // 2 + 90, rule_y)], fill=BLUE, width=4)

    services = [
        ("monitor", C_SOPORTE, "SOPORTE TÉCNICO", "Computadoras, Laptops Mantenimiento y Reparación"),
        ("cctv", C_CCTV, "CCTV Y SEGURIDAD", "Instalación, Monitoreo y Acceso Remoto"),
        ("network", C_REDES, "REDES E INFRAESTRUCTURA", "Cableado Estructurado WiFi, Routers, Switches y más"),
        ("code", C_SOFT, "DESARROLLO DE SOFTWARE", "Sitios Web, Sistemas a la Medida, Paneles y Plataformas"),
        ("server", C_IT, "SOPORTE IT EMPRESARIAL", "Mantenimiento, Respaldos, Seguridad y Optimización"),
        ("printer", C_PRINT, "IMPRESORAS Y PERIFÉRICOS", "Instalación, Configuración y Soporte"),
    ]

    # Compact footer — sits close under the 2×3 grid (no empty mid band)
    bar_m = SAFE + 6
    bar_h = 168
    bar_y1 = H - SAFE + 4
    bar_y0 = bar_y1 - bar_h
    grid_top = rule_y + 18
    grid_bottom = bar_y0 - 18
    margin_x = SAFE + 10
    usable_w = W - margin_x * 2
    cols, rows = 3, 2
    cell_w = usable_w // cols
    cell_h = (grid_bottom - grid_top) // rows

    title_font = font(FONT_BOLD, 36)
    desc_font = font(FONT_REG, 28)
    icon_s = 78

    # Grid separators
    for c in range(1, cols):
        sx = margin_x + cell_w * c
        draw.line([(sx, grid_top + 6), (sx, grid_bottom - 6)], fill=LIGHT_GRAY, width=2)
    mid_x0 = margin_x + 28
    mid_x1 = margin_x + usable_w - 28
    mid_y = grid_top + cell_h
    draw.line([(mid_x0, mid_y), (mid_x1, mid_y)], fill=LIGHT_GRAY, width=2)

    for i, (kind, color, title, desc) in enumerate(services):
        row, col = divmod(i, cols)
        x0 = margin_x + col * cell_w
        y0 = grid_top + row * cell_h
        cx = x0 + cell_w // 2
        # Vertical stack centered in cell: icon → title → desc → accent
        pad_y = 22
        icon_y = y0 + pad_y + icon_s
        text_max_w = cell_w - 36
        text_top = icon_y + icon_s + 18
        service_icon(draw, cx, icon_y, kind, color, s=icon_s)
        ty = wrap_center(draw, title, cx, text_top, title_font, color, text_max_w, line_gap=3)
        dy = wrap_center(draw, desc, cx, ty + 10, desc_font, GRAY, text_max_w, line_gap=4)
        line_y = min(dy + 16, y0 + cell_h - 28)
        accent_w = min(int(cell_w * 0.38), 150)
        draw.line([(cx - accent_w, line_y), (cx + accent_w, line_y)], fill=color, width=4)
        draw.ellipse((cx - 7, line_y - 7, cx + 7, line_y + 7), fill=color)

    draw.rounded_rectangle((bar_m, bar_y0, W - bar_m, bar_y1), radius=14, outline=BLUE, width=4)

    footer_items = [
        ("home", "SOPORTE A DOMICILIO\nY REMOTO"),
        ("people", "PROYECTOS\nEMPRESARIALES"),
        ("web", "atrixnld.com"),
    ]
    seg_w = (W - 2 * bar_m) // 3
    foot_f = font(FONT_BOLD, 30)
    url_f = font(FONT_BOLD, 38)
    for i, (kind, label) in enumerate(footer_items):
        cx = bar_m + seg_w * i + seg_w // 2
        if i > 0:
            sx = bar_m + seg_w * i
            draw.line([(sx, bar_y0 + 18), (sx, bar_y1 - 18)], fill=LIGHT_GRAY, width=2)
        mid_y = (bar_y0 + bar_y1) // 2
        icon_r = 34
        if label == "atrixnld.com":
            block_w = icon_r * 2 + 16 + text_size(draw, label, url_f)[0]
            icon_cx = cx - block_w // 2 + icon_r
            circle_icon(draw, icon_cx, mid_y, icon_r, kind)
            tw, th = text_size(draw, label, url_f)
            draw.text((icon_cx + icon_r + 16, mid_y - th // 2), label, fill=BLACK, font=url_f)
        else:
            lines = label.split("\n")
            heights = [text_size(draw, ln, foot_f)[1] for ln in lines]
            total_h = sum(heights) + 4 * (len(lines) - 1)
            max_line_w = max(text_size(draw, ln, foot_f)[0] for ln in lines)
            block_w = icon_r * 2 + 14 + max_line_w
            icon_cx = cx - block_w // 2 + icon_r
            circle_icon(draw, icon_cx, mid_y, icon_r, kind)
            tx = icon_cx + icon_r + 14
            yy = mid_y - total_h // 2
            for ln in lines:
                draw.text((tx, yy), ln, fill=BLACK, font=foot_f)
                yy += text_size(draw, ln, foot_f)[1] + 4

    return img


def main() -> None:
    import sys

    only = sys.argv[1] if len(sys.argv) > 1 else "both"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dpi300_w = round(8.5 / 2.54 * 300)
    dpi300_h = round(5.4 / 2.54 * 300)

    if only in ("both", "front"):
        front = render_front()
        front_path = OUT_DIR / "tarjeta-atrix-frente.png"
        front.save(front_path, "PNG", optimize=True, dpi=(DPI, DPI))
        print(f"Wrote {front_path} {front.size} @ {DPI} DPI ({8.5}×{5.4} cm)")
        small = front.resize((dpi300_w, dpi300_h), Image.Resampling.LANCZOS)
        out = OUT_DIR / "tarjeta-atrix-frente-300dpi.png"
        small.save(out, "PNG", optimize=True, dpi=(300, 300))
        print(f"Wrote {out} {small.size} @ 300 DPI")

    if only in ("both", "back", "reverso"):
        back = render_back()
        back_path = OUT_DIR / "tarjeta-atrix-reverso.png"
        back.save(back_path, "PNG", optimize=True, dpi=(DPI, DPI))
        print(f"Wrote {back_path} {back.size} @ {DPI} DPI ({8.5}×{5.4} cm)")
        small = back.resize((dpi300_w, dpi300_h), Image.Resampling.LANCZOS)
        out = OUT_DIR / "tarjeta-atrix-reverso-300dpi.png"
        small.save(out, "PNG", optimize=True, dpi=(300, 300))
        print(f"Wrote {out} {small.size} @ 300 DPI")


if __name__ == "__main__":
    main()
