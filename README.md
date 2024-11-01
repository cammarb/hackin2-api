# Hackin2 API

Repository for the Hackin2 API, built using `Express.js` with `Typescript`. The API serves as the backend service for the Hackin2 web application, which is a platform that connects cybersecurity freelancers and companies in look for one. It is designed to work in conjunction with a `React + Vite` frontend client, `PostgreSQL` database and `Redis` cache storage, to provide a seamless user experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Project Setup](#project-setup)
    - [Manual](#manual)
    - [Dev Container](#dev-container)
  - [Run the API](#run-the-api)
- [API Documentation](#api-documentation)
- [License](#license)

## Introduction

Hackin2 is a platform that helps companies and physical pentesters connect.
This repository contains the backend API, which provides the necessary endpoints for the Hackin2 web application to interact with the database, cache storage, handle user authentication, authorization and manage security-related tasks.

![diagram](docs/current-infrastructure.drawio.svg)

## Features

- User authentication and authorization with `JWT` and `Sessions`.
- Role base access control: `COMPANY`, `PENTESTER`.
- Programs management and tracking.
- Bounty creating and management.
- Findings reporting and management.
- Security event logging and monitoring (TBD)
- User activity and access control.
- Customizable configuration options.

## Getting Started

### Prerequisites

To run the API locally, you need the following prerequisites:

- git
- Node.js (version >= 20)
- npm

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/cammarb/hackin2-api.git
   cd hackin2-api
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

### Project Setup

You can setup the project manually or by opening the devcontainer enviroment

#### Manual

This section assumes **you know how to work with docker.**

1. Run the dev-starter script

```bash
./dev-starter.sh
```

If you open the file you'll see that this is creating the .env file from the .env.example. 
To make the app run, the contents in the .env file are sufficient, however to be able to send e-mails,
save images to Cloudinary and make payments with Stripe, you'll need your API keys.

If you encounter an error or problem, please create an issue.

#### Dev Container

Dev Containers will allow you to open the project in a docker container, creating the database for you, setting up the necessary extensions in VSCode and generating the `.env` as well as the key pairs for `jwt`.

1. Open the project in VSCode
2. Install the extension `Dev Containers`
3. Open the command palette by pressing **[Ctrl + Shift + P]** (Windows/Linux) or **[Cmd + Shift + P]** (MacOS)
4. Search for: _Dev Containers: Open Folder in Container..._ and select that option
5. VSCode will create the container for you and install all of the requirements and dependencies

### Run the API

```bash
# To create/update the PostgreSQL database
npx prisma db push

# To populate the database with the seed file
npx prisma db seed
npm run dev
```
