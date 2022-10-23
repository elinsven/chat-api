import { PrismaClient } from "@prisma/client";

//Instantiate PrismaClient
const prisma = new PrismaClient();

//Define an async function called main to send queries to the database. 
//You will write all your queries inside this function. You are calling the findMany() query, 
//which will return all the link records that exist in the database.
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com'
    }
  })
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

//Call the main function.
main()
  .catch((e) => {
    throw e;
  })
  //Close the database connections when the script terminates.
  .finally(async () => {
    await prisma.$disconnect();
  });