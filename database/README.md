# Database contents
This is where I put the database schemas, that contains everything (the user account & password info is NOT avaiable in the backup.)

## How to import
Import the schema:
```bash
psql -d database -f database_dump.sql
```

## How to create a database_dump
Type or copy This
```bash
pg_dump -U your_username -d your_database --schema-only > schema.sql

```
