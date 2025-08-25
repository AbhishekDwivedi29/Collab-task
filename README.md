# Collab-task

---

## 📌 Project Overview

*Collab-task* is a real-time collaborative task management system inspired by Kanban workflows. It enables users to create boards, manage tasks across columns, and receive live updates through socket-driven notifications.

### 🔧 Tech Stack
- *Backend*: Node.js, Express, Socket.IO
- *Frontend*: React, Zustand, TailwindCSS
- *Auth*: JWT-based authentication
- *Deployment*: Render (backend), Vercel (frontend)
- *State & Notifications*: Zustand + LocalStorage
- *Real-time Layer*: Socket.IO with board-level room isolation

### ✨ Key Features
- 🔐 Secure user authentication and board access control
- 🧩 Modular microservices for boards, columns, and tasks
- 📡 Real-time socket events for task and column creation
- 🔔 Notification system with local persistence and dropdown UI
- 🧠 Clean architecture with recruiter-ready documentation and observability hooks


---

## 🧱 Microservice Overview

The system is architected as two independently deployable microservices: the *User Service* and the *Board Service*. Each service owns its domain logic, communicates via authenticated APIs, and contributes to a scalable backend that supports real-time collaboration and secure user management.

---

### 👤 User Service

The User Service acts as the authentication and identity backbone of the system. It handles secure user registration and login using JWT tokens, enabling stateless access across both HTTP routes and WebSocket connections. Once authenticated, users can retrieve their profile data, which includes personal details and the boards they’re associated with. Internally, the service also manages board linkage—whenever a user creates or is invited to a board, this service updates their record to reflect that association. It operates independently from board logic, ensuring clean separation of concerns and making it easy to scale or refactor without affecting task or collaboration features. The service also includes internal authorization middleware that validates trusted service-to-service communication, allowing backend modules to interact securely without exposing sensitive endpoints to the public. Overall, the User Service is designed to be lightweight, secure, and extensible, forming the foundation for personalized, authenticated experiences across the app.

---

### 🗂 Board Service

The Board Service powers the collaborative core of the application. It manages the lifecycle of boards, columns, and tasks—allowing users to create boards, invite collaborators, organize tasks into columns, and track progress in real time. Each board acts as a container for columns, which in turn hold tasks that can be assigned, moved, and commented on. All operations are protected by JWT-based middleware to ensure that only authorized users can interact with board data. The service also integrates a real-time socket layer using Socket.IO, enabling users to join board-specific rooms and receive live updates when tasks or columns are created. Socket connections are authenticated during handshake, and scoped events are emitted to relevant board rooms, ensuring efficient and secure collaboration. Designed with modular controllers and domain-driven boundaries, the Board Service is scalable, maintainable, and ready for production-grade extensions like activity logs, mentions, or task updates.

---

## 📡 Real-Time Communication & Notification System

The system uses *Socket.IO* to enable real-time collaboration across boards. When a user logs in, their JWT token is passed during the socket handshake to authenticate the connection. Once verified, the user is joined to rooms corresponding to the boards they belong to. This room-based isolation ensures that events like task creation or column updates are scoped only to relevant users, preventing cross-board noise and optimizing bandwidth.

The socket layer is tightly integrated with the Board Service. Events such as taskcreated, columncreated, and connectionCount are emitted from the server whenever relevant actions occur. These events are picked up by the frontend’s GlobalSocketListener, which dynamically joins board rooms and listens for incoming updates.

To surface these events to users, the system includes a lightweight *notification layer* built with Zustand. Notifications are stored in localStorage for session persistence and displayed via a dropdown UI triggered by a bell icon. New alerts are highlighted with a red badge, and users can mark them as seen by interacting with the dropdown. The system currently supports task and column creation events, but is designed to be easily extended to include comments, mentions, or activity logs.

This architecture ensures that users receive instant feedback without polling, and that the real-time layer remains secure, scoped, and performant. It’s a clean separation of concerns: sockets handle delivery, Zustand manages state, and the UI renders it all with minimal overhead.

Absolutely, Abhishek. Based on your full codebase—from route definitions to socket handling and notification logic—here’s a comprehensive breakdown of the *system architecture* and *flow of operations*. This is written to reflect production-grade clarity, suitable for documentation, onboarding, or showcasing to recruiters.

---

## 🔄 Flow of Operation

#### 1. *User Registration & Login*
- A user registers or logs in via the User Service.
- On success, a JWT token is issued and stored client-side.
- This token is used for all subsequent API calls and socket connections.

#### 2. *Board Creation & Membership*
- Authenticated users create boards via the Board Service.
- The board is linked to the user via an internal call to the User Service (add-board).
- Users can invite others to join boards, updating membership records.

#### 3. *Column & Task Management*
- Users create columns within boards to organize tasks.
- Tasks are created inside columns, can be moved across them, and support comments.
- Each task is optionally assigned to a user and scoped to a board.

#### 4. *Socket Connection & Room Joining*
- On frontend mount, the GlobalSocketListener connects to the socket server using the JWT token.
- After authentication, the user joins rooms for each board they belong to (joinBoard).
- This isolates socket traffic per board, ensuring scoped event delivery.

#### 5. *Real-Time Event Emission*
- When a task or column is created, the server emits taskcreated or columncreated to the relevant board room.
- A global connectionCount event broadcasts active socket connections.

#### 6. *Notification System*
- The frontend listens for socket events using GlobalSocketListener.
- Events are transformed into notifications and stored in Zustand state.
- Notifications persist in localStorage and are displayed via a dropdown UI.
- New alerts trigger a red badge on the bell icon; users can mark them as seen.

---

### 🧠 Design Principles

- *Domain Isolation*: Each service owns its logic and data, enabling independent scaling and deployment.
- *Room-Based Socket Architecture*: Scoped real-time updates per board for efficient collaboration.


## 👨‍💻 Author

*Abhishek Dwivedi*  
Backend Architect | Microservices Specialist | Payment Systems Debugger


