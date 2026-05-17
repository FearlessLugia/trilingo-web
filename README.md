# Trilingo Web

A modern, desktop-optimized trilingual dictionary for English, French, and Spanish. I use it myself to learn Spanish.

**Trilingo Web** is the desktop evolution of the original [Trilingo Mobile](https://github.com/FearlessLugia/trilingo) app.

Fully vibe-coded by Gemini.

## Motivation

Learning new words in multiple languages often feels fragmented. Dictionary apps typically separate English, French, and Spanish into different interfaces, and switching between them is slow and unintuitive. For students or multilingual learners who frequently compare meanings across languages, this friction accumulates into real cognitive load. 

*Trilingo Web* takes the core mission of the original mobile application and evolves it for the desktop environment. By utilizing a **Miller Columns (Column Stack)** layout, it eliminates the need for "back-and-forth" navigation. Users can explore semantic connections across three languages side-by-side, revealing cross-lingual relationships instantly. The focus is on reducing friction, increasing information density, and providing a professional-grade tool for deep linguistic exploration.

## Objectives

The primary goal of *Trilingo Web* is to create an interactive English-French-Spanish dictionary that helps users explore and compare meanings across languages in a unified, multi-pane view. It enables learners to discover equivalent words and semantic relationships without losing context, powered by a fast, keyboard-driven interface.

## Technical Stack

*Trilingo Web* is built with **Next.js 15+** and **TypeScript**, leveraging the latest web technologies for a "native-feel" desktop experience.

- **Framework**: [Next.js](https://nextjs.org/) (App Router) for high-performance rendering and routing.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for a modern, utility-first design system, paired with [shadcn/ui](https://ui.shadcn.com/) for accessible components.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) manages the dynamic column stack, search history, and saved words.
- **Persistence**: [Redux Persist](https://github.com/rt2zz/redux-persist) ensures that your history and bookmarks are saved to **Web LocalStorage**, providing a serverless and account-free experience.
- **Interactions**: [Framer Motion](https://www.framer.com/motion/) provides subtle transitions for layout stability, while global event listeners enable comprehensive **Keyboard Shortcuts**.
- **Backend**: Connects to a FastAPI service for trilingual alignment.

## Features

### 🏛 Miller Columns (Column Stack)
The app centers around a horizontal column layout inspired by macOS Finder. Clicking a search result or a lemma chip "pushes" a new pane to the right. This maintains a visible breadcrumb of your research path and allows you to compare multiple definitions and languages simultaneously.

### ⌨️ Keyboard-Driven Workflow
Designed for efficiency, *Trilingo Web* can be operated entirely via keyboard:
- **Navigation**: Use `ArrowLeft` and `ArrowRight` to slide through your active column stack.
- **Reset**: Press `Esc` to instantly clear all panes and return to the primary search input.
- **Instant Focus**: Start typing anywhere on the site to automatically jump focus back to the search bar.
- **Search**: Press `Enter` to execute searches based on your language toggle settings.

### 🔍 Enhanced Multilingual Search
The Search pane detects language candidates in real-time. A dedicated **Default Language Toggle** allows you to:
- **Auto**: See all language possibilities for your query.
- **ENG/FRA/SPA**: Lock a specific language to bypass the selection list and jump straight to the dictionary results upon pressing Enter.

### 📚 Recursive Word Exploration
Within every Word and Synset card, lemmas are rendered as interactive chips. Clicking a lemma triggers a new lookup and pushes a new Word pane, enabling infinite lateral movement through the dictionary without ever hitting a "back" button.

### 💾 Search History & Saved Words
- **History**: Automatically records your journey. History entries are color-coded by language for quick visual scanning.
- **Saved List**: Star entries to keep them for later. Your saved list is grouped by date and searchable locally.

## User Guide

### Search Pane
The starting point of every session. Type a word in English, French, or Spanish. The "Possibilities" list will update instantly. Selecting a result pushes a **Word Pane**.

### Word Pane
Displays all synsets (meanings) for a specific word in a specific language. Each card shows the synset ID, definition, and aligned lemmas in all three languages. Clicking a synset card pushes a **Synset Pane**.

### Synset Pane
Focuses on a single, specific meaning. Includes the full definition, aligned lemmas, and **Example Sentences** if available.

### Saved & Me Panes
Accessed via the persistent Sidebar. 
- **Saved**: A filtered view of your bookmarks.
- **Me**: Local maintenance tools to clear history or reset your saved list.

## Development Guide

### Prerequisites
- Node.js 18+
- The Trilingo Backend running locally (typically at `http://localhost:8000`)

### Setup Development Environment

1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Environment Variables:
    Copy the example file and update it if necessary:
    ```bash
    cp .env.example .env.local
    ```

### Run the App Locally

```bash
npm run dev
```
Open the URL shown in your terminal (typically [http://localhost:3000](http://localhost:3000)) to view the application.

## Backend API Reference

*Trilingo Web* expects a backend server that implements the following API contract.

### 1. Language Detection
Determines which supported languages (eng, fra, spa) contain the queried word.

**Endpoint**: `GET /languages?q={query}`

**Example Response**:
```json
{
  "query": "animal",
  "languages": ["eng", "fra", "spa"]
}
```

### 2. Synset Alignment
Retrieves aligned synonym sets (meanings) for a word from a specific pivot language.

**Endpoint**: `POST /align`

**Request Body**:
```json
{
  "query": "bank",
  "pivot": "eng"
}
```

**Example Response**:
```json
{
  "pivot": "eng",
  "headword": "bank",
  "synsets": [
    {
      "id": "bank.n.01",
      "pos": "noun",
      "gloss": { "eng": "sloping land beside a body of water" },
      "lemmas": {
        "eng": ["bank"],
        "fra": ["rive"],
        "spa": ["orilla"]
      },
      "examples": {
        "eng": ["they sat on the bank of the river"]
      }
    }
  ]
}
```

## Deployment

The application is designed to be easily deployed to platforms like **Vercel**.
