# jwt-authentification
## Only backend services



### Usage :
```bash
git clone https://github.com/artkabis/jwt-authentification.git .
npm i
npm start dev
```

### Init environnement variable
create .env file and add ->

```dosini
MONGO_URI = 'mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/YOURDBNAME'
API_PORT = 8000
TOKEN_KEY = '000111222333444'
```

### Ressources :
[MongoDB](https://www.mongodb.com/atlas/database)
[JWT](https://jwt.io/)



### Testing request : 
use [Thunder Client](https://www.thunderclient.io/)

### Exemples request :

POST register : 
![post register request](https://github.com/artkabis/jwt-authentification/blob/main/screen-github/register-request.JPG)

POST login :
![post login request](https://github.com/artkabis/jwt-authentification/blob/main/screen-github/login-request.JPG)


GET hello : 
![get hello request](https://github.com/artkabis/jwt-authentification/blob/main/screen-github/hello-request.JPG)
