
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Main function to export the database
async function exportDatabase() {
  try {
    // Database connection details from environment variables
    const dbName = process.env.POSTGRES_DB;
    const dbUser = process.env.POSTGRES_USER;
    const dbHost = process.env.POSTGRES_HOST;
    const dbPort = process.env.POSTGRES_PORT;

    // Check if required environment variables are set
    if (!dbName || !dbUser || !dbHost || !dbPort) {
      console.error('Error: Missing required environment variables for database connection.');
      console.error('Please ensure POSTGRES_DB, POSTGRES_USER, POSTGRES_HOST, and POSTGRES_PORT are set.');
      return;
    }

    // Tables to exclude from the export
    const excludedTables = ['users', 'user_sessions']; // Add any other tables to exclude here

    // Path to the output directory
    const outputDir = path.join(process.cwd(), 'exported_db');
    await fs.mkdir(outputDir, { recursive: true });

    // Path for the output SQL file
    const currentDate = getCurrentDate();
    const outputFilePath = path.join(outputDir, `db_export_${currentDate}.sql`);

    // Construct the pg_dump command
    let command = `pg_dump "postgresql://${dbUser}:${process.env.POSTGRES_PASSWORD}@${dbHost}:${dbPort}/${dbName}" -F c -f "${outputFilePath}"`;

    // Add exclude-table flags for each table to be excluded
    for (const table of excludedTables) {
      command += ` --exclude-table-data=${table}`;
    }

    console.log('Starting database export...');
    console.log(`Exporting to: ${outputFilePath}`);
    console.log(`Excluding tables: ${excludedTables.join(', ')}`);

    // Execute the pg_dump command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Export failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`pg_dump stderr: ${stderr}`);
      }
      console.log('Database export completed successfully.');
      console.log(`File saved to: ${outputFilePath}`);
    });

  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}

// Run the export function
exportDatabase();
