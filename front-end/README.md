# ETL Tool with Front-End File Upload and Basic Transformation

## Overview

Our ETL (Extract, Transform, Load) tool is designed to streamline the process of handling CSV data. The project comprises a React-based front-end with React Query for a responsive user interface and a Django-based RESTful API for back-end operations.

### Front-End Interface

- Utilizes React with Material UI for a visually appealing and user-friendly interface.
- Implements drag-and-drop functionality, allowing users to upload CSV files and apply basic transformations effortlessly.
- Transformation blocks, including operations like addition, subtraction, and multiplication, can be dragged onto the data for quick manipulation.
- Transformed data is dynamically displayed in a table.
- Users can save transformations as rules for future use.

### Back-End API

- Django-based RESTful API ensures smooth communication with the front-end.
- Handles file uploads, storing CSV files and transformation rules in a database.
- Supports retrieval of CSV files and rules as needed.
- Utilizes Python 3.x, the latest versions of Django, Django REST Framework, SQL Alchemy, and Pandas for efficient data processing.

## Requirements

Ensure the following steps to run the project:

### Front-End

1. Set up the React project:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

### Back-End

1. Install Django and dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Apply migrations and run the Django server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
