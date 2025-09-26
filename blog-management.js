document.addEventListener('DOMContentLoaded', ()=>{
	const loginBox = document.getElementById('login-box');
	const adminPanel = document.getElementById('admin-panel');
	const loginBtn = document.getElementById('admin-login');
	const logoutBtn = document.getElementById('admin-logout');

	function showPanel(isAdmin){
		if(isAdmin){ loginBox.style.display = 'none'; adminPanel.style.display = ''; window.blogData.populateManagementList(); }
		else { loginBox.style.display = ''; adminPanel.style.display = 'none'; }
	}

	showPanel(window.blogData && window.blogData.isAdmin && window.blogData.isAdmin());

	if(loginBtn){
		loginBtn.addEventListener('click', ()=>{
			const u = document.getElementById('admin-user').value.trim();
			const p = document.getElementById('admin-pass').value.trim();
			if(window.blogData.tryAdminLogin(u,p)){
				showPanel(true);
			} else {
				alert('Giriş başarısız');
			}
		});
	}

	if(logoutBtn){ logoutBtn.addEventListener('click', ()=>{ window.blogData.adminLogout(); showPanel(false); }); }

	// Add new post
	const addBtn = document.getElementById('add-post');
	if(addBtn){
		addBtn.addEventListener('click', ()=>{
			const post = {
				title_tr: document.getElementById('new-title-tr').value.trim(),
				title_en: document.getElementById('new-title-en').value.trim(),
				summary_tr: document.getElementById('new-summary-tr').value.trim(),
				summary_en: document.getElementById('new-summary-en').value.trim(),
				content_tr: document.getElementById('new-content-tr').value.trim(),
				content_en: document.getElementById('new-content-en').value.trim(),
				category: document.getElementById('new-category').value,
				image: document.getElementById('new-image').value.trim()
			};
			window.blogData.addBlogPost(post);
			window.blogData.populateManagementList();
			window.blogData.renderBlogPosts('all');
			// clear inputs
			document.getElementById('new-title-tr').value = '';
			document.getElementById('new-title-en').value = '';
			document.getElementById('new-summary-tr').value = '';
			document.getElementById('new-summary-en').value = '';
			document.getElementById('new-content-tr').value = '';
			document.getElementById('new-content-en').value = '';
			document.getElementById('new-image').value = '';
		});
	}

	// Delegate edit/delete in posts list
	document.getElementById('posts-list').addEventListener('click', (e)=>{
		const edit = e.target.closest('.edit-post');
		const del = e.target.closest('.delete-post');
		if(edit){
			const id = edit.getAttribute('data-id');
			const posts = window.blogData.loadPosts();
			const p = posts.find(x=>x.id===id);
			if(!p) return;
			// simple prompt-based edit
			const newTitleTr = prompt('Başlık (TR)', p.title_tr || '');
			if(newTitleTr === null) return; // cancelled
			const newTitleEn = prompt('Title (EN)', p.title_en || '');
			window.blogData.editBlogPost(id, { title_tr: newTitleTr, title_en: newTitleEn });
			window.blogData.populateManagementList();
			window.blogData.renderBlogPosts('all');
		}
		if(del){
			const id = del.getAttribute('data-id');
			if(confirm('Bu yazıyı silmek istediğinize emin misiniz?')){
				window.blogData.deleteBlogPost(id);
				window.blogData.populateManagementList();
				window.blogData.renderBlogPosts('all');
			}
		}
	});

	// Export posts as a JS seed file (user can save & commit to repo)
	const exportBtn = document.getElementById('export-posts');
	if(exportBtn){
		exportBtn.addEventListener('click', ()=>{
			const posts = window.blogData.loadPosts();
			const content = 'window.__BLOG_SEED = ' + JSON.stringify(posts, null, 2) + ';\n';
			const blob = new Blob([content], {type: 'application/javascript'});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a'); a.href = url; a.download = 'blog-seed.js'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
			alert('blog-seed.js downloaded. Kaydedip repo ya ekleyin (ör: site root)');
		});
	}
});
