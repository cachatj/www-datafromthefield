document.getElementById('calendar-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const babyName = document.getElementById('baby-name').value;
    const birthDate = document.getElementById('birth-date').value;
    const eventFormat = document.getElementById('event-format').value || "{weeks} weeks old - {baby_name}";
    
    // Show loading indicator
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('result').classList.add('d-none');
    
    try {
        const response = await fetch('https://us-central1-gcp-generative-ai.cloudfunctions.net/baby-milestone-calendar-generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ babyName, birthDate, eventFormat }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = data.downloadUrl;
            document.getElementById('result').classList.remove('d-none');
        } else {
            throw new Error('Calendar generation failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the calendar: ' + error.message);
    } finally {
        // Hide loading indicator
        document.getElementById('loading').classList.add('d-none');
    }
});
