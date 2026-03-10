
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import uuid

# --- Configuration ---
OUTPUT_DIR = "temp_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Flask App Initialization ---
app = Flask(__name__)

# Configure CORS to allow requests from your specific GitHub Pages domain.
# This is more secure than allowing all origins.
CORS(app, resources={
    r"/api/*": {"origins": "https://amable5380-byte.github.io"},
    r"/downloads/*": {"origins": "https://amable5380-byte.github.io"}
})


# --- Helper Functions ---
def get_sanitized_filename(url):
    """Creates a safe filename from a URL."""
    base_name = url.split('/')[-1] if url.split('/')[-1] else "webtoon"
    return "".join(c for c in base_name if c.isalnum() or c in ('-', '_')).rstrip()

# --- API Endpoints ---
@app.route('/api/create-shorts', methods=['POST'])
def create_shorts_endpoint():
    # The Flask-CORS extension automatically handles OPTIONS preflight requests.
    data = request.get_json()
    webtoon_url = data.get('url')

    if not webtoon_url:
        return jsonify({"error": "URL is required"}), 400

    print(f"✅ Received request to create shorts for: {webtoon_url}")

    request_id = str(uuid.uuid4())
    sanitized_name = get_sanitized_filename(webtoon_url)
    output_filename = f"{sanitized_name}_{request_id}.mp4"
    output_filepath = os.path.join(OUTPUT_DIR, output_filename)

    try:
        print(f"🎥 Simulating video creation for {output_filename}...")
        ffmpeg_command = [
            'ffmpeg',
            '-f', 'lavfi',
            '-i', 'color=c=black:s=1080x1920:r=30:d=5',
            '-y',
            output_filepath
        ]
        subprocess.run(ffmpeg_command, check=True, capture_output=True, text=True)
        print("✅ Simulation complete. Dummy MP4 file created.")

    except FileNotFoundError:
        print("❌ FFmpeg not found. Please install FFmpeg on your system to run this.")
        return jsonify({"error": "Server configuration error: FFmpeg not found."}), 500
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during dummy file creation: {e.stderr}")
        return jsonify({"error": "Failed to create dummy video file."}), 500

    download_url = f'/downloads/{output_filename}'
    return jsonify({
        "message": "Video creation process completed.",
        "downloadUrl": download_url,
        "fileName": output_filename
    })

@app.route('/downloads/<filename>')
def download_file(filename):
    """Serves the generated video file for download."""
    print(f"⬇️ Serving file: {filename}")
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)


# --- Main Execution ---
if __name__ == '__main__':
    # To fix the "Failed to fetch" error caused by mixed content (https frontend
    # calling an http backend), we run the Flask server over HTTPS using a temporary,
    # self-signed certificate.
    # Note: You may need to install the pyOpenSSL library: pip install pyOpenSSL
    print("🚀 Starting Flask server on https://127.0.0.1:5000")
    print("ℹ️ Your browser will show a security warning. You must accept it to proceed.")
    app.run(host='0.0.0.0', port=5000, debug=True, ssl_context='adhoc')
