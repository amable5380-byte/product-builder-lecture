
import asyncio
import sys
from playwright.async_api import async_playwright
from moviepy.editor import ImageSequenceClip, AudioFileClip, CompositeVideoClip, TextClip
import requests
from bs4 import BeautifulSoup
import os

# --- Configuration ---
# Mac/Linux
FONT_PATH = "/System/Library/Fonts/Supplemental/AppleGothic.ttf" 
# Windows
# FONT_PATH = "C:/Windows/Fonts/malgun.ttf" 
OUTPUT_DIR = "output"
MAX_IMAGES = 50 # Limit the number of images to avoid overly long videos

# --- Helper Functions ---

def get_webtoon_title(url: str) -> str:
    """Fetches the webtoon title from the page's HTML."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        # Naver Webtoon specific selector
        title = soup.select_one('.comicinfo .detail h2').text.strip().split()[0]
        return title
    except Exception as e:
        print(f"Could not fetch webtoon title: {e}")
        return "webtoon_video"

async def capture_webtoon_images(url: str, output_path: str, max_images: int):
    """Uses Playwright to capture screenshots of the webtoon."""
    print("Launching browser...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        print(f"Navigating to {url}...")
        await page.goto(url, wait_until='networkidle')
        
        # Naver Webtoon specific selector for the main image viewer
        image_viewer_selector = '#comic_view_area'
        await page.wait_for_selector(image_viewer_selector)
        
        print("Capturing webtoon cuts...")
        image_elements = await page.query_selector_all(f'{image_viewer_selector} img')
        
        if not os.path.exists(output_path):
            os.makedirs(output_path)

        captured_files = []
        for i, element in enumerate(image_elements[:max_images]):
            filename = os.path.join(output_path, f"shot_{i:03d}.png")
            try:
                await element.screenshot(path=filename)
                print(f"Saved {filename}")
                captured_files.append(filename)
            except Exception as e:
                print(f"Could not capture image {i}: {e}")

        await browser.close()
        print(f"Captured {len(captured_files)} images.")
        return captured_files

def create_scrolling_video(image_files: list, output_filename: str, title: str):
    """Creates a scrolling video from the captured images using MoviePy."""
    if not image_files:
        print("No images to create a video from.")
        return

    print("Creating video...")
    # Add a title card
    title_clip = TextClip(
        f"AI가 제작한\n{title}\n쇼츠 영상",
        fontsize=70,
        color='white',
        font=FONT_PATH,
        bg_color='black',
        size=(1080, 1920)
    ).set_duration(3)

    # Create the main video clip
    main_clip = ImageSequenceClip(image_files, fps=15) # Adjust fps for scroll speed
    
    # Composite the clips
    final_clip = CompositeVideoClip(
        [main_clip.set_position(('center', 'top')), title_clip.set_position('center')],
        size=(1080, 1920) # 9:16 aspect ratio for shorts
    ).set_duration(main_clip.duration)

    # Optional: Add background music (replace with your BGM file)
    # bgm_path = "path/to/your/music.mp3"
    # if os.path.exists(bgm_path):
    #     bgm = AudioFileClip(bgm_path).set_duration(final_clip.duration)
    #     final_clip = final_clip.set_audio(bgm)

    print(f"Writing video file to {output_filename}...")
    final_clip.write_videofile(output_filename, codec="libx264", audio_codec="aac")
    print("Video creation complete!")


# --- Main Execution ---

async def main():
    if len(sys.argv) < 2:
        print("Usage: python create_shorts.py <webtoon_url>")
        sys.exit(1)
        
    webtoon_url = sys.argv[1]
    
    # 1. Get Title & Prepare Paths
    title = get_webtoon_title(webtoon_url)
    image_folder = os.path.join(OUTPUT_DIR, title.replace(" ", "_"))
    output_video_path = os.path.join(OUTPUT_DIR, f"{title.replace(" ", "_")}_shorts.mp4")

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 2. Capture Images
    image_files = await capture_webtoon_images(webtoon_url, image_folder, MAX_IMAGES)
    
    # 3. Create Video
    create_scrolling_video(image_files, output_video_path, title)
    
    # 4. Cleanup
    print("Cleaning up temporary image files...")
    for img_file in image_files:
        os.remove(img_file)
    os.rmdir(image_folder)
    print("Done.")


if __name__ == "__main__":
    # On Windows, you might need this policy for asyncio
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
