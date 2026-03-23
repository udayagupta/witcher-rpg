# ⚔️ Witcher Text RPG

A turn-based text RPG inspired by *The Witcher* universe — built with **React**.
Battle monsters, cast signs, apply oils, and manage buffs & debuffs through an immersive text-based combat interface.

---

## 🧙‍♂️ Features

* **Turn-based combat system** – switch between player and monster turns.
* **Buffs & Debuffs** – effects with duration, stacking rules, and automatic expiration.
* **Witcher Signs** – cast *Igni*, *Quen*, and *Aard*, consuming stamina.
* **Battle logs** – detailed combat narration for every action.
* **Context-driven player state** – persistent data via React Context.

---

## 🧩 Tech Stack

| Layer    | Tools                                                    |
| -------- | -------------------------------------------------------- |
| Frontend | React + Vite                                             |
| State    | React Context API                                        |
| Styling  | Tailwind CSS                                             |
| Data     | Static JSON files                                        |
| Logic    | Modular JS utility functions                             |

---

## 🕹️ Gameplay Overview

### Player Actions

* **Silver Attack** – deals weapon-based damage, enhanced by applied oils.
* **Signs** – magical abilities consuming stamina:

  * **Igni**: Fire damage over time
  * **Quen**: Heals the player
  * **Aard**: Damages the monster

### Turn System

1. Player performs an action (attack, sign, or item).
2. Monster counterattacks.
3. Buff/debuff durations tick down.
4. Repeat until one side’s vitality reaches zero.
5. Or Flee the battle

---

## ⚙️ Setup & Run

```bash
# Clone the repo
git clone https://github.com/udayagupta/witcher-rpg.git
cd witcher-rpg

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open browser at:
👉 `http://localhost:5173`

---

## 🧠 Future Improvements

* Add inventory and alchemy system.
* Add player leveling and experience gain.
* Introduce persistent save/load functionality.
* Refine UI animations and background music.

---

## 🐺 Credits

* Inspired by **The Witcher** series by CD Projekt Red.
* Sound effects from [Voicy](https://www.voicy.network/search/witcher-3-sound-effects).  
* Icons from [React Icons](https://react-icons.github.io/react-icons/).
* Framer Motion for animations: [Framer Motion](https://www.framer.com/motion/).

---

## 📜 License

This project is for educational and non-commercial purposes only.
All Witcher-related names and lore belong to their respective owners.
