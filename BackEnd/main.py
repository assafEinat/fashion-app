from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import random
import cv2
import io

from pydantic import BaseModel
from starlette.responses import StreamingResponse
import account

app = FastAPI()

# Add CORSMiddleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Cache control headers
headers = {"Cache-Control": "public, no-store"}

ROOT_BACKGROUNDS = r"C:\Users\yarin\PycharmProjects\pythonProject\backgrounds"
ROOT_CLOTHES = r"C:\Users\yarin\PycharmProjects\pythonProject\clothes\male"  # Directory where clothing items are stored
shirt_index = 1
pants_index = 1
background_index = 1

def get_file_count(directory: str) -> int:
    """Returns the number of files in the given directory."""
    files_in_directory = os.listdir(directory)
    file_count = 0

    # Loop through all files in the directory and count only files (not subdirectories)
    for file in files_in_directory:
        file_path = os.path.join(directory, file)
        if os.path.isfile(file_path):
            file_count += 1

    return file_count

def get_random_file(directory: str) -> str:
    """Returns a random file from the given directory."""
    files = get_file_list(directory)
    if files:
        return random.choice(files)
    return None

def get_file_list(directory: str) -> list:
    """Returns a list of files in the given directory."""
    files = []
    for f in os.listdir(directory):
        file_path = os.path.join(directory, f)
        if os.path.isfile(file_path):
            files.append(f)
    return files


@app.get("/clothings/shirts/next")
def next_shirt():
    global shirt_index
    print("next--"+str(shirt_index))
    shirts_dir = os.path.join(ROOT_CLOTHES, "shirts")
    shirt_count = get_file_count(shirts_dir)

    # Serve the current file and then increment the index
    shirt_filename = f"{shirt_index}.jfif"
    shirt_path = os.path.join(shirts_dir, shirt_filename)

    if os.path.exists(shirt_path):
        shirt_index += 1
        if shirt_index > shirt_count:  # If index exceeds the file count, reset it
            shirt_index = 1
        return FileResponse(shirt_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Shirt not found"}

@app.get("/clothings/pants/next")
def next_pants():
    global pants_index
    pants_dir = os.path.join(ROOT_CLOTHES, "pants")
    pants_count = get_file_count(pants_dir)

    # Serve the current file and then increment the index
    pants_filename = f"{pants_index}.jpg"
    pants_path = os.path.join(pants_dir, pants_filename)

    if os.path.exists(pants_path):
        pants_index += 1
        if pants_index > pants_count:  # If index exceeds the file count, reset it
            pants_index = 1
        return FileResponse(pants_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Pants not found"}

@app.get("/clothings/shirts/prev")
def prev_shirt():
    global shirt_index
    print("prev--"+str(shirt_index))
    shirts_dir = os.path.join(ROOT_CLOTHES, "shirts")
    shirt_count = get_file_count(shirts_dir)

    # Decrement index first and wrap around if it goes below 1

    shirt_filename = f"{shirt_index}.jfif"
    shirt_path = os.path.join(shirts_dir, shirt_filename)

    shirt_index -= 1
    if shirt_index < 1:
        shirt_index = shirt_count

    if os.path.exists(shirt_path):
        return FileResponse(shirt_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Shirt not found"}

@app.get("/clothings/pants/prev")
def prev_pants():
    global pants_index
    pants_dir = os.path.join(ROOT_CLOTHES, "pants")
    pants_count = get_file_count(pants_dir)

    # Decrement index first and wrap around if it goes below 1

    pants_filename = f"{pants_index}.jpg"
    pants_path = os.path.join(pants_dir, pants_filename)

    pants_index -= 1
    if pants_index < 1:
        pants_index = pants_count

    if os.path.exists(pants_path):
        return FileResponse(pants_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Pants not found"}

@app.get("/clothings/backgrounds/next")
def next_background():
    global background_index
    print("next--" + str(background_index))
    backgrounds_dir = ROOT_BACKGROUNDS
    background_count = get_file_count(backgrounds_dir)

    # Serve the current file and then increment the index
    background_filename = f"{background_index}.jpg"  # Adjust extension as needed
    background_path = os.path.join(backgrounds_dir, background_filename)

    background_index += 1
    if background_index > background_count:  # If index exceeds the file count, reset it
        background_index = 1

    if os.path.exists(background_path):
        return FileResponse(background_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Background not found"}

@app.get("/clothings/backgrounds/prev")
def prev_background():
    global background_index
    print("prev--" + str(background_index))
    backgrounds_dir = ROOT_BACKGROUNDS
    background_count = get_file_count(backgrounds_dir)

    # Decrement index first and wrap around if it goes below 1
    background_index -= 1
    if background_index < 1:
        background_index = background_count

    background_filename = f"{background_index}.jpg"  # Adjust extension as needed
    background_path = os.path.join(backgrounds_dir, background_filename)

    if os.path.exists(background_path):
        return FileResponse(background_path, headers=headers)  # Return the file as a response with cache control
    else:
        return {"error": "Background not found"}

@app.get("/capture-face")
def picture():
    # Open the default camera
    cam = cv2.VideoCapture(0)

    # Check if the camera opened successfully
    if not cam.isOpened():
        return {"error": "Failed to access the camera"}

    # Capture a single frame
    ret, frame = cam.read()
    cam.release()  # Release the camera immediately after capturing

    if not ret:
        return {"error": "Failed to capture an image"}

    # Load the pre-trained Haar Cascade classifier for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Convert the captured frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) > 0:
        # Crop the first detected face
        x, y, w, h = faces[0]
        frame = frame[y:y + h, x:x + w]  # Crop the face

    # Encode the image as a JPEG in memory
    _, buffer = cv2.imencode('.jpg', frame)
    img_bytes = io.BytesIO(buffer)

    # Return the image as a StreamingResponse
    return StreamingResponse(img_bytes, media_type="image/jpeg")

class User(BaseModel):
    username: str
    password: str


@app.post("/signup")
def sign_up(user: User):
    name = user.username
    password = user.password
    return account.register(name, password)

@app.get("/login")
def login(username,password):
    print(account.accounts)
    return account.log_in(username, password)

@app.get("/clothings/save/get")
def get_save(username):
    return {"list" : account.accounts_save.get(username)}

@app.get("/clothings/index/shirts")
def get_shirts_by_index(index: int):
    """
    Retrieve a shirt image by its specific index.
    :param index: The index of the shirt to retrieve.
    :return: The shirt image or an error message if not found.
    """
    shirts_dir = os.path.join(ROOT_CLOTHES, "shirts")
    shirt_count = get_file_count(shirts_dir)

    # Validate the index
    if index < 1 or index > shirt_count:
        return {"error": f"Invalid index. Please provide a value between 1 and {shirt_count}."}

    # Construct the file path
    shirt_filename = f"{index}.jfif"
    shirt_path = os.path.join(shirts_dir, shirt_filename)

    # Check if the file exists and serve it
    if os.path.exists(shirt_path):
        global shirt_index
        shirt_index = index + 1  # Update the global index to align with this selection
        if shirt_index > shirt_count:  # Wrap around if necessary
            shirt_index = 1
        return FileResponse(shirt_path, headers=headers)
    else:
        return {"error": "Shirt not found"}

@app.get("/clothings/index/pants")
def get_pants_by_index(index: int):
    """
    Retrieve a pants image by its specific index.
    :param index: The index of the pants to retrieve.
    :return: The pants image or an error message if not found.
    """
    pants_dir = os.path.join(ROOT_CLOTHES, "pants")
    pants_count = get_file_count(pants_dir)

    # Validate the index
    if index < 1 or index > pants_count:
        return {"error": f"Invalid index. Please provide a value between 1 and {pants_count}."}

    # Construct the file path
    pants_filename = f"{index}.jpg"
    pants_path = os.path.join(pants_dir, pants_filename)

    # Check if the file exists and serve it
    if os.path.exists(pants_path):
        global pants_index
        pants_index = index + 1  # Update the global index to align with this selection
        if pants_index > pants_count:  # Wrap around if necessary
            pants_index = 1
        return FileResponse(pants_path, headers=headers)
    else:
        return {"error": "Pants not found"}

@app.get("/clothings/index/backgrounds")
def get_background_by_index(index: int):
    """
    Retrieve a background image by its specific index.
    :param index: The index of the background to retrieve.
    :return: The background image or an error message if not found.
    """
    backgrounds_dir = ROOT_BACKGROUNDS
    background_count = get_file_count(backgrounds_dir)

    # Validate the index
    if index < 1 or index > background_count:
        return {"error": f"Invalid index. Please provide a value between 1 and {background_count}."}

    # Construct the file path
    background_filename = f"{index}.jpg"
    background_path = os.path.join(backgrounds_dir, background_filename)

    # Check if the file exists and serve it
    if os.path.exists(background_path):
        global background_index
        background_index = index + 1  # Update the global index to align with this selection
        if background_index > background_count:  # Wrap around if necessary
            background_index = 1
        return FileResponse(background_path, headers=headers)
    else:
        return {"error": "Background not found"}


class Username(BaseModel):
    username: str

@app.post("/clothings/save/add")
def add_save(username: Username):
    username = username.username
    try:
        fav_list = [background_index,shirt_index,pants_index]
        account.accounts_save[username] = fav_list
        return {"success":"the banana did transfer"}
    except Exception as e:
        return {"error":f"{e}"}
def get_random(path, category):
    """
    Returns a random file from the given path and updates the corresponding global index.
    :param path: Directory path for the files
    :param category: Category of the item (e.g., 'shirts', 'pants', 'backgrounds')
    """
    random_file = get_random_file(path)
    if random_file:
        # Update the global index based on the random file name
        file_name, _ = os.path.splitext(random_file)  # Extract file name without extension
        try:
            index = int(file_name)  # Assume the file name is a number
        except ValueError:
            return {"error": "Invalid file naming convention"}

        if category == "shirts":
            global shirt_index
            shirt_index = index
        elif category == "pants":
            global pants_index
            pants_index = index
        elif category == "backgrounds":
            global background_index
            background_index = index

        # Return the random file as a response
        file_path = os.path.join(path, random_file)
        return FileResponse(file_path, headers=headers)
    else:
        return {"error": f"No files found in {category}"}

@app.get("/clothings/random/shirts")
def get_random_shirts():
    shirts_dir = os.path.join(ROOT_CLOTHES, "shirts")
    return get_random(shirts_dir, "shirts")

@app.get("/clothings/random/pants")
def get_random_pants():
    pants_dir = os.path.join(ROOT_CLOTHES, "pants")
    return get_random(pants_dir, "pants")

@app.get("/clothings/random/backgrounds")
def random_background():
    backgrounds_dir = ROOT_BACKGROUNDS
    return get_random(backgrounds_dir, "backgrounds")

