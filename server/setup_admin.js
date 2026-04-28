const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function setupAdmin() {
    const email = 'siddhantgupta@gmail.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN', password: hashedPassword, isGlobalAdmin: true }
        });
        console.log('User updated to ADMIN:', email);
    } else {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Siddhant Gupta',
                role: 'ADMIN',
                isGlobalAdmin: true
            }
        });
        console.log('User created as ADMIN:', email);
    }
    
    process.exit(0);
}

setupAdmin().catch(e => { console.error(e); process.exit(1); });
