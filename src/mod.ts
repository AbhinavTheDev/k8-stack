/**
 * @module
 * A utility library to instantly scaffold Next.js full-stack boilerplates.
 * Provides a programmatic API to generate various tech stacks.
 */

import { execSync } from 'node:child_process';
import path from 'node:path';

/**
 * Checks if Bun is installed on the current system.
 * @returns {boolean} True if Bun is available, false otherwise.
 */
export function checkBun(): boolean {
    try {
        execSync('bun --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

/**
 * The available stack options for generation.
 * Only one stack should be set to true at a time.
 */
export interface StackOptions {
    standard?: boolean;
    modern?: boolean;
    ultraFast?: boolean;
    baasSql?: boolean;
    baasNosql?: boolean;
    classic?: boolean;
    openSource?: boolean;
    kindeStandard?: boolean;
    kindeEdge?: boolean;
    mongoStandard?: boolean;
    mongoKinde?: boolean;
    mongoClerk?: boolean;
}

/**
 * Generates a Next.js project with the specified tech stack.
 * 
 * @param {string} projectName - The name of the target directory (e.g., 'my-app')
 * @param {StackOptions} options - The stack configuration flags
 * @throws Will throw an error if the shell commands fail to execute.
 */
export function generateStack(projectName: string, options: StackOptions): void {
    const isBun = checkBun();

    const pm = {
        runner: isBun ? 'bunx' : 'npx',
        install: isBun ? 'bun add' : 'npm i',
        devDeps: isBun ? 'bun add -d' : 'npm i -D',
        flag: isBun ? '--use-bun' : '--use-npm'
    };

    let stackName = '';
    let stackCommands: string[] =[];

    if (options.standard) {
        stackName = 'Standard (NextAuth + Prisma)';
        stackCommands =[
            `${pm.install} next-auth @prisma/client`,
            `${pm.devDeps} prisma`,
            `${pm.runner} prisma init`
        ];
    } else if (options.modern) {
        stackName = 'Modern (Clerk + Drizzle)';
        stackCommands =[
            `${pm.install} @clerk/nextjs drizzle-orm @neondatabase/serverless`,
            `${pm.devDeps} drizzle-kit`
        ];
    } else if (options.ultraFast) {
        stackName = 'Ultra-Fast (Clerk + Drizzle)';
        stackCommands =[
            `${pm.install} @clerk/nextjs drizzle-orm @libsql/client`,
            `${pm.devDeps} drizzle-kit`
        ];
    } else if (options.baasSql) {
        stackName = 'BaaS (SQL) - Supabase';
        stackCommands =[
            `${pm.install} @supabase/supabase-js @supabase/ssr`
        ];
    } else if (options.baasNosql) {
        stackName = 'BaaS (NoSQL) - Firebase';
        stackCommands =[
            `${pm.install} firebase firebase-admin`
        ];
    } else if (options.classic) {
        stackName = 'Classic (NextAuth + Mongoose)';
        stackCommands =[
            `${pm.install} next-auth mongoose`
        ];
    } else if (options.openSource) {
        stackName = 'Open Source (NextAuth + Drizzle)';
        stackCommands =[
            `${pm.install} next-auth drizzle-orm @libsql/client`,
            `${pm.devDeps} drizzle-kit`
        ];
    } else if (options.kindeStandard) {
        stackName = 'Kinde Standard (Kinde + Prisma)';
        stackCommands =[
            `${pm.install} @kinde-oss/kinde-auth-nextjs @prisma/client`,
            `${pm.devDeps} prisma`,
            `${pm.runner} prisma init`
        ];
    } else if (options.kindeEdge) {
        stackName = 'Kinde Edge (Kinde + Drizzle)';
        stackCommands =[
            `${pm.install} @kinde-oss/kinde-auth-nextjs drizzle-orm @libsql/client`,
            `${pm.devDeps} drizzle-kit`
        ];
    } else if (options.mongoStandard) {
        stackName = 'Mongo Standard (NextAuth + Mongoose)';
        stackCommands =[
            `${pm.install} next-auth mongoose mongodb @auth/mongodb-adapter`
        ];
    } else if (options.mongoKinde) {
        stackName = 'Mongo Kinde (Kinde + Mongoose)';
        stackCommands =[
            `${pm.install} @kinde-oss/kinde-auth-nextjs mongoose`
        ];
    } else if (options.mongoClerk) {
        stackName = 'Mongo Clerk (Clerk + Mongoose)';
        stackCommands =[
            `${pm.install} @clerk/nextjs mongoose`
        ];
    } else {
        console.log('\n❌ Please provide a valid stack flag.');
        console.log('Use --help to see all available options.');
        process.exit(1);
    }

    console.log(`\n📦 Package Manager Detected: ${isBun ? 'Bun (Ultra-fast⚡)' : 'NPM'}`);
    console.log(`\n🚀 Bootstrapping '${projectName}' with the ${stackName} stack...\n`);

    try {
        // 1. Create the Next.js app (Injecting PM flag so Next.js doesn't get confused)
        const createCmd = `npx create-next-app@latest ${projectName} -y ${pm.flag}`;
        console.log(`> ${createCmd}`);
        execSync(createCmd, { stdio: 'inherit' });

        // 2. Define the path to the newly created folder
        const projectPath = path.join(process.cwd(), projectName);

        // 3. Run the stack-specific commands specifically INSIDE the new folder
        for (const cmd of stackCommands) {
            console.log(`\n> ${cmd}`);
            execSync(cmd, { stdio: 'inherit', cwd: projectPath });
        }

        console.log(`\n✅ Setup complete!`);
        console.log(`Next steps:`);
        console.log(`  cd ${projectName}`);
        console.log(`  ${isBun ? 'bun run dev' : 'npm run dev'}\n`);

    } catch (error) {
        console.error('\n❌ An error occurred during setup.');
        process.exit(1);
    }
}