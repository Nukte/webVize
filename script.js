// Gelişmiş animated dots + lines arka plan (tema duyarlı)
document.addEventListener('DOMContentLoaded', function(){
  const canvas = document.getElementById('bg-dots');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr = window.devicePixelRatio || 1;
  function resize(){
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize); resize();
  // Nokta verisi
  const dots = Array.from({length: 32}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    r: 2.2 + Math.random()*1.8,
    dx: -0.18+Math.random()*0.36, dy: -0.18+Math.random()*0.36
  }));
  function getAccent(){
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--accent').trim() || '#007BFF';
  }
  function getLineColor(){
    const theme = document.documentElement.getAttribute('data-theme')||'light';
    return theme==='dark' ? 'rgba(51,144,255,0.22)' : 'rgba(0,123,255,0.13)';
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    // Çizgiler
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a = dots[i], b = dots[j];
        const dist = Math.hypot(a.x-b.x, a.y-b.y);
        if(dist<160){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = getLineColor();
          ctx.lineWidth = 1.1 - dist/200;
          ctx.globalAlpha = 1 - dist/180;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    // Noktalar
    const accent = getAccent();
    for(const dot of dots){
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI*2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.7;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      // Hareket
      dot.x += dot.dx; dot.y += dot.dy;
      if(dot.x<0||dot.x>w) dot.dx*=-1;
      if(dot.y<0||dot.y>h) dot.dy*=-1;
    }
    requestAnimationFrame(draw);
  }
  // Tema değişince yeniden çiz
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
  draw();
});
/*
  script.js
  - Sayfa geçişi (fetch + pushState)
  - Tema yönetimi (localStorage)
  - Dil yönetimi (translations nesnesi + localStorage)
  - Preloader
  - Modal / Lightbox
  - Basit form doğrulama
*/

// -----------------------------
// Translations (TR / EN)
// -----------------------------
const translations = {
  tr: {
    nav_home: 'Anasayfa', nav_about: 'Hakkımda', nav_projects: 'Projeler', nav_blog: 'Blog', nav_gallery: 'Galeri', nav_contact: 'İletişim',
    title_home: 'Kemal — Anasayfa', title_about: 'Kemal — Hakkımda', title_projects: 'Kemal — Projeler', title_blog: 'Kemal — Blog', title_contact: 'Kemal — İletişim', title_gallery: 'Kemal — Galeri',
    hero_title: "Merhaba, ben Kemal",
    hero_subtitle: "Full-stack geliştirici",
    btn_projects: 'Projelerimi Gör', projects_title: 'Projelerim', about_title: 'Hakkımda', contact_title: 'İletişim', gallery_title: 'Galeri', blog_title: 'Blog', btn_send: 'Mesaj Gönder',
  /* About page */
  /* About page - Simple version */
  personal_intro_title: 'Kişisel Tanıtım',
  personal_intro: 'Merhaba! Ben <strong>Ali Kemal Kara</strong>. Tuzla Meslek Lisesi\'nde yazılım bölümü okudum ve şu anda Akdeniz Üniversitesi\'nde Bilgisayar Programcılığı bölümünde eğitimime devam ediyorum. Yazılım geliştirme alanında kendimi sürekli geliştirmeye odaklı bir öğrenciyim.',
  work_experience_title: 'İş Deneyimi',
  netas_position: 'Software Developer Intern',
  netas_company: 'NETAŞ',
  netas_duration: '10 Ay',
  netas_description: 'NETAŞ\'ta 10 ay boyunca Software Developer Intern olarak çalıştım. Bu süreçte yazılım geliştirme süreçlerini öğrendim, takım çalışması deneyimi kazandım ve profesyonel iş ortamında projeler geliştirdim.',
  technologies_title: 'Kullandığım Teknolojiler',
  tech_csharp: 'C#',
  tech_dotnet: '.NET Core / ASP.NET',
  tech_python: 'Python',
  tech_cpp: 'C++',
  tech_git: 'Git',
  tech_docker: 'Docker',
  education_title: 'Eğitim',
  university_name: 'Akdeniz Üniversitesi',
  university_department: 'Bilgisayar Programcılığı',
  university_status: 'Devam Ediyor',
  highschool_name: 'Tuzla Meslek Lisesi',
  highschool_department: 'Yazılım Bölümü',
  highschool_status: 'Mezun',
  /* Contact page */
    contact_intro: 'Benimle iletişime geçmek için aşağıdaki formu kullanabilir veya sosyal medya hesaplarımdan ulaşabilirsiniz.',
    label_name: 'Ad Soyad', label_email: 'E-posta', label_subject: 'Konu', label_message: 'Mesaj',
    location_title: 'Konum', location_text: 'Türkiye', email_title: 'E-posta', availability_title: 'Müsaitlik', availability_text: 'Yeni projeler için açık',
    social_title: 'Sosyal Medya',
  social_github: 'GitHub', social_linkedin: 'LinkedIn', social_twitter: 'Twitter',
  /* Blog page */
  blog_subtitle: 'Yazılım geliştirme, teknoloji ve deneyimlerim hakkında yazılar',
  filter_all: 'Tümü', filter_development: 'Geliştirme', filter_tutorial: 'Eğitim', filter_experience: 'Deneyim',
  category_development: 'Geliştirme', category_tutorial: 'Eğitim', category_experience: 'Deneyim',
  read_time: '5 dk okuma', read_more: 'Devamını Oku',
  blog1_title: 'C# ile Modern Web API Geliştirme',
  blog1_excerpt: 'ASP.NET Core kullanarak RESTful API\'ler nasıl geliştirilir? Bu yazıda modern web API geliştirme tekniklerini ve best practice\'leri inceliyoruz.',
  blog2_title: 'Docker ile Geliştirme Ortamı Kurulumu',
  blog2_excerpt: 'Docker kullanarak tutarlı geliştirme ortamları nasıl oluşturulur? Containerization\'ın avantajları ve pratik uygulama örnekleri.',
  blog3_title: 'SQL Server Performans Optimizasyonu Deneyimlerim',
  blog3_excerpt: 'Büyük veri setleriyle çalışırken karşılaştığım performans sorunları ve bunları nasıl çözdüğüm hakkında deneyimlerimi paylaşıyorum.',
  blog4_title: 'Clean Architecture ile Proje Yapısı',
  blog4_excerpt: 'Sürdürülebilir ve test edilebilir kod yazmak için Clean Architecture prensiplerini nasıl uyguluyorum.',
  /* Badges */
    badge_js: "JavaScript",
    badge_html: "HTML",
    badge_css: "CSS",
    badge_react: "React",
  badge_csharp: "C#",
  badge_python: "Python",
  badge_cpp: "C++",
  badge_dotnet: ".NET Core / ASP.NET MVC",
  badge_sql: "SQL",
  badge_docker: "Docker",
  badge_git: "Git",
  skill_cs: "C#",
  skill_python: "Python",
  skill_cpp: "C++",
  skill_dotnet: ".NET Core / ASP.NET MVC",
  skill_sql: "SQL",
  skill_docker: "Docker",
  skill_git: "Git",
  label_cs: "C#",
  label_python: "Python",
  label_cpp: "C++",
  label_dotnet: ".NET Core / ASP.NET MVC",
  label_sql: "SQL",
  label_docker: "Docker",
  label_git: "Git",
    /* Projects */
    projects_subtitle: 'GitHub hesabımdan gerçek projelerim',
    proj1_title: 'Unity Editor Proje Kurulum Aracı', proj1_desc: 'Unity projeleriniz için gerekli olan klasörleri tek tuş ile oluşturmanızı sağlayan editor aracı. Proje organizasyonunu kolaylaştırır.', proj1_github: 'GitHub',
    proj2_title: 'Türkçe Cümle Duygu Analizi', proj2_desc: 'Türkçe cümleleri pozitif veya negatif olarak sınıflandıran makine öğrenmesi projesi. Doğal dil işleme teknikleri kullanılarak geliştirilmiştir.', proj2_github: 'GitHub',
    proj3_title: 'Stajyer Takip Sistemi', proj3_desc: 'Stajyerlerin takip edilmesi ve yönetilmesi için geliştirilmiş masaüstü uygulaması. C# ve .NET teknolojileri kullanılarak geliştirilmiştir.', proj3_github: 'GitHub',
    proj4_title: 'NetFlowN', proj4_desc: 'Web tabanlı network flow analiz aracı. HTML, CSS ve JavaScript teknolojileri kullanılarak geliştirilmiş modern web uygulaması.', proj4_github: 'GitHub',
    proj5_title: 'ArtyHome For School', proj5_desc: 'Okul yönetimi için geliştirilmiş masaüstü uygulaması. Öğrenci ve öğretmen bilgilerinin yönetilmesi için C# ile geliştirilmiştir.', proj5_github: 'GitHub',
    proj6_title: 'Kim Milyoner Olmak İster', proj6_desc: 'Popüler televizyon yarışması "Kim Milyoner Olmak İster"in C# ile geliştirilmiş masaüstü versiyonu. Eğlenceli quiz oyunu.', proj6_github: 'GitHub',
    view_all_projects: 'Tüm Projelerimi GitHub\'da Görüntüle',
    /* Gallery photo alts */
    photo1_alt: 'Fotoğraf 1', photo2_alt: 'Fotoğraf 2', photo3_alt: 'Fotoğraf 3', photo4_alt: 'Fotoğraf 4', photo5_alt: 'Fotoğraf 5', photo6_alt: 'Fotoğraf 6'
  },
  en: {
    nav_home: 'Home', nav_about: 'About', nav_projects: 'Projects', nav_blog: 'Blog', nav_gallery: 'Gallery', nav_contact: 'Contact',
    title_home: 'Kemal — Home', title_about: 'Kemal — About', title_projects: 'Kemal — Projects', title_blog: 'Kemal — Blog', title_contact: 'Kemal — Contact', title_gallery: 'Kemal — Gallery',
    hero_title: 'Code. Creativity. Innovation.', hero_sub: 'I combine software, design and technology with a minimalist approach. Check my portfolio and projects below.',
    btn_projects: 'See Projects', projects_title: 'My Projects', about_title: 'About Me', contact_title: 'Contact', gallery_title: 'Gallery', blog_title: 'Blog', btn_send: 'Send Message',
  /* About page */
  /* About page - Simple version */
  personal_intro_title: 'Personal Introduction',
  personal_intro: 'Hello! I\'m <strong>Ali Kemal Kara</strong>. I studied software development at Tuzla Vocational High School and I\'m currently continuing my education in Computer Programming at Akdeniz University. I\'m a student focused on continuously improving myself in the field of software development.',
  work_experience_title: 'Work Experience',
  netas_position: 'Software Developer Intern',
  netas_company: 'NETAŞ',
  netas_duration: '10 Months',
  netas_description: 'I worked as a Software Developer Intern at NETAŞ for 10 months. During this process, I learned software development processes, gained teamwork experience and developed projects in a professional work environment.',
  technologies_title: 'Technologies I Use',
  tech_csharp: 'C#',
  tech_dotnet: '.NET Core / ASP.NET',
  tech_python: 'Python',
  tech_cpp: 'C++',
  tech_git: 'Git',
  tech_docker: 'Docker',
  education_title: 'Education',
  university_name: 'Akdeniz University',
  university_department: 'Computer Programming',
  university_status: 'Ongoing',
  highschool_name: 'Tuzla Vocational High School',
  highschool_department: 'Software Development',
  highschool_status: 'Graduate',
    /* Contact page */
    contact_intro: 'You can reach me using the form below or through my social media accounts.',
    label_name: 'Full Name', label_email: 'E-mail', label_subject: 'Subject', label_message: 'Message',
    location_title: 'Location', location_text: 'Turkey', email_title: 'Email', availability_title: 'Availability', availability_text: 'Open for new projects',
    social_title: 'Social Media',
  social_github: 'GitHub', social_linkedin: 'LinkedIn', social_twitter: 'Twitter',
  /* Blog page */
  blog_subtitle: 'Articles about software development, technology and my experiences',
  filter_all: 'All', filter_development: 'Development', filter_tutorial: 'Tutorial', filter_experience: 'Experience',
  category_development: 'Development', category_tutorial: 'Tutorial', category_experience: 'Experience',
  read_time: '5 min read', read_more: 'Read More',
  blog1_title: 'Modern Web API Development with C#',
  blog1_excerpt: 'How to develop RESTful APIs using ASP.NET Core? In this article, we examine modern web API development techniques and best practices.',
  blog2_title: 'Development Environment Setup with Docker',
  blog2_excerpt: 'How to create consistent development environments using Docker? Advantages of containerization and practical application examples.',
  blog3_title: 'My SQL Server Performance Optimization Experiences',
  blog3_excerpt: 'I share my experiences about performance issues I encountered while working with large datasets and how I solved them.',
  blog4_title: 'Project Structure with Clean Architecture',
  blog4_excerpt: 'How I apply Clean Architecture principles to write sustainable and testable code.',
  /* Badges */
    badge_csharp: "C#",
    badge_dotnet: ".NET",
    badge_aspnet: "ASP.NET MVC",
    badge_sql: "SQL",
    badge_python: "Python",
    badge_docker: "Docker",
    badge_git: "Git",
    badge_cpp: "C++",
    skill_cs: "C#",
    skill_dotnet: ".NET",
    skill_aspnet: "ASP.NET MVC",
    skill_sql: "SQL",
    skill_python: "Python",
    skill_docker: "Docker",
    skill_git: "Git",
    skill_cpp: "C++",
    label_cs: "C#",
    label_dotnet: ".NET",
    label_aspnet: "ASP.NET MVC",
    label_sql: "SQL",
    label_python: "Python",
    label_docker: "Docker",
    label_git: "Git",
    label_cpp: "C++",
    /* Projects */
    projects_subtitle: 'Real projects from my GitHub account',
    proj1_title: 'Unity Editor Project Setup Tool', proj1_desc: 'An editor tool that allows you to create necessary folders for your Unity projects with a single click. Simplifies project organization.', proj1_github: 'GitHub',
    proj2_title: 'Turkish Sentence Mood Analysis', proj2_desc: 'A machine learning project that classifies Turkish sentences as positive or negative. Developed using natural language processing techniques.', proj2_github: 'GitHub',
    proj3_title: 'Intern Tracking System', proj3_desc: 'A desktop application developed for tracking and managing interns. Developed using C# and .NET technologies.', proj3_github: 'GitHub',
    proj4_title: 'NetFlowN', proj4_desc: 'Web-based network flow analysis tool. A modern web application developed using HTML, CSS and JavaScript technologies.', proj4_github: 'GitHub',
    proj5_title: 'ArtyHome For School', proj5_desc: 'Desktop application developed for school management. Developed with C# for managing student and teacher information.', proj5_github: 'GitHub',
    proj6_title: 'Who Wants to Be a Millionaire', proj6_desc: 'Desktop version of the popular TV game show "Who Wants to Be a Millionaire" developed with C#. Fun quiz game.', proj6_github: 'GitHub',
    view_all_projects: 'View All My Projects on GitHub',
    /* Gallery photo alts */
    photo1_alt: 'Photo 1', photo2_alt: 'Photo 2', photo3_alt: 'Photo 3', photo4_alt: 'Photo 4', photo5_alt: 'Photo 5', photo6_alt: 'Photo 6'
  }
};

// -----------------------------
// Helper: update year
// -----------------------------
document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

// -----------------------------
// Preloader: hide on full load
// -----------------------------
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if(p){
    p.style.transition = 'opacity 400ms ease';
    p.style.opacity = '0';
    setTimeout(()=> p.remove(), 500);
  }
});

// -----------------------------
// Theme management
// -----------------------------
function applyTheme(theme){
  if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.setAttribute('data-theme','light');
  localStorage.setItem('site-theme', theme);
  // update toggle icon if exists
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.textContent = theme === 'dark' ? '🌙' : '☀️');
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('site-theme') || 'light';
applyTheme(savedTheme);

// Theme button (delegated because every page has its own button)
document.addEventListener('click', e => {
  if(e.target.matches('.theme-toggle')){
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    // add a fading class to body to animate non-variable properties
    document.documentElement.classList.add('theme-switching');
    setTimeout(()=> document.documentElement.classList.remove('theme-switching'), 420);
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }
});

// Mobile nav panel toggle (delegated)
document.addEventListener('click', e => {
  if(e.target.matches('.menu-toggle')){
    let panel = document.querySelector('.nav-panel');
    let backdrop = document.querySelector('.nav-backdrop');
    if(!panel){
      panel = document.createElement('div'); panel.className = 'nav-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-hidden', 'true');
      // clone links from existing nav
      const nav = document.querySelector('.nav');
      if(nav){
        const clone = nav.cloneNode(true);
        clone.style.display = 'flex'; clone.style.flexDirection = 'column'; clone.style.gap = '10px';
        panel.appendChild(clone);
      }
      if(!panel.querySelector('a')) panel.textContent = 'No navigation links found.';
      const close = document.createElement('button'); close.className='menu-toggle-close'; close.textContent='Kapat'; close.style.marginTop='auto'; panel.appendChild(close);
      document.body.appendChild(panel);
    }
    if(!backdrop){ backdrop = document.createElement('div'); backdrop.className='nav-backdrop'; document.body.appendChild(backdrop); }
    const isOpen = panel.classList.toggle('open'); backdrop.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    // manage focus: move focus into panel when opened
    if(isOpen){
      const firstLink = panel.querySelector('a') || panel.querySelector('button');
      if(firstLink) firstLink.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  // close via backdrop click
  if(e.target.matches('.nav-backdrop') || e.target.matches('.menu-toggle-close')){
    const panel = document.querySelector('.nav-panel'); const backdrop = document.querySelector('.nav-backdrop');
    if(panel) panel.classList.remove('open'); if(backdrop) backdrop.classList.remove('open');
    if(panel) panel.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  // if link inside nav-panel clicked, close panel
  if(e.target.closest('.nav-panel') && e.target.closest('a')){
    const panel = document.querySelector('.nav-panel'); const backdrop = document.querySelector('.nav-backdrop');
    if(panel){ panel.classList.remove('open'); if(backdrop) backdrop.classList.remove('open'); }
    if(panel) panel.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
});

// close nav-panel with Escape and trap focus a bit while open
document.addEventListener('keydown', (ev) => {
  if(ev.key === 'Escape'){
    const panel = document.querySelector('.nav-panel'); const backdrop = document.querySelector('.nav-backdrop');
    if(panel && panel.classList.contains('open')){
      panel.classList.remove('open'); if(backdrop) backdrop.classList.remove('open'); panel.setAttribute('aria-hidden','true'); document.body.style.overflow = '';
    }
  }
  // simple focus trap: if tabbing while panel open, keep focus inside
  if(ev.key === 'Tab'){
    const panel = document.querySelector('.nav-panel');
    if(panel && panel.classList.contains('open')){
      const focusable = panel.querySelectorAll('a, button');
      if(focusable.length === 0) return;
      const first = focusable[0]; const last = focusable[focusable.length-1];
      if(ev.shiftKey && document.activeElement === first){ ev.preventDefault(); last.focus(); }
      else if(!ev.shiftKey && document.activeElement === last){ ev.preventDefault(); first.focus(); }
    }
  }
});

// -----------------------------
// Language management (centralized)
// -----------------------------
function applyLanguage(lang){
  const dict = translations[lang] || translations.tr;
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if(!key) return;
    const val = dict[key];
    if(typeof val === 'undefined') return;
    const tag = el.tagName && el.tagName.toLowerCase();
    // If it's an image, set alt text
    if(tag === 'img'){
      el.alt = val;
      return;
    }
    // If it's an input/textarea and has placeholder attribute, set placeholder
    if(tag === 'input' || tag === 'textarea'){
      if(el.hasAttribute('placeholder')){
        el.setAttribute('placeholder', val);
        return;
      }
    }
    // Default: replace innerHTML
    el.innerHTML = val;
  });
  // update html lang attribute for accessibility
  document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
  localStorage.setItem('site-lang', lang);
}

// Initialize language UI and set pressed states
function initLanguageUI(){
  const savedLang = localStorage.getItem('site-lang') || 'tr';
  applyLanguage(savedLang);
  document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === savedLang;
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

// Delegated click handler for language buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn[data-lang]');
  if(!btn) return;
  const lang = btn.getAttribute('data-lang');
  if(!lang) return;
  applyLanguage(lang);
  // update aria-pressed states
  document.querySelectorAll('.lang-btn[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
});

// Initialize on load
initLanguageUI();

// -----------------------------
// Modal / Lightbox
// -----------------------------
function openModal(src, alt=''){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.setAttribute('aria-hidden','false');
  modal.querySelector('img').src = src;
  modal.querySelector('img').alt = alt;
}
function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  modal.querySelector('img').src = '';
}

document.addEventListener('click', e => {
  if(e.target.matches('.photo') || e.target.closest('.photo')){
    const img = e.target.closest('img');
    openModal(img.src, img.alt);
  }
  if(e.target.matches('.modal-close') || e.target.matches('.modal') ){
    closeModal();
  }
});

// close modal with Esc
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// -----------------------------
// Enhanced Contact form validation
// -----------------------------
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const group = field.closest('.form-group');
  const errorEl = document.getElementById(fieldId + '-error');
  
  group.classList.add('error');
  errorEl.textContent = message;
  errorEl.classList.add('show');
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const group = field.closest('.form-group');
  const errorEl = document.getElementById(fieldId + '-error');
  
  group.classList.remove('error');
  errorEl.classList.remove('show');
}

function validateField(fieldId, value, rules) {
  clearError(fieldId);
  
  if (rules.required && !value.trim()) {
    showError(fieldId, 'Bu alan zorunludur.');
    return false;
  }
  
  if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(fieldId, 'Geçerli bir e-posta adresi girin.');
    return false;
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    showError(fieldId, `En az ${rules.minLength} karakter olmalıdır.`);
    return false;
  }
  
  return true;
}

document.addEventListener('submit', e => {
  if(e.target && e.target.id === 'contact-form'){
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const msg = document.getElementById('form-msg');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    // Validate all fields
    const isNameValid = validateField('name', name.value, { required: true, minLength: 2 });
    const isEmailValid = validateField('email', email.value, { required: true, email: true });
    const isSubjectValid = validateField('subject', subject.value, { required: true, minLength: 3 });
    const isMessageValid = validateField('message', message.value, { required: true, minLength: 10 });
    
    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      return;
    }
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Simulate form submission
    setTimeout(() => {
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
      
      msg.textContent = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.';
      msg.className = 'form-msg success show';
      
      // Clear form
      name.value = email.value = subject.value = message.value = '';
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        msg.classList.remove('show');
      }, 5000);
    }, 2000);
  }
});

// Real-time validation
document.addEventListener('input', e => {
  if (e.target.matches('#contact-form input, #contact-form textarea')) {
    const fieldId = e.target.id;
    const value = e.target.value;
    
    switch(fieldId) {
      case 'name':
        validateField(fieldId, value, { required: true, minLength: 2 });
        break;
      case 'email':
        validateField(fieldId, value, { required: true, email: true });
        break;
      case 'subject':
        validateField(fieldId, value, { required: true, minLength: 3 });
        break;
      case 'message':
        validateField(fieldId, value, { required: true, minLength: 10 });
        break;
    }
  }
});

// -----------------------------
// Blog filtering functionality
// -----------------------------
document.addEventListener('click', e => {
  if (e.target.matches('.filter-btn')) {
    const filter = e.target.getAttribute('data-filter');
    const cards = document.querySelectorAll('.blog-card');
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter cards
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
});

// -----------------------------
// Page transitions: fetch + replace <main>
// - Click any internal link
// - Prevent default, fade out main, fetch page, extract <main>, fade in
// - Use history.pushState to update URL
// -----------------------------

async function fetchAndSwap(url, addToHistory = true){
  const controller = new AbortController();
  const signal = controller.signal;
  const main = document.getElementById('main-content');
  if(!main) return;
  // ensure overlay exists
  let overlay = document.querySelector('.page-overlay');
  let prog = document.querySelector('.progress-bar');
  if(!overlay){
    overlay = document.createElement('div'); overlay.className = 'page-overlay'; overlay.setAttribute('aria-hidden','true');
    prog = document.createElement('div'); prog.className = 'progress-bar'; document.body.appendChild(prog);
    document.body.appendChild(overlay);
  }

  try{
    // start transition
    overlay.setAttribute('data-active','true');
    prog.style.width = '6%';
    // Animate main out
    main.style.transition = 'opacity 260ms ease';
    main.style.opacity = 0;

    // fetch with timeout via AbortController
    const fetchTimeout = setTimeout(()=>{ controller.abort(); }, 10000);
    const res = await fetch(url, {cache: 'no-store', signal});
    clearTimeout(fetchTimeout);
    if(!res.ok) throw new Error('Fetch failed');

    // update progress as we process text
    prog.style.width = '34%';
    const text = await res.text();
    prog.style.width = '68%';

    // parse and swap
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const newMain = doc.getElementById('main-content') || doc.body;
    const newTitle = doc.querySelector('title')?.innerText || document.title;

    main.innerHTML = newMain.innerHTML;
    document.title = newTitle;

    if(addToHistory) history.pushState({url:url}, '', url);

  // reapply dynamic things
    applyTheme(localStorage.getItem('site-theme') || 'light');
    applyLanguage(localStorage.getItem('site-lang') || 'tr');
    // re-init language UI in new content (buttons, aria-pressed)
    if(typeof initLanguageUI === 'function') initLanguageUI();
    document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());
    // small re-init for menu button binding (if any)
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if(menuBtn && nav){
      menuBtn.addEventListener('click', ()=> nav.classList.toggle('open'));
    }

    // apply enter animation classes for smoother appearance
    main.classList.remove('page-exit');
    main.classList.add('page-enter');
    // force reflow then show
    void main.offsetWidth;
    main.classList.add('show');

    // finish progress
    prog.style.width = '100%';
    setTimeout(()=>{
      prog.style.width = '0%';
      overlay.setAttribute('data-active','false');
      // cleanup enter classes after animation
      setTimeout(()=>{
        main.classList.remove('page-enter');
        main.classList.remove('show');
        main.style.opacity = 1;
      }, 260);
    }, 260);
    // scroll to top
    window.scrollTo({top:0,behavior:'smooth'});
  }catch(err){
    console.error('Navigation error', err);
    controller.abort();
    // fallback to full navigation
    window.location.href = url;
  }
}

// Delegate clicks on links
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href) return;
  // ignore external links (start with http or mailto or target blank)
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || a.target === '_blank';
  const sameOrigin = new URL(href, location.href).origin === location.origin;

  if(!isExternal && sameOrigin){
    // internal link -> hijack
    e.preventDefault();
    // add exit class
    const main = document.getElementById('main-content');
    if(main){ main.classList.add('page-exit'); }
    setTimeout(()=> fetchAndSwap(href, true), 120);
  }
});

// Delegate menu toggle so it persists after content swaps
document.addEventListener('click', e => {
  if(e.target.matches('.menu-toggle')){
    const nav = document.querySelector('.nav');
    if(!nav) return;
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  }
});

// handle back/forward
window.addEventListener('popstate', (e) => {
  const url = location.pathname.split('/').pop() || 'index.html';
  fetchAndSwap(url, false);
});

// initial opacity ensure
document.addEventListener('DOMContentLoaded', ()=>{
  const main = document.getElementById('main-content');
  if(main) {
    main.style.opacity = 1;
    main.style.transition = 'opacity 260ms ease';
  }
  // clean any leftover overlay from previous session
  const old = document.querySelectorAll('.page-overlay, .progress-bar');
  old.forEach(n => n.remove());
  // hero blob parallax (if present)
  const hero = document.querySelector('.hero');
  const blob = document.querySelector('.hero-blob');
  if(hero && blob){
    hero.classList.add('hover-enabled');
    hero.addEventListener('pointermove', (ev)=>{
      const r = hero.getBoundingClientRect();
      const dx = (ev.clientX - (r.left + r.width/2)) / r.width;
      const dy = (ev.clientY - (r.top + r.height/2)) / r.height;
      blob.style.transform = `translate3d(${dx*18}px, ${dy*12}px, 0) scale(1.02)`;
    });
    hero.addEventListener('pointerleave', ()=>{ blob.style.transform = 'translate3d(0,0,0) scale(1)'; });
  }
});

// Simple typewriter for hero terminal
(() => {
  const out = document.getElementById('type-output');
  if(!out) return;
  const lines = [
    "var skills = new[] { \"C#\", \"Python\", \"C++\", \".NET Core / ASP.NET MVC\", \"SQL\", \"Docker\", \"Git\" };",
    "foreach(var s in skills) Console.WriteLine(s);",
    "// Backend: C#, .NET Core / ASP.NET MVC | DB: SQL | DevOps: Docker | Tools: Git"
  ];
  let li = 0; let ci = 0; let forward = true;
  function step(){
    const cur = lines[li];
    out.textContent = cur.slice(0, ci);
    if(forward){
      ci++;
      if(ci > cur.length){ forward=false; setTimeout(step, 900); return; }
    } else {
      ci--;
      if(ci <= 0){ forward=true; li = (li+1)%lines.length; setTimeout(step, 400); return; }
    }
    setTimeout(step, 24 + Math.random()*18);
  }
  step();
})();

// 3D tilt for project cards
(function(){
  const cards = document.querySelectorAll('.projects .card');
  if(!cards.length) return;
  cards.forEach(card=>{
    card.addEventListener('pointermove', (ev)=>{
      const r = card.getBoundingClientRect();
      const dx = (ev.clientX - (r.left + r.width/2)) / r.width;
      const dy = (ev.clientY - (r.top + r.height/2)) / r.height;
      const rx = dy * -8; const ry = dx * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.classList.add('tilt');
    });
    card.addEventListener('pointerleave', ()=>{ card.style.transform=''; card.classList.remove('tilt'); });
  });
})();

// small helper: close modal if click outside image
// already handled by click listener above

// -----------------------------
// Enhanced Contact form validation
// -----------------------------
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const group = field.closest('.form-group');
  const errorEl = document.getElementById(fieldId + '-error');
  
  if (group && errorEl) {
    group.classList.add('error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const group = field.closest('.form-group');
  const errorEl = document.getElementById(fieldId + '-error');
  
  if (group && errorEl) {
    group.classList.remove('error');
    errorEl.classList.remove('show');
  }
}

function validateField(fieldId, value, rules) {
  clearError(fieldId);
  
  if (rules.required && !value.trim()) {
    showError(fieldId, 'Bu alan zorunludur.');
    return false;
  }
  
  if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError(fieldId, 'Geçerli bir e-posta adresi girin.');
    return false;
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    showError(fieldId, `En az ${rules.minLength} karakter olmalıdır.`);
    return false;
  }
  
  return true;
}

// Enhanced form submission with better UX
document.addEventListener('submit', e => {
  if(e.target && e.target.id === 'contact-form'){
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const msg = document.getElementById('form-msg');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    // Validate all fields
    let isValid = true;
    if (name) isValid = validateField('name', name.value, { required: true, minLength: 2 }) && isValid;
    if (email) isValid = validateField('email', email.value, { required: true, email: true }) && isValid;
    if (subject) isValid = validateField('subject', subject.value, { required: true, minLength: 3 }) && isValid;
    if (message) isValid = validateField('message', message.value, { required: true, minLength: 10 }) && isValid;
    
    // Fallback for old contact form
    if (!subject && name && email && message) {
      if(!name.value.trim() || !email.value.trim() || !message.value.trim()){
        if (msg) msg.textContent = 'Lütfen tüm alanları doldurun.';
        return;
      }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
        if (msg) msg.textContent = 'Geçerli bir e-posta girin.';
        return;
      }
      if (msg) msg.textContent = 'Mesaj gönderildi (demo). Teşekkürler!';
      name.value = email.value = message.value = '';
      return;
    }
    
    if (!isValid) return;
    
    // Show loading state
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
    }
    
    // Simulate form submission
    setTimeout(() => {
      if (btnText && btnLoading) {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
      }
      
      if (msg) {
        msg.textContent = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.';
        msg.className = 'form-msg success show';
      }
      
      // Clear form
      if (name) name.value = '';
      if (email) email.value = '';
      if (subject) subject.value = '';
      if (message) message.value = '';
      
      // Hide success message after 5 seconds
      if (msg) {
        setTimeout(() => {
          msg.classList.remove('show');
        }, 5000);
      }
    }, 2000);
  }
});

// Real-time validation
document.addEventListener('input', e => {
  if (e.target.matches('#contact-form input, #contact-form textarea')) {
    const fieldId = e.target.id;
    const value = e.target.value;
    
    switch(fieldId) {
      case 'name':
        validateField(fieldId, value, { required: true, minLength: 2 });
        break;
      case 'email':
        validateField(fieldId, value, { required: true, email: true });
        break;
      case 'subject':
        validateField(fieldId, value, { required: true, minLength: 3 });
        break;
      case 'message':
        validateField(fieldId, value, { required: true, minLength: 10 });
        break;
    }
  }
});

// -----------------------------
// Blog filtering functionality
// -----------------------------
document.addEventListener('click', e => {
  if (e.target.matches('.filter-btn')) {
    const filter = e.target.getAttribute('data-filter');
    const cards = document.querySelectorAll('.blog-card');
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter cards
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
});

// -----------------------------
// Scroll animations (AOS-like functionality)
// -----------------------------
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  
  // Re-initialize after page transitions
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    const observer = new MutationObserver(() => {
      setTimeout(initScrollAnimations, 100);
    });
    
    observer.observe(mainContent, {
      childList: true,
      subtree: true
    });
  }
});

// -----------------------------
// Smooth scrolling for anchor links
// -----------------------------
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// -----------------------------
// About page animations
// -----------------------------
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current);
        setTimeout(updateCounter, 20);
      } else {
        counter.textContent = target;
      }
    };
    
    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress-bar[data-progress]');
  
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            bar.style.width = progress + '%';
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(bar);
  });
}

// Initialize about page animations
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.about-stats')) {
    animateCounters();
  }
  if (document.querySelector('.skill-progress-bar')) {
    animateSkillBars();
  }
});

// Re-initialize after page transitions
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (document.querySelector('.about-stats')) {
          animateCounters();
        }
        if (document.querySelector('.skill-progress-bar')) {
          animateSkillBars();
        }
      }, 100);
    });
    
    observer.observe(mainContent, {
      childList: true,
      subtree: true
    });
  }
});

// Responsive hamburger menü aç/kapa
// Enhanced script with blog functionality, improved UX and about page animations