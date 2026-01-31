const http = require('http');

const data = JSON.stringify({
    email: 'charankarthikeyan2003@gmail.com'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/forgot-password',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🧪 Testing Forgot Password API...\n');
console.log('📧 Sending reset code to: charankarthikeyan2003@gmail.com\n');

const req = http.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('📬 Response Status:', res.statusCode);
        console.log('📄 Response Body:');

        try {
            const response = JSON.parse(body);
            console.log(JSON.stringify(response, null, 2));

            if (response.success) {
                console.log('\n✅ SUCCESS! Reset code generated');
                if (response.developmentCode) {
                    console.log('🔑 Dev Code (email send failed):', response.developmentCode);
                    console.log('⚠️  Email was NOT sent - check SMTP configuration');
                } else {
                    console.log('📧 Email sent successfully!');
                    console.log('📬 Check inbox: charankarthikeyan2003@gmail.com');
                }
            } else {
                console.log('\n❌ FAILED:', response.message);
            }
        } catch (e) {
            console.log(body);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Request failed:', e.message);
});

req.write(data);
req.end();
