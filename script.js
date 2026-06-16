/* ═══════════════════════════════════════════════════════════════
   IDP — Intelligent Digital Products · Interaction Engine
   Premium AI Product Studio · v1.0.0
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initIntroSequence();
    initCursorTrailer();
    initMouseSpotlight();
    initMagneticButtons();
    initRevealObserver();
    initNavbarScroll();
    initMobileMenu();
    initLiveDashboard();
    initChatSimulator();
    initSmeCalculator();
    initContactForm();
    initB2bStepper();
    initStoryScroll();
    initCelestialParticles();
});

/* ───────────────────────────────────────────────────────────────
   1. INTRO SEQUENCE
   ─────────────────────────────────────────────────────────────── */
function initIntroSequence() {
    const overlay = document.getElementById('intro-overlay');
    
    function adjustTypewriterWidth() {
        const typewriterText = document.querySelector('.typewriter-text');
        if (typewriterText) {
            const charCount = typewriterText.textContent.trim().length;
            typewriterText.style.setProperty('--chars', charCount);
            
            typewriterText.style.setProperty('width', 'auto', 'important');
            typewriterText.style.setProperty('display', 'inline-block', 'important');
            const exactWidth = typewriterText.scrollWidth;
            typewriterText.style.removeProperty('width');
            typewriterText.style.removeProperty('display');
            typewriterText.style.setProperty('--width-px', `${exactWidth}px`);
        }
    }

    adjustTypewriterWidth();
    window.addEventListener('load', adjustTypewriterWidth);
    window.addEventListener('resize', adjustTypewriterWidth);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(adjustTypewriterWidth);
    }

    if (!overlay) return;

    // Skip intro if user has visited the site before
    if (localStorage.getItem('idp_intro_seen') === 'true') {
        document.documentElement.classList.add('no-intro');
        overlay.style.display = 'none';
        triggerHeroReveal();
        return;
    }

    setTimeout(() => {
        overlay.classList.add('done');
    }, 2500);

    setTimeout(() => {
        overlay.style.display = 'none';
        triggerHeroReveal();
        localStorage.setItem('idp_intro_seen', 'true');
    }, 3200);
}

function triggerHeroReveal() {
    const heroSection = document.querySelector('.section.hero, #hero, [data-section="hero"]');
    if (heroSection) {
        heroSection.classList.add('in-view');
        const heroReveals = heroSection.querySelectorAll('[data-reveal]');
        heroReveals.forEach((el) => {
            const delay = el.getAttribute('data-reveal-delay');
            if (delay) el.style.transitionDelay = delay + 'ms';
            el.classList.add('revealed');
        });
    }
}

/* ───────────────────────────────────────────────────────────────
   2. CURSOR TRAILER
   ─────────────────────────────────────────────────────────────── */
function initCursorTrailer() {
    const trailer = document.getElementById('cursor-trailer');
    if (!trailer) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        trailer.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animateTrailer() {
        currentX = lerp(currentX, mouseX, 0.15);
        currentY = lerp(currentY, mouseY, 0.15);
        trailer.style.transform = `translate(${currentX - 6}px, ${currentY - 6}px)`;
        rafId = requestAnimationFrame(animateTrailer);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(animateTrailer);
    });

    const interactiveSelector = '.magnetic-btn, a, button';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            trailer.classList.add('expanded');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            trailer.classList.remove('expanded');
        }
    });

    rafId = requestAnimationFrame(animateTrailer);
}

/* ───────────────────────────────────────────────────────────────
   3. MOUSE SPOTLIGHT + GLASS-CARD 3D TILT
   ─────────────────────────────────────────────────────────────── */
function initMouseSpotlight() {
    const spotlight = document.getElementById('bg-spotlight');
    const cards = document.querySelectorAll('.glass-card');

    document.addEventListener('mousemove', (e) => {
        if (spotlight) {
            spotlight.style.setProperty('--x', e.clientX + 'px');
            spotlight.style.setProperty('--y', e.clientY + 'px');
            spotlight.style.opacity = '1';
        }
    });

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            card.style.setProperty('--mx', localX + 'px');
            card.style.setProperty('--my', localY + 'px');

            const tiltX = ((localY - centerY) / centerY) * -5;
            const tiltY = ((localX - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '50%');
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });
}

/* ───────────────────────────────────────────────────────────────
   4. MAGNETIC BUTTONS
   ─────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (e.clientX - centerX) * 0.25;
            const dy = (e.clientY - centerY) * 0.25;
            const maxOffset = 8;
            const clampedDx = Math.max(-maxOffset, Math.min(maxOffset, dx));
            const clampedDy = Math.max(-maxOffset, Math.min(maxOffset, dy));
            btn.style.transform = `translate(${clampedDx}px, ${clampedDy}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            btn.style.transform = 'translate(0, 0)';
            setTimeout(() => {
                btn.style.transition = '';
            }, 400);
        });
    });
}

/* ───────────────────────────────────────────────────────────────
   5. REVEAL OBSERVER (Scroll-triggered animations)
   ─────────────────────────────────────────────────────────────── */
function initRevealObserver() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-reveal-delay');
                    if (delay) {
                        el.style.transitionDelay = delay + 'ms';
                    }
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
}

/* ───────────────────────────────────────────────────────────────
   6. NAVBAR SCROLL (Compact on scroll)
   ─────────────────────────────────────────────────────────────── */
function initNavbarScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const scrollWrapper = document.getElementById('story-scroll-wrapper');

    function handleScroll() {
        const isSnapScroll = window.innerHeight >= 480;
        const scrollTop = isSnapScroll && scrollWrapper 
            ? scrollWrapper.scrollTop 
            : (window.scrollY || document.documentElement.scrollTop);

        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (scrollWrapper) {
        scrollWrapper.addEventListener('scroll', handleScroll, { passive: true });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial trigger
    handleScroll();
}

/* ───────────────────────────────────────────────────────────────
   7. MOBILE MENU
   ─────────────────────────────────────────────────────────────── */
function initMobileMenu() {
    const btn = document.getElementById('btn-mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if (!btn || !navLinks) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a, .nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !btn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

/* ───────────────────────────────────────────────────────────────
   8. LIVE DASHBOARD
   ─────────────────────────────────────────────────────────────── */
function initLiveDashboard() {
    const statLatency = document.getElementById('stat-latency');
    const dashLog = document.querySelector('.dash-log');
    if (!statLatency || !dashLog) return;

    const logMessages = [
        'Ingestion agent pool checked standby nodes.',
        'VPC boundary confirmed strict GDPR isolation.',
        'Vertex AI endpoint health: 100% stable.',
        'BOLX marketplace inventory updated.',
        'Vector search embeddings index query processed.',
        'LangGraph active node transitioned successfully.',
    ];

    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    function updateDashboard() {
        const latency = Math.floor(Math.random() * (149 - 128 + 1)) + 128;
        statLatency.textContent = latency + 'ms';

        const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        const row = document.createElement('div');
        row.className = 'log-row active-log';
        row.innerHTML = `<span class="log-time">${getTimestamp()}</span> <span class="log-msg">${msg}</span>`;

        const prevActive = dashLog.querySelector('.active-log');
        if (prevActive) prevActive.classList.remove('active-log');

        dashLog.appendChild(row);

        const rows = dashLog.querySelectorAll('.log-row');
        if (rows.length > 4) {
            rows[0].remove();
        }
    }

    updateDashboard();
    setInterval(updateDashboard, 3000);
}

/* ───────────────────────────────────────────────────────────────
   9. CHAT SIMULATOR
   ─────────────────────────────────────────────────────────────── */
function initChatSimulator() {
    const messagesContainer = document.getElementById('chat-messages-container');
    const suggestions = document.getElementById('chat-suggestions');
    const chatInput = document.getElementById('input-chat-text');
    const sendBtn = document.getElementById('btn-chat-send');
    if (!messagesContainer || !suggestions) return;

    /* ── Mock data ─────────────────────────────────────────── */
    const mockResponses = {
        machinery: {
            intro: 'BOLX matched **14 industrial listings** across OLX, Amazon.es, and national retail and industrial catalogs:',
            listings: [
                {
                    portal: 'OLX',
                    portalClass: 'olx',
                    title: 'Industrial CNC Milling Machine - 3-Axis',
                    price: '€4,200',
                    desc: 'Location: Porto. Commercial grade, verified seller. Ready for workshop deployment.',
                    rating: '★★★★★ (Optimal Regional Match)',
                },
                {
                    portal: 'AMAZON',
                    portalClass: 'amazon',
                    title: 'Precision CNC Router Kit 6040',
                    price: '€1,850',
                    desc: 'Shipped from Amazon Spain. High precision spindle, USB controller setup.',
                    rating: '★★★★☆ (Retail Benchmark)',
                },
            ],
            outro: 'We are monitoring additional channels. Would you like to set an automated price threshold alert?',
        },
    };

    /* ── Helpers ────────────────────────────────────────────── */
    function parseBold(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]/g, '<span class="accent-text">$1</span>');
    }

    function scrollToBottom() {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth',
        });
    }

    function appendMessage(text, direction) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${direction}`;
        msg.innerHTML = `<div class="msg-bubble">${parseBold(text)}</div>`;
        messagesContainer.appendChild(msg);
        scrollToBottom();
        return msg;
    }

    let loaderCounter = 0;
    function appendLoader() {
        const id = 'chat-loader-' + ++loaderCounter;
        const msg = document.createElement('div');
        msg.className = 'chat-message incoming system-load';
        msg.id = id;
        msg.innerHTML = `
            <div class="msg-bubble loader-bubble">
                <div class="loader-dots">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
                <span class="loader-text">Searching OLX, Amazon.es, and national industrial catalogs in parallel...</span>
            </div>`;
        messagesContainer.appendChild(msg);
        scrollToBottom();
        return id;
    }

    function removeLoader(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function appendListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'chat-message incoming';
        card.innerHTML = `
            <div class="msg-bubble listing-card">
                <div class="listing-header">
                    <span class="portal-badge ${listing.portalClass}">${listing.portal}</span>
                    <span class="listing-price">${listing.price}</span>
                </div>
                <h4 class="listing-title">${listing.title}</h4>
                <p class="listing-desc">${parseBold(listing.desc)}</p>
                <div class="listing-rating">
                    <i data-lucide="sparkles" class="icon-sparkle"></i>
                    <span>${listing.rating}</span>
                </div>
            </div>`;
        messagesContainer.appendChild(card);
        scrollToBottom();
        try { lucide.createIcons(); } catch (_) { /* noop */ }
    }

    function setInputsEnabled(enabled) {
        const suggestionBtns = suggestions.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach((b) => {
            b.disabled = !enabled;
            b.style.pointerEvents = enabled ? '' : 'none';
            b.style.opacity = enabled ? '' : '0.4';
        });
        if (chatInput) chatInput.disabled = !enabled;
        if (sendBtn) sendBtn.disabled = !enabled;
    }

    function getFallbackResponse(query) {
        const count = Math.floor(Math.random() * 100) + 30;
        return {
            intro: `BOLX matched **${count} listings** across OLX.pt, Amazon.es, and others for "${query}". Filtering and organizing price metrics...`,
            listings: [
                {
                    portal: 'OLX',
                    portalClass: 'olx',
                    title: `${query.charAt(0).toUpperCase() + query.slice(1)} — Regional Match`,
                    price: '€' + (Math.floor(Math.random() * 1000) + 100),
                    desc: `Matched entry for **"${query}"** on regional commercial nodes.`,
                    rating: '★★★★☆ (Optimal regional value)',
                },
                {
                    portal: 'AMAZON',
                    portalClass: 'amazon',
                    title: `${query.charAt(0).toUpperCase() + query.slice(1)} — Global Ingest`,
                    price: '€' + (Math.floor(Math.random() * 1200) + 120),
                    desc: `Amazon.es retail node ingestion. Direct delivery available.`,
                    rating: '★★★★☆ (Retail Baseline)',
                },
            ],
            outro: `We are monitoring additional channels for "${query}". Would you like to refine the procurement parameters?`,
        };
    }

    /* ── Main flow ─────────────────────────────────────────── */
    function handleQuery(queryText) {
        const raw = queryText.trim().toLowerCase();
        if (!raw) return;

        setInputsEnabled(false);
        appendMessage(queryText, 'outgoing');

        const key = Object.keys(mockResponses).find((k) => raw.includes(k));
        const response = key ? mockResponses[key] : getFallbackResponse(raw);

        let loaderId;
        setTimeout(() => {
            loaderId = appendLoader();
        }, 600);

        setTimeout(() => {
            removeLoader(loaderId);
            appendMessage(response.intro, 'incoming');

            let listingDelay = 600;
            response.listings.forEach((listing, i) => {
                setTimeout(() => {
                    appendListingCard(listing);
                }, listingDelay + i * 500);
            });

            const outroDelay = listingDelay + response.listings.length * 500 + 800;
            setTimeout(() => {
                appendMessage(response.outro, 'incoming');
                setInputsEnabled(true);
                if (chatInput) {
                    chatInput.value = '';
                    updateSendButtonState();
                }
            }, outroDelay);
        }, 2800);
    }

    /* ── Event bindings ────────────────────────────────────── */
    suggestions.querySelectorAll('.suggestion-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const query = btn.textContent.trim();
            handleQuery(query);
        });
    });

    function updateSendButtonState() {
        if (!sendBtn || !chatInput) return;
        const hasValue = chatInput.value.trim().length > 0;
        sendBtn.disabled = !hasValue;
        sendBtn.classList.toggle('active', hasValue);
    }

    if (chatInput) {
        chatInput.addEventListener('input', updateSendButtonState);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                e.preventDefault();
                handleQuery(chatInput.value.trim());
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (!chatInput || sendBtn.disabled) return;
            handleQuery(chatInput.value.trim());
        });
    }
}

/* ───────────────────────────────────────────────────────────────
   10. SME CALCULATOR (Animated counters)
   ─────────────────────────────────────────────────────────────── */
function initSmeCalculator() {
    const rangeStaff = document.getElementById('range-staff');
    const rangeHours = document.getElementById('range-hours');
    const rangeWage = document.getElementById('range-wage');
    const displayStaff = document.getElementById('display-staff');
    const displayHours = document.getElementById('display-hours');
    const displayWage = document.getElementById('display-wage');
    const resultSavings = document.getElementById('result-savings');
    const resultHours = document.getElementById('result-hours');

    if (!rangeStaff || !rangeHours || !rangeWage) return;

    const automationRate = 0.65;
    let currentDisplaySavings = 0;
    let currentDisplayHours = 0;
    let targetSavings = 0;
    let targetHours = 0;
    let animFrameId = null;

    function formatNumber(n) {
        return n.toLocaleString('en-US');
    }

    function animateCounters() {
        let settled = true;

        if (Math.abs(currentDisplaySavings - targetSavings) > 1) {
            currentDisplaySavings += (targetSavings - currentDisplaySavings) * 0.12;
            settled = false;
        } else {
            currentDisplaySavings = targetSavings;
        }

        if (Math.abs(currentDisplayHours - targetHours) > 1) {
            currentDisplayHours += (targetHours - currentDisplayHours) * 0.12;
            settled = false;
        } else {
            currentDisplayHours = targetHours;
        }

        if (resultSavings) {
            resultSavings.textContent = '€' + formatNumber(Math.round(currentDisplaySavings));
        }
        if (resultHours) {
            resultHours.textContent = formatNumber(Math.round(currentDisplayHours));
        }

        if (!settled) {
            animFrameId = requestAnimationFrame(animateCounters);
        } else {
            animFrameId = null;
        }
    }

    function calculate() {
        const staff = parseFloat(rangeStaff.value) || 0;
        const hours = parseFloat(rangeHours.value) || 0;
        const wage = parseFloat(rangeWage.value) || 0;

        if (displayStaff) displayStaff.textContent = staff;
        if (displayHours) displayHours.textContent = hours + 'h';
        if (displayWage) displayWage.textContent = '€' + wage;

        const totalHoursSavedWeekly = staff * hours * automationRate;
        const annualHoursSaved = Math.round(totalHoursSavedWeekly * 52);
        const annualSavings = Math.round(annualHoursSaved * wage);

        targetHours = annualHoursSaved;
        targetSavings = annualSavings;

        if (!animFrameId) {
            animFrameId = requestAnimationFrame(animateCounters);
        }
    }

    rangeStaff.addEventListener('input', calculate);
    rangeHours.addEventListener('input', calculate);
    rangeWage.addEventListener('input', calculate);

    calculate();
}

/* ───────────────────────────────────────────────────────────────
   11. CONTACT FORM
   ─────────────────────────────────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('form-ai-audit');
    const formHolder = document.getElementById('card-contact-form-holder');
    const successBox = document.getElementById('form-success-box');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"], .magnetic-btn[type="submit"], input[type="submit"]') || form.querySelector('button');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        
        if (submitBtn && btnText) {
            submitBtn.disabled = true;
            btnText.textContent = 'Analyzing manual SME workflows...';
        }

        const formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.status === 200) {
                if (formHolder) {
                    const h3 = formHolder.querySelector('h3');
                    if (h3) h3.style.display = 'none';
                    form.style.display = 'none';
                } else {
                    form.style.display = 'none';
                }
                if (successBox) {
                    successBox.style.display = 'block';
                    try { lucide.createIcons(); } catch (_) { /* noop */ }
                }
            } else {
                alert(result.message || 'Something went wrong. Please try again.');
                if (submitBtn && btnText) {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Submit Application';
                }
            }
        })
        .catch(() => {
            alert('Unable to submit form. Please check your internet connection and try again.');
            if (submitBtn && btnText) {
                submitBtn.disabled = false;
                btnText.textContent = 'Submit Application';
            }
        });
    });
}

/* ───────────────────────────────────────────────────────────────
   12. B2B STEPPER
   ─────────────────────────────────────────────────────────────── */
function initB2bStepper() {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
    ].filter(Boolean);
    if (steps.length !== 3) return;

    let currentIndex = 1; // start at step 2

    function activateStep(index) {
        steps.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
    }

    activateStep(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % 3;
        activateStep(currentIndex);
    }, 4000);
}

/* ───────────────────────────────────────────────────────────────
   13. STORY SCROLL (Parallax + Word-Reveal + Side-Nav)
   ─────────────────────────────────────────────────────────────── */
function initStoryScroll() {
    const wrapper = document.getElementById('story-scroll-wrapper');
    const progressBar = document.getElementById('scroll-progress-bar');
    const sideDots = document.querySelectorAll('.side-nav .side-nav-dot');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const sections = document.querySelectorAll('.story-container .section');
    if (!wrapper || !sections.length) return;

    let introFinished = localStorage.getItem('idp_intro_seen') === 'true';

    // Automatically reveal the header once the cinematic intro finishes
    if (!introFinished) {
        setTimeout(() => {
            introFinished = true;
            onScroll();
        }, 11000);
    }

    /* ── Auto text-split for word-reveal ──────────────────── */
    sections.forEach((section) => {
        const titles = section.querySelectorAll('.section-title');
        titles.forEach((title) => {
            if (title.dataset.wordSplit) return;
            const text = title.textContent.trim();
            const words = text.split(/\s+/);
            title.innerHTML = words
                .map(
                    (w, i) =>
                        `<span class="word-reveal" style="transition-delay:${i * 80}ms">${w}</span>`
                )
                .join(' ');
            title.dataset.wordSplit = 'true';
        });
    });

    /* ── Hero starts in-view ─────────────────────────────── */
    const heroSection = sections[0];
    if (heroSection) heroSection.classList.add('in-view');

    /* ── Parallax targets ─────────────────────────────────── */
    const parallaxSelectors = [
        '.dashboard-card',
        '.chatbot-card',
        '.pipeline-card',
        '.calc-results',
    ];

    function applyParallax(scrollTop, isSnapScroll) {
        if (!isSnapScroll) {
            parallaxSelectors.forEach((sel) => {
                const elements = document.querySelectorAll(sel);
                elements.forEach((el) => {
                    el.style.transform = '';
                });
            });
            return;
        }

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const offset = scrollTop - sectionTop;
            parallaxSelectors.forEach((sel) => {
                const el = section.querySelector(sel);
                if (el) {
                    const translateY = offset * 0.06;
                    el.style.transform = `translateY(${translateY}px)`;
                }
            });
        });
    }

    /* ── On scroll ────────────────────────────────────────── */
    function onScroll() {
        const isSnapScroll = window.innerHeight >= 480;
        const scrollTop = isSnapScroll ? wrapper.scrollTop : (window.scrollY || document.documentElement.scrollTop);
        const scrollHeight = isSnapScroll 
            ? (wrapper.scrollHeight - wrapper.clientHeight) 
            : (document.documentElement.scrollHeight - window.innerHeight);
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        /* Find current section */
        let closestIdx = 0;
        let minDiff = Infinity;
        const clientHeight = isSnapScroll ? wrapper.clientHeight : window.innerHeight;

        sections.forEach((section, idx) => {
            const sectionTop = section.offsetTop;
            const diff = Math.abs(sectionTop - scrollTop - clientHeight * 0.35);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        /* Toggle in-view */
        sections.forEach((section, idx) => {
            section.classList.toggle('in-view', idx === closestIdx);
        });

        /* Side-nav dots */
        sideDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === closestIdx);
        });

        /* Hide side-nav dots only and exclusively when footer (idx 8) is in view */
        const sideNav = document.getElementById('side-nav-dots');
        if (sideNav) {
            sideNav.classList.toggle('hidden', closestIdx === 8);
        }

        /* Hide navbar on the first scroll point (closestIdx === 0) if the intro hasn't finished */
        const header = document.getElementById('main-header');
        if (header) {
            header.classList.toggle('hidden-navbar', closestIdx === 0 && !introFinished);
        }

        /* Nav links (offset by 1 due to the new landing section at index 0) */
        navLinks.forEach((link, idx) => {
            link.classList.toggle('active', idx === closestIdx - 1);
        });

        /* Parallax */
        applyParallax(scrollTop, isSnapScroll);
    }

    wrapper.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* ── Side dot clicks ─────────────────────────────────── */
    sideDots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            if (sections[idx]) {
                const isSnapScroll = window.innerHeight >= 480;
                if (isSnapScroll) {
                    wrapper.scrollTo({
                        top: sections[idx].offsetTop,
                        behavior: 'smooth',
                    });
                } else {
                    window.scrollTo({
                        top: sections[idx].offsetTop - 80,
                        behavior: 'smooth',
                    });
                }
            }
        });
    });

    /* ── Nav link clicks ─────────────────────────────────── */
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const isSnapScroll = window.innerHeight >= 480;
                    if (isSnapScroll) {
                        wrapper.scrollTo({
                            top: target.offsetTop,
                            behavior: 'smooth',
                        });
                    } else {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth',
                        });
                    }
                }
            }
        });
    });

    /* Initial trigger */
    onScroll();
}

/* ───────────────────────────────────────────────────────────────
   14. CELESTIAL PARTICLES
   ─────────────────────────────────────────────────────────────── */
function initCelestialParticles() {
    const canvas = document.getElementById('celestial-particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let scrollSpeedFactor = 1.0;
    let scrollSpeedTarget = 1.0;
    let scrollTimeout = null;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 45 : 120;
    const CONNECTION_DIST = isMobile ? 90 : 160;
    const REPULSION_RADIUS = 220;

    function resize() {
        const parent = canvas.parentElement || document.body;
        width = canvas.width = parent.clientWidth || window.innerWidth;
        height = canvas.height = parent.clientHeight || window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const baseVx = (Math.random() - 0.5) * 0.28; // Slow base speed when left alone
            const baseVy = (Math.random() - 0.5) * 0.28;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseVx: baseVx,
                baseVy: baseVy,
                vx: baseVx,
                vy: baseVy,
                radius: 2 + Math.random() * 3.5,
                baseAlpha: 0.35 + Math.random() * 0.45,
                alpha: 0.4,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        /* Ease scroll speed factor */
        scrollSpeedFactor += (scrollSpeedTarget - scrollSpeedFactor) * 0.08;

        const time = performance.now() * 0.001;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            /* Alpha pulsing */
            p.alpha = p.baseAlpha + Math.sin(time * 0.8 + p.phase) * 0.12;

            /* Move */
            p.x += p.vx * scrollSpeedFactor;
            p.y += p.vy * scrollSpeedFactor;

            /* Mouse repulsion (adds acceleration to velocity for inertia glide) */
            const dxM = p.x - mouseX;
            const dyM = p.y - mouseY;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);
            if (distM < REPULSION_RADIUS && distM > 0) {
                const force = (REPULSION_RADIUS - distM) / REPULSION_RADIUS;
                p.vx += (dxM / distM) * force * 1.5;
                p.vy += (dyM / distM) * force * 1.5;
            }

            /* Apply inertia friction, returning slowly to base drift speed */
            p.vx = p.vx * 0.94 + p.baseVx * 0.06;
            p.vy = p.vy * 0.94 + p.baseVy * 0.06;

            /* Bounce on edges */
            if (p.x < 0) { p.x = 0; p.vx *= -1; p.baseVx *= -1; }
            if (p.x > width) { p.x = width; p.vx *= -1; p.baseVx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; p.baseVy *= -1; }
            if (p.y > height) { p.y = height; p.vy *= -1; p.baseVy *= -1; }

            /* Draw particle with glowing halo */
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,242,254,${p.alpha * 0.22})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,242,254,${p.alpha})`;
            ctx.fill();
        }

        /* Connections */
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(0,122,255,${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    /* ── Events ────────────────────────────────────────────── */
    window.addEventListener('resize', () => {
        resize();
    });

    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    const scrollWrapper = document.getElementById('story-scroll-wrapper');
    if (scrollWrapper) {
        scrollWrapper.addEventListener(
            'scroll',
            () => {
                scrollSpeedTarget = 3.5;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    scrollSpeedTarget = 1.0;
                }, 800);
            },
            { passive: true }
        );
    }

    window.addEventListener(
        'scroll',
        () => {
            scrollSpeedTarget = 3.5;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollSpeedTarget = 1.0;
            }, 800);
        },
        { passive: true }
    );

    /* ── Bootstrap ─────────────────────────────────────────── */
    resize();
    createParticles();
    requestAnimationFrame(animate);
}
