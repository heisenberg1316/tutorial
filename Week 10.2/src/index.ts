import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertUser(email: string, password: string, firstName: string, lastName: string){
    const res = await prisma.user.create({
        data : {
            email,
            password,
            firstName,
            lastName
        }
    })
    console.log("res is ", res);
} 

interface UpdateParams {
    firstName : string,
    lastName : string,
}

async function updateUser(email: string, updateDetails : UpdateParams){
    const res = await prisma.user.update({
        where : {email : email},
        data : {
            firstName : updateDetails.firstName,
            lastName : updateDetails.lastName,
        }
    })
}


// insertUser("mukulaftermigration@gmail.com", "mukul3333", "Mukul", "Singh");
updateUser("mukulaftermigration@gmail.com", {firstName : "John", lastName : "Cena"});