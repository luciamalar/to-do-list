# ToDoList

A simple Express ToDoList API

## Requirements

1. Node.js
2. MySQL
3. TypeORM

### Node
- #### Node installation on Windows

    Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.16.0

    $ npm --version
    8.1.4

### MySQL
- #### MySQL installation on Windows

    Just go on [official MySQL website](https://dev.mysql.com/) and download the installer.

- #### MySQL installation on Ubuntu

  You can install mysql easily with apt install, just run the following commands.

      $ sudo apt install mysql-server
  
  This will install MySQL, but will not prompt you to set a password or make any other configuration changes. Because this leaves your installation of MySQL insecure, run the following and set a password.

      $ sudo mysql_secure_installation

If the installation was successful, you should be able to run the following command.

    $ mysql --version
    Ver 8.0.27

### TypeORM
- #### TypeORM installation on Windows

      $ npm install typeorm

- #### Node installation on Ubuntu

      $ sudo npm install typeorm

If the installation was successful, you should be able to run the following command.

    $ typeorm --version
    0.2.41

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd ToDoList
    $ npm install

## Configure app

Open `/ormconfig.json` then edit it with your settings. You will need:

- Port to connect to your database;
- Username and password to connect to your database;
- Database name;

Open `/config/config.ts` then edit it with your settings:

- Change DBURI to `mysql://localhost:DATABASE_PORT/DATABASE_NAME`

## Running the project

    $ npm start

## Simple build for production

    $ npm build