import mongoose from "mongoose";
import Placement from "../models/Placement.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

const branches = ["CSE", "ECE", "ME", "CE", "EE"];
const companies = ["Google", "Amazon", "Stripe", "Microsoft", "Startup"];
const genders = ["Male", "Female"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(MONGO_URI, {
    dbName: "ManagementSystem"
  });

  const data = [];
  for (let i = 0; i < 10000; i++) {
    data.push({
      name: `Student_${i}`,
      batch: 2019 + Math.floor(Math.random() * 6),
      branch: rand(branches),
      company: rand(companies),
      package: Math.floor(Math.random() * 40) + 4,
      cpi: +(Math.random() * 4 + 6).toFixed(2),
      gender: rand(genders),
    });
  }

  await Placement.insertMany(data);
  console.log("10,000 placement records inserted");
  process.exit();
}

seed();
