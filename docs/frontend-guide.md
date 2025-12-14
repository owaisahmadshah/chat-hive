# Frontend Guide

The frontend is built with **React**, **TypeScript**, and **Vite**.

## Folder Structure (`frontend/src`)

- **`assets/`**: Static assets like images and icons.
- **`components/`**: Reusable UI components (buttons, inputs, etc.).
- **`features/`**: Feature-specific components (e.g., Chat window, Sidebar).
- **`hooks/`**: Custom React hooks.
- **`lib/`**: Utility libraries and configurations (e.g., axios setup).
- **`routes/`**: Application routing configuration.
- **`services/`**: API service calls.
- **`store/`**: State management (Redux/Zustand/Context).
- **`types/`**: TypeScript type definitions.

## Key Technologies

- **Styling**: We use **Tailwind CSS** for utility-first styling and **Shadcn UI** for pre-built accessible components.
- **State Management**: (Check `store/` for implementation details - likely Redux Toolkit or Zustand).
- **Routing**: React Router DOM.
- **Forms**: React Hook Form + Zod for validation.

## Development Tips

- **Components**: Keep components small and focused. Use the `components/` folder for generic UI elements and `features/` for domain-specific logic.
- **API Calls**: All API calls should be defined in `services/` to keep components clean.
- **Types**: Always define interfaces/types for props and API responses in `types/`.
