const { test, expect } = require('@playwright/test');
const BASE_URL = 'http://localhost:3001';

test.describe('Companies API - Count', () => {
  test('GET /api/companies/count with and without filters', async ({ request }) => {
    // 1️⃣ Total without filters
    const resTotal = await request.get(`${BASE_URL}/api/companies/count`);
    expect(resTotal.status()).toBe(200);
    const bodyTotal = await resTotal.json();
    expect(bodyTotal).toHaveProperty('total');
    const total = bodyTotal.total;
    expect(total).toBeGreaterThan(0);

    // 2️⃣ Filter by existing name
    const resFilter = await request.get(`${BASE_URL}/api/companies/count?name=Microsoft`);
    expect(resFilter.status()).toBe(200);
    const bodyFilter = await resFilter.json();
    expect(bodyFilter).toHaveProperty('total');
    expect(bodyFilter.total).toBeLessThanOrEqual(total);

    // 3️⃣ Filter by non-existing name
    const resNonExist = await request.get(`${BASE_URL}/api/companies/count?name=NoSuchCompany`);
    expect(resNonExist.status()).toBe(200);
    const bodyNonExist = await resNonExist.json();
    expect(bodyNonExist).toHaveProperty('total');
    expect(bodyNonExist.total).toBe(0);
  });

  test('GET /api/companies/top-paid returns max 5 items by default, sorted by salary, and respects limit', async ({ request }) => {
  // Default max 5 items
  const resDefault = await request.get(`${BASE_URL}/api/companies/top-paid`);
  expect(resDefault.status()).toBe(200);
  const bodyDefault = await resDefault.json();
  expect(bodyDefault.length).toBeLessThanOrEqual(5);

  // Descending order check: filter valid salaries first
  const salaries = bodyDefault
    .map(c => c.salaryBand?.base)
    .filter(s => typeof s === 'number');

  // Ensure descending
  const isDescending = salaries.every((s, i, arr) => i === 0 || arr[i - 1] >= s);
  expect(isDescending).toBe(true);

  // Test limit parameter
  const resLimit = await request.get(`${BASE_URL}/api/companies/top-paid?limit=10`);
  expect(resLimit.status()).toBe(200);
  const bodyLimit = await resLimit.json();
  expect(bodyLimit.length).toBeLessThanOrEqual(10);
});

test('GET /api/companies/by-skill/:skill returns correct companies', async ({ request }) => {
    // 1️⃣ Existing skill (e.g., DSA)
    const skill = 'DSA';
    const resSkill = await request.get(`${BASE_URL}/api/companies/by-skill/${skill}`);
    expect(resSkill.status()).toBe(200);
    const bodySkill = await resSkill.json();
    expect(Array.isArray(bodySkill)).toBe(true);
    expect(bodySkill.length).toBeGreaterThan(0);
    bodySkill.forEach(company => {
      const skills = company.hiringCriteria?.skills?.map(s => s.toLowerCase()) || [];
      expect(skills).toContain(skill.toLowerCase());
    });

    // 2️⃣ Case-insensitive check (e.g., dsa)
    const skillLower = 'dsa';
    const resLower = await request.get(`${BASE_URL}/api/companies/by-skill/${skillLower}`);
    expect(resLower.status()).toBe(200);
    const bodyLower = await resLower.json();
    expect(bodyLower.length).toBe(bodySkill.length); // same as previous
    bodyLower.forEach(company => {
      const skills = company.hiringCriteria?.skills?.map(s => s.toLowerCase()) || [];
      expect(skills).toContain(skillLower.toLowerCase());
    });

    // 3️⃣ Non-existing skill
    const nonSkill = 'NonExistingSkill';
    const resNon = await request.get(`${BASE_URL}/api/companies/by-skill/${nonSkill}`);
    expect(resNon.status()).toBe(200);
    const bodyNon = await resNon.json();
    expect(Array.isArray(bodyNon)).toBe(true);
    expect(bodyNon.length).toBe(0);
  });

   test('GET /api/companies/by-location/:location returns correct companies', async ({ request }) => {
    // 1️⃣ Existing location (e.g., Hyderabad)
    const location = 'Hyderabad';
    const resLoc = await request.get(`${BASE_URL}/api/companies/by-location/${location}`);
    expect(resLoc.status()).toBe(200);
    const bodyLoc = await resLoc.json();
    expect(Array.isArray(bodyLoc)).toBe(true);
    expect(bodyLoc.length).toBeGreaterThan(0);
    bodyLoc.forEach(company => {
      expect(company.location?.toLowerCase()).toBe(location.toLowerCase());
    });

    // 2️⃣ Case-insensitive check (e.g., hyderabad)
    const locationLower = 'hyderabad';
    const resLower = await request.get(`${BASE_URL}/api/companies/by-location/${locationLower}`);
    expect(resLower.status()).toBe(200);
    const bodyLower = await resLower.json();
    expect(bodyLower.length).toBe(bodyLoc.length); // same number as previous
    bodyLower.forEach(company => {
      expect(company.location?.toLowerCase()).toBe(locationLower.toLowerCase());
    });

    // 3️⃣ Non-existing location
    const nonLocation = 'NoSuchCity';
    const resNon = await request.get(`${BASE_URL}/api/companies/by-location/${nonLocation}`);
    expect(resNon.status()).toBe(200);
    const bodyNon = await resNon.json();
    expect(Array.isArray(bodyNon)).toBe(true);
    expect(bodyNon.length).toBe(0);
  });

   test('GET /api/companies/headcount-range returns correct companies', async ({ request }) => {
    // 1️⃣ Only min provided
    const min = 3000;
    const resMin = await request.get(`${BASE_URL}/api/companies/headcount-range?min=${min}`);
    expect(resMin.status()).toBe(200);
    const bodyMin = await resMin.json();
    expect(Array.isArray(bodyMin)).toBe(true);
    bodyMin.forEach(company => {
      expect(company.headcount).toBeGreaterThanOrEqual(min);
    });

    // 2️⃣ Both min and max provided
    const max = 8000;
    const resMinMax = await request.get(`${BASE_URL}/api/companies/headcount-range?min=${min}&max=${max}`);
    expect(resMinMax.status()).toBe(200);
    const bodyMinMax = await resMinMax.json();
    expect(Array.isArray(bodyMinMax)).toBe(true);
    bodyMinMax.forEach(company => {
      expect(company.headcount).toBeGreaterThanOrEqual(min);
      expect(company.headcount).toBeLessThanOrEqual(max);
    });

    // 3️⃣ Invalid input
    const resInvalid = await request.get(`${BASE_URL}/api/companies/headcount-range?min=abc`);
    // Expect either 400 or a default fallback response
    expect([200, 400]).toContain(resInvalid.status());
    const bodyInvalid = await resInvalid.json();
    expect(Array.isArray(bodyInvalid)).toBe(true);
  });



  test('GET /api/companies/benefit/:benefit returns companies correctly', async ({ request }) => {
    // 1️⃣ Full match (e.g., "Health Insurance")
    const resFull = await request.get(`${BASE_URL}/api/companies/benefit/Health Insurance`);
    expect(resFull.status()).toBe(200);
    const bodyFull = await resFull.json();
    expect(Array.isArray(bodyFull)).toBe(true);
    bodyFull.forEach(company => {
      const benefits = company.benefits.map(b => b.toLowerCase());
      expect(benefits.some(b => b.includes('health insurance'.toLowerCase()))).toBe(true);
    });

    // 2️⃣ Partial match (e.g., "Insurance")
    const resPartial = await request.get(`${BASE_URL}/api/companies/benefit/Insurance`);
    expect(resPartial.status()).toBe(200);
    const bodyPartial = await resPartial.json();
    expect(Array.isArray(bodyPartial)).toBe(true);
    bodyPartial.forEach(company => {
      const benefits = company.benefits.map(b => b.toLowerCase());
      expect(benefits.some(b => b.includes('insurance'.toLowerCase()))).toBe(true);
    });

    // 3️⃣ Case-insensitive check (e.g., "insurance")
    const resCase = await request.get(`${BASE_URL}/api/companies/benefit/insurance`);
    expect(resCase.status()).toBe(200);
    const bodyCase = await resCase.json();
    expect(Array.isArray(bodyCase)).toBe(true);
    bodyCase.forEach(company => {
      const benefits = company.benefits.map(b => b.toLowerCase());
      expect(benefits.some(b => b.includes('insurance'))).toBe(true);
    });

    // 4️⃣ Non-existing benefit
    const resNonExist = await request.get(`${BASE_URL}/api/companies/benefit/NoSuchBenefit`);
    expect(resNonExist.status()).toBe(200);
    const bodyNonExist = await resNonExist.json();
    expect(Array.isArray(bodyNonExist)).toBe(true);
    expect(bodyNonExist.length).toBe(0);
  });


});
