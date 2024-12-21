function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}

function searchHotelPrices() {
    const hotelId = document.getElementById('hotel-id').value;
    if (!hotelId) {
        showError('Please enter a Hotel ID');
        return;
    }

    showLoader();
    fetch(`/api/hotel-prices?hotel_id=${hotelId}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            if (data.error) {
                showError(data.error);
            } else {
                displayHotelPrices(data);
            }
        })
        .catch(error => {
            hideLoader();
            showError('An error occurred while fetching data');
        });
}

function displayHotelPrices(data) {
    const resultsDiv = document.getElementById('results');
    let html = '<h2>Hotel Prices</h2>';
    html += '<table><tr><th>Booking Site</th><th>Price</th><th>Hotel Name</th></tr>';
    
    for (let site in data.prices) {
        html += `<tr>
            <td>${site}</td>
            <td>${data.prices[site]}</td>
            <td>${data.hotel_name}</td>
        </tr>`;
    }
    
    html += '</table>';
    resultsDiv.innerHTML = html;
    document.querySelector('.reset-button').style.display = 'block';
}

function resetSearch() {
    document.getElementById('hotel-id').value = '';
    document.getElementById('results').innerHTML = '';
    document.querySelector('.reset-button').style.display = 'none';
}

function searchMapping() {
    const name = document.getElementById('mapping-name').value;
    if (!name) {
        showError('Please enter a Hotel or City name');
        return;
    }

    showLoader();
    fetch(`/api/mapping?name=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            if (data.error) {
                showError(data.error);
            } else {
                displayMapping(data);
            }
        })
        .catch(error => {
            hideLoader();
            showError('An error occurred while fetching data');
        });
}

function displayMapping(data) {
    const resultsDiv = document.getElementById('mapping-results');
    let html = '<h2>Mapping Results</h2>';
    html += '<table><tr><th>ID</th><th>Name</th></tr>';
    
    data.forEach(item => {
        html += `<tr><td>${item.id}</td><td>${item.name}</td></tr>`;
    });
    
    html += '</table>';
    resultsDiv.innerHTML = html;
}

function refreshAccountInfo() {
    showLoader();
    fetch('/api/account')
        .then(response => response.json())
        .then(data => {
            hideLoader();
            if (data.error) {
                showError(data.error);
            } else {
                displayAccountInfo(data);
            }
        })
        .catch(error => {
            hideLoader();
            showError('An error occurred while fetching account information');
        });
}

function displayAccountInfo(data) {
    const infoDiv = document.getElementById('account-info');
    const usedRequests = data.total_requests - data.remaining_requests;
    const usagePercentage = (usedRequests / data.total_requests) * 100;

    let html = `
        <h2>Account Information</h2>
        <p>Total Requests Allowed: ${data.total_requests}</p>
        <p>Requests Used: ${usedRequests}</p>
        <p>Remaining Requests: <strong>${data.remaining_requests}</strong></p>
        <div class="progress-bar">
            <div class="progress" style="width: ${usagePercentage}%"></div>
        </div>
        <p>API Usage: ${usagePercentage.toFixed(2)}%</p>
    `;

    infoDiv.innerHTML = html;
}

// Load account info on page load if on the account page
if (window.location.pathname === '/account') {
    refreshAccountInfo();
}

