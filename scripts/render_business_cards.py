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
    """Clean geometric line icons for the PVC reverse grid."""
    w = max(3, s // 11)
    if kind == "monitor":
        # Tech support: clean laptop + compact gear badge
        draw.rounded_rectangle(
            (cx - s * 0.70, cy - s * 0.78, cx + s * 0.70, cy + s * 0.08),
            radius=max(5, s // 12),
            outline=color,
            width=w,
        )
        draw.rectangle(
            (cx - s * 0.54, cy - s * 0.62, cx + s * 0.54, cy - s * 0.06),
            outline=color,
            width=max(2, w - 1),
        )
        draw.line([(cx - s * 0.95, cy + s * 0.22), (cx + s * 0.95, cy + s * 0.22)], fill=color, width=w)
        draw.line([(cx - s * 0.70, cy + s * 0.08), (cx - s * 0.95, cy + s * 0.22)], fill=color, width=w)
        draw.line([(cx + s * 0.70, cy + s * 0.08), (cx + s * 0.95, cy + s * 0.22)], fill=color, width=w)
        draw.line([(cx - s * 0.95, cy + s * 0.36), (cx + s * 0.95, cy + s * 0.36)], fill=color, width=max(2, w - 1))
        gx, gy, gr = cx + s * 0.28, cy - s * 0.34, s * 0.18
        draw.ellipse((gx - gr, gy - gr, gx + gr, gy + gr), outline=color, width=w)
        draw.ellipse((gx - gr * 0.35, gy - gr * 0.35, gx + gr * 0.35, gy + gr * 0.35), fill=color)
        for ang in (0, 60, 120):
            rad = math.radians(ang)
            c, sn = math.cos(rad), math.sin(rad)
            draw.line(
                [(gx + gr * 0.55 * c, gy + gr * 0.55 * sn), (gx + gr * 1.15 * c, gy + gr * 1.15 * sn)],
                fill=color,
                width=max(2, w - 1),
            )
            draw.line(
                [(gx - gr * 0.55 * c, gy - gr * 0.55 * sn), (gx - gr * 1.15 * c, gy - gr * 1.15 * sn)],
                fill=color,
                width=max(2, w - 1),
            )
    elif kind == "cctv":
        # Clean side-profile security camera
        draw.rounded_rectangle(
            (cx - s * 0.58, cy - s * 0.28, cx + s * 0.28, cy + s * 0.28),
            radius=max(8, s // 7),
            outline=color,
            width=w,
        )
        draw.ellipse((cx + s * 0.08, cy - s * 0.30, cx + s * 0.68, cy + s * 0.30), outline=color, width=w)
        draw.ellipse(
            (cx + s * 0.26, cy - s * 0.16, cx + s * 0.54, cy + s * 0.16),
            outline=color,
            width=max(2, w - 1),
        )
        draw.ellipse((cx + s * 0.34, cy - s * 0.07, cx + s * 0.46, cy + s * 0.07), fill=color)
        draw.ellipse((cx - s * 0.42, cy - s * 0.12, cx - s * 0.28, cy + s * 0.02), fill=color)
        draw.line([(cx - s * 0.12, cy + s * 0.28), (cx - s * 0.12, cy + s * 0.55)], fill=color, width=w)
        draw.rounded_rectangle(
            (cx - s * 0.48, cy + s * 0.55, cx + s * 0.24, cy + s * 0.72),
            radius=max(3, s // 18),
            outline=color,
            width=w,
        )
    elif kind == "network":
        # Hub-and-spoke nodes (no globe clutter)
        nodes = [
            (cx, cy - s * 0.72),
            (cx - s * 0.78, cy + s * 0.12),
            (cx + s * 0.78, cy + s * 0.12),
            (cx - s * 0.42, cy + s * 0.78),
            (cx + s * 0.42, cy + s * 0.78),
        ]
        hub_r = max(7, s // 7)
        for nx, ny in nodes:
            draw.line([(cx, cy), (nx, ny)], fill=color, width=w)
        draw.ellipse((cx - hub_r, cy - hub_r, cx + hub_r, cy + hub_r), outline=color, width=w)
        draw.ellipse((cx - hub_r // 2, cy - hub_r // 2, cx + hub_r // 2, cy + hub_r // 2), fill=color)
        nr = max(5, s // 9)
        for nx, ny in nodes:
            draw.ellipse((nx - nr, ny - nr, nx + nr, ny + nr), outline=color, width=w)
            draw.ellipse((nx - nr // 2, ny - nr // 2, nx + nr // 2, ny + nr // 2), fill=color)
    elif kind == "code":
        # Software: app window with code lines (reads clearer than tight </>)
        draw.rounded_rectangle(
            (cx - s * 0.78, cy - s * 0.62, cx + s * 0.78, cy + s * 0.66),
            radius=max(6, s // 10),
            outline=color,
            width=w,
        )
        # Title bar
        draw.line([(cx - s * 0.78, cy - s * 0.30), (cx + s * 0.78, cy - s * 0.30)], fill=color, width=w)
        for dx in (-0.55, -0.38, -0.21):
            r = max(3, s // 16)
            px = cx + s * dx
            py = cy - s * 0.46
            draw.ellipse((px - r, py - r, px + r, py + r), fill=color)
        # Code lines
        for i, frac in enumerate((0.85, 0.62, 0.74)):
            yy = cy - s * 0.05 + i * s * 0.22
            x0 = cx - s * 0.52
            draw.line([(x0, yy), (x0 + s * frac, yy)], fill=color, width=max(2, w - 1))
    elif kind == "server":
        # Three clean rack units
        unit_h = s * 0.42
        gap = s * 0.12
        top = cy - (1.5 * unit_h + gap)
        for i in range(3):
            y0 = top + i * (unit_h + gap)
            y1 = y0 + unit_h
            draw.rounded_rectangle(
                (cx - s * 0.78, y0, cx + s * 0.78, y1),
                radius=max(3, s // 14),
                outline=color,
                width=w,
            )
            led = max(4, s // 12)
            my = (y0 + y1) / 2
            draw.ellipse((cx - s * 0.55 - led, my - led, cx - s * 0.55 + led, my + led), fill=color)
            draw.line([(cx - s * 0.28, my), (cx + s * 0.52, my)], fill=color, width=max(2, w - 1))
    elif kind == "printer":
        # Paper + body + tray (balanced silhouette)
        draw.rounded_rectangle(
            (cx - s * 0.48, cy - s * 0.88, cx + s * 0.48, cy - s * 0.22),
            radius=max(3, s // 16),
            outline=color,
            width=w,
        )
        draw.line([(cx - s * 0.28, cy - s * 0.68), (cx + s * 0.28, cy - s * 0.68)], fill=color, width=max(2, w - 1))
        draw.line([(cx - s * 0.28, cy - s * 0.52), (cx + s * 0.18, cy - s * 0.52)], fill=color, width=max(2, w - 1))
        draw.rounded_rectangle(
            (cx - s * 0.82, cy - s * 0.32, cx + s * 0.82, cy + s * 0.38),
            radius=max(5, s // 10),
            outline=color,
            width=w,
        )
        draw.rounded_rectangle(
            (cx - s * 0.42, cy + s * 0.12, cx + s * 0.42, cy + s * 0.82),
            radius=max(3, s // 16),
            outline=color,
            width=w,
        )
        draw.ellipse((cx + s * 0.48, cy - s * 0.08, cx + s * 0.66, cy + s * 0.1), fill=color)


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
    for i, line in enumerate(lines):
        tw, th = text_size(draw, line, fnt)
        draw.text((cx - tw // 2, yy), line, fill=fill, font=fnt)
        yy += th
        if i < len(lines) - 1:
            yy += line_gap
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


def draw_footer_frame(
    draw: ImageDraw.ImageDraw,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    radius: int = 28,
) -> None:
    """Delicate single-stroke footer frame with soft fill."""
    fill = (244, 247, 252)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=fill)
    # Thin navy hairline — no dual remarcado
    draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, outline=NAVY, width=2)


def measure_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.ImageFont,
    max_w: int,
    line_gap: int = 4,
) -> tuple[list[str], int, int]:
    """Return wrapped lines, block width, and block height."""
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
    if not lines:
        return [], 0, 0
    widths = [text_size(draw, ln, fnt)[0] for ln in lines]
    heights = [text_size(draw, ln, fnt)[1] for ln in lines]
    return lines, max(widths), sum(heights) + line_gap * (len(lines) - 1)


def render_back() -> Image.Image:
    """Reverse: 2×3 service grid + refined footer band (print-readable)."""
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    wm = load_mark_watermark(760, opacity=10)
    img.paste(wm, (W - wm.width - 20, (H - wm.height) // 2 - 28), wm)

    # Match reference: TL + BR corners (BR painted again after footer so it overlaps frame)
    paint_corner(draw, "tl", size=292, band=48)

    # —— Header ——
    # Generous air around the main title (top pad + title→subtitle separation)
    title_f = font(FONT_BLACK, 70)
    sub_f = font(FONT_BOLD, 34)
    t1 = "SOLUCIONES TECNOLÓGICAS"
    t2 = "PARA HOGARES Y EMPRESAS"
    header_top = SAFE + 26
    tw, th1 = text_size(draw, t1, title_f)
    draw.text(((W - tw) // 2, header_top), t1, fill=NAVY, font=title_f)
    tw2, th2 = text_size(draw, t2, sub_f)
    # No underline / dual accent rule — air only
    sub_y = header_top + th1 + 62
    draw.text(((W - tw2) // 2, sub_y), t2, fill=MUTED, font=sub_f)
    header_bottom = sub_y + th2 + 8  # extra air under subtitle before grid

    services = [
        ("monitor", C_SOPORTE, "SOPORTE TÉCNICO", "Computadoras, Laptops Mantenimiento y Reparación"),
        ("cctv", C_CCTV, "CCTV Y SEGURIDAD", "Instalación, Monitoreo y Acceso Remoto"),
        ("network", C_REDES, "REDES E INFRAESTRUCTURA", "Cableado Estructurado WiFi, Routers, Switches y más"),
        ("code", C_SOFT, "DESARROLLO DE SOFTWARE", "Sitios Web, Sistemas a la Medida, Paneles y Plataformas"),
        ("server", C_IT, "SOPORTE IT EMPRESARIAL", "Mantenimiento, Respaldos, Seguridad y Optimización"),
        ("printer", C_PRINT, "IMPRESORAS Y PERIFÉRICOS", "Instalación, Configuración y Soporte"),
    ]

    # —— Footer band: short thin marco, clear air above from service accents ——
    bar_m = SAFE + 12
    bar_h = 76  # was 156 — short band, tight vertical padding
    bar_y1 = H - SAFE + 2
    bar_y0 = bar_y1 - bar_h

    # Gap between bottom accent row and footer frame
    grid_top = header_bottom + 22
    grid_bottom = bar_y0 - 40
    margin_x = SAFE + 8
    usable_w = W - margin_x * 2
    cols, rows = 3, 2
    cell_w = usable_w // cols
    cell_h = (grid_bottom - grid_top) // rows

    # Type + icons; captions sit close under titles; accents stay on a fixed row baseline
    title_font = font(FONT_BOLD, 40)
    desc_font = font(FONT_REG, 30)
    icon_s = 90
    title_line_gap = 8
    desc_line_gap = 10
    min_icon_title = 18
    # Tight title→caption gap (do not stretch — captions lift toward titles)
    title_desc_gap = 2
    cell_pad = 10
    text_max_w = cell_w - 32

    # Measure every cell once
    measured: list[tuple[str, tuple[int, int, int], str, str, int, int]] = []
    for kind, color, title, desc in services:
        _, _, title_h = measure_wrapped(draw, title, title_font, text_max_w, line_gap=title_line_gap)
        _, _, desc_h = measure_wrapped(draw, desc, desc_font, text_max_w, line_gap=desc_line_gap)
        measured.append((kind, color, title, desc, title_h, desc_h))

    # No gray cell separators — open 2×3 grid
    for row in range(rows):
        row_items = measured[row * cols : (row + 1) * cols]
        y0 = grid_top + row * cell_h
        # Top-anchored icons; accents locked to a shared bottom baseline (do not follow captions)
        icon_y = y0 + cell_pad + icon_s
        line_y = y0 + cell_h - cell_pad
        span = line_y - (icon_y + icon_s)
        max_text = max(th + title_desc_gap + dh for *_, th, dh in row_items)
        # Extra vertical room becomes air between captions and the fixed accent line
        free = max(0, span - max_text)
        icon_title_gap = min_icon_title + max(0, free // 5)

        text_top = icon_y + icon_s + icon_title_gap

        for col, (kind, color, title, desc, _th, _dh) in enumerate(row_items):
            cx = margin_x + col * cell_w + cell_w // 2
            service_icon(draw, cx, icon_y, kind, color, s=icon_s)
            ty = wrap_center(
                draw, title, cx, text_top, title_font, color, text_max_w, line_gap=title_line_gap
            )
            wrap_center(
                draw,
                desc,
                cx,
                ty + title_desc_gap,
                desc_font,
                GRAY,
                text_max_w,
                line_gap=desc_line_gap,
            )
            accent_w = min(int(cell_w * 0.36), 148)
            draw.line([(cx - accent_w, line_y), (cx + accent_w, line_y)], fill=color, width=4)
            draw.ellipse((cx - 6, line_y - 6, cx + 6, line_y + 6), fill=color)

    # —— Footer frame + equal-column content (shorter marco, no gray dividers) ——
    draw_footer_frame(draw, bar_m, bar_y0, W - bar_m, bar_y1, radius=12)

    # Tight inset so icons/text sit close to the thin border
    stroke_inset = 5
    content_y0 = bar_y0 + stroke_inset
    content_y1 = bar_y1 - stroke_inset
    mid_y = (content_y0 + content_y1) // 2

    footer_items = [
        ("home", "SOPORTE A DOMICILIO\nY REMOTO", False),
        ("people", "PROYECTOS\nEMPRESARIALES", False),
        ("web", "atrixnld.com", True),
    ]
    inner_m = bar_m + stroke_inset
    inner_w = W - 2 * inner_m
    seg_w = inner_w // 3
    foot_f = font(FONT_BOLD, 19)
    url_f = font(FONT_BOLD, 25)
    icon_r = 24
    icon_text_gap = 10
    col_pad = 8

    for i, (kind, label, is_url) in enumerate(footer_items):
        seg_x0 = inner_m + seg_w * i
        # No gray vertical dividers between footer columns

        fnt = url_f if is_url else foot_f
        lines = label.split("\n")
        # Tight line air inside short marco
        line_gap = 2 if not is_url else 2
        tracking = 1.1 if not is_url else 0.0

        def tracked_width(text: str) -> int:
            if tracking <= 0 or len(text) <= 1:
                return text_size(draw, text, fnt)[0]
            return sum(text_size(draw, ch, fnt)[0] for ch in text) + int(tracking * (len(text) - 1))

        def draw_tracked(x: int, y: int, text: str) -> None:
            if tracking <= 0:
                draw.text((x, y), text, fill=BLACK, font=fnt)
                return
            cx = x
            for ch in text:
                draw.text((cx, y), ch, fill=BLACK, font=fnt)
                cx += text_size(draw, ch, fnt)[0] + tracking

        heights = [text_size(draw, ln, fnt)[1] for ln in lines]
        total_h = sum(heights) + line_gap * (len(lines) - 1)
        max_line_w = max(tracked_width(ln) for ln in lines)

        # Icon + text as one unit, vertically centered in the short band
        block_w = icon_r * 2 + icon_text_gap + max_line_w
        max_block_w = seg_w - 2 * col_pad
        if block_w > max_block_w:
            block_w = max_block_w
        block_left = seg_x0 + (seg_w - block_w) // 2
        icon_cx = block_left + icon_r
        circle_icon(draw, icon_cx, mid_y, icon_r, kind)
        tx = icon_cx + icon_r + icon_text_gap

        if is_url:
            # Left-middle anchor: vertical midline of text matches icon center
            draw.text((tx, mid_y), lines[0], fill=BLACK, font=fnt, anchor="lm")
        else:
            yy = mid_y - total_h // 2
            for ln in lines:
                draw_tracked(tx, yy, ln)
                yy += text_size(draw, ln, fnt)[1] + line_gap

    # Brand corner sits over the footer frame (reference look)
    paint_corner(draw, "br", size=310, band=50)

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
