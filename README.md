# Task Management Application

## Overview

This project is a task management application that allows users to create, view, update, and delete tasks. It includes features for managing task statuses and provides a responsive design for a seamless user experience across different devices.

## Features

- **User Authentication:** Users can register, log in, and log out.
- **Create Tasks:** Users can create new tasks with a title and description.
- **View Tasks:** Tasks are displayed in columns based on their status (To Do, In Progress, Done).
- **Update Task Status:** Users can change the status of a task.
- **Delete Tasks:** Users can delete tasks.
- **Responsive Design:** The application is optimized for both desktop and mobile views.

## Technologies Used

- **Frontend:**
    - React
    - SCSS
- **Backend:**
    - Node.js
    - Express.js
    - PostgreSQL
- **Authentication:**
    - JWT (JSON Web Tokens)
- **Styling:**
    - SCSS

## Project Structure

The project structure is organized as follows:


## Component Breakdown

### `TaskItem.js`

This component represents an individual task item.

#### Props
- `task`: The task object containing task details.
- `onDelete`: Callback function to handle task deletion.
- `language`: Current language for localization.
- `onChangeStatus`: Callback function to handle status changes.

#### State
- `showAside`: Boolean to toggle the task details aside.
- `asideRef`: Reference to the task details aside for handling outside clicks.

#### Methods
- `handleDelete`: Deletes the task by making an API call.
- `toggleAside`: Toggles the visibility of the task details aside.
- `handleStatusChange`: Updates the task status by making an API call.

### `Tasks.scss`

Contains the styling for the task management components. Key styles include:

- `.tasks-container`: Container for the tasks.
- `.task-columns`: Layout for task columns.
- `.task-item`: Styling for individual task items.
- `.add-task-form`: Styling for the form to add new tasks.
- `.task-details`: Styling for the task details aside.
- `.popup-overlay` and `.popup`: Styling for the modal popups.

## API Endpoints

### Base URL

The base URL for the API is defined in `apiConfig.js`.

### Endpoints

- **POST /auth/register**: Registers a new user.
- **POST /auth/login**: Authenticates a user and returns a token.
- **GET /auth/activate/:token**: Activates a new user's account.
- **GET /auth/check-email/:email**: Checks if an email is already in use.
- **GET /auth/check-username/:username**: Checks if a username is already in use.
- **GET /tasks**: Retrieves all tasks.
- **POST /tasks**: Creates a new task.
- **PUT /tasks/:id**: Updates a task by ID.
- **DELETE /tasks/:id**: Deletes a task by ID.

## Authentication

The application uses JWT for authentication. The token is stored in `localStorage` and included in the headers of API requests.

## How to Run the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/traetor/johnny-systems-backend.git

2. **Install dependencies for the backend:**
   ```sh
   npm install

3. **Set up environment variables:**
   ```sh
   Create a .env file in the backend directory with the following content
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=
   JWT_SECRET=
   EMAIL=
   EMAIL_PASSWORD=
   FRONTEND_URL=

4. **Run the backend server:**
   ```sh
   npm start

5. **Access the application:**
   ```sh
   Open your browser and go to http://localhost:3001.
