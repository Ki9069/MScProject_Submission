# Project Title
Cantonese Learning Application for Heritage Learners in the UK: A Comparative Study of Learning Design Approaches and User Engagement

## Overview

This project is a mobile-responsive Cantonese learning web application focusing on visually similar Chinese characters (VSCs).

It is designed for Cantonese heritage learners in the UK, particularly children from Hong Kong migrant families.

As part of a comparative study, the application was developed in two versions to examine the effect of a GenAI-powered contextual storytelling approach on learner engagement and VSC discrimination accuracy, compared with an explicit character-study learning approach.

The application includes two versions:

- Group A (baseline): provides direct character-study learning features.
- Group B (experimental): combines the baseline features with GenAI-powered contextual storytelling.

## Project Structure

The source code is divided into two main components:

- `frontend`: The client-side UI built with React and styled with Tailwind CSS. It provides interactive learning activities, such as stroke-order animation and handwriting practice. The baseline and experimental interfaces are differentiated by the configured user-group environment variable, which determines the presence of experimental features.

- `backend`: The server-side application implemented using Python Flask. It contains the application and data logic, connects to external AI services, and communicates with an SQLite database.

The backend is organised into the following layers:

- `route`: Handles HTTP requests and responses, defines endpoints, and parses request payloads.
- `service`: Contains the application logic and interacts with external API services.
- `repository`: Handles database access and SQL queries, separating data-access logic from the application logic.
- `database`: Creates the database connection and initialises the database schema.

## Requirements

To run the application locally, the following are required (these versions were used for development):

- Node.js: v24.18.0
- npm: 11.16.0
- Python: 3.9.6

## Setup

Run the following commands from the project root directory to set up the backend and frontend environments.

### Backend

1. Navigate to the `backend` folder with: `cd backend`

2. Create a virtual environment with: `python3 -m venv venv`

3. Activate the virtual environment with: `source venv/bin/activate`

4. Install the backend dependencies with: `pip install -r requirements.txt`

### Frontend

1. Navigate to the `frontend` folder with: `cd frontend`

2. Install the frontend dependencies with: `npm install`

### Environment Variables

For both Group A and Group B, the following frontend environment variables define the API configuration and user-group interface:

| Variable | Description | Value |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Defines the API base URL | `http://localhost:5001` |
| `VITE_USER_GROUP` | Determines the user-group interface | Group A: `A_baseline`; Group B: `B_advanced` |

The frontend configurations for Group A and Group B are stored in `frontend/.env.a` and `frontend/.env.b`, respectively.

The experimental feature, which is exclusive to Group B, requires API keys to connect to the Anthropic and OpenAI services:

1. Create a `.env` file inside `backend/`.

2. Add your own API credentials to `backend/.env`.

3. Do not commit or share your API credentials.

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Used for narrative text generation |
| `OPENAI_API_KEY` | Used for narrative audio generation |

The `backend/.env` file should follow this format:

`ANTHROPIC_API_KEY=your_anthropic_api_key`

`OPENAI_API_KEY=your_openai_api_key`

Replace the placeholder values with your own API credentials.

## Running the Application

### 1. Initialise the Database

From the `backend` directory, initialise the local SQLite database with:

`python3 -m database.init_db`

This initialises the required database schema and pre-defined learning content.

### 2. Start the Backend

From the `backend` directory, start the Flask server with:

`python3 app.py`

The Flask server will run at `http://localhost:5001`.

### 3. Start the Frontend

Open a new terminal and navigate to the `frontend` directory.

To run Group A: `npm run dev:a`

To run Group B: `npm run dev:b`

Open the URL displayed by Vite in the browser.

## Experimental Groups

| Group | Configuration | Features |
| --- | --- | --- |
| Group A (Baseline) | `A_baseline` | Direct character-study learning features |
| Group B (Experimental) | `B_advanced` | Baseline features plus GenAI-powered contextual storytelling |