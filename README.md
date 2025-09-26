# Cryptoicons Project

## Introduction

This project is a web application designed to provide an extensive and easily accessible library of cryptocurrency icons. Users can browse, search, preview, copy, and download SVG icons for various cryptocurrencies. The application aims to be a valuable resource for developers, designers, and enthusiasts who need high-quality crypto icons for their projects.

## Purpose

The main purpose of this project is to offer a user-friendly platform for discovering and utilizing cryptocurrency icons. It addresses the need for a centralized, searchable repository of SVG assets, simplifying the process of integrating crypto branding into applications, websites, and other digital content.

## Technologies Used

This project is built using a modern web development stack, focusing on performance, scalability, and developer experience.

*   **Next.js**: A React framework for building server-side rendered and static web applications. It provides features like API routes, file-system based routing, and optimized performance.
*   **React**: A JavaScript library for building user interfaces, enabling the creation of dynamic and interactive front-end experiences.
*   **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality, readability, and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs. It enables fast styling with a highly customizable and efficient approach.
*   **Lucide React**: A collection of beautiful and customizable open-source icons for React applications, used for action buttons and UI elements.
*   **Supabase**: (Mentioned in `package.json`, but its specific usage wasn't apparent from the scanned files. Assuming it's for future enhancements or data storage not directly related to icon fetching.) A platform that provides a PostgreSQL database, authentication, instant APIs, and real-time subscriptions, often used as a backend-as-a-service.

## Features

*   **Extensive Icon Library**: Browse a large collection of cryptocurrency icons in SVG format.
*   **Search Functionality**: Easily find icons by name or symbol using a responsive search bar.
*   **Icon Preview**: View a larger version of each icon for detailed inspection.
*   **Copy SVG Code**: Quickly copy the SVG code of any icon to your clipboard for direct use in projects.
*   **Download Icons**: Download individual SVG icon files.
*   **Responsive Design**: A user-friendly interface that adapts to various screen sizes.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:gmonchain/Cryptoicons.git
    cd Cryptoicons
    ```

2.  **Install dependencies:**

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
