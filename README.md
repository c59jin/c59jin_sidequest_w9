## Project Title

GBDA302 Week 9 Example 3: Debug System Implementation

---

## Authors

Catarina Jin - c59jin - 21077832

---

## Description

This project is a modified version of Week 9 - Example 3 built using p5.js. The goal of this assignment was to implement a debug system that supports testing and development of game mechanics.

The player controls a character that can move, jump, and attack within a platform-based environment. In addition to the original gameplay, a debug screen was added to allow real-time control and visualization of internal game systems.

Core features include:

- Character movement (left, right, jump)
- Attack animation system
- Gravity-based physics
- Sound effects and background music
- Debug system with real-time toggles

The debug system allows:

- Switching between normal gravity and moon gravity
- Visualizing player and sensor hitboxes
- Resetting player position instantly
- Displaying real-time player state information (velocity, grounded state, attack state)

The player experience focuses on:

- Understanding how physics affects gameplay
- Observing internal game mechanics through debug tools
- Testing different gameplay conditions efficiently

---

## Setup and Interaction Instructions

How to Run:

Open the project folder in Visual Studio Code.

Use Live Server or open index.html in a browser.

The game will load automatically.

Controls:

A / D or Left / Right Arrow → Move  
W or Up Arrow → Jump  
Space Bar → Attack

Debug Controls:

1 → Toggle Moon Gravity  
2 → Toggle Hitbox Visualization  
R → Reset Player Position  
TAB → Show / Hide Debug Panel

Objective:

Move the player character across the platform.

Use jumping and movement to navigate.

Use debug tools to test physics and gameplay behavior.

---

## Iteration Notes

a. Post-Playtest: Changes Made

Based on testing and development needs, the following changes were implemented:

Added Moon Gravity Toggle  
A gravity switch was added to simulate low-gravity physics. This helps test how movement and jumping behave under different conditions.

Implemented Hitbox Visualization  
A debug feature was added to display player and sensor hitboxes. This improves understanding of collision detection and grounding behavior.

Added Player Reset Function  
A reset key was implemented to quickly reposition the player without restarting the game.

Created Debug Panel UI  
A visual debug panel was added to display real-time information such as velocity, grounded state, and attack state.

---

b. Post-Showcase: Planned Improvements

Add More Debug Features  
Additional toggles such as speed adjustment or slow motion could be added to further support testing.

Improve UI Design  
The debug panel could be redesigned to be more visually organized and user-friendly.

Add Toggleable Sound Controls  
Options to mute or adjust sound during testing would improve usability.

---

## Assets

The base code was provided as part of the Week 9 Example 3 template.

Modifications and debug features were implemented by me.

GenAI was used to assist with writing comments and structuring additional features.

---

## References

Friedman, B., Hendry, D. 2019. Value Sensitive Design: Shaping Technology with Moral Imagination. MIT Press.

---
