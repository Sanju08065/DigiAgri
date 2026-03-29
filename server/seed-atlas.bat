@echo off
echo Running seed against MongoDB Atlas...
set MONGODB_URI=mongodb+srv://ratnamsanjay4_db_user:k5O2FKueXbE411wZ@cluster0.32tqvas.mongodb.net/digital-agriculture?retryWrites=true^&w=majority^&appName=Cluster0
set NODE_ENV=production
node src/seed.js
pause
