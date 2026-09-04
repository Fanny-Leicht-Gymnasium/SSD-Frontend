import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright
import time


APP_URL = "http://localhost:8081/"
OUTPUT_DIR = Path("html/assets/PWA/screenshots")

USERNAME = os.getenv("SSD_USERNAME")
PASSWORD = os.getenv("SSD_PASSWORD")

screenshots = []

variantLablemap = {
    "home": "Home",
    "excuses": "Excuses",
    "settings": "Settings",
}

def login(page):
    """Log into the application."""

    # Fill in login credentials.
    page.locator('ssd-login input[id="username"]').fill(USERNAME)
    page.locator('ssd-login input[id="password"]').fill(PASSWORD)

    # Click the login button.
    page.locator('ssd-login button[type="submit"]').click()

    time.sleep(1)

    # Wait until the application finishes logging in.
    page.wait_for_load_state("networkidle")

def make_page(browser, size, device="desktop", color_scheme="light"):
    """Create a new page with the specified size and color scheme."""
    if device == "desktop":
        viewport = {"width": 1280, "height": 720}
    elif device == "mobile":
        viewport = {"width": 390, "height": 844}
    else:
        raise ValueError(f"Unknown device: {device}")

    return browser.new_page(
        viewport=viewport,
        device_scale_factor=1,
        is_mobile=(device == "mobile"),
        color_scheme=color_scheme,
    )

def make_screenshot(page, variant, device="desktop", color_scheme="light"):
    """Take a screenshot of the page and save it to the specified filename."""
    global screenshots
    filename = variant+"-"+device+"-"+color_scheme+".png"
    page.screenshot(path=OUTPUT_DIR / filename, full_page=True)
    screenshots.append({
        "src": f"/assets/PWA/screenshots/{filename}",
        "sizes": f"{page.viewport_size['width']}x{page.viewport_size['height']}",
        "type": "image/png",
        "form_factor": "wide" if device == "desktop" else "narrow",
        "color_scheme": color_scheme,
        "variant": variantLablemap.get(variant, variant) + (" (Mobile)" if device == "mobile" else "") + (" (Dark Mode)" if color_scheme == "dark" else ""),
    })

def generate_screenshots():
    global screenshots
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not USERNAME or not PASSWORD:
        raise RuntimeError(
            "Set SSD_USERNAME and SSD_PASSWORD environment variables first."
        )

    

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()

        for device in ["desktop", "mobile"]:
            for color_scheme in ["dark", "light"]:
                size = {"width": 1280, "height": 720} if device == "desktop" else {"width": 390, "height": 844}
                page = make_page(browser, size, device=device, color_scheme=color_scheme)

                page.goto(APP_URL+"/intra/", wait_until="networkidle")
                login(page)
                make_screenshot(page, "home", device=device, color_scheme=color_scheme)

                page.goto(APP_URL + "/intra/excuses/", wait_until="networkidle")
                make_screenshot(page, "schedule", device=device, color_scheme=color_scheme)

                page.goto(APP_URL + "/intra/settings/", wait_until="networkidle")
                make_screenshot(page, "settings", device=device, color_scheme=color_scheme)

                page.close()


    print(json.dumps({
        "screenshots": screenshots
    }, indent=2))

    return screenshots


if __name__ == "__main__":
    generate_screenshots()