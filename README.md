# PackPal – Social Travel Exploration App

PackPal is a full-stack mobile application that blends travel discovery with social interaction. It enables users to explore destinations, share experiences through posts, and engage with a real-time community feed.

---

## Live Demo

Add your demo link here  
Example: https://expo.dev/@your-username/packpal

---

## Preview

<p align="center">
  <img src="assets/home" width="200"/>
  <img src="assets/feeds" width="200"/>
  <img src="assets/profile" width="200"/>
  <img src="assets/details" width="200"/>
</p>

---

## Key Highlights

- Real-time social feed using Firestore listeners
- Full authentication system with persistent sessions
- Cloud-based image upload and delivery via CDN
- Optimized data fetching using client-side caching
- Clean, scalable architecture following production patterns

---

## Features

### Core
- User authentication (Firebase Auth)
- Create and upload posts (camera/gallery)
- Real-time feed updates
- Like, share, and delete functionality
- Profile management with image updates

### UX & Design
- Card-based UI inspired by modern social platforms
- Responsive layout using Flexbox
- Image carousels for destination browsing
- Smooth navigation using stack + tab navigation

---

## Tech Stack

### Frontend
- React Native (Expo)
- JavaScript (ES6+)
- React Navigation

### Backend
- Firebase Authentication
- Firebase Firestore (NoSQL, real-time database)

### Cloud & Media
- Cloudinary (image storage and CDN)
- Expo ImagePicker API

---

## Architecture

User → React Native App → Firebase Auth → Firestore → Cloudinary → UI Update

### Design Approach
- Client-server architecture
- Firestore as single source of truth
- Asynchronous data handling using async/await
- Real-time updates via onSnapshot listeners

---

## Data Model

### Users
- userId  
- name  
- email  
- photo (Cloudinary URL)  

### Posts
- postId  
- userId  
- image  
- caption  
- likes (array of userIds)  
- createdAt  

---

## Screens Breakdown

| Screen | Description |
|--------|------------|
| Home | Displays curated travel destinations |
| Details | Destination info with external links |
| Feed | Real-time social posts |
| Profile | User profile and image updates |
| Create Post | Upload and share content |

---

## Engineering Challenges

### 1. Data Inconsistency
- Problem: AsyncStorage and Firestore mismatch  
- Solution: Removed AsyncStorage and used Firestore only  

### 2. Feed Performance
- Problem: Repeated user fetches  
- Solution: Implemented usersMap caching  

### 3. Image Not Updating
- Problem: Cache issue  
- Solution: Added timestamp query parameter  

### 4. Infinite Loading
- Problem: UI blocked by async calls  
- Solution: Decoupled rendering from data fetching  

### 5. Like System Errors
- Problem: Undefined likes field  
- Solution: Initialized array and used atomic updates  

---

## Testing

- Android Emulator (Pixel 6)
- Manual functional testing
- Firebase logs for debugging
- Console-based runtime tracing

### Tested Scenarios
- Authentication flow  
- Post creation (camera and gallery)  
- Like and unlike functionality  
- Real-time feed updates  
- Navigation across all screens  

---

## Installation

```bash
git clone https://github.com/your-username/packpal.git
cd packpal
npm install
npx expo start
