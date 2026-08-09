# Setup Checklist

## Prerequisites
- [ ] MySQL installed
- [ ] MySQL service running
- [ ] Node.js installed

## Configuration
- [ ] `.env` file has correct credentials
- [ ] MySQL user created (or using root)
- [ ] User has proper privileges

## Database Setup
- [ ] Run `npm install`
- [ ] Run `npm run test-db` (should show connection)
- [ ] Run `npm run init-db` (creates database)
- [ ] Run `npm run import-data` (imports all data)
- [ ] Run `npm run test-db` again (verify data)

## Verification
- [ ] All 4 tables created
- [ ] pest_data has records
- [ ] bhandara_weather has records
- [ ] raigad_weather has records
- [ ] ratnagiri_weather has records

## Testing
- [ ] Run `npm run server`
- [ ] Visit http://localhost:5000/api/health
- [ ] Visit http://localhost:5000/api/pest-data
- [ ] Check browser console for errors

## Common Issues

❌ ECONNREFUSED → MySQL not running
💡 Start MySQL service

❌ Access denied → Wrong credentials
💡 Check .env file

❌ Database doesn't exist → Not initialized
💡 Run npm run init-db

❌ Table doesn't exist → Data not imported
💡 Run npm run import-data
