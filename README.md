# Hackin2 API

Repository for the Hackin2 API, built using Express.js with Typescript. The API serves as the backend service for the Hackin2 web application, which is a platform that connects cybersecurity freelancers and companies in look for one. It is designed to work in conjunction with a React + Vite frontend client to provide a seamless user experience.

### Table of Contents

- Introduction
- Features
- Getting Started
  - Prerequisites
  - Installation
  - Configuration
- API Documentation
- License

## Introduction

Hackin2 is platform that helps companies and cybersecurity freelancers connect. This repository contains the backend API, which provides the necessary endpoints for the Hackin2 web application to interact with the database, handle user authentication, and manage security-related tasks.

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

- Node.js (version >= 16)
- npm

### Installation

Clone this repository to your local machine:

```bash
git clone https://github.com/Hackin2-company/hackin2-api.git
cd hackin2-api
```

Install the dependencies:

```bash
npm install
```

### Configuration

Before running the API, you need to set up the configuration. Copy the .env.example file and rename it to .env, then fill in the appropriate values for the environment variables:

DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key_for_jwt
Replace your_database_connection_string with the connection string for the Postgresql database and your_secret_key with a secure secret key for token generation during user authentication with Json Web Tokens.

### API Documentation

For detailed API documentation and examples on how to use the endpoints, please refer to the ~~[API Documentation](https://www.notion.so/How-To-Set-Up-the-API-ef235e313e24423db97ccc39fc8218fd)~~ _(deprecated)_ file in Notion.

### License

TBD
