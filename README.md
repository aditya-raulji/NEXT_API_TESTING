# 🚀 Companies API – Automated Testing with Playwright  

## 📌 Introduction  

This project contains **end-to-end API test automation** for a custom-built **Companies API** developed with **Next.js** and **MongoDB**.  

The Companies API provides insights into organizations, including:  

- 📍 Location  
- 💰 Salary details  
- 👥 Headcount  
- 🎯 Hiring criteria  
- 🎁 Employee benefits  
- 📝 Interview rounds  

Using **Playwright**, this project ensures that API endpoints are **reliable, accurate, and resilient** under different input scenarios.  

---

## ✅ Features Covered  

The automated tests validate the following:  

- **Data accuracy** – responses return correct results  
- **Filtering & Sorting** – queries return expected subsets of data  
- **Edge cases & errors** – invalid or missing inputs are handled gracefully  
- **Scalability checks** – limit and range parameters work as intended  

---

## 🔗 API Endpoints Tested  

| Endpoint | Description | Test Coverage |
|----------|-------------|---------------|
| `/api/companies/count` | Returns the total number of companies | 🔹 Count without filters <br> 🔹 Filter by name <br> 🔹 Non-existing company name |
| `/api/companies/top-paid` | Returns top paid companies | 🔹 Default 5 results <br> 🔹 Sorted by salary (DESC) <br> 🔹 Limit param supported |
| `/api/companies/by-skill/:skill` | Filters companies by skill | 🔹 Matches exact skill <br> 🔹 Case-insensitive <br> 🔹 No matches return empty |
| `/api/companies/by-location/:location` | Filters companies by location | 🔹 Exact match <br> 🔹 Case-insensitive <br> 🔹 Handles non-existing location |
| `/api/companies/headcount-range` | Filters by headcount range | 🔹 Minimum only <br> 🔹 Min + Max <br> 🔹 Invalid input handling |
| `/api/companies/benefit/:benefit` | Filters by employee benefits | 🔹 Exact & partial match <br> 🔹 Case-insensitive <br> 🔹 Empty response for no match |

---

## 🛠️ Tech Stack  

- **Backend** → Next.js (API Routes)  
- **Database** → MongoDB  
- **Testing** → Playwright  
- **Runtime** → Node.js  
- **Language** → JavaScript  

---

## ▶️ Getting Started  

### 1️⃣ Install dependencies  
```bash
npm install
2️⃣ Run Playwright tests
bash
Copy code
npx playwright test
3️⃣ View the HTML test report
bash
Copy code
npx playwright show-report
📊 Example Test Flow
Request /api/companies/count without filters → Expect total company count

Request /api/companies/count?name=Google → Expect count = 1 (if Google exists)

Request /api/companies/top-paid?limit=3 → Expect 3 companies sorted by salary DESC

Request /api/companies/by-skill/react → Expect all React-based companies

📌 Future Enhancements
🔹 Add performance testing for stress/load validation

🔹 Integrate CI/CD pipeline for automated test execution

🔹 Expand coverage for authentication & authorization endpoints

🔹 Implement contract testing with schema validation

👨‍💻 Author
Companies API Testing Project – Built with ❤️ using Next.js, MongoDB & Playwright.

pgsql
Copy code

Do you want me to also **add shields.io badges** (like Node.js, Playwright, MongoDB, License) at the top of the `README
