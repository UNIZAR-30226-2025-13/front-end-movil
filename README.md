# 🎵 SpongefyMovil 

SpongifyMovil is a mobile application built with **React Native** and **Expo** for streaming audio content.  
This project uses **Expo Router** for navigation and follows a modular structure.

---

## 📌 **Prerequisites**
Ensure you have the following installed on your system:

- **Node.js** (Download: [nodejs.org](https://nodejs.org/))
- **Expo CLI**  
  Install Expo CLI globally:
  ```sh
  npm install -g expoClone the Repository
   ```
Clone the repository and navigate to the project directory:
  ```sh
git clone https://github.com/UNIZAR-30226-2025-13/front-end-movil.git
cd spongify-movil
```
### Install Dependencies
Install all necessary packages with:
```sh
npm install
```
If you encounter issues, try removing existing modules and reinstalling:

```sh
rm -rf node_modules package-lock.json
npm install
```
Start the Project
Run the following command to launch the Expo Developer Tools:
```sh
npx expo start
```
Run the App on a Device/Emulator
For Android: Press a in the Expo terminal (ensure your Android emulator is running).
For iOS: Press i (requires Xcode on macOS).
For a physical device: Scan the QR code with Expo Go (available on the Play Store / App Store).
Project Structure

```bash
/spongify-movil
  ├── /app
  │   ├── index.tsx         # Splash screen (redirects to login)
  │   ├── login.tsx         # Login screen
  │   ├── register.tsx      # Register screen
  │   ├── _layout.tsx       # Root layout for navigation
  ├── /components           # Reusable UI components
  ├── /assets               # Images, icons, and other static files
  ├── /screens              # Main app screens
  ├── package.json
  ├── app.json
  ├── tsconfig.json
  ├── README.md
```

Clear the cache:

```sh
npx expo start --clear
```
Android Emulator Not Detected
Ensure Android Studio and the SDK are installed, then run:

Reinstall dependencies:

```sh
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

## License
This project is licensed under the MIT License.


