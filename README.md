npm i react-icons axios moment emoji-picker-react react-router-dom recharts react-hot-toast

cd backend
npm init -y

npm i express jsonwebtoken mongoose dotenv cors bcryptjs multer xlsx
 npm i nodemon --save-dev

 in .env file for generate JWT_SECRET 
 node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"