# Hackin2 API

Repository for the Hackin2 API, built using Express.js with Typescript. The API serves as the backend service for the Hackin2 web application, which is a platform that connects cybersecurity freelancers and companies in look for one. It is designed to work in conjunction with a React + Vite frontend client to provide a seamless user experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [License](#license)

## Introduction

Hackin2 is a platform that helps companies and cybersecurity freelancers connect. This repository contains the backend API, which provides the necessary endpoints for the Hackin2 web application to interact with the database, handle user authentication, and manage security-related tasks.

## Features

- User authentication and authorization.
- Asset management and tracking.
- Incident reporting and management.
- Security event logging and monitoring.
- User activity and access control.
- Customizable configuration options.

## Getting Started

### Prerequisites

To run the API locally, you need the following prerequisites:

- git
- Node.js (version >= 16)
- npm
- Postgresql

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

3. Use database migration

Before running the script, a database needs to be created separetly

```bash
npm prisma db pull
```

4. Generate private/public keys

```bash
openssl genrsa -out {the_name_of_your_private_key.pem} 2048
```

```bash
openssl rsa -pubout -in {the_name_of_your_private_key.pem} -out {the_name_of_your_public_key.pem}
```

### Configuration

Before running the API, you need to set up the configuration.
Copy the .env.example file and rename it to .env, then fill in the appropriate values for the environment variables:

```
PORT=8000
DATABASE_URL=your_database_connection_string
ISSUER=https://hackin2.com
PUBKEY=public_key.pem
PRIVKEY=private_key.pem
```
