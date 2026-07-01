const http = require('http');

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 7002,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      const payload = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    
    if (token) {
      options.headers['Cookie'] = `token=${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      let newCookie = null;
      if (res.headers['set-cookie']) {
        const match = res.headers['set-cookie'][0].match(/token=([^;]+)/);
        if (match) newCookie = match[1];
      }

      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, token: newCookie || token });
        } catch (e) {
          resolve({ status: res.statusCode, data, token: newCookie || token });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  const ts = Date.now();
  console.log('--- 1. Login as CFO ---');
  let res = await request('POST', '/rest/onboardings/login', {
    email: 'cfo@org.com',
    password: 'CFO#ORG@April2026'
  });
  console.log(res.status, res.data.success ? 'Success' : res.data);
  const cfoToken = res.token;
  if (!cfoToken) {
    console.log('Failed to login as CFO. Ensure seed is run.');
    return;
  }

  console.log('\n--- 2. Register Users ---');
  let rmRes = await request('POST', '/rest/onboardings/register', { name: 'RM User', email: `rm_${ts}@org.com`, password: 'pwd' });
  let apeRes = await request('POST', '/rest/onboardings/register', { name: 'APE User', email: `ape_${ts}@org.com`, password: 'pwd' });
  let empRes = await request('POST', '/rest/onboardings/register', { name: 'EMP User', email: `emp_${ts}@org.com`, password: 'pwd' });
  
  const rmId = rmRes.data.data.id;
  const apeId = apeRes.data.data.id;
  const empId = empRes.data.data.id;
  console.log('Users created:', rmId, apeId, empId);

  console.log('\n--- 3. Assign Roles ---');
  res = await request('POST', '/rest/roles/assign', { userId: rmId, role: 'RM' }, cfoToken);
  console.log('Assign RM:', res.status, res.data.success ? 'Success' : res.data);
  res = await request('POST', '/rest/roles/assign', { userId: apeId, role: 'APE' }, cfoToken);
  console.log('Assign APE:', res.status, res.data.success ? 'Success' : res.data);

  console.log('\n--- 4. Assign Employee to Manager ---');
  res = await request('POST', '/rest/employees/assign', { employeeId: empId, managerId: rmId }, cfoToken);
  console.log('Assign EMP to RM:', res.status, res.data.success ? 'Success' : res.data);

  console.log('\n--- 5. Login Users ---');
  let empLogin = await request('POST', '/rest/onboardings/login', { email: `emp_${ts}@org.com`, password: 'pwd' });
  let rmLogin = await request('POST', '/rest/onboardings/login', { email: `rm_${ts}@org.com`, password: 'pwd' });
  let apeLogin = await request('POST', '/rest/onboardings/login', { email: `ape_${ts}@org.com`, password: 'pwd' });
  const empToken = empLogin.token;
  const rmToken = rmLogin.token;
  const apeToken = apeLogin.token;

  console.log('\n--- 6. Create Reimbursement (EMP) ---');
  res = await request('POST', '/rest/reimbursements', { title: 'Travel', description: 'Flight', amount: 500 }, empToken);
  console.log('Create Reimbursement:', res.status, res.data.success || res.data.status === 'success' ? 'Success' : res.data);
  const reimbId = res.data?.data?.id;
  if (!reimbId) return console.log('Failed to create reimbursement');

  console.log('\n--- 7. Get Reimbursements (RM) ---');
  res = await request('GET', '/rest/reimbursements', null, rmToken);
  console.log('RM fetches:', res.status, res.data.data?.reimbursements?.length, 'found');

  console.log('\n--- 8. RM Approves ---');
  res = await request('PATCH', '/rest/reimbursements', { reimbursementId: reimbId, status: 'APPROVED' }, rmToken);
  console.log('RM Appproves:', res.status, res.data.status === 'success' ? 'Success' : res.data);

  console.log('\n--- 9. Get Reimbursements (APE) ---');
  res = await request('GET', '/rest/reimbursements', null, apeToken);
  console.log('APE fetches:', res.status, res.data.data?.reimbursements?.length, 'found');

  console.log('\n--- 10. APE Approves ---');
  res = await request('PATCH', '/rest/reimbursements', { reimbursementId: reimbId, status: 'APPROVED' }, apeToken);
  console.log('APE Appproves:', res.status, res.data.status === 'success' ? 'Success' : res.data);

  console.log('\n--- 11. Get Subordinate Reimbursements (RM) ---');
  res = await request('GET', `/rest/reimbursements/${empId}`, null, rmToken);
  console.log('RM fetches subordinate:', res.status, res.data.data?.reimbursements?.length, 'found');

  console.log('\n--- 12. Remove Employee Mapping (CFO) ---');
  res = await request('DELETE', '/rest/employees/assign', { employeeId: empId, managerId: rmId }, cfoToken);
  console.log('Remove EMP from RM:', res.status, res.data.success || res.data.status === 'success' ? 'Success' : res.data);

  console.log('\n--- Done ---');
}

runTests().catch(console.error);
