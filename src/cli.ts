#!/usr/bin/env node

import { Command } from 'commander';
import { generateStack, type StackOptions } from './mod.ts';

const program = new Command();

program
    .name('k8-stack')
    .description('A CLI to instantly setup tech stack')
    .version('1.0.0')
    .argument('[project-name]', 'Name of the project directory', 'my-app')
    .option('--standard', 'Industry Standard: NextAuth + Neon Postgres + Prisma')
    .option('--modern', 'Modern Edge: Clerk + Neon Postgres + Drizzle')
    .option('--ultra-fast', 'Ultra Fast: Clerk + Drizzle')
    .option('--baas-sql', 'BaaS (SQL): Supabase')
    .option('--baas-nosql', 'BaaS (NoSQL): Firebase')
    .option('--classic', 'Classic: NextAuth + Mongoose')
    .option('--open-source', 'Open Source: NextAuth + Drizzle')
    .option('--kinde-standard', 'Kinde Standard: Kinde Auth + Neon Postgres + Prisma')
    .option('--kinde-edge', 'Kinde Edge: Kinde Auth + Drizzle')
    .option('--mongo-standard', 'Mongo Standard: NextAuth + MongoDB + Mongoose')
    .option('--mongo-kinde', 'Mongo Kinde: Kinde + Mongoose')
    .option('--mongo-clerk', 'Mongo Clerk: Clerk + Mongoose')
    .action((projectName: string, options: StackOptions) => {
        
        // If no options are provided, show the help menu instead of crashing
        if (Object.keys(options).length === 0) {
            program.help();
            return;
        }

        // Call our extracted library function
        generateStack(projectName, options);
    });

program.parse(process.argv);