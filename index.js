#!/usr/bin/env node

const { Command } = require('commander');
const { execSync } = require('child_process');
const path = require('path');

// --- RUNTIME CHECK UTILITY ---
function checkBun() {
    try {
        // stdio: 'ignore' prevents the terminal from showing an error if bun isn't found
        execSync('bun --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

const program = new Command();

// Configure the CLI program
program
    .name('k8-stack')
    .description('A CLI to instantly setup tech stack')
    .version('1.0.0')
    .argument('[project-name]', 'Name of the project directory', 'my-app')
    // Define our stack flags
    .option('--standard', 'Industry Standard: NextAuth + Neon Postgres + Prisma')
    .option('--modern', 'Modern Edge: Clerk + Neon Postgres + Drizzle')
    .option('--ultra-fast', 'Ultra Fast: Clerk + Drizzle')
    .option('--baas-sql', 'BaaS (SQL): Supabase')
    .option('--bass-nosql', 'BaaS (NoSQL): Firebase')
    .option('--classic', 'Classic: NextAuth + Mongoose')
    .option('--open-source', 'Open Source: NextAuth + Drizzle')
    .option('--kinde-standard', 'Kinde Standard: Kinde Auth + Neon Postgres + Prisma')
    .option('--kinde-edge', 'Kinde Edge: Kinde Auth + Drizzle')
    .option('--mongo-standard', 'Mongo Standard: NextAuth + MongoDB + Mongoose')
    .option('--mongo-kinde', 'Mongo Kinde: Kinde + Mongoose')
    .option('--mongo-clerk', 'Mongo Clerk: Clerk + Mongoose')
    .action((projectName, options) => {

        const isBun = checkBun();

        const pm = {
            runner: isBun ? 'bunx' : 'npx',        // bunx vs npx
            install: isBun ? 'bun add' : 'npm i',  // bun add vs npm i
            devDeps: isBun ? 'bun add -d' : 'npm i -D', // bun add -d vs npm i -D
            flag: isBun ? '--use-bun' : '--use-npm' // Tells create-next-app which PM to use
        };

        // We will store the subsequent commands to run inside the new folder
        let stackName = '';
        let stackCommands = [];

        // Commander automatically camelCases hyphenated flags! 
        // e.g., '--kinde-standard' becomes 'options.kindeStandard'
        if (options.standard) {
            stackName = 'Standard (NextAuth + Prisma)';
            stackCommands = [
                `${pm.install} next-auth @prisma/client`,
                `${pm.install} -D prisma`,
                `${pm.runner} prisma init`
            ];
        } else if (options.modern) {
            stackName = 'Modern (Clerk + Drizzle)';
            stackCommands = [
                `${pm.install} @clerk/nextjs drizzle-orm @neondatabase/serverless`,
                `${pm.install} -D drizzle-kit`
            ];
        } else if (options.ultraFast) {
            stackName = 'Ultra-Fast (Clerk + Drizzle)';
            stackCommands = [
                `${pm.install} @clerk/nextjs drizzle-orm @libsql/client`,
                `${pm.install} -D drizzle-kit`
            ];
        } else if (options.baasSQL) {
            stackName = 'BaaS (SQL) - Supabase';
            stackCommands = [
                `${pm.install} @supabase/supabase-js @supabase/ssr`
            ];
        } else if (options.baasNosql) {
            stackName = 'BaaS (NoSQL) - Firebase';
            stackCommands = [
                `${pm.install} firebase firebase-admin`
            ];
        } else if (options.classic) {
            stackName = 'Classic (NextAuth + Mongoose)';
            stackCommands = [
                `${pm.install} next-auth mongoose`
            ]
        } else if (options.openSource) {
            stackName = 'Open Source (NextAuth + Drizzle)';
            stackCommands = [
                `${pm.install} next-auth drizzle-orm @libsql/client`,
                `${pm.install} -D drizzle-kit`
            ];
        } else if (options.kindeStandard) {
            stackName = 'Kinde Standard (Kinde + Prisma)';
            stackCommands = [
                `${pm.install} @kinde-oss/kinde-auth-nextjs @prisma/client`,
                `${pm.install} -D prisma`,
                `${pm.runner} prisma init`
            ];
        } else if (options.kindeEdge) {
            stackName = 'Kinde Edge (Kinde + Drizzle)';
            stackCommands = [
                `${pm.install} @kinde-oss/kinde-auth-nextjs drizzle-orm @libsql/client`,
                `${pm.install} -D drizzle-kit`
            ]
        } else if (options.mongoStandard) {
            stackName = 'Mongo Standard (NextAuth + Mongoose)';
            stackCommands = [
                `${pm.install} next-auth mongoose mongodb @auth/mongodb-adapter`
            ];
        } else if (options.mongoKinde) {
            stackName = 'Mongo Kinde (Kinde + Mongoose)';
            stackCommands = [
                `${pm.install} @kinde-oss/kinde-auth-nextjs mongoose`
            ];
        } else if (options.mongoClerk) {
            stackName = 'Mongo Clerk (Clerk + Mongoose)';
            stackCommands = [
                `${pm.install} @clerk/nextjs mongoose`
            ];
        } else {
            console.log('\n❌ Please provide a valid stack flag.');
            // Automatically prints the help menu if they mess up
            program.help();
            return;
        }

        console.log(`\n📦 Package Manager Detected: ${isBun ? 'Bun (Ultra-fast⚡)' : 'NPM'}`);
        console.log(`\n🚀 Bootstrapping '${projectName}' with the ${stackName} stack...\n`);

        try {
            // 1. Create the Next.js app in the current directory
            console.log(`> npx create-next-app@latest ${projectName} -y`);
            execSync(`npx create-next-app@latest ${projectName} -y`, { stdio: 'inherit' });

            // 2. Define the path to the newly created folder
            const projectPath = path.join(process.cwd(), projectName);

            // 3. Run the stack-specific commands specifically INSIDE the new folder
            for (const cmd of stackCommands) {
                console.log(`\n> ${cmd}`);
                // cwd: projectPath replaces the need for "cd my-app && ..."
                execSync(cmd, { stdio: 'inherit', cwd: projectPath });
            }

            console.log(`\n✅ Setup complete!`);
            console.log(`Next steps:`);
            console.log(`  cd ${projectName}`);
            console.log(`  npm run dev\n`);

        } catch (error) {
            console.error('\n❌ An error occurred during setup.');
            process.exit(1);
        }
    });

// Parse the arguments passed by the user
program.parse(process.argv);