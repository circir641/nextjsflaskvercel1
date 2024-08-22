if you open the main folder, open terminal and go to ``client`
then type ``npm install next react react-dom`` to reinstall next.js enviroments.
then type ``npm run dev`` to run the client.

open new terminal and go to server folder.
delete the env folder
to reinstall new environment for the server type inside the terminal should be like
``PS C:\Users\user\vercel2-master\server> python -m venv env ``
next type ``env\scripts\activate`` once inside the environment type
``pip install -r requirements.txt``
go to browser and run localhost:3000/login
the user and pass was 
user:``user`` password:``user``

note :when you log in and keeps saying ``invalid user or password`` go to cmd and type
``ipconfig`` enter and once run you should see like this `` IPv4 Address. . . . . . . . . . . : 192.168.42.167``
make a new file named it ``.env.local` it should be inside the client not inside the pages.
``client
    -pages
 .env.local``
copy your IPv4 Address then paste this inside the  `` .env.local``
``NEXT_PUBLIC_API_URL=http://192.168.42.167:5000``
go back to the browser and try to login again it should allow you in mobile and pc.

note : your mobile and pc should be connected into the usb port. use your mobile's internet as your pc's internet so they both shared same IPv4 Address.

go directly crud inside the server. you can go to cmd and paste this.
1.  to get the jwt token
``curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"username\": \"user\", \"password\": \"user\"}"``
2. to create item
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -H "Authorization: Bearer removethiswordpastethetokenhere" -d "{\"name\": \"Item1\", \"description\": \"Description1\", \"price\": 10.0}"
3.get item by id
``curl -H "Authorization: Bearer removethiswordpastethetokenhere " http://localhost:5000/api/items/1``
4.delete id
``curl -X DELETE http://localhost:5000/api/items/1 -H "Authorization: Bearer removethiswordpastethetokenhere"``
5. update by id
``curl -X PUT http://localhost:5000/api/items/1 -H "Content-Type: application/json" -H "Authorization: Bearer removethiswordpastethetokenhere" -d "{\"name\": \"Updated Item1\", \"description\": \"Updated Description1\", \"price\": 20.0}"``
----

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
