// Get profile ID from URL
function getProfileId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Load and display profile details
async function loadProfileDetail() {
    const profileId = getProfileId();
    if (!profileId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('profiles.json');
        const data = await response.json();
        const profile = data.profiles.find(p => p.id === profileId);
        
        if (!profile) {
            document.getElementById('profile-detail-container').innerHTML = '<div class="alert alert-danger">Profile not found</div>';
            return;
        }
        
        displayProfileDetail(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profile-detail-container').innerHTML = '<div class="alert alert-danger">Error loading profile data</div>';
    }
}

// Display profile details
function displayProfileDetail(profile) {
    const container = document.getElementById('profile-detail-container');
    container.innerHTML = `
        <div class="detail-card">
            <div class="row g-0">
                <div class="col-md-4 detail-img">
                    <img src="${profile.image}" alt="${profile.name}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
                    <div class="mt-3">
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="info-grid">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-user"></i> FULL NAME</div>
                                    <div class="info-value">${profile.name}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-user-friends"></i> FATHER NAME</div>
                                    <div class="info-value">${profile.fatherName}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-id-card"></i> CNIC</div>
                                    <div class="info-value">${profile.cnic}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-phone"></i> PHONE NUMBER</div>
                                    <div class="info-value">${profile.phone}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-city"></i> CITY</div>
                                    <div class="info-value">${profile.city}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-mail-bulk"></i> POSTAL CODE</div>
                                    <div class="info-value">${profile.postalCode}</div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-address-card"></i> ADDRESS</div>
                                    <div class="info-value">${profile.address}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-birthday-cake"></i> AGE</div>
                                    <div class="info-value">${profile.dateofbirth}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-item">
                                    <div class="info-label"><i class="fas fa-birthday-cake"></i> AGE</div>
                                    <div class="info-value">${profile.age} years</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="brief-section">
                <h4 class="brief-title"><i class="fas fa-file-alt"></i> Intelligence Brief</h4>
                <p class="brief-text">${profile.brief}</p>
            </div>
        </div>
    `;
}

// Go back function
function goBack() {
    window.location.href = 'index.html';
}

// Initialize detail page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profile-detail-container')) {
        loadProfileDetail();
    }
});