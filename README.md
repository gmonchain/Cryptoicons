# Cryptoicons Project

## Introduction

This project is a web application designed to provide an extensive and easily accessible library of cryptocurrency icons. Users can browse, search, preview, copy, and download SVG icons for various cryptocurrencies. This project aims to be a centralized hub for all crypto-related iconography.

## Purpose

The main purpose of this project is to offer a user-friendly platform for discovering and utilizing cryptocurrency icons. It also serves as a demonstration of modern web development practices.
It addresses the need for a centralized, searchable repository of SVG assets, simplifying the process of integrating crypto branding into applications, websites, and other digital content. This project aims to simplify the process for both developers and designers.

## Technologies Used

This project is built using a modern web development stack, focusing on performance, scalability, and developer experience. It leverages the power of several cutting-edge technologies.

*   **Next.js**: A React framework for building server-side rendered and static web applications. It provides features like API routes, file-system based routing, and optimized performance. Next.js is chosen for its powerful features and ease of use.
*   **React**: A JavaScript library for building user interfaces, enabling the creation of dynamic and interactive front-end experiences. React is fundamental for the interactive nature of this application.
*   **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality, readability, and maintainability. It helps catch errors early in the development cycle.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs. It enables fast styling with a highly customizable and efficient approach. Tailwind CSS allows for rapid UI development.
*   **Lucide React**: A collection of beautiful and customizable open-source icons for React applications, used for action buttons and UI elements. These icons enhance the user interface significantly.
  
## Features

This application comes packed with a variety of features to enhance the user experience.
*   **Extensive Icon Library**: Browse a large collection of cryptocurrency icons in SVG format. This ensures a wide range of options for users.
*   **Search Functionality**: Easily find icons by name or symbol using a responsive search bar. This greatly improves icon discovery.
*   **Icon Preview**: View a larger version of each icon for detailed inspection. This allows users to see the details before downloading.
*   **Copy SVG Code**: Quickly copy the SVG code of any icon to your clipboard for direct use in projects. This streamlines the integration process.
*   **Download Icons**: Download individual SVG icon files. This offers flexibility for offline use or custom modifications.
*   **Responsive Design**: A user-friendly interface that adapts to various screen sizes. This ensures a consistent experience across devices.

## Getting Started

To run this project locally, follow these steps. These steps will guide you through setting up the development environment.
1.  **Clone the repository:** Make sure you have Git installed on your system.

    ```bash
    git clone git@github.com:gmonchain/Cryptoicons.git
    cd Cryptoicons
    ```

2.  **Install dependencies:** Ensure you have Node.js and npm (or yarn/pnpm) installed.

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

*   `components/`: Reusable React components (e.g., `IconCard`, `SearchBar`, `PreviewModal`).
*   `hooks/`: Custom React hooks for logic encapsulation (e.g., `useCryptoIcons`, `useToast`).
*   `pages/`: Next.js pages and API routes (e.g., `index.tsx` for the main page, `api/icons.ts` for serving icon data).
*   `public/icons/`: Directory containing all the SVG cryptocurrency icon files.
*   `styles/`: Global styles and Tailwind CSS configuration.
*   `types/`: TypeScript type definitions.
