# Accessible Tic-Tac-Toe Game

## Overview
This project is a real-time, accessible Tic-Tac-Toe game designed to be used by visually impaired players. It uses screen reader support and adheres to web accessibility standards.

## Assumptions
This project is built based off the assumption that
1. Users are visually impaired out of all the sensory impairments 
2. Users are equipped with the knowledge of how to use a computer keyboard
3. Users understand the rules of tic tac toe
4. Users will play with headphones/headsets on

## Table of Contents
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)


## Tech Stack
- **Frontend:** React, Socket.IO client
- **Backend:** Node.js, Express, SQLite, Socket.IO, DBbrowser (for viewing data)


## Setup Instructions

### Prerequisites
- Ensure that Node.js and npm are installed.
- Install [DB Browser for SQLite](https://sqlitebrowser.org/) (this is optional, for database viewing).

### Backend Setup
1. Navigate to the **backend** directory:
   ```bash
   cd backend
2. Run the backend
   ```bash
   node index.js 

### Frontend Setup
1. Navigate to the **frontend** directory:
   ```bash
   cd frontend

2. Run the frontend
   ```bash
   npm start

### Database fields
1. id
2. session_id
3. board
4. player_turn
5. status
6. winner
7. moves


#### API endpoints 
1. Create a game
    ```bash 
    POST localhost:3000/api/game 
2. Retrieve a game data
    ```bash 
    GET localhost:3000/api/game/sessionId
    
    sample:
    localhost:3000/api/game/Game_1730172060703

