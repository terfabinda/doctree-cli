![Logo](doctree.png)

# 🌲 doctree – Project Structure Generator (CLI)

From the makers of the DocTree VS Code Extension.

Generate clean, readable directory trees for your `README.md` — **from the terminal**, **in any project**, **with zero setup**.

Perfect for open-source projects, investor pitches, team onboarding, and clean documentation.

Just run:

```bash
npx doctree
```

And instantly add a beautiful project structure to your `README.md`.

---

## 🌟 Features

- ✅ **No installation** – runs with `npx`
- 📄 **Auto-creates `README.md`** if missing
- 🔤 **Prompts for custom ignores** (e.g. `cache`, `logs`, `*.tmp`)
- 🌳 **Smart tree generation** with proper indentation
- 📉 **Auto-abbreviates** large projects (shows `...` after 20 lines)
- 💾 **Saves full structure** to `fs-full.md`
- 🌍 **Works everywhere** – VS Code, Vim, Sublime, Android Studio, or plain terminal

---

## 🚀 Usage

In your project root, run:

```bash
npx doctree
```

You’ll be prompted:

```
Any additional folders or files to ignore (comma-separated, e.g. cache, secret.json)? (Press Enter to skip):
```

Type your custom ignores (or press Enter to skip), and:

- ✅ Tree is inserted into `README.md`
- ✅ Or a new `README.md` is created
- ✅ Full structure saved to `fs-full.md` if large

---

## 🧩 Example Output

```text
lib/
├── main.dart
├── screens/
│   ├── home_screen.dart
│   ├── login_screen.dart
│   └── ...
├── services/
│   ├── auth_service.dart
│   └── ...
└── ...
[View full structure →](fs-full.md)
```

Clean, professional, and ready to share.

---

## 🔄 Powered by the VS Code Extension

This CLI shares the same engine as the **[DocTree VS Code Extension](https://marketplace.visualstudio.com/items?itemName=terfabinda.doctree)** — now available **outside the editor**.

👉 Use the extension for in-editor speed  
👉 Use the CLI for universal access

---

## 🛠️ Requirements

- Node.js (v14 or higher)
- Any project folder with a file system
- No admin rights needed

---

## 🐛 Known Issues

- May fail if the project has permission restrictions (e.g., system folders)
- Very deeply nested folders may cause slight delays (rare)
- On some Windows systems, long paths may not resolve correctly (Windows path limit)

> We’re actively working to improve performance and compatibility.

---

## 📦 Publish & Contribute

This package is open-source and published on npm:

👉 [https://www.npmjs.com/package/doctree](https://www.npmjs.com/package/doctree)

Want to help improve it?  
We welcome contributions!

### How to Contribute

1. Fork the repo: [https://github.com/terfabinda/doctree-cli](https://github.com/terfabinda/doctree-cli)
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

---

## 🐛 Issues & Feedback

Having trouble? Want to suggest a feature?

- 💬 **For CLI help**: Visit the [GitHub Community - Software Development board](https://github.com/community/discussions?discussions_q=repo%3Anpm%2Fcli)
- 📣 **Give feedback**: Open a discussion in the [npm feedback forum](https://www.npmjs.com/support)
- 🔍 **Troubleshoot builds**: Use [Gradle Help](https://help.gradle.org) for deep debugging with Build Scan™

---

## 📄 License

MIT License – see [LICENSE](LICENSE)

---

## 🎉 Thank You!

Thanks for using **doctree** — the simple, smart way to document your project structure.

Let’s make every `README.md` beautiful. 💫

---
