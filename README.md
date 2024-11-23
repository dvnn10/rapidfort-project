
## Overview
This web application processes Word documents (.docx) and converts them to PDF, with additional support for password protection, file metadata viewing, and PDF preview/download functionalities.

This project adheres to the provided rubric with containerized deployment using Docker and GitHub Actions for CI/CD, making it ready for cloud deployment and scalability.

---

## Features

### Core Functionality:
- Upload Word documents (.doc or .docx).
- View file metadata (name, size).
- Convert Word documents to secure PDFs.
- Preview the converted PDF directly on the web page.
- Download the PDF manually after conversion.
- Password-protect the converted PDFs (optional).

### UI Enhancements:
- Intuitive user interface with Light/Dark mode toggle.
- Drag-and-drop area for easy file uploads.
- Modern responsive design.

---

## Hosting:

### Frontend:
Hosted on Vercel:  
[RapidFort Frontend](https://rapidfort-frontend-new.vercel.app/)

### Backend:
Hosted on Render:  
[RapidFort Backend](https://word-to-pdf-backend-gs0i.onrender.com)

---

## Containerization:
- Backend and frontend are Dockerized and pushed to Docker Hub for seamless deployment.
  - **Backend Docker Image:** `devin864/word-to-pdf-backend`
  - **Frontend Docker Image:** `devin864/word-to-pdf-frontend`

---

## Kubernetes:
- Kubernetes manifests included for orchestrating deployments.

---

## Technologies Used

### Frontend:
- **React:** UI development.
- **CSS:** Styling the user interface.
- **Vercel:** Hosting the frontend application.

### Backend:
- **Node.js:** Backend server with API endpoints.
- **Express:** Handling HTTP requests and file uploads.
- **Multer:** File upload management.
- **LibreOffice:** Conversion of Word files to PDF.
- **Hummus-Recipe:** Adding password protection to PDFs.
- **Render:** Hosting the backend service.

### CI/CD:
- **GitHub Actions:** Automated Docker builds and deployments.

### Containerization:
- **Docker:** For building and deploying containerized images.
- **Kubernetes:** For orchestrating containerized applications.

---

## Hosted Endpoints:

### Frontend:
Hosted on Vercel:  
[RapidFort Frontend](https://rapidfort-frontend-new.vercel.app/)

### Backend:
Hosted on Render:  
[RapidFort Backend](https://word-to-pdf-backend-gs0i.onrender.com)

---

## Docker Hub Images:
- **Backend:** `devin864/word-to-pdf-backend`
- **Frontend:** `devin864/word-to-pdf-frontend`

---

## Deployment Instructions:

### Local Development:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/rapidfort-project.git
   cd rapidfort-project
   ```

2. Start the backend:
   ```bash
   cd backend
   npm install
   node server.js
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

### Docker Deployment:
1. Build Docker Images:
   - **Backend**:
     ```bash
     docker build -t devin864/word-to-pdf-backend ./backend
     ```
   - **Frontend**:
     ```bash
     docker build -t devin864/word-to-pdf-frontend ./frontend
     ```

2. Run Docker Containers:
   - **Backend**:
     ```bash
     docker run -p 5000:5000 devin864/word-to-pdf-backend
     ```
   - **Frontend**:
     ```bash
     docker run -p 3000:3000 devin864/word-to-pdf-frontend
     ```

---

### Kubernetes Deployment:
1. Apply the manifest files:
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   kubectl apply -f kubernetes/service.yaml
   ```

2. Access the application using the Kubernetes service.

---

### GitHub Actions:
The repository includes a GitHub Actions pipeline to:
- Build the Docker images for the backend and frontend.
- Push the images to Docker Hub.

---

## Bash Script:
Create a script `run.sh` to automate Docker setup:
```bash
#!/bin/bash

echo "Building backend Docker image..."
docker build -t devin864/word-to-pdf-backend ./backend

echo "Building frontend Docker image..."
docker build -t devin864/word-to-pdf-frontend ./frontend

echo "Running backend container..."
docker run -d -p 5000:5000 devin864/word-to-pdf-backend

echo "Running frontend container..."
docker run -d -p 3000:3000 devin864/word-to-pdf-frontend

echo "Application is running:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
```

---

## Rubric Alignment:

### Repo and Hosting:
- Project stored on GitHub and hosted on Render (backend) and Vercel (frontend).

### Documentation:
- Detailed project structure, steps, and usage instructions provided.

### Exception Handling:
- Backend handles invalid file formats, conversion errors, and server-side exceptions.
- Frontend provides user-friendly error messages for failed operations.

### UI:
- Responsive, modern design with Light/Dark theme support.

### Dockerized Application:
- Backend and frontend are Dockerized with images pushed to Docker Hub.

### GitHub Actions:
- CI/CD pipeline for building and deploying Docker images.

### Kubernetes:
- Manifest files included for deployment.


## Contributors:
- **Devin Kansal**  
  Email: [devinkansal@gmail.com]

For questions or issues, feel free to contact me!
