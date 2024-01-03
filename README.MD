# Back End Final Project C9 (GoStudy)

## MOOC (Massive Online Open Course)

### Installations

Install dependencies for this project

```shell
npm install
```

### Set .env

```shell
NODE_ENV=

DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DB_HOST=
PORT=

JWT_SECRET=
JWT_RESET_SECRET=

FRONTEND_URL=
BACKEND_URL=

NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=

GOOGLE_API_KEY=
GOOGLE_BASE_URL=
```

### Database

#### Create Database

```shell
sequelize db:create
```

#### Migrate Database

```shell
sequelize db:migrate
```

#### Seed Database

```shell
sequelize db:seed:all
```

### Server

```shell
npm run dev
localhost:3000/
```

### OpenAPI

```shell
localhost:3000/api-docs
```

First you should login with superadmin account

```shell
{
    "email": "admin2@gmail.com",
    "password": "admin1234"
}
```

After that you can access all API.
