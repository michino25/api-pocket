# API Pocket

**API Pocket** is a powerful tool that allows users to create APIs quickly without the complexity of setting up a backend or database. With just a few clicks, you can create tables, manage schemas, and generate APIs right from the UI.

The platform supports **RESTful operations**:  
`GET` | `POST` | `PUT` | `PATCH` | `DELETE`

API Pocket is live and available at: https://apipocket.vercel.app/ – Try it now!

## Features

- **Quick API Creation** – Define tables and generate APIs instantly.
- **OAuth Login** – Secure authentication with OAuth.
- **Schema & Data Management** – Easily modify tables, fields, and records.
- **API Documentation** – Auto-generated API docs for your endpoints.
- **Access Control** – Enable or disable APIs as needed.
- **User Settings** – Change username and personal preferences.

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/michino25/api-pocket
cd api-pocket
yarn install
```

Then, start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

## API Setup Guide

1. **Login via OAuth**
   - Sign in using your preferred OAuth provider.
2. **Create a Table**

   - Define your data structure (columns, types, etc.).

3. **Generate API Endpoints**

   - Automatically get `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` routes.

4. **Manage Data**

   - Insert, update, and delete records with an intuitive UI.

5. **Access API Docs**
   - View and test APIs directly from the documentation.

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Here are the common commit types:

- **feat** – New feature
- **fix** – Bug fix
- **docs** – Documentation updates
- **style** – Code style changes (formatting, missing semicolons, etc.)
- **refactor** – Code improvements without changing behavior
- **test** – Adding or updating tests
- **chore** – Maintenance tasks (build scripts, dependencies, etc.)
- **ci** – Continuous integration updates
- **perf** – Performance improvements
- **revert** – Revert a previous commit

Example commit message:

```bash
git commit -m "feat: add API toggle functionality"
```

## Upcoming Features

- **Dark Mode** – Toggle between light and dark themes.
- **Multi-language Support** – Switch between different languages.
- **Enhanced API Docs** – Improved documentation experience.
- **API Toggle** – Enable or disable specific APIs when needed.
- **User Settings** – Change username and preferences.
- **Data Filters** – Advanced filtering for querying data.
