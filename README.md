
# Daylight — To-Do & Notes App 🌿

Daylight is a responsive productivity application built with React that helps users manage daily tasks and organize notes through a clean, calming interface.

## Features

### ✅ To-Do App
- Add new tasks.
- Edit and delete existing tasks.
- Mark tasks as completed or pending.
- Filter tasks by All, Pending, and Completed.
- Display task creation dates.
- Save tasks using browser Local Storage.

### 📝 Notes App
- Create, edit, and delete notes.
- Add a title and content to each note.
- Organize notes into Personal, Study, Work, and Ideas categories.
- Search notes by title or content.
- Filter notes by category.
- Display creation and modification timestamps.
- Save notes using browser Local Storage.

## Technologies Used

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite
- Browser Local Storage

## React Concepts Demonstrated

- Functional components and JSX
- `useState` for state management
- `useEffect` for side effects
- Event handling
- Conditional rendering
- List rendering with `.map()`
- Array filtering with `.filter()`
- Object updates using the spread operator
- Component-based application structure

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/akshithpokala07-dotcom/Daylight
   ```

2. Enter the project directory:

   ```bash
   cd minor-project-04
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## Data Storage

The application uses browser Local Storage to retain tasks and notes across page refreshes in the same browser.

No backend database is required.

## Project Structure

```text
minor-project-04/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Future Improvements

- Task due dates and reminders.
- Dark mode.
- Additional task sorting options.
- Rich-text note editing.

## Author

Developed as part of the Web Development Week 04 Minor Project.

## License

Created for educational purposes.
