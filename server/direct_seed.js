const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const input = `What is acceleration due to gravity on Earth?|9.8,10,8.9,9.2|0|Physics|Kinematics|JEE|2024|true
A body starts from rest. Velocity after time t?|at,2at,at^2,a/t|0|Physics|Kinematics|JEE|2024|false
Unit of force is?|Newton,Joule,Watt,Pascal|0|Physics|Laws of Motion|JEE|2023|true
Work done formula?|Fs,F/s,F+s,F-s|0|Physics|Work Energy|JEE|2024|false
Kinetic energy formula?|1/2 mv^2,mv^2,2mv^2,mv|0|Physics|Work Energy|JEE|2023|true
SI unit of momentum?|kg m/s,N/m,J/s,kg/m|0|Physics|Momentum|JEE|2024|false
Ohm law?|V=IR,I=VR,V=I/R,R=VI|0|Physics|Current Electricity|JEE|2023|true
Power formula?|VI,V/I,I/V,VR|0|Physics|Electricity|JEE|2024|false
Frequency unit?|Hertz,Newton,Joule,Volt|0|Physics|Waves|JEE|2024|false
Angular velocity unit?|rad/s,m/s,m/s^2,rad|0|Physics|Rotational Motion|JEE|2023|true
Number of moles in 1 mole substance?|6.022e23,1,22.4,12|0|Chemistry|Mole Concept|JEE|2024|true
Molar mass of H2O?|18,16,2,20|0|Chemistry|Mole Concept|JEE|2023|true
Oxidation is?|Loss of electrons,Gain of electrons,Gain of proton,Loss of neutron|0|Chemistry|Redox|JEE|2024|false
Reduction is?|Gain of electrons,Loss of electrons,Gain of neutron,Loss of proton|0|Chemistry|Redox|JEE|2024|false
pH of neutral solution?|7,0,14,1|0|Chemistry|Solutions|JEE|2023|true
Strong acid example?|HCl,NaOH,CH4,H2|0|Chemistry|Acids Bases|JEE|2024|false
Avogadro number?|6.022e23,3.011e23,1e23,9e23|0|Chemistry|Mole Concept|JEE|2023|true
Gas constant R value?|8.314,1.38,0.082,6.67|0|Chemistry|Thermodynamics|JEE|2024|false
Atomic number of Oxygen?|8,16,12,6|0|Chemistry|Atomic Structure|JEE|2023|true
Valency of Carbon?|4,2,3,1|0|Chemistry|Chemical Bonding|JEE|2024|false
Value of sin 90?|1,0,-1,1/2|0|Maths|Trigonometry|JEE|2024|true
Value of cos 0?|1,0,-1,1/2|0|Maths|Trigonometry|JEE|2024|true
Derivative of x^2?|2x,x,2,x^2|0|Maths|Calculus|JEE|2023|true
Integral of 1 dx?|x,x^2,1,0|0|Maths|Calculus|JEE|2023|true
Value of tan 45?|1,0,-1,undefined|0|Maths|Trigonometry|JEE|2024|false
Formula of (a+b)^2?|a^2+2ab+b^2,a^2-b^2,a^2+b^2,2ab|0|Maths|Algebra|JEE|2023|true
Roots of x^2-1=0?|1,-1,0,2|0|Maths|Algebra|JEE|2024|false
Slope formula?|y2-y1/x2-x1,x2-x1/y2-y1,y1+y2,x1+x2|0|Maths|Coordinate Geometry|JEE|2023|true
Value of log10(100)?|2,1,10,100|0|Maths|Logarithm|JEE|2024|false
Sum of first n natural numbers?|n(n+1)/2,n^2,n(n-1)/2,2n|0|Maths|Sequences|JEE|2023|true`;

async function main() {
    const lines = input.split('\n').filter(line => line.trim());
    const toCreate = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const parts = line.split('|');
        if (parts.length < 5) continue;
        
        const options = parts[1].split(',').map(o => o.trim());
        const correctAnswer = parseInt(parts[2].trim()) || 0;
        const yearStr = parts[6]?.trim();
        
        toCreate.push({
            text: parts[0].trim(),
            options: JSON.stringify(options),
            correctAnswer,
            subject: parts[3]?.trim(),
            chapter: parts[4]?.trim() || null,
            level: parts[5]?.trim() || null,
            year: yearStr ? parseInt(yearStr) : null,
            isPYQ: parts[7]?.trim() === 'true',
            imageUrl: null
        });
    }

    try {
        const results = await Promise.all(toCreate.map(data => prisma.question.create({ data })));
        console.log(`Successfully imported ${results.length} questions into the database.`);
    } catch (e) {
        console.error('Failed to insert in DB:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
