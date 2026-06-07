# DiasporaBridge (MbokoGO)

DiasporaBridge is a full-stack platform that connects travelers and senders within the African diaspora.

Travelers can publish upcoming trips and available luggage space, while senders can find suitable transport opportunities to send packages to family and friends abroad.

The platform aims to make international package transportation more accessible, affordable, and community-driven.

---

## Project Status

🚧 Active Development

DiasporaBridge is currently under active development and already includes:

* User authentication and authorization
* Travel listing management
* Real-time messaging
* Multi-language support
* Progressive Web App (PWA)
* Automated testing
* Dockerized backend infrastructure

---

## Features

### Authentication & Security

* User registration
* Email verification
* Secure login using JWT
* Password reset
* Role-based authorization
* Protected routes

### Listings

* Create travel listings
* Edit and delete listings
* View available trips
* Search by destination city
* Search by travel dates
* Advanced filters (7, 15 and 30 days)
* Personal listing management

### Messaging

* Real-time messaging
* Private conversations
* Communication between travelers and senders
* Conversation overview

### User Profiles

* Profile management
* Account information updates
* Personal dashboard

### Internationalization

* French
* English
* Runtime language switching

### Progressive Web App

* Installable application
* Mobile-first design
* Responsive user interface
* App-like experience

---

## Technology Stack

### Frontend

* Angular 20
* Angular Material
* TypeScript
* RxJS
* PWA

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* Maven

### Database

* MySQL 8

### Infrastructure & DevOps

* Docker
* Docker Compose
* phpMyAdmin
* Render
* Vercel

### Testing

* Jasmine
* Karma
* Playwright

### Version Control

* Git
* GitHub

---

## Architecture

```text
Angular Frontend
        │
        ▼
Spring Boot REST API
        │
        ▼
MySQL Database
```

The application follows a client-server architecture and uses JWT tokens for secure authentication and authorization.

---

## Testing Strategy

### Unit Tests

Implemented using Jasmine and Karma.

Covered services:

* AuthService
* ListingService

Run unit tests:

```bash
ng test
```

---

### Component Tests

Implemented for key business components:

* Login
* AddListing
* SearchBarComputer

---

### End-to-End Tests

Implemented using Playwright.

Covered scenarios:

* Login page rendering
* User credential input
* Successful authentication workflow

Run E2E tests:

```bash
npx playwright test
```

Run E2E tests with browser UI:

```bash
npx playwright test --headed
```

---

## Running the Project with Docker

### Prerequisites

* Docker
* Docker Compose

### Start the application

```bash
docker compose up --build
```

Services started:

| Service               | Port |
| --------------------- | ---- |
| Backend (Spring Boot) | 8080 |
| MySQL                 | 3306 |
| phpMyAdmin            | 8082 |

### Stop the application

```bash
docker compose down
```

---

## Local Development

### Frontend

```bash
cd frontend
npm install
ng serve
```

Application:

```text
http://localhost:4200
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

API:

```text
http://localhost:8080
```

---

## Roadmap

Planned improvements:

* WhatsApp-first contact flow
* Push notifications
* Traveler verification system
* Rating and review system
* AI-assisted matching between travelers and senders
* Native mobile applications (iOS / Android)

---

## Author

**Arnauld Mba Kuitche**

Fullstack Developer

Technologies:

Angular • Spring Boot • Java • MySQL • Docker • Playwright • GitHub
