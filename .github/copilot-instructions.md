<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Freedom Stack v2 Project Instructions

This is a modern web application built with the Freedom Stack v2, which includes:

## Tech Stack

- **Astro** - Ultra-fast static site generator with component islands architecture
- **Alpine.js** - Lightweight reactive framework for client-side interactivity
- **TailwindCSS v4** - Next-generation utility-first CSS framework
- **Bknd** - Backend-as-a-service for rapid development (setup required)
- [Basecoat UI](https://basecoatui.com) - Pre-built UI components for rapid development

## Project Structure

- Use Astro's file-based routing in `src/pages/`
- Global styles are in `src/styles/global.css` with TailwindCSS imports
- Alpine.js is loaded via CDN and provides reactive functionality
- TailwindCSS v4 is integrated via Vite plugin

## Development Guidelines

- Follow Astro best practices for component islands and partial hydration
- Use Alpine.js for simple client-side reactivity and state management
- Leverage TailwindCSS utility classes for styling
- Keep components lightweight and focused
- Use TypeScript where beneficial

## Code Style

- Use modern ES6+ syntax
- Prefer composition over inheritance
- Keep Alpine.js data functions simple and readable
- Use semantic HTML elements
- Follow accessibility best practices

## Performance Considerations

- Minimize client-side JavaScript
- Leverage Astro's static generation capabilities
- Use Alpine.js only where reactivity is needed
- Optimize images and assets
- Consider using Astro's built-in optimizations
