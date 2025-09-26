/* blogData.js
	 Simple client-side blog storage and rendering module.
	 - Stores posts in localStorage under 'blog_posts_v1'
	 - Exposes window.blogData with methods for rendering and admin CRUD
*/
(function(){
	const STORAGE_KEY = 'blog_posts_v1';
	const ADMIN_KEY = 'isAdmin';

	// Seed posts if none exist
	// If a baked-in seed exists (user committed blog-seed.js which defines window.__BLOG_SEED), use it.
	const seed = (window.__BLOG_SEED && Array.isArray(window.__BLOG_SEED)) ? window.__BLOG_SEED : [
		{
			id: 'p-' + Date.now(),
			title_tr: 'C# ile Modern Web API Geliştirme',
			title_en: 'Modern Web API Development with C#',
			summary_tr: 'ASP.NET Core kullanarak RESTful API\'ler nasıl geliştirilir?',
			summary_en: 'How to develop RESTful APIs using ASP.NET Core?',
			content_tr: '<p>ASP.NET Core ile modern Web API geliştirmenin temelleri...</p>',
			content_en: '<p>Basics of building modern Web APIs with ASP.NET Core...</p>',
			category: 'development',
			image: 'fotos/WhatsApp Görsel 2025-09-21 saat 16.52.37_1b752342.jpg',
			createdAt: Date.now()
		},
		{
			id: 'p-' + (Date.now()+1),
			title_tr: 'Docker ile Geliştirme Ortamı Kurulumu',
			title_en: 'Development Environment Setup with Docker',
			summary_tr: 'Docker kullanarak tutarlı geliştirme ortamları nasıl oluşturulur?',
			summary_en: 'How to create consistent development environments using Docker?',
			content_tr: '<p>Docker kullanarak geliştirme ortamı hazırlama adımları...</p>',
			content_en: '<p>Steps to prepare a development environment using Docker...</p>',
			category: 'tutorial',
			image: 'fotos/WhatsApp Görsel 2025-09-21 saat 16.53.04_7d631d58.jpg',
			createdAt: Date.now()+1
		}
	];

	function loadPosts(){
		try{
			const raw = localStorage.getItem(STORAGE_KEY);
			if(!raw) return JSON.parse(JSON.stringify(seed));
			return JSON.parse(raw);
		}catch(e){
			console.error('Failed to load posts', e);
			return JSON.parse(JSON.stringify(seed));
		}
	}

	function savePosts(posts){
		localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
	}

	function getLang(){
		return localStorage.getItem('site-lang') || 'tr';
	}

	function renderBlogPosts(filter='all'){
		const grid = document.querySelector('.blog-grid');
		if(!grid) return;
		const lang = getLang();
		const posts = loadPosts();
		grid.innerHTML = '';
		const filtered = posts.filter(p => filter === 'all' || p.category === filter).sort((a,b)=> b.createdAt - a.createdAt);
		if(filtered.length === 0){
			grid.innerHTML = '<p class="muted">No posts yet.</p>';
			return;
		}
		for(const p of filtered){
			const card = document.createElement('article'); card.className = 'blog-card'; card.setAttribute('data-category', p.category); card.setAttribute('data-id', p.id);
			const title = p['title_' + lang] || p.title_tr || p.title_en || '';
			const summary = p['summary_' + lang] || p.summary_tr || p.summary_en || '';
			card.innerHTML = `
				<div class="card-media">
					<img src="${p.image || ''}" alt="${escapeHtml(title)}" />
				</div>
				<div class="card-body">
					<h3 class="card-title">${escapeHtml(title)}</h3>
					<p class="card-excerpt">${escapeHtml(stripTags(summary)).slice(0,180)}${summary.length>180?'…':''}</p>
					<div class="card-actions">
						<button class="btn read-more" data-id="${p.id}">${lang==='en' ? 'Read More' : 'Devamını Oku'}</button>
					</div>
				</div>
			`;
			grid.appendChild(card);
		}
	}

	function escapeHtml(s){
		if(!s) return '';
		return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; });
	}

	function stripTags(s){ return String(s||'').replace(/<[^>]*>/g,''); }

	// Post modal (detail)
	function openPostModal(id){
		const posts = loadPosts();
		const p = posts.find(x=>x.id===id);
		if(!p) return;
		const lang = getLang();
		const title = p['title_' + lang] || p.title_tr || p.title_en;
		const content = p['content_' + lang] || p.content_tr || p.content_en || '';

		// create modal if not exists
		let modal = document.getElementById('post-modal');
		if(!modal){
			modal = document.createElement('div'); modal.id = 'post-modal'; modal.className = 'modal'; modal.setAttribute('aria-hidden','true');
			modal.innerHTML = '<div class="modal-inner post-modal-inner"><button class="modal-close">✕</button><div class="post-content"></div></div>';
			document.body.appendChild(modal);
			modal.addEventListener('click', (ev)=>{ if(ev.target === modal) closePostModal(); });
			modal.querySelector('.modal-close').addEventListener('click', closePostModal);
		}
		const inner = modal.querySelector('.post-content');
		inner.innerHTML = `<img src="${p.image||''}" alt="${escapeHtml(title)}" style="max-width:100%;height:auto;margin-bottom:12px;" /><h2>${escapeHtml(title)}</h2>${content}`;
		modal.setAttribute('aria-hidden','false');
		document.body.style.overflow = 'hidden';
	}

	function closePostModal(){
		const modal = document.getElementById('post-modal');
		if(!modal) return; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = '';
	}

	// CRUD for admin
	function addBlogPost(post){
		const posts = loadPosts();
		post.id = 'p-' + (Date.now());
		post.createdAt = Date.now();
		posts.push(post);
		savePosts(posts);
		return post;
	}

	function editBlogPost(id, updates){
		const posts = loadPosts();
		const idx = posts.findIndex(p=>p.id===id);
		if(idx === -1) return false;
		posts[idx] = Object.assign({}, posts[idx], updates);
		savePosts(posts);
		return true;
	}

	function deleteBlogPost(id){
		let posts = loadPosts();
		const before = posts.length;
		posts = posts.filter(p=>p.id!==id);
		savePosts(posts);
		return posts.length < before;
	}

	function populateManagementList(){
		const el = document.getElementById('posts-list');
		if(!el) return;
		const posts = loadPosts().sort((a,b)=> b.createdAt - a.createdAt);
		el.innerHTML = '';
		for(const p of posts){
			const row = document.createElement('div'); row.className = 'manage-row'; row.setAttribute('data-id', p.id);
			const title = p.title_tr || p.title_en || '';
			row.innerHTML = `<strong>${escapeHtml(title)}</strong> <span class="muted">${p.category}</span>
				<div class="manage-actions">
					<button class="btn edit-post" data-id="${p.id}">Düzenle</button>
					<button class="btn danger delete-post" data-id="${p.id}">Sil</button>
				</div>`;
			el.appendChild(row);
		}
	}

	// Simple client-side admin auth (client-only)
	function tryAdminLogin(user, pass){
		if(user === 'nukte' && pass === 'root'){
			localStorage.setItem(ADMIN_KEY, '1');
			return true;
		}
		return false;
	}

	function adminLogout(){ localStorage.removeItem(ADMIN_KEY); }
	function isAdmin(){ return localStorage.getItem(ADMIN_KEY) === '1'; }

	// Wire delegated click for blog read buttons
	document.addEventListener('click', (e)=>{
		const rd = e.target.closest('.read-more');
		if(rd){ const id = rd.getAttribute('data-id'); openPostModal(id); }
		if(e.target.matches('#post-modal .modal-close')) closePostModal();
	});

	// expose public API
	window.blogData = {
		loadPosts, savePosts, renderBlogPosts, openPostModal, closePostModal,
		addBlogPost, editBlogPost, deleteBlogPost, populateManagementList,
		tryAdminLogin, adminLogout, isAdmin
	};

	// Auto-render if .blog-grid present
	document.addEventListener('DOMContentLoaded', ()=>{
		const grid = document.querySelector('.blog-grid');
		if(grid) renderBlogPosts('all');
	});

})();
