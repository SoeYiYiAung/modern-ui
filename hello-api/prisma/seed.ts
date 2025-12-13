import { prisma } from "../libs/prisma";

async function seed() {
    await prisma.toDo.deleteMany();
    
    const data = await prisma.toDo.createMany({
        data: [
            { name: "Egg", done: false },
            { name: "Bread", done: true },
            { name: "Butter", done: false },
        ]
    });

    console.log(data);
}

seed();