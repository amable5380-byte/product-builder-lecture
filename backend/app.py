
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import uuid

# --- Configuration ---
# Use a temporary directory for storing generated files.
# In a real production environment, you would use a more robust storage solution
# like Google Cloud Storage or Amazon S3.
OUTPUT_DIR = "temp_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Flask App Initialization ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow our web frontend
# to communicate with this backend server.
CORS(app)

# --- Helper Functions ---
def get_sanitized_filename(url):
    """Creates a safe filename from a URL."""
    # Take the last part of the URL path
    base_name = url.split('/')[-1] if url.split('/')[-1] else "webtoon"
    # Replace invalid characters
    return "".join(c for c in base_name if c.isalnum() or c in ('-', '_')).rstrip()

# --- API Endpoints ---
@app.route('/api/create-shorts', methods=['POST'])
def create_shorts_endpoint():
    """
    API endpoint to create a webtoon shorts video.
    Expects a JSON payload with a 'url' key.
    """
    data = request.get_json()
    webtoon_url = data.get('url')

    if not webtoon_url:
        return jsonify({"error": "URL is required"}), 400

    print(f"✅ Received request to create shorts for: {webtoon_url}")

    # Generate a unique ID for this request to avoid filename conflicts
    request_id = str(uuid.uuid4())
    sanitized_name = get_sanitized_filename(webtoon_url)
    output_filename = f"{sanitized_name}_{request_id}.mp4"
    output_filepath = os.path.join(OUTPUT_DIR, output_filename)

    # --- SIMULATION: Replace this block with actual video generation ---
    # This is a placeholder to simulate video creation.
    # We'll create a dummy MP4 file. In a real scenario, this is where you would
    # call your web scraping and video processing logic (e.g., using Selenium, moviepy).
    try:
        print(f"🎥 Simulating video creation for {output_filename}...")
        # Use FFmpeg to create a short, silent, black video as a placeholder
        ffmpeg_command = [
            'ffmpeg',
            '-f', 'lavfi',
            '-i', 'color=c=black:s=1080x1920:r=30:d=5', # 5-second black video
            '-y', # Overwrite output file if it exists
            output_filepath
        ]
        # Using subprocess.run to execute the command
        result = subprocess.run(ffmpeg_command, check=True, capture_output=True, text=True)
        print("✅ Simulation complete. Dummy MP4 file created.")
        
    except FileNotFoundError:
        print("❌ FFmpeg not found. Please install FFmpeg to run this simulation.")
        return jsonify({"error": "Server configuration error: FFmpeg not found."}), 500
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during dummy file creation: {e.stderr}")
        return jsonify({"error": "Failed to create dummy video file."}), 500
    # --- End of Simulation Block ---


    # Return the URL to download the generated file
    download_url = f'/downloads/{output_filename}'
    return jsonify({
        "message": "Video creation process started successfully.",
        "downloadUrl": download_url,
        "fileName": output_filename
    })

@app.route('/downloads/<filename>')
def download_file(filename):
    """
    Serves the generated video file for download.
    """
    print(f"⬇️ Serving file: {filename}")
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)

# --- Main Execution ---
if __name__ == '__main__':
    # Running on 0.0.0.0 makes the server accessible from your local network.
    # The default port is 5000.
    app.run(host='0.0.0.0', port=5000, debug=True)
