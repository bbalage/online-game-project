# Notes

## Required
- Websocket
- REST (mondjuk a meccs állásáról)
- Chat
- Server-db connection
- Admin felület

**repo:**
- backend
- frontend

**Pluszok:**
- voice

### Game ideas
- shooting
- tower defense

## Menüpontok
1. Login / regisztráció
2. Game felület: (1) Chat (2) Státusz (3) Canvas

### Feladatok
- **login** - REST API + Registration + Password
- **admin** - REST API
- **chat** - WebSocket
- **game** - WebSocket

**Marci:**
- login
- registration
- admin

**Dávid:**
- db help
- voice chat

**Balázs:**
- Keret
- WebSocket alap kommunikáció

```
User = {
    id: number
    username: string
    password: hash
}

UserHistory = {
    id: number
    idref: number
    score: number
    date: date
}
```

Játék adatainak tárolása: Session storage-ba.

```
Message = {
    header = {
        type: integer
        userId: integer
        timestamp: datetime
    }
    data = {
        ...
    }
}
```

**Kérdőjeles dolgok:**
- Tesztelés