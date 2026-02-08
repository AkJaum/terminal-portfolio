# Terminal Portfolio

An interactive web-based terminal portfolio built with **Next.js** and **React**, designed to simulate a Unix-like shell experience inside the browser.

This project showcases my programming background through a command-line interface, allowing users to explore projects, read files, and navigate a virtual filesystem — just like in a real terminal.

> This is an evolving project. New features and improvements will be added over time.

---

## ✨ Features

### 🖥️ Terminal Interface
- Fully interactive terminal UI
- Keyboard-driven input (no buttons)
- Command history navigation using `↑` and `↓`
- Styled with **Tailwind CSS** for an authentic terminal look

### 📁 Virtual File System
- In-memory filesystem implemented in JavaScript
- Folder and file navigation using real shell semantics
- Supports nested directories and text files

### 🧠 Supported Commands

| Command | Description |
|--------|-------------|
| `ls` | Lists files and directories in the current path |
| `cd <dir>` | Navigates between directories |
| `cd ..` | Goes up one directory |
| `cd /` or `cd ~` | Returns to home directory |
| `cat <file>` | Displays file contents |
| `clean` | Clears the terminal output |
| `tab` | Autocompletes commands and file names (when available) |

### ⚠️ Error Handling
- Graceful handling of invalid commands
- Clear warning messages instead of application crashes
- Input is safely reset on errors

### 🚀 Tech Stack

- **Next.js** (App Router)
- **React**
- **JavaScript** (no TypeScript)
- **Tailwind CSS**

### 🧪 Local Setup

Clone the repository:

```bash
git clone https://github.com/your-username/terminal-portfolio.git
cd terminal-portfolio

npm install
npm run dev
```

Then open:

http://localhost:3000

### 🛠️ Planned Improvements

Execute real C projects via WebAssembly

More shell commands (mkdir, touch, rm)

Command suggestions & help system

Improved autocomplete behavior

Visual feedback for command execution

Mobile support

### 👨‍💻 Author

João Gabriel - Full Stack Developer

This project was built to combine low-level programming mindset with modern web technologies, focusing on clarity, usability, and technical depth.