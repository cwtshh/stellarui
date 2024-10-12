# Como rodar o projeto

Adicione um aquivo .env com as seguintes variáveis:

```
VITE_BASE_API_URL=

API_PORT=

MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_INITDB_DATABASE=stellar
CONNECTION_STRING=mongodb://MONGO_INITDB_ROOT_USERNAME:MONGO_INITDB_ROOT_PASSWORD@stellar_db:27017/

SECRET_KEY=

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Após isso, inicie o docker e digite o seguinte comando:

```
$ docker compose up -d
```

Todos os containers irão subir automáticamente e estarão disponíveis em:

* front: http://localhost:5173/login
* backend: http://localhost:3001/  (Será substituida a porta do env)
* mongodb: mongodb://MONGO_INITDB_ROOT_USERNAME:MONGO_INITDB_ROOT_PASSWORD@stellar_db:27017/ (substituia as variaveis do env aqui)

Para acesso direto ao banco de dados, entre no terminal do respectivo container e digite:

```
$ mongosh admin -u MONGO_INITDB_ROOT_USERNAME -p MONGO_INITDB_ROOT_PASSWORD
```

Seja feliz!



