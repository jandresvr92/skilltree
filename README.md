# 🌳 SkillTree

![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite)
![Zustand](https://img.shields.io/badge/State-Zustand-brown)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css)

SkillTree is an interactive, graph-based application designed to visualize and track learning paths. Built with a striking neo-brutalist UI, it allows users to import structured skill data, explore dependencies, and track their progress as they unlock new abilities.

## ✨ Features

- **Interactive Graph Visualization:** Navigate complex skill trees using a drag-and-drop, zoomable canvas powered by `@xyflow/react`.
- **Dynamic Progression System:** Nodes automatically transition from `locked` to `available` as prerequisite skills are marked as `completed`.
- **Persistent Progress:** Your learning journey is automatically saved locally using Zustand's persist middleware.
- **JSON Import/Export:** Easily load custom learning paths via JSON files. The app includes a robust validator to ensure data integrity.
- **Neo-brutalist Design:** A bold, highly readable user interface built with Tailwind CSS and Lucide React icons.
- **Modular Architecture:** Engineered for scalability with a clean separation of concerns, isolating pure business logic from UI state and React components.

## 🏗️ Architecture

The codebase follows a Feature-based modular architecture to ensure high maintainability and testability:

- **Domain vs. UI State:** State management is strictly divided. `useTreeStore` handles persistent domain data (nodes, edges, progress), while `useUiStore` manages ephemeral interface states (selected nodes, active views).
- **Pure Functions:** Graph traversal, node unlocking logic, and JSON validation are isolated as pure functions in the `features/` directory, entirely decoupled from React.
- **Separation of Concerns:** Components are highly focused. The `MapBoard` handles graph rendering, while the `SidePanel` reacts to global UI state, eliminating unnecessary prop-drilling and component coupling.

## 📂 Project Structure

```text
skilltree/
├── src/
│   ├── core/                  # Global types and configurations (SkillNodeData, etc.)
│   ├── features/              # Pure business logic (No React dependencies)
│   │   ├── graph/             # Graph traversal and status recomputation
│   │   └── import/            # JSON validation and normalization
│   ├── store/                 # Global state management
│   │   ├── useTreeStore.ts    # Persistent domain state
│   │   └── useUiStore.ts      # Ephemeral UI state
│   ├── components/            # Isolated UI components
│   │   ├── graph/             # MapBoard, SkillNode
│   │   ├── layout/            # SidePanel
│   │   └── shared/            # Modals, generic UI
│   ├── App.tsx                # Main layout and routing
│   └── main.tsx               # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skilltree.git
   ```
2. Navigate to the project directory:
   ```bash
   cd skilltree
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Graph Engine:** [React Flow (@xyflow/react)](https://reactflow.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📝 License

This project is licensed under the MIT License.