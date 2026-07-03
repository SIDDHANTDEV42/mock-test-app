const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const input = `What is the SI unit of force?|Joule,Newton,Watt,Pascal|2|Physics|Units and Measurements|Easy|2026|false
Which instrument measures electric current?|Voltmeter,Ammeter,Barometer,Thermometer|2|Physics|Current Electricity|Easy|2026|false
What is the speed of light in vacuum?|3×10^8 m/s,3×10^6 m/s,3×10^5 m/s,3×10^7 m/s|1|Physics|Optics|Easy|2026|false
Which quantity is a vector?|Mass,Time,Distance,Velocity|4|Physics|Vectors|Easy|2026|false
SI unit of power?|Joule,Watt,Newton,Volt|2|Physics|Work Power Energy|Easy|2026|false
Acceleration due to gravity on Earth is?|9.8 m/s²,8.9 m/s²,10.8 m/s²,7.8 m/s²|1|Physics|Gravitation|Easy|2026|false
Which law explains inertia?|Newton First Law,Newton Second Law,Newton Third Law,Ohm Law|1|Physics|Laws of Motion|Easy|2026|false
Unit of electric resistance?|Ohm,Volt,Ampere,Watt|1|Physics|Current Electricity|Easy|2026|false
Mirror used in vehicles rear view?|Plane,Convex,Concave,Cylindrical|2|Physics|Ray Optics|Easy|2026|false
Energy stored in a battery is?|Chemical,Nuclear,Mechanical,Sound|1|Physics|Energy|Easy|2026|false
SI unit of frequency?|Hertz,Joule,Pascal,Newton|1|Physics|Waves|Easy|2026|false
Which particle has negative charge?|Proton,Neutron,Electron,Photon|3|Physics|Modern Physics|Easy|2026|false
Unit of pressure?|Pascal,Watt,Newton,Joule|1|Physics|Properties of Matter|Easy|2026|false
What is measured in kilograms?|Force,Mass,Power,Energy|2|Physics|Units and Measurements|Easy|2026|false
Which wave does not need medium?|Sound,Water,Electromagnetic,String|3|Physics|Waves|Easy|2026|false
Formula of speed?|Distance/Time,Time/Distance,Mass×Acceleration,Work/Time|1|Physics|Motion in 1D|Easy|2026|false
Unit of charge?|Coulomb,Volt,Ohm,Tesla|1|Physics|Electrostatics|Easy|2026|false
Lens used to correct myopia?|Convex,Concave,Plane,None|2|Physics|Optics|Easy|2026|false
Which color has maximum wavelength?|Violet,Blue,Green,Red|4|Physics|Optics|Easy|2026|false
SI unit of energy?|Joule,Watt,Newton,Pascal|1|Physics|Work Power Energy|Easy|2026|false
Water formula is?|H2O,CO2,O2,NH3|1|Chemistry|Basic Chemistry|Easy|2026|false
Atomic number of Hydrogen?|1,2,3,4|1|Chemistry|Atomic Structure|Easy|2026|false
pH of pure water?|5,6,7,8|3|Chemistry|Solutions|Easy|2026|false
Gas essential for respiration?|Hydrogen,Oxygen,Nitrogen,Helium|2|Chemistry|Gases|Easy|2026|false
Symbol of Sodium?|S,So,Na,N|3|Chemistry|Periodic Table|Easy|2026|false
Which is an acid?|HCl,NaOH,KOH,CaO|1|Chemistry|Acids Bases Salts|Easy|2026|false
Which is a base?|HCl,H2SO4,NaOH,HNO3|3|Chemistry|Acids Bases Salts|Easy|2026|false
Atomic number of Carbon?|4,6,8,12|2|Chemistry|Atomic Structure|Easy|2026|false
Chemical formula of carbon dioxide?|CO,CO2,C2O,O2|2|Chemistry|Basic Chemistry|Easy|2026|false
Which metal is liquid at room temperature?|Iron,Mercury,Copper,Silver|2|Chemistry|Metals|Easy|2026|false
Symbol of Gold?|Ag,Au,Gd,Go|2|Chemistry|Periodic Table|Easy|2026|false
Which gas is used in balloons?|Helium,Oxygen,Nitrogen,Chlorine|1|Chemistry|Gases|Easy|2026|false
Common salt formula?|NaCl,KCl,CaCl2,MgCl2|1|Chemistry|Compounds|Easy|2026|false
Atomic number of Oxygen?|6,7,8,9|3|Chemistry|Atomic Structure|Easy|2026|false
Which is a noble gas?|Oxygen,Hydrogen,Helium,Nitrogen|3|Chemistry|Periodic Table|Easy|2026|false
Formula of ammonia?|NH3,H2O,CH4,CO2|1|Chemistry|Compounds|Easy|2026|false
Which acid is present in vinegar?|Acetic,Hydrochloric,Sulphuric,Nitric|1|Chemistry|Organic Chemistry|Easy|2026|false
Number of elements in modern periodic table?|108,118,128,98|2|Chemistry|Periodic Table|Easy|2026|false
Which element is represented by Fe?|Fluorine,Iron,Fermium,Francium|2|Chemistry|Periodic Table|Easy|2026|false
Molecule of oxygen is?|O,O2,O3,O4|2|Chemistry|Basic Chemistry|Easy|2026|false
What is 2+2?|2,3,4,5|3|Mathematics|Numbers|Easy|2026|false
Square root of 81?|7,8,9,10|3|Mathematics|Numbers|Easy|2026|false
Value of pi approximately?|2.14,3.14,4.13,1.34|2|Mathematics|Mensuration|Easy|2026|false
5×6=?|25,30,35,40|2|Mathematics|Arithmetic|Easy|2026|false
10²=?|10,20,100,1000|3|Mathematics|Indices|Easy|2026|false
What is 15-7?|6,7,8,9|3|Mathematics|Arithmetic|Easy|2026|false
1/2 + 1/2 = ?|1,2,0.5,1.5|1|Mathematics|Fractions|Easy|2026|false
Value of 3²?|3,6,9,12|3|Mathematics|Indices|Easy|2026|false
Perimeter of square with side 4?|8,12,16,20|3|Mathematics|Mensuration|Easy|2026|false
Area of square side 5?|10,15,20,25|4|Mathematics|Mensuration|Easy|2026|false
What is 20÷4?|4,5,6,7|2|Mathematics|Arithmetic|Easy|2026|false
Value of x in x+2=5?|1,2,3,4|3|Mathematics|Algebra|Easy|2026|false
What is 7×8?|54,56,58,60|2|Mathematics|Arithmetic|Easy|2026|false
Cube of 2?|4,6,8,10|3|Mathematics|Indices|Easy|2026|false
Sum of angles of a triangle?|90,180,270,360|2|Mathematics|Geometry|Easy|2026|false
What is 100-25?|65,70,75,80|3|Mathematics|Arithmetic|Easy|2026|false
Value of 9÷3?|1,2,3,4|3|Mathematics|Arithmetic|Easy|2026|false
What is 11+12?|21,22,23,24|3|Mathematics|Arithmetic|Easy|2026|false
Rectangle area formula?|l+b,l×b,2l+2b,l-b|2|Mathematics|Mensuration|Easy|2026|false
What is 50% of 100?|25,50,75,100|2|Mathematics|Percentage|Easy|2026|false`;

async function main() {
    const lines = input.split('\n').filter(line => line.trim());
    const toCreate = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const parts = line.split('|');
        if (parts.length < 5) continue;
        
        const options = parts[1].split(',').map(o => o.trim());
        // The user's input seems to be 1-indexed, so we subtract 1 for 0-indexed correct answers
        const correctAnswer = (parseInt(parts[2].trim()) || 1) - 1;
        const yearStr = parts[6]?.trim();
        
        toCreate.push({
            text: parts[0].trim(),
            options: JSON.stringify(options),
            correctAnswer: Math.max(0, correctAnswer), // ensure non-negative
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
