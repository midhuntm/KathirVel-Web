import sys
import os

# Add the 'backend' folder to Python's system path so it can import your API correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

# This exports your FastAPI 'app' exactly as Vercel expects it
from app.main import app
