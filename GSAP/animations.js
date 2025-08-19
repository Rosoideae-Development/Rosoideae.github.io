
document.addEventListener('DOMContentLoaded', function() {
    
    initAnimations();
    
    
    initNavigation();
    

    initScrollEffects();
});

function initAnimations() {

    gsap.fromTo("header", 
        { 
            y: -20,
            opacity: 0.8
        },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            delay: 0.3, 
            ease: "power2.out" 
        }
    );

    gsap.from(".hero-content", {
        y: 100,
        opacity: 0,
        duration: 2.2,
        delay: 1.5,
        ease: "power3.out"
    });

    gsap.from(".hero-title", {
        scale: 0.8,
        opacity: 0,
        duration: 1.8,
        delay: 2.2,
        ease: "back.out(1.7)"
    });


    gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        delay: 3,
        ease: "power2.out"
    });

    gsap.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        delay: 3.3,
        ease: "power2.out"
    });


    gsap.from(".hero-buttons", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 3.6,
        ease: "power3.out"
    });


    gsap.from(".social-icon", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 4,
        stagger: 0.15,
        ease: "power3.out"
    });


    gsap.from(".rose-background", {
        x: -100,
        opacity: 0,
        duration: 4,
        delay: 1,
        ease: "power2.out"
    });


    gsap.from(".rose-petal", {
        x: -50,
        opacity: 0,
        scale: 0,
        duration: 2.5,
        delay: 2.2,
        stagger: 0.4,
        ease: "back.out(1.7)"
    });


    const logoFloat = gsap.timeline({repeat: -1, yoyo: true, ease: "power2.inOut"});
    logoFloat.to(".main-logo", {
        y: -15,
        duration: 3,
        ease: "power2.inOut"
    }).to(".main-logo", {
        y: 0,
        duration: 3,
        ease: "power2.inOut"
    });


    gsap.to(".main-logo", {
        rotation: 2,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function initNavigation() {

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                
                document.querySelectorAll('section[id]').forEach(section => {
                    gsap.to(section, {
                        opacity: 0,
                        visibility: 'hidden',
                        y: 50,
                        duration: 0.5,
                        ease: "power2.in"
                    });
                });
                
                
                gsap.to(targetSection, {
                    opacity: 1,
                    visibility: 'visible',
                    y: 0,
                    duration: 0.8,
                    delay: 0.3, 
                    ease: "power2.out",
                    onComplete: () => {
                        
                        animateContentElements(targetSection);
                    }
                });
                
                
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

function initScrollEffects() {
    const header = document.querySelector('header');
    
}


function animateContentElements(section) {
    if (section.id === 'about') {
        gsap.set('.feature', { opacity: 1, y: 0, scale: 1 });
    }
    if (section.id === 'teams') {
        gsap.set('.team-member', { opacity: 1, y: 0, scale: 1 });
    }
    if (section.id === 'matches') {
        gsap.set('.match-card', { opacity: 1, y: 0, scale: 1 });
    }
    if (section.id === 'contact') {
        gsap.set('.contact-item', { opacity: 1, y: 0, scale: 1 });
    }
}


document.addEventListener('DOMContentLoaded', function() {

    const navItems = document.querySelectorAll('nav a');
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });

    
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
        });
    });

   
    const watchLiveBtn = document.querySelector('.watch-live');
    if (watchLiveBtn) {
        watchLiveBtn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        watchLiveBtn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    }
});
