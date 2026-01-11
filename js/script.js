// Initialize AOS with proper mobile support
function initAOS() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: false,
        mirror: true,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        disable: function() {
            // Only disable on very small screens
            const maxWidth = 320;
            const isSmallScreen = window.innerWidth < maxWidth;
            return isSmallScreen;
        },
        startEvent: 'DOMContentLoaded'
    });
}

// Define variables
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const mainHeader = document.getElementById('mainHeader');

// Mobile Menu Functionality
if (mobileMenuBtn && navLinks) {
    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);
    
    // Toggle menu function
    function toggleMenu() {
        const isActive = navLinks.classList.contains('active');
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        backdrop.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update icon
        if (!isActive) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Menu button click
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Backdrop click to close
    backdrop.addEventListener('click', toggleMenu);
    
    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    // Header effect
    if (mainHeader) {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }
    
    // Vertical progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.height = `${scrollPercent}%`;
    }
    
    // Update active nav link
    updateActiveNavLink();
    
    // Animate skill bars
    animateSkillBars();
    
    // Parallax background
    updateParallax();
});

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}` || 
            (current === '' && item.getAttribute('href') === '#home')) {
            item.classList.add('active');
        }
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    skillProgress.forEach(bar => {
        const rect = bar.parentElement.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible && !bar.style.width) {
            const width = bar.getAttribute('data-width') + '%';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        }
    });
}

// Parallax effect
function updateParallax() {
    const bgLines = document.querySelectorAll('.bg-line');
    
    bgLines.forEach(line => {
        const speed = line.getAttribute('data-speed') || 0.5;
        const yPos = -(window.scrollY * speed);
        line.style.transform = `translateY(${yPos}px)`;
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    const backdrop = document.querySelector('.menu-backdrop');
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    if (backdrop) backdrop.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL
                history.pushState(null, null, href);
            }
        }
    });
});

// ===== FORM VALIDATION FUNCTIONS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.opacity = '0';
        setTimeout(() => {
            formMessage.style.opacity = '1';
            formMessage.style.display = 'none';
        }, 500);
    }, 5000);
}

// ===== CONTACT FORM WITH EMAILJS =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[name="user_name"]').value;
        const email = this.querySelector('input[name="user_email"]').value;
        const subject = this.querySelector('input[name="subject"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Get form message element and submit button
        const formMessage = document.getElementById('formMessage');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (formMessage && submitBtn) {
            // Disable submit button during sending
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Show sending message
            showMessage('Sending your message...', 'info');
            
            // Prepare template parameters that match your template
            const templateParams = {
                to_name: 'Shanmukha', // Your name
                from_name: name, // Sender's name
                name: name, // Also send name separately (same as from_name)
                email: email, // Sender's email
                phone: 'Not provided', // Since you don't have a phone field
                message: message, // The message content
                subject: subject // Optional: include subject if you want
            };
            
            // Debug log
            console.log('Sending template params:', templateParams);
            
            // Send email using EmailJS
            emailjs.send('service_njbn91g', 'template_97kew3b', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showMessage('Message sent successfully! I will get back to you soon.', 'success');
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    showMessage('Failed to send message. Please try again or contact directly via email.', 'error');
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        }
    });
}

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('input');
        input.value = '';
        input.placeholder = "Subscribed!";
        
        setTimeout(() => {
            input.placeholder = "Your Email";
        }, 3000);
    });
}

// ===== INTERSECTION OBSERVER FOR CONTACT SECTION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactSection = document.querySelector('.contact');
    const contactContainer = document.querySelector('.contact-content');
    
    if (contactSection && contactContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    contactContainer.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(contactSection);
    }
});

// Initialize everything on load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAOS();
    
    // Initialize EmailJS
    (function(){
        emailjs.init("JDP4bgHfxUiQPAo-D");
    })();
    
    // Animate skill bars on load
    animateSkillBars();
    
    // Initialize footer waves
    const waves = document.querySelectorAll('.wave');
    waves.forEach((wave, index) => {
        wave.style.animationDuration = `${25 + index * 5}s`;
    });
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Refresh on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            AOS.refresh();
        }, 250);
    });
});

// Manual refresh function
window.refreshAnimations = function() {
    AOS.refresh();
    animateSkillBars();
};


