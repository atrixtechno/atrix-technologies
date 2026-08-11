#!/usr/bin/env python3
"""Render ATRIX PVC business cards at print-quality 600 DPI (8.5 × 5.4 cm)."""

from __future__ import annotations

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
        # Laptop / tech support: screen + base
        draw.rounded_rectangle(
            (cx - s * 0.72, cy - s * 0.72, cx + s * 0.72, cy + s * 0.28),
            radius=max(4, s // 10),
            outline=color,
            width=w,
        )
        draw.line([(cx - s * 0.55, cy - s * 0.48), (cx + s * 0.55, cy - s * 0.48)], fill=color, width=max(2, w - 1))
        draw.line([(cx - s * 0.95, cy + s * 0.42), (cx + s * 0.95, cy + s * 0.42)], fill=color, width=w)
        draw.line([(cx - s * 0.72, cy + s * 0.28), (cx - s * 0.95, cy + s * 0.42)], fill=color, width=w)
        draw.line([(cx + s * 0.72, cy + s * 0.28), (cx + s * 0.95, cy + s * 0.42)], fill=color, width=w)
        # Small wrench accent (geometric)
        draw.arc(
            (cx + s * 0.15, cy - s * 0.25, cx + s * 0.55, cy + s * 0.15),
            start=200,
            end=340,
            fill=color,
            width=w,
        )
        draw.line(
            [(cx + s * 0.35, cy - s * 0.05), (cx + s * 0.55, cy + s * 0.18)],
            fill=color,
            width=w,
        )
    elif kind == "cctv":
        # Dome / bullet camera — simple silhouette
        draw.ellipse((cx - s * 0.35, cy - s * 0.55, cx + s * 0.35, cy + s * 0.15), outline=color, width=w)
        draw.rounded_rectangle(
            (cx - s * 0.55, cy - s * 0.05, cx + s * 0.55, cy + s * 0.45),
            radius=max(4, s // 9),
            outline=color,
            width=w,
        )
        draw.ellipse((cx - s * 0.18, cy + s * 0.05, cx + s * 0.18, cy + s * 0.35), outline=color, width=w)
        draw.ellipse((cx - s * 0.07, cy + s * 0.14, cx + s * 0.07, cy + s * 0.26), fill=color)
        draw.line([(cx, cy + s * 0.45), (cx, cy + s * 0.72)], fill=color, width=w)
        draw.line([(cx - s * 0.35, cy + s * 0.72), (cx + s * 0.35, cy + s * 0.72)], fill=color, width=w)
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
        # Soft brackets + slash (no window chrome / text glyph)
        bw = max(3, w)
        # Left chevron <
        draw.line(
            [(cx - s * 0.15, cy - s * 0.72), (cx - s * 0.72, cy), (cx - s * 0.15, cy + s * 0.72)],
            fill=color,
            width=bw,
            joint="curve",
        )
        # Right chevron >
        draw.line(
            [(cx + s * 0.15, cy - s * 0.72), (cx + s * 0.72, cy), (cx + s * 0.15, cy + s * 0.72)],
            fill=color,
            width=bw,
            joint="curve",
        )
        # Center slash
        draw.line([(cx + s * 0.12, cy - s * 0.55), (cx - s * 0.12, cy + s * 0.55)], fill=color, width=bw)
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
    title_f = font(FONT_BLACK, 60)
    sub_f = font(FONT_BOLD, 32)
    t1 = "SOLUCIONES TECNOLÓGICAS"
    t2 = "PARA HOGARES Y EMPRESAS"
    header_top = SAFE + 2
    tw, th1 = text_size(draw, t1, title_f)
    draw.text(((W - tw) // 2, header_top), t1, fill=NAVY, font=title_f)
    tw2, th2 = text_size(draw, t2, sub_f)
    # Extra air between title and subtitle; no underline / dual accent rule
    sub_y = header_top + th1 + 40
    draw.text(((W - tw2) // 2, sub_y), t2, fill=MUTED, font=sub_f)
    header_bottom = sub_y + th2

    services = [
        ("monitor", C_SOPORTE, "SOPORTE TÉCNICO", "Computadoras, Laptops Mantenimiento y Reparación"),
        ("cctv", C_CCTV, "CCTV Y SEGURIDAD", "Instalación, Monitoreo y Acceso Remoto"),
        ("network", C_REDES, "REDES E INFRAESTRUCTURA", "Cableado Estructurado WiFi, Routers, Switches y más"),
        ("code", C_SOFT, "DESARROLLO DE SOFTWARE", "Sitios Web, Sistemas a la Medida, Paneles y Plataformas"),
        ("server", C_IT, "SOPORTE IT EMPRESARIAL", "Mantenimiento, Respaldos, Seguridad y Optimización"),
        ("printer", C_PRINT, "IMPRESORAS Y PERIFÉRICOS", "Instalación, Configuración y Soporte"),
    ]

    # —— Footer band: equal thirds, circular marks + text as one aligned row ——
    bar_m = SAFE + 12
    bar_h = 198
    bar_y1 = H - SAFE + 2
    bar_y0 = bar_y1 - bar_h

    grid_top = header_bottom + 26
    grid_bottom = bar_y0 - 18
    margin_x = SAFE + 14
    usable_w = W - margin_x * 2
    cols, rows = 3, 2
    cell_w = usable_w // cols
    cell_h = (grid_bottom - grid_top) // rows

    title_font = font(FONT_BOLD, 34)
    desc_font = font(FONT_REG, 26)
    icon_s = 72

    # No gray cell separators — open 2×3 grid

    for i, (kind, color, title, desc) in enumerate(services):
        row, col = divmod(i, cols)
        x0 = margin_x + col * cell_w
        y0 = grid_top + row * cell_h
        cx = x0 + cell_w // 2
        text_max_w = cell_w - 44

        # Measure stack then center vertically in cell
        _, _, title_h = measure_wrapped(draw, title, title_font, text_max_w, line_gap=2)
        _, _, desc_h = measure_wrapped(draw, desc, desc_font, text_max_w, line_gap=3)
        stack_h = icon_s * 2 + 14 + title_h + 8 + desc_h + 18
        stack_top = y0 + max(16, (cell_h - stack_h) // 2)
        icon_y = stack_top + icon_s
        text_top = icon_y + icon_s + 14

        service_icon(draw, cx, icon_y, kind, color, s=icon_s)
        ty = wrap_center(draw, title, cx, text_top, title_font, color, text_max_w, line_gap=2)
        dy = wrap_center(draw, desc, cx, ty + 8, desc_font, GRAY, text_max_w, line_gap=3)
        line_y = min(dy + 14, y0 + cell_h - 22)
        accent_w = min(int(cell_w * 0.32), 128)
        draw.line([(cx - accent_w, line_y), (cx + accent_w, line_y)], fill=color, width=4)
        draw.ellipse((cx - 6, line_y - 6, cx + 6, line_y + 6), fill=color)

    # —— Footer frame + equal-column content ——
    draw_footer_frame(draw, bar_m, bar_y0, W - bar_m, bar_y1, radius=26)

    # Content box inside thin frame
    stroke_inset = 14
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
    foot_f = font(FONT_BOLD, 26)
    url_f = font(FONT_BOLD, 34)
    icon_r = 38
    icon_text_gap = 20
    col_pad = 18

    for i, (kind, label, is_url) in enumerate(footer_items):
        seg_x0 = inner_m + seg_w * i
        if i > 0:
            sx = seg_x0
            draw.line(
                [(sx, content_y0 + 12), (sx, content_y1 - 12)],
                fill=(198, 208, 224),
                width=2,
            )

        fnt = url_f if is_url else foot_f
        lines = label.split("\n")
        # Generous line air so stacked footer labels aren't cramped
        line_gap = 18 if not is_url else 4
        tracking = 1.6 if not is_url else 0.0

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

        # Icon + text as one unit, centered in the column (balanced band)
        block_w = icon_r * 2 + icon_text_gap + max_line_w
        max_block = seg_w - 2 * col_pad
        if block_w > max_block:
            block_w = max_block
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
