# WeeCare Observatory - WiFi DensePose

## Overview
The WeeCare Observatory is a web-based 3D visualization dashboard designed to simulate and display real-time human tracking, vital sign monitoring, and event detection using WiFi sensing technology. It uses "WiFi DensePose" concepts to track micro-variations in WiFi signals.

## How it works
The application is entirely client-side and is built using **Three.js** for 3D rendering.
It operates in a continuous loop:
1. **Scenario Generator (`demo-data.js`)**: Generates simulated WiFi sensing data (RSSI, variance, motion band power) and translates it into specific scenarios like "Multi-Person Tracking" or "Intruder Detect". It defines the position, rotation, and pose of the people in the room.
2. **Pose System (`pose-system.js` & `figure-pool.js`)**: Takes the abstract state (e.g., "walking", "crouching") and applies inverse kinematics and procedural animation to 3D skeletons to make them move realistically.
3. **HUD Controller (`hud-controller.js`)**: Manages the 2D HTML/CSS overlay, updating the vital signs (Heart Rate, Respiration Rate), presence status, and handling the settings menu.
4. **Main Scene Orchestrator (`main.js`)**: Ties everything together, initializing the camera, lights, post-processing effects (bloom, vignette, film grain), and rendering the final output to the canvas 60 times a second.

## How it was made
1. **Core Technologies**: The project is written in vanilla HTML, CSS, and JavaScript. It does not require a build step or a framework like React.
2. **Graphics Engine**: It leverages `Three.js` (loaded via CDN) to render the 3D room, glowing wireframe models, and procedural geometry (like the WiFi subcarrier manifolds).
3. **Customizations**: Originally based on the open-source `hi` (RuView) repository, it has been customized for "WeeCare". The branding has been updated across all files, default scenarios have been modified, and character animations (such as fixing the backwards intruder model) have been patched.

## How to run
1. Open a terminal or command prompt in the `ui` folder.
2. Run a local HTTP server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000/observatory.html`.
