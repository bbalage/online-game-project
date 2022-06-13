# Online game

This repository contains a hand-in project for the university course Software development methodologies.

## Launch the servers

Prequisite:
- Angular CLI installation (our version: 13.2.6)
- node (our version: v12.22.12)
- npm (our version: 6.14.16)

First open a terminal, clone the repository, then cd into the directiory.

```
git clone https://github.com/bbalage/online-game-project.git
cd online-game-project
```

To launch the backend, issue the following commands:

```
cd backend
npm i
npm run start
# or use npm run start-dev
```

Open another terminal, and issue the following commands from the directory of the repository:

```
cd frontend
npm i
ng serve
```

You can play the game through the *http://localhost:4200* url.

You can use the admin interface through the *http://localhost:4200/admin* url.

## Game description

In order to play, first Register, then log in.

The game is a simple tank game. Once you logged in, you may push the **Play!** button on the info bar. This should generate a new tank for you if you do not already have one.

### Controls:
- **Movement:** WASD keys.
- **Shoot cannon:** Space key.

### Metadata
The game logs the score of the players. If you damage another tank with the cannon, then the damage you dealt will be logged. Currently the data is only available through the admin site.

### Death
The game displays your HP. If it reaches zero, you die. You can keep playing by pressing the **Play!** button again.

## Chat

You can switch between game and chat by click on the game map and the textbox respectively. Be careful not to get shot while chatting!

## Admin

On the admin site you can:
- List and add users.
- See high scores.
- Send chat messages.

You can log in to the admin site using the following credentials:

*username*: admin<br/>
*password*: admin
