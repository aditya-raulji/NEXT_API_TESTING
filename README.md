# Companies API Testing with Playwright

---

## Project Overview

This repository contains automated API tests for a **Companies API** built with **Next.js** and **MongoDB**.  

The API provides company information such as location, salary, headcount, hiring criteria, benefits, and interview rounds.  

The goal of this project is to **verify API functionality, filtering, sorting, and robustness** using **Playwright**.

---

## API Endpoints Tested

| Endpoint | Description | Test Cases |
|----------|-------------|------------|
| `/api/companies/count` | Returns total number of companies | ✅ Total without filters <br> ✅ Filter by name <br> ✅ Non-existing company name |
| `/api/companies/top-paid` | Returns top-paid companies | ✅ Default max 5 items <br> ✅ Sorted by salary descending <br> ✅ Limit parameter works |
| `/api/companies/by-skill/:skill` | Filter companies by skill | ✅ Matches companies with the skill <br> ✅ Case-insensitive <br> ✅ Non-existing skill returns empty |
| `/api/companies/by-location/:location` | Filter companies by location | ✅ Matches companies with the location <br> ✅ Case-insensitive <br> ✅ Non-existing location returns empty |
| `/api/companies/headcount-range` | Filter companies by headcount | ✅ Min headcount only <br> ✅ Min and max headcount <br> ✅ Handles invalid input |
| `/api/companies/benefit/:benefit` | Filter companies by benefits | ✅ Matches companies with benefit <br> ✅ Partial match supported <br> ✅ Case-insensitive <br> ✅ No match returns empty array |

---

## Tech Stack

- **Next.js** – Backend API routes  
- **MongoDB** – Database to store company information  
- **Playwright** – API testing framework  
- **Node.js** – JavaScript runtime environment  
- **JavaScript** – Programming language  

---

## How to Run

1. Install dependencies:

```bash
npm install
```
--

Run Playwright tests

```bash
npx playwright test
```

--

View the HTML test report

```bash
npx playwright show-report
```

---
# NEXT_API_TESTING
# NEXT_API_TESTING
