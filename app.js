let profilesData = [];
let currentFilter = 'all';
let searchTimeout;

// Typing animation
async function typeWriter() {
    const texts = ["OSINT DATABASE ACTIVE", "PROFILING SYSTEM ONLINE", "SECURE CONNECTION ESTABLISHED"];
    let textIndex = 0;
    const typingElement = document.getElementById('typing-text');
    
    while (true) {
        const text = texts[textIndex % texts.length];
        for (let i = 0; i <= text.length; i++) {
            typingElement.textContent = text.substring(0, i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        for (let i = text.length; i >= 0; i--) {
            typingElement.textContent = text.substring(0, i);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        textIndex++;
    }
}

// Load profiles from JSON
async function loadProfiles() {
    try {
        const response = await fetch('profiles.json');
        const data = await response.json();
        profilesData = data.profiles;
        
        // Update total profiles count
        document.getElementById('total-profiles').textContent = profilesData.length;
        
        displayProfiles(profilesData);
        setupSearch();
    } catch (error) {
        console.error('Error loading profiles:', error);
        document.getElementById('profiles-grid').innerHTML = '<div class="col-12 text-center"><i class="fas fa-exclamation-triangle"></i> Error loading profiles</div>';
    }
}

// Display profiles as cards
function displayProfiles(profiles, searchTerm = '') {
    const grid = document.getElementById('profiles-grid');
    const noResults = document.getElementById('noResults');
    
    if (profiles.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    grid.innerHTML = '';
    
    profiles.forEach(profile => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-12';
        
        // Highlight search term in name if present
        let displayName = profile.name;
        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayName = profile.name.replace(regex, '<span class="search-highlight">$1</span>');
        }
        
        col.innerHTML = `
            <div class="profile-card" onclick="navigateToDetail(${profile.id})">
                <div class="profile-img">
                    <img src="${profile.image}" alt="${profile.name}" onerror="this.src='https://via.placeholder.com/120x120?text=No+Image'">
                </div>
                <h3 class="profile-name">${displayName}</h3>
                <div class="profile-info"><i class="fas fa-calendar-alt"></i> Age: ${profile.age}</div>
                <div class="profile-info"><i class="fas fa-map-marker-alt"></i> ${profile.city}</div>
                <div class="profile-badge">
                    <i class="fas fa-id-card"></i> Active Intel Profile
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

// Search function
function searchProfiles() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const clearBtn = document.getElementById('clearSearch');
    
    // Show/hide clear button
    clearBtn.style.display = searchTerm ? 'block' : 'none';
    
    const startTime = performance.now();
    
    let filteredProfiles = [...profilesData];
    
    if (searchTerm) {
        filteredProfiles = profilesData.filter(profile => {
            switch(currentFilter) {
                case 'name':
                    return profile.name.toLowerCase().includes(searchTerm);
                case 'city':
                    return profile.city.toLowerCase().includes(searchTerm);
                case 'age':
                    return profile.age.toString().includes(searchTerm);
                case 'phone':
                    return profile.phone.toLowerCase().includes(searchTerm);
                case 'all':
                default:
                    return profile.name.toLowerCase().includes(searchTerm) ||
                           profile.city.toLowerCase().includes(searchTerm) ||
                           profile.age.toString().includes(searchTerm) ||
                           profile.phone.toLowerCase().includes(searchTerm) ||
                           (profile.cnic && profile.cnic.toLowerCase().includes(searchTerm));
            }
        });
    }
    
    const endTime = performance.now();
    const searchTime = (endTime - startTime).toFixed(0);
    
    // Update search stats
    const searchStats = document.getElementById('searchStats');
    const resultCount = document.getElementById('resultCount');
    const searchTimeSpan = document.getElementById('searchTime');
    
    if (searchTerm) {
        resultCount.textContent = filteredProfiles.length;
        searchTimeSpan.textContent = searchTime;
        searchStats.style.display = 'block';
    } else {
        searchStats.style.display = 'none';
    }
    
    displayProfiles(filteredProfiles, searchTerm);
}

// Setup search event listeners
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    // Debounced search
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchProfiles, 300);
    });
    
    // Clear search
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchProfiles();
        searchInput.focus();
    });
    
    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Update active chip
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Update current filter
            currentFilter = chip.getAttribute('data-filter');
            
            // Re-run search with new filter
            searchProfiles();
        });
    });
    
    // Voice search (optional feature)
    const voiceBtn = document.querySelector('.voice-search');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        voiceBtn.style.opacity = '1';
        voiceBtn.addEventListener('click', () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.start();
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                searchProfiles();
            };
        });
    } else {
        voiceBtn.style.opacity = '0.3';
        voiceBtn.style.cursor = 'not-allowed';
    }
}

// Reset search
function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
    currentFilter = 'all';
    searchProfiles();
}

// Navigate to detail page
function navigateToDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profiles-grid')) {
        loadProfiles();
        typeWriter();
    }
});