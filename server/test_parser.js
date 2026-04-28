const input = `Energy|JEE|2023|true
SI unit of momentum?,kg
m/s,N/m,J/s,kg/m|0|Physics|Momentum|JEE|2024|false
Ohm law?,V=IR,I=VR,V=I/R,R=VI|0|Physics|Current Electricity|JEE|2023|true
Power formula?,VI,V/I,I/V,VR|0|Physics|Electricity|JEE|2024|false
Frequency unit?,Hertz,Newton,Joule,Volt|0|Physics|Waves|JEE|2024|false
Angular velocity unit?,rad/s,m/s,m/s^2,rad|0|Physics|Rotational
Motion|JEE|2023|true`;

const lines = input.split('\n').filter(line => line.trim());
const questionsToProcess = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const parts = line.split('|');
    
    try {
        if (parts.length < 2) {
            throw new Error(`Line ${i + 1} looks incomplete. Needs at least 1 pipe (|) between the question text and options. You wrote: "${line.substring(0, 30)}..."`);
        }
        
        // Check for missing first pipe
        if (parts.length > 2 && !isNaN(parseInt(parts[1]?.trim())) && isNaN(parseInt(parts[2]?.trim()))) {
            throw new Error(`Line ${i + 1}: Missing pipe (|) between Question Text and Options. Found number instead of options in the second block. You wrote: "${line.substring(0, 30)}..."`);
        }

        const text = parts[0]?.trim();
        const optsStr = parts[1]?.trim() || "Option A, Option B, Option C, Option D";
        const options = optsStr.split(',').map(o => o.trim());
        
        let correctAnswer = parseInt(parts[2]?.trim());
        if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) {
            correctAnswer = 0; 
        }
        
        const subject = parts[3]?.trim() || "General";
        const chapter = parts[4]?.trim() || "Miscellaneous";
        const level = parts[5]?.trim() || "JEE";
        
        const rawYear = parts[6]?.trim();
        const year = rawYear ? parseInt(rawYear) : null;
        
        const isPYQ = parts[7]?.trim() === 'true';

        questionsToProcess.push({
            text,
            options,
            correctAnswer,
            subject,
            chapter,
            level,
            year,
            isPYQ
        });
        console.log(`Line ${i+1} PASSED:`, {text, opts: options, correct: correctAnswer});
    } catch (e) {
        console.error(`ERROR:`, e.message);
    }
}
