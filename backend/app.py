
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

# Configure CORS to allow requests specifically from your GitHub Pages domain
# and from local development environments.
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://127.0.0.1:5500",  # For local testing (e.g., with VS Code Live Server)
        "https://amable5380-byte.github.io" # Your deployed frontend
    ]
}})

# --- Helper Functions ---
def get_sanitized_filename(url):
    """Creates a safe filename from a URL."""
    base_name = url.split('/')[-1] if url.split('/')[-1] else "webtoon"
    return "".join(c for c in base_name if c.isalnum() or c in ('-', '_')).rstrip()

# --- API Endpoints ---
@app.route('/api/create-shorts', methods=['POST', 'OPTIONS']) # Added OPTIONS for preflight requests
def create_shorts_endpoint():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return _build_cors_preflight_response()

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
        result = subprocess.run(ffmpeg_command, check=True, capture_output=True, text=True)
        print("✅ Simulation complete. Dummy MP4 file created.")
        
    except FileNotFoundError:
        print("❌ FFmpeg not found. Please install FFmpeg to run this simulation.")
        return jsonify({"error": "Server configuration error: FFmpeg not found."}), 500
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during dummy file creation: {e.stderr}")
        return jsonify({"error": "Failed to create dummy video file."}), 500

    download_url = f'/downloads/{output_filename}'
    response = jsonify({
        "message": "Video creation process started successfully.",
        "downloadUrl": download_url,
        "fileName": output_filename
    })
    
    return response

@app.route('/downloads/<filename>')
def download_file(filename):
    """Serves the generated video file for download."""
    print(f"⬇️ Serving file: {filename}")
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)

# --- CORS Preflight Response Helper ---
def _build_cors_preflight_response():
    response = jsonify(success=True)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
    response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
    return response

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
