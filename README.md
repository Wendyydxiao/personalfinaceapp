# Personal Finance Tracker

The Personal Finance Tracker is an interactive MERN (MongoDB, Express.js, React, Node.js) single-page application designed to help users manage and track their financial transactions. Users can create an account, log in, and securely manage their income and expenses. This project showcases a comprehensive full-stack development approach, highlighting authentication, data management, and a modern, responsive user interface.

## :ledger: Index

- [About](#beginner-about)
  - [File Structure](#file_folder-file-structure)
  - [Features](#sparkles-features)
  - [Build](#hammer-build)
  - [Deployment](#rocket-deployment)
- [Key Learning Points](#notebook-key-learning-points)
- [Resources](#page_facing_up-resources)
- [Gallery](#camera-gallery)
- [Credit/Acknowledgment](#star2-creditacknowledgment)
- [License](#lock-license)

## :beginner: About

The Personal Finance Tracker app is built to simplify personal financial management by allowing users to log their transactions, categorize expenses, and view financial summaries. The app provides an intuitive and responsive user experience with a strong focus on data security and user authentication.

### :file_folder: File Structure

```plaintext
PERSONAL-FINANCE-APP/
│
├── client/                     # React front-end for the application
│   ├── src/
│   │   ├── pages/              # Pages (Dashboard, Login, Profile, etc.)
│   │   ├── utils/              # Utility functions (auth, queries, mutations)
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Entry point for React
│   ├── public/                 # Public files
│   └── package.json            # Front-end dependencies and scripts
│
├── server/                     # Backend files
│   ├── config/                 # Configuration files (DB connection)
│   ├── models/                 # Mongoose models for MongoDB (User, Transaction, Category)
│   ├── resolvers/              # GraphQL resolvers
│   ├── schemas/                # GraphQL typeDefs and schema index
│   ├── seeds/                  # Seed data for initializing the database
│   ├── utils/                  # Authentication and helper utilities
│   └── server.js               # Main server file
│
├── .gitignore                  # Files to ignore in version control
├── LICENSE                     # License file for the project
├── package.json                # Root dependencies and scripts
└── README.md                   # Project documentation (this file)
```

### :sparkles: Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Transaction Management**: Users can add, edit, delete, and view transactions.
- **Categorization**: Transactions can be categorized to provide insight into spending habits.
- **GraphQL API**: Efficient data querying and mutation using Apollo Server.
- **Responsive UI**: User-friendly design for desktop and mobile devices.
- **Data Security**: Protection of sensitive user data through environment variables and secure authentication processes.

### :hammer: Build

- **Frameworks and Libraries**: MERN stack (MongoDB, Express.js, React, Node.js).
- **Database**: MongoDB with Mongoose ODM.
- **API**: GraphQL with Apollo Server for query and mutation management.
- **Authentication**: JWT and bcrypt for secure user login.
- **Styling**: Custom CSS for a polished and professional appearance.

## :rocket: Deployment

The app is deployed on Render for live use: [Visit the Personal Finance Tracker](PUT LINK HERE)

###  :fire: Contribution

 - Your contributions are always welcome and greatly appreciated. Here are some ways you can contribute to the project:

 1. **Report a bug** <br>
 If you think you have encountered a bug, and I should know about it, feel free to report it here [here](https://github.com/Wendyydxiao/personalfinaceapp/issues). I will look into it and take the necessary steps.
 
 2. **Request a feature** <br>
 If you have a feature idea that you think would enhance the project, you can request it [here](https://github.com/Wendyydxiao/personalfinaceapp/issues), If the feature is deemed viable, it will be considered for development. 

 3. **Create a pull request** <br>
 The best way to contribute is by creating a pull request. The community will appreciate your efforts. You can start by picking up any open issues from [here](https://github.com/Wendyydxiao/personalfinaceapp/issues) and submitting a pull request.

## :notebook: Key Learning Points

- Implementing a full-stack MERN application.
- Managing Git branching workflow and collaborative development.
- Designing a responsive, user-friendly interface with React.
- Using GraphQL for flexible data management.
- Deploying a full-stack app to Render.

## :page_facing_up: Resources

### Tools Used
- **VS Code**: Integrated development environment.
- **Git Bash**: Command-line interface for version control.
- **MongoDB Atlas**: Cloud database service.
- **Render**: Hosting service for the app.

### Libraries and APIs
- **Express.js**: Backend server framework.
- **Apollo Server**: GraphQL server implementation.
- **Mongoose**: MongoDB object modeling tool.
- **bcrypt**: Library for password hashing.

## :camera: Gallery

Screenshots and previews are available here: [Gallery Link](GALLERY LINK HERE)

## :star2: Credit/Acknowledgment

Developed by:
- [Adam Todorovic](https://github.com/ProjectAdam95)
- [Wendy Xiao](https://github.com/Wendyydxiao)
- [Benjamin Rice](https://github.com/BenJR546)

## :lock: License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
