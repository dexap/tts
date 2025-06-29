# Freedom Stack v2 - Astro Web App

A modern web application built with the Freedom Stack v2, combining the best of modern web development tools for rapid development and excellent performance.

## 🚀 Tech Stack

- **[Astro](https://astro.build/)** - Ultra-fast static site generator with component islands architecture
- **[Alpine.js](https://alpinejs.dev/)** - Lightweight reactive framework for client-side interactivity
- **[TailwindCSS v4](https://tailwindcss.com/)** - Next-generation utility-first CSS framework
- **[Bknd](https://bknd.dev/)** - Backend-as-a-service for rapid development _(setup required)_

## ✨ Features

- ⚡ **Ultra-fast** - Astro's static generation with minimal JavaScript
- 🎨 **Modern Styling** - TailwindCSS v4 with utility-first approach
- 📱 **Responsive Design** - Mobile-first responsive components
- 🔄 **Interactive Components** - Alpine.js for lightweight reactivity
- 🛠️ **TypeScript Support** - Full TypeScript integration
- 🚀 **Component Islands** - Partial hydration for optimal performance

## 🏗️ Project Structure

```text
/
├── public/           # Static assets
├── src/
│   ├── pages/        # File-based routing
│   │   └── index.astro
│   └── styles/       # Global styles
│       └── global.css
├── .github/
│   └── copilot-instructions.md
├── astro.config.mjs  # Astro configuration
├── tailwind.config.js # TailwindCSS configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd sesame-web
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:4321`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run astro    # Run Astro CLI commands
```

## 🎯 Development Guidelines

### Astro Best Practices

- Use component islands for interactive elements
- Leverage static generation for optimal performance
- Import only what you need to minimize bundle size

### Alpine.js Usage

- Keep data functions simple and readable
- Use Alpine.js for lightweight interactivity
- Avoid complex state management (consider upgrading to React/Vue for complex apps)

### TailwindCSS v4

- Use utility-first approach for styling
- Leverage responsive design utilities
- Customize theme in `tailwind.config.js` as needed

### File Organization

- Pages go in `src/pages/` (file-based routing)
- Components go in `src/components/`
- Styles go in `src/styles/`
- Static assets go in `public/`

## 🔧 Configuration

### TailwindCSS

Configuration is in `tailwind.config.js`. Current plugins included:

- `@tailwindcss/typography` - Enhanced typography
- `@tailwindcss/forms` - Better form styling
- `@tailwindcss/container-queries` - Container query support

### Astro

Configuration is in `astro.config.mjs` with TailwindCSS v4 integration via Vite plugin.

## 📦 Dependencies

### Core Dependencies

- `astro` - Static site generator
- `alpinejs` - Reactive framework
- `@tailwindcss/vite` - TailwindCSS v4 Vite integration
- `tailwindcss` - CSS framework

### Development Dependencies

- `@tailwindcss/typography` - Typography plugin
- `@tailwindcss/forms` - Forms plugin
- `@tailwindcss/container-queries` - Container queries plugin

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting

- **Vercel** - Zero-config deployment with git integration
- **Netlify** - JAMstack hosting with continuous deployment
- **GitHub Pages** - Free hosting for public repositories
- **Cloudflare Pages** - Fast global CDN with generous free tier

## �️ Next Steps

1. **Set up Bknd** - Follow [Bknd documentation](https://bknd.dev) for backend services
2. **Add Components** - Create reusable Astro components in `src/components/`
3. **Customize Styling** - Modify `tailwind.config.js` for your brand
4. **Add Pages** - Create new pages in `src/pages/` for your application
5. **Deploy** - Choose your preferred hosting platform and deploy

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Alpine.js Documentation](https://alpinejs.dev/start-here)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Freedom Stack v2 Repository](https://github.com/cameronapak/freedom-stack-v2)

## 🤝 Contributing

This project follows the Freedom Stack v2 principles. Feel free to contribute improvements and share your experiences with the stack!

---

**Happy coding with Freedom Stack v2! 🚀**
│ └── pages/
│ └── index.astro
└── package.json

```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
```
