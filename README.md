# SkillForge 🔥

> A gamified course-selling platform with AI-powered peer matching, built with nodeJs and ReactJs.

---

## Prerequisites — Install These First

Before touching any code, make sure you have these installed:

| Tool | Version | Download |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ (comes with Node) | — |
| MongoDB Community | v6+ | https://www.mongodb.com/try/download/community |
| Git | Any | https://git-scm.com |

To verify installations, run in your terminal:
```bash
node -v       # Should print v18.x.x or higher
npm -v        # Should print 9.x.x or higher
mongod --version   # Should print v6.x.x or higher
```

---

## 🚀 How to Run it Locally 

### Step 1 — Start MongoDB

Open a terminal and run:
```bash
mongod
```
Leave this terminal open. MongoDB runs on `mongodb://localhost:27017` by default.

> On macOS with Homebrew you can also run: `brew services start mongodb-community`
> On Windows, MongoDB may already run as a service automatically.

---

### Step 2 — Set Up the Backend

Open a **new terminal** and navigate into the backend folder:

```bash
cd skillforge/backend
```

Install dependencies:
```bash
npm install
```

Create your `.env` file by copying the example:
```bash
# On Mac/Linux:
cp .env.example .env

# On Windows (Command Prompt):
copy .env.example .env
```

Now open `.env` in any text editor and set your values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=make_this_a_long_random_string_like_this_abc123xyz789
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Stream Chat — get free keys at https://getstream.io 
STREAM_API_KEY=your_key_here
STREAM_API_SECRET=your_secret_here
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
 MongoDB connected: localhost
 Server running on http://localhost:5000
```

---

### Step 3 — Set Up the Frontend

Open a **third terminal** and navigate into the frontend folder:

```bash
cd skillforge/frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend dev server:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4 — Open the App

Go to **http://localhost:5173** in your browser.

You now have:
- ⚛️  React frontend on `localhost:5173`
- 🟢 Express backend on `localhost:5000`
- 🍃 MongoDB running locally

---


