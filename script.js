document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('main-video');
    const loadingOverlay = document.getElementById('loading-overlay');
    const funnyMessage = document.getElementById('funny-message');
    const videoUpload = document.getElementById('video-upload');
    const videoUrlInput = document.getElementById('video-url');
    const loadUrlBtn = document.getElementById('load-url-btn');

    let hasPlayedEffect = false;
    let isLocked = false;
    
    // --- Secret Editor Mode Logic ---
    let unlocks = false;
    let secretBuf = '';
    
    function unlockAdmin() {
        if (unlocks) return;
        unlocks = true;
        document.getElementById('admin-controls').style.display = 'flex';
        // uncover slot uploads
        document.querySelectorAll('.slot-upload').forEach(el => {
            el.classList.remove('hidden');
        });
        console.log('Editor mode unlocked.');
    }

    // Check URL 
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        unlockAdmin();
    }
    
    // Check key presses for "admin"
    document.addEventListener('keydown', (e) => {
        if (e.key.length === 1) {
            secretBuf += e.key.toLowerCase();
            if (secretBuf.length > 5) secretBuf = secretBuf.slice(-5);
            if (secretBuf === 'admin') {
                unlockAdmin();
                alert('Secret Editor Features Unlocked! You can now load custom videos.');
            }
        }
    });

    // Handle play intercept for loading effect
    video.addEventListener('play', (e) => {
        if (!hasPlayedEffect && !isLocked) {
            video.pause();
            isLocked = true;
            
            // Show loading bar
            loadingOverlay.classList.remove('hidden');
            
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                funnyMessage.classList.remove('hidden');
                
                // Keep the funny message up for a moment
                setTimeout(() => {
                    funnyMessage.classList.add('hidden');
                    hasPlayedEffect = true;
                    isLocked = false;
                    video.play();
                }, 1500);
                
            }, 2000); // Fake analysis takes 2 seconds
        }
    });

    // Handle dragged/uploaded MAIN video
    videoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            video.src = fileURL;
            hasPlayedEffect = false; // Reset trick for new video
            video.load();
        }
    });

    // Handle URL load for MAIN video
    loadUrlBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            video.src = url;
            hasPlayedEffect = false;
            video.load();
            videoUrlInput.value = '';
            alert('Loading totally secure un-hacked video...');
        } else {
            alert('Please enter a totally legitimate URL first!');
        }
    });

    // Drag and drop onto MAIN video container
    const videoContainer = document.getElementById('video-container');
    
    videoContainer.addEventListener('dragover', (e) => {
        if (!unlocks) return;
        e.preventDefault();
        videoContainer.style.border = "8px dashed #ff00ff";
    });

    videoContainer.addEventListener('dragleave', (e) => {
        if (!unlocks) return;
        e.preventDefault();
        videoContainer.style.border = "8px dotted #0000ff";
    });

    videoContainer.addEventListener('drop', (e) => {
        if (!unlocks) return;
        e.preventDefault();
        videoContainer.style.border = "8px dotted #0000ff";
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                const fileURL = URL.createObjectURL(file);
                video.src = fileURL;
                hasPlayedEffect = false;
                video.load();
            } else {
                alert("That doesn't look like a video to me!");
            }
        }
    });

    // --- SIDEBAR SLOTS LOGIC ---
    const slots = document.querySelectorAll('.sidebar-slot');
    slots.forEach(slot => {
        const upload = slot.querySelector('.slot-upload');
        const vid = slot.querySelector('.slot-video');
        const placeholder = slot.querySelector('.slot-placeholder');

        upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                vid.src = url;
                placeholder.classList.add('hidden');
                vid.classList.remove('hidden');
            }
        });

        // Add drag & drop to sidebar slots when unlocked
        slot.addEventListener('dragover', (e) => {
            if (!unlocks) return;
            e.preventDefault();
            slot.style.borderColor = "yellow";
        });
        slot.addEventListener('dragleave', (e) => {
            if (!unlocks) return;
            e.preventDefault();
            slot.style.borderColor = "#ff0000";
        });
        slot.addEventListener('drop', (e) => {
            if (!unlocks) return;
            e.preventDefault();
            slot.style.borderColor = "#ff0000";
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('video/')) {
                    const url = URL.createObjectURL(file);
                    vid.src = url;
                    placeholder.classList.add('hidden');
                    vid.classList.remove('hidden');
                }
            }
        });
    });
});
