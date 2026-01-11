# 🎵 Spin The Artist

Spin The Artist is a music-based interactive web game designed for solo play and group parties. Players spin multiple wheels to randomly receive a music category, an artist, and a challenge—testing their music knowledge, taste, and quick thinking in a fast-paced, social format.

The project is built as a lightweight MVP with a focus on gameplay mechanics, UX clarity, and shareable moments.

---

## ✨ Key Features

- 🎡 **Three-wheel gameplay system**
  - Category Wheel
  - Artist Wheel
  - Challenge Wheel
- ⏱️ **Timed rounds** to maintain pace and pressure
- 🃏 **Joker cards** for limited strategic control
- ⚠️ **Danger rounds** that introduce high-risk challenges
- 🧠 **Taste-based scoring** (not just right/wrong answers)
- 🌙 **Dark, reel-friendly UI**
- 📱 **Mobile-first responsive layout**

---

## 🎮 Gameplay Flow

1. Start the game
2. Spin the **Category Wheel**
3. Spin the **Artist Wheel** (filtered by category)
4. Spin the **Challenge Wheel**
5. Complete the challenge within the time limit
6. Mark the round as **Pass** or **Fail**
7. Score updates and the next round begins

Every fourth round is automatically converted into a **Danger Round**.

---

## 🎼 Music Categories

- Pop  
- Hip-Hop  
- Bollywood  
- Indie  
- Electronic  
- International  

---

## 🧩 Challenge Types

- Favourite song
- Underrated / deep-cut song
- Sing or hum for 10 seconds
- Guess the release year
- Overrated / worst song (Danger Round)

---

## 🧠 Scoring System

- Popular or obvious answer: **+1**
- Underrated / deep-cut answer: **+3**
- Explanation bonus: **+1**
- Hardcore difficulty applies a score multiplier

The system rewards **music taste and depth**, not just recall.

---

## 🛠️ Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Framer Motion**
- **JavaScript**
- Static JSON data (no backend)

---

---

## ▶️ Running the Project Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/manas447/spin-the-artist.git


## 📂 Project Structure
src/
├─ components/ # UI components (wheels, timer, scoreboard)
├─ data/ # Categories, artists, challenges (JSON)
├─ utils/ # Game logic utilities
├─ App.jsx
├─ main.jsx
└─ index.css

