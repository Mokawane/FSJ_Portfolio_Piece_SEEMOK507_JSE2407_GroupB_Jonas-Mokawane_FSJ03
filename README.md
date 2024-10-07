
# Next.js E-commerce Application

This project is a simple e-commerce platform built using **Next.js**, **React**, and **Tailwind CSS**. It provides functionality for viewing products, navigating through product pages, and viewing detailed information for each product.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Build for Production](#build-for-production)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Products Page](#products-page)
  - [Product Detail Page](#product-detail-page)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- **Next.js**: A React framework with server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for building responsive, mobile-first designs.
- **Node.js**: JavaScript runtime for building server-side applications.

## Features

- Product listing with pagination.
- View detailed information for each product.
- Interactive image carousel for product images.
- Responsive design using Tailwind CSS.

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mokawane/SEEMOK507_JSE2407_GroupB_Jonas-Mokawane_FSJ01SEEMOK507_JSE2407_GroupB_Jonas-Mokawane_FSJ01.git
   cd my-next-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Run the following command to start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Build for Production

To build the project for production, run:

```bash
npm run build
# or
yarn build
```

You can start the production server using:

```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── app/
│   ├── fonts/
│   ├── product/[id]/
│   │   └── page.jsx
│   └── products/
│       └── page.jsx
├── components/
│   └── Header.jsx
├── globals.css
├── layout.js
├── page.js
public/
├── favicon.ico
.eslintrc.json
tailwind.config.js
next.config.mjs
package.json
```

### Description

- **app/products/page.jsx**: Displays the list of products.
- **app/product/[id]/page.jsx**: Displays detailed information for a specific product.
- **components/Header.jsx**: Contains the header component.
- **globals.css**: Global CSS styles.
- **layout.js**: Defines the layout for all pages.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **next.config.mjs**: Next.js configuration file.

## Usage

### Products Page

On the products page, you will see a paginated list of products fetched from the API. Users can navigate through different pages and view more products.

### Product Detail Page

By clicking on a product, the user is taken to the product detail page, where detailed information such as images, description, category, and reviews are displayed. Users can also browse through different product images using the image carousel.

## Contributing

If you want to contribute to this project, feel free to open a pull request. Please ensure your code follows best practices and is well-documented.

