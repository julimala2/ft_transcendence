## login

curl -i -k -X POST https://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password1!"}' \
  -c cookies.txt

## acces DB
npx prisma studio

## upload image

curl -i -k -X POST https://localhost:3000/api/users/me/avatar \
  -b cookies.txt \
  -F "avatar=@/home/juliette-malaval/Downloads/logo_u.png"


A la suite du login pour avoir le token dans cookies.txt

