# CS3219-AY22-23 PeerPrep31

## Introduction

This is a repository for the CS3219 PeerPrep31 project.

Project report: [https://docs.google.com/document/d/1lMmKNzSaULcGdDKGaeeYchcasFEc6UAYVqZ8sBm4V9w/edit?usp=sharing](https://docs.google.com/document/d/1lMmKNzSaULcGdDKGaeeYchcasFEc6UAYVqZ8sBm4V9w/edit?usp=sharing)

Team members:

- Pham Ba Thang (A0219715B)
- Nguyen Ba Van Nhi (A0219736W)
- Muhammad Radhya Fawza (A0219709W)
- Victor Chen (A0261266E)

## Setting up the application

### User Service

Make sure that you have MongoDB installed and running on your machine

1. Change directory using `cd ./user-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run User Service using `npm run dev`.

### Matching Service

1. Change directory using `cd ./matching-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run Matching Service using `npm run dev`.

### Collaboration Service

Make sure that you have Redis installed and running on your machine

1. Change directory using `cd ./collaboration-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment. You can get `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET` by registering [here](https://www.jdoodle.com/compiler-api/)
3. Install npm packages using `npm i`.
4. Run Collaboration Service using `npm run dev`.

### Communication Service

Make sure that you have Redis installed and running on your machine

1. Change directory using `cd ./communication-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run Communication Service using `npm run dev`.

### Question Service

Make sure that you have MongoDB installed and running on your machine

1. Change directory using `cd ./question-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run Question Service using `npm run dev`.

### History Service

Make sure that you have MongoDB installed and running on your machine

1. Change directory using `cd ./history-service`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run Question Service using `npm run dev`.

### Frontend

1. Change directory using `cd ./frontend`
2. Rename `.env.sample` file to `.env` and change the environment variables based on your own environment.
3. Install npm packages using `npm i`.
4. Run Frontend using `npm start`.
5. Visit the application at `http://localhost:3000`

## Running the application with docker-compose

1. Make sure that you have docker and docker-compose installed on your machine.
2. From the root directory, run `docker-compose up -d` to build and run the application.
3. Visit the application at `http://localhost:3000`
