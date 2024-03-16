# Hackin2 API

Repository for the Hackin2 API, built using Express.js with Typescript. The API serves as the backend service for the Hackin2 web application, which is a platform that connects cybersecurity freelancers and companies in look for one. It is designed to work in conjunction with a React + Vite frontend client to provide a seamless user experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Run the API](#run-the-api)
- [API Documentation](#api-documentation)
- [License](#license)

## Introduction

Hackin2 is a platform that helps companies and cybersecurity freelancers connect.
This repository contains the backend API, which provides the necessary endpoints for the Hackin2 web application to interact with the database, handle user authentication, and manage security-related tasks.

## Features

- User authentication and authorization.
- Role base access control.
- Programs management and tracking.
- Findings reporting and management.
- Security event logging and monitoring.
- User activity and access control.
- Customizable configuration options.

## Getting Started

### Prerequisites

To run the API locally, you need the following prerequisites:

- git
- Node.js (version >= 18)
- npm
- Docker

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Hackin2-company/hackin2-api.git
   cd hackin2-api
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

### Configuration

1. Generate private/public keys

   - MacOS/Linux
     ```bash
     .generate_keys.sh
     ```
   - Windows
     ```powershell
     generate_keys.ps1
     ```

2. Create .env file

   Before running the API, you need to set up the configuration.
   Copy the .env.example file and rename it to .env, then fill in the appropriate values for the environment variables:

   ```
   PORT=8000
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_DB=hackin2db
   DATABASE_PORT=5432
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hackin2db

   ORIGIN='http://localhost:5173'
   ISSUER='https://hackin2.com'

   PUBKEY=public_key.pem
   PRIVKEY=private_key.pem
   ```

### Run the API

```bash
npm run dev
```
