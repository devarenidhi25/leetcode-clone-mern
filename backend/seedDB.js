import mongoose from "mongoose";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Problem from "./src/models/ProblemModel.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recursive function to convert nested ObjectIds
const convertObjectIds = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectIds(item));
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const key in obj) {
      const oid_key = '$' + 'oid';
      if (key === '_id' && obj[key] && obj[key][oid_key]) {
        converted[key] = new mongoose.Types.ObjectId(obj[key][oid_key]);
      } else if (typeof obj[key] === 'object') {
        converted[key] = convertObjectIds(obj[key]);
      } else {
        converted[key] = obj[key];
      }
    }
    return converted;
  }
  
  return obj;
};

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("? Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("? Cleared existing problems");

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../frontend/public/CodeDB.problems.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const problems = JSON.parse(rawData);

    console.log(`? Found ${problems.length} problems in JSON file`);

    // Convert all ObjectIds recursively
    const problemsToInsert = problems.map(problem => convertObjectIds(problem));

    const result = await Problem.insertMany(problemsToInsert);
    console.log(`? Successfully seeded ${result.length} problems into database`);

    // Verify
    const count = await Problem.countDocuments();
    console.log(`? Total problems in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("? Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDB();
