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

In case your database is running on docker, add this flag while running the container.

        $ flag --default-authentication-plugin=mysql_native_password

If the installation was successful, you should be able to run the following command.

    $ mysql --version
    Ver 8.0.27

## Install

    $ git clone https://github.com/luciamalar/to-do-list.git
    $ cd to-do-list
    $ npm install

## Configure app

Open `/ormconfig.json` then edit it with your database settings. You will need:

- Port to connect to your database;
- Username and password to connect to your database/ username must already exist in the db;
- Database name/ database have to already exist;

Open `/config/config.ts` then edit it with your settings:

- Change DBURI to `mysql://localhost:DATABASE_PORT/DATABASE_NAME`

## Running database migration

Run `one` of the following commands

    $ ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run

    $ typeorm migration:run

## Running the project

    $ npm start

## Simple build for production

    $ npm build

## Run swagger documentation on adress

    http://localhost:5000/api-docs/