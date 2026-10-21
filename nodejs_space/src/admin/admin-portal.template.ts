export const ADMIN_PORTAL_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pusena Yönetim Portalı</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <style>
    :root { --primary:#C96BAE; --primary-dark:#9A3B7E; --bg:#0F1117; --card:#1A1D27; --border:#2A2F40; --text:#F3F4F6; --muted:#9CA3AF; --danger:#EF4444; --success:#10B981; --accent:#6366F1; --teal:#14B8A6; --warning:#F59E0B; }
    * { box-sizing:border-box; margin:0; padding:0; font-family:'Inter',sans-serif; }
    body { background:var(--bg); color:var(--text); min-height:100vh; display:flex; }
    #login-overlay { position:fixed; inset:0; background:rgba(15,17,23,.95); backdrop-filter:blur(10px); z-index:1000; display:flex; align-items:center; justify-content:center; }
    .login-box { background:var(--card); border:1px solid var(--border); padding:36px; border-radius:20px; width:100%; max-width:400px; text-align:center; }
    .login-box h2 { font-size:24px; margin-bottom:8px; color:var(--primary); }
    .form-group { text-align:left; margin-bottom:14px; }
    .form-group label { display:block; font-size:12px; font-weight:600; margin-bottom:6px; color:var(--muted); }
    .form-control { width:100%; padding:11px 14px; background:#12141D; border:1px solid var(--border); border-radius:10px; color:#fff; font-size:14px; outline:none; }
    .form-control:focus { border-color:var(--primary); }
    textarea.form-control { resize:vertical; min-height:80px; }
    .btn { padding:10px 16px; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; transition:.2s; }
    .btn-primary { background:var(--primary); color:#fff; }
    .btn-primary:hover { background:var(--primary-dark); }
    .btn-danger { background:var(--danger); color:#fff; }
    .btn-accent { background:var(--accent); color:#fff; }
    .btn-teal { background:var(--teal); color:#fff; }
    .btn-ghost { background:#242938; color:var(--text); border:1px solid var(--border); }
    .btn-sm { padding:6px 10px; font-size:11px; border-radius:7px; }
    .btn-block { width:100%; }
    .btn-icon { width:38px; height:38px; padding:0; display:inline-flex; align-items:center; justify-content:center; font-size:16px; }
    aside { width:250px; background:var(--card); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:20px 14px; flex-shrink:0; }
    .brand { font-size:20px; font-weight:800; color:var(--primary); margin-bottom:24px; padding-left:4px; display:flex; align-items:center; gap:10px; }
    .brand img { width:40px; height:40px; object-fit:contain; border-radius:10px; flex-shrink:0; background:#000; }
    .login-logo { width:108px; height:108px; object-fit:contain; display:block; margin:0 auto 12px; border-radius:20px; background:#000; }
    .nav-item { display:flex; align-items:center; gap:10px; padding:11px 12px; border-radius:10px; color:var(--muted); cursor:pointer; margin-bottom:4px; font-weight:600; font-size:13px; }
    .nav-item:hover, .nav-item.active { background:#242938; color:#fff; }
    .nav-item.active { color:var(--primary); background:rgba(201,107,174,.12); }
    .user-pill { margin-top:auto; padding:12px; background:#12141D; border-radius:10px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
    main { flex:1; padding:28px; overflow-y:auto; height:100vh; }
    .header-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; gap:12px; flex-wrap:wrap; }
    .header-bar h1 { font-size:22px; font-weight:800; }
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr)); gap:14px; margin-bottom:22px; }
    .stat-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:16px; }
    .stat-title { font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; margin-bottom:4px; letter-spacing:.03em; }
    .stat-value { font-size:26px; font-weight:800; }
    .stat-value.sm { font-size:20px; }
    .summary-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-bottom:22px; }
    .summary-card { background:linear-gradient(135deg,#1A1D27,#242938); border:1px solid var(--border); border-radius:14px; padding:18px; }
    .summary-card h4 { font-size:13px; color:var(--muted); margin-bottom:6px; }
    .summary-card p { font-size:15px; font-weight:700; line-height:1.4; }
    .chart-panel { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:22px; margin-bottom:22px; }
    .chart-panel h3 { font-size:16px; margin-bottom:18px; font-weight:700; }
    .bar-chart { display:flex; flex-direction:column; gap:16px; }
    .bar-row { display:flex; align-items:center; gap:14px; }
    .bar-label { width:90px; font-size:13px; font-weight:600; flex-shrink:0; }
    .bar-track { flex:1; height:28px; background:#12141D; border-radius:8px; overflow:hidden; border:1px solid var(--border); }
    .bar-fill { height:100%; border-radius:7px; display:flex; align-items:center; padding:0 10px; font-size:11px; font-weight:700; color:#fff; min-width:32px; transition:width .5s ease; }
    .bar-fill.pregnancy { background:linear-gradient(90deg,#C96BAE,#9A3B7E); }
    .bar-fill.period { background:linear-gradient(90deg,#6366F1,#4F46E5); }
    .bar-fill.relationship { background:linear-gradient(90deg,#14B8A6,#0D9488); }
    .bar-count { width:50px; text-align:right; font-weight:700; font-size:14px; }
    .toolbar { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; align-items:center; }
    .search-input { flex:1; min-width:200px; padding:10px 14px; background:#12141D; border:1px solid var(--border); border-radius:10px; color:#fff; font-size:13px; }
    .chip { padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid var(--border); background:#12141D; color:var(--muted); }
    .chip.active { background:var(--primary); color:#fff; border-color:var(--primary); }
    .table-container { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:auto; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th { background:#151822; padding:12px 16px; color:var(--muted); font-weight:600; border-bottom:1px solid var(--border); white-space:nowrap; }
    td { padding:12px 16px; border-bottom:1px solid var(--border); vertical-align:middle; }
    tr:last-child td { border-bottom:none; }
    tr:hover { background:rgba(255,255,255,.02); }
    .badge { display:inline-block; padding:3px 7px; border-radius:6px; font-size:10px; font-weight:700; margin:1px; }
    .badge-primary { background:rgba(201,107,174,.2); color:var(--primary); }
    .badge-danger { background:rgba(239,68,68,.2); color:var(--danger); }
    .badge-success { background:rgba(16,185,129,.2); color:var(--success); }
    .badge-accent { background:rgba(99,102,241,.2); color:var(--accent); }
    .badge-teal { background:rgba(20,184,166,.2); color:var(--teal); }
    .actions { display:flex; gap:6px; flex-wrap:wrap; }
    .card-panel { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:22px; margin-bottom:18px; }
    .card-panel h3 { font-size:16px; margin-bottom:14px; font-weight:700; }
    .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .post-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px; margin-bottom:16px; }
    .post-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:10px; flex-wrap:wrap; }
    .post-meta { font-size:12px; color:var(--muted); }
    .post-content { font-size:14px; line-height:1.6; margin-bottom:12px; white-space:pre-wrap; word-break:break-word; }
    .post-stats { font-size:12px; color:var(--muted); margin-bottom:12px; }
    .comments-wrap { border-left:3px solid var(--border); margin-left:12px; padding-left:16px; }
    .comment-item { background:#12141D; border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:8px; }
    .comment-header { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap; }
    .comment-author { font-weight:700; font-size:13px; }
    .comment-date { font-size:11px; color:var(--muted); }
    .comment-body { font-size:13px; line-height:1.5; color:var(--text); white-space:pre-wrap; word-break:break-word; }
    .content-layout { display:grid; grid-template-columns:280px 1fr; gap:18px; min-height:400px; }
    .content-list { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden; max-height:70vh; overflow-y:auto; }
    .content-list-item { padding:12px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:.15s; }
    .content-list-item:hover { background:#242938; }
    .content-list-item.active { background:rgba(201,107,174,.15); border-left:3px solid var(--primary); }
    .content-list-item .cli-title { font-weight:600; font-size:13px; }
    .content-list-item .cli-sub { font-size:11px; color:var(--muted); margin-top:3px; }
    .content-editor { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:22px; max-height:70vh; overflow-y:auto; }
    .content-editor h3 { margin-bottom:16px; font-size:17px; }
    .content-editor-empty { color:var(--muted); text-align:center; padding:60px 20px; font-size:14px; }
    .sub-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
    .sub-tab { padding:8px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid var(--border); background:#12141D; color:var(--muted); }
    .sub-tab.active { background:var(--primary); color:#fff; border-color:var(--primary); }
    .input-row { display:flex; gap:8px; align-items:center; }
    .input-row .form-control { flex:1; }
    .selected-user-pill { margin-top:8px; padding:8px 12px; background:#12141D; border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--teal); display:none; }
    .mini-list { max-height:180px; overflow-y:auto; border:1px solid var(--border); border-radius:8px; margin-top:8px; }
    .mini-list-item { padding:8px 12px; border-bottom:1px solid var(--border); font-size:12px; }
    .mini-list-item:last-child { border-bottom:none; }
    .data-table { width:100%; font-size:12px; border-collapse:collapse; margin-top:8px; }
    .data-table th, .data-table td { padding:6px 10px; border:1px solid var(--border); text-align:left; }
    .data-table th { background:#151822; color:var(--muted); }
    .menu-btn { display:none; }
    .sidebar-backdrop { display:none; }
    @media(max-width:900px){
      aside { display:none; position:fixed; left:0; top:0; bottom:0; z-index:850; }
      aside.open { display:flex; }
      .menu-btn { display:inline-flex; }
      .sidebar-backdrop.open { display:block; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:840; }
      main { padding:16px; }
      .grid-2, .content-layout { grid-template-columns:1fr; }
      .content-list { max-height:240px; }
    }
    #modal-overlay, #picker-overlay, #edit-overlay { position:fixed; inset:0; background:rgba(0,0,0,.65); z-index:900; display:none; align-items:center; justify-content:center; padding:20px; }
    .modal { background:var(--card); border:1px solid var(--border); border-radius:18px; width:100%; max-width:720px; max-height:90vh; overflow-y:auto; padding:24px; }
    .modal.wide { max-width:900px; }
    .modal-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; gap:12px; }
    .modal-header h2 { font-size:20px; font-weight:800; }
    .info-grid { display:grid; grid-template-columns:140px 1fr; gap:8px 16px; font-size:13px; margin-bottom:16px; }
    .info-grid .lbl { color:var(--muted); font-weight:600; }
    .section-title { font-size:14px; font-weight:800; margin:16px 0 10px; color:var(--primary); }
    .template-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
    .template-btn { padding:8px 12px; background:#12141D; border:1px solid var(--border); border-radius:8px; font-size:11px; cursor:pointer; color:var(--text); }
    .template-btn:hover { border-color:var(--primary); }
    .preview-box { background:#12141D; border:1px solid var(--border); border-radius:12px; padding:14px; margin-top:12px; }
    .preview-box .pt { font-weight:800; margin-bottom:4px; }
    .preview-box .pb { color:var(--muted); font-size:13px; line-height:1.5; }
    .switch-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border); }
    .module-chips { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
    .module-chip { padding:6px 12px; border-radius:8px; border:1px solid var(--border); cursor:pointer; font-size:12px; font-weight:600; }
    .module-chip.sel { background:var(--primary); border-color:var(--primary); color:#fff; }
    .picker-search { margin-bottom:14px; }
    .picker-list { max-height:360px; overflow-y:auto; border:1px solid var(--border); border-radius:10px; }
    .picker-item { padding:12px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:.15s; }
    .picker-item:hover { background:#242938; }
    .picker-item .pi-name { font-weight:700; font-size:14px; }
    .picker-item .pi-email { font-size:12px; color:var(--muted); margin-top:2px; }
    .toast { position:fixed; bottom:24px; right:24px; background:var(--success); color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; z-index:2000; display:none; box-shadow:0 8px 24px rgba(0,0,0,.4); }
    .empty-state { text-align:center; color:var(--muted); padding:40px 20px; font-size:14px; }
  </style>
</head>
<body>
  <div id="login-overlay">
    <div class="login-box">
      <img src="/pusena-logo.png" alt="Pusena" class="login-logo">
      <h2>Pusena Admin</h2>
      <p style="color:var(--muted);font-size:13px;margin:8px 0 20px">Yönetim portalına giriş yapın</p>
      <div id="login-err" style="color:var(--danger);font-size:12px;margin-bottom:12px;display:none"></div>
      <div class="form-group"><label>E-posta</label><input type="text" id="login-user" class="form-control" value="admin@bloom.com" onkeydown="if(event.key==='Enter')login()"></div>
      <div class="form-group"><label>Şifre</label><input type="password" id="login-pass" class="form-control" onkeydown="if(event.key==='Enter')login()"></div>
      <button class="btn btn-primary btn-block" onclick="login()">Giriş Yap</button>
    </div>
  </div>

  <div class="sidebar-backdrop" id="sidebar-backdrop" onclick="closeSidebar()"></div>
  <aside id="sidebar">
    <div class="brand"><img src="/pusena-logo.png" alt="Pusena"><span>Pusena Panel</span></div>
    <div class="nav-item active" data-tab="dashboard" onclick="switchTab('dashboard',this)">📊 Genel Bakış</div>
    <div class="nav-item" data-tab="users" onclick="switchTab('users',this)">👥 Kullanıcılar</div>
    <div class="nav-item" data-tab="deleted" onclick="switchTab('deleted',this)">🗑️ Silinen Hesaplar</div>
    <div class="nav-item" data-tab="posts" onclick="switchTab('posts',this)">💬 Topluluk</div>
    <div class="nav-item" data-tab="moderation" onclick="switchTab('moderation',this)">🛡️ Moderasyon</div>
    <div class="nav-item" data-tab="notifs" onclick="switchTab('notifs',this)">🔔 Bildirim Merkezi</div>
    <div class="nav-item" data-tab="content" onclick="switchTab('content',this)">📚 İçerik Yönetimi</div>
    <div class="user-pill">
      <div><div id="admin-name" style="font-weight:700;font-size:13px">Admin</div><div style="font-size:11px;color:var(--muted)">Yönetici</div></div>
      <button class="btn btn-danger btn-sm" onclick="logout()">Çıkış</button>
    </div>
  </aside>

  <main>
    <div class="header-bar">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn btn-ghost btn-sm menu-btn btn-icon" onclick="toggleSidebar()" aria-label="Menü">☰</button>
        <h1 id="page-title">Genel Bakış</h1>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="refreshCurrentTab()">🔄 Yenile</button>
    </div>

    <div id="tab-dashboard">
      <div class="summary-row" id="dash-summary"></div>
      <div class="stats-grid" id="dash-stats"></div>
      <div class="chart-panel">
        <h3>Modül Kullanıcı Dağılımı</h3>
        <div class="bar-chart" id="module-chart"></div>
      </div>
    </div>

    <div id="tab-users" style="display:none">
      <div class="toolbar">
        <input type="text" id="user-search" class="search-input" placeholder="İsim veya e-posta ara..." oninput="debounceSearch()">
        <span class="chip active" data-filter="all" onclick="setFilter('all',this)">Tümü</span>
        <span class="chip" data-filter="active" onclick="setFilter('active',this)">Aktif</span>
        <span class="chip" data-filter="pending" onclick="setFilter('pending',this)">Bekleyen</span>
        <span class="chip" data-filter="admin" onclick="setFilter('admin',this)">Admin</span>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Modüller</th><th>Durum</th><th>Kayıt</th><th>İşlemler</th></tr></thead>
          <tbody id="users-tbody"></tbody>
        </table>
      </div>
    </div>

    <div id="tab-deleted" style="display:none">
      <div class="table-container">
        <table>
          <thead><tr><th>Ad</th><th>E-posta</th><th>Neden</th><th>Not</th><th>Tarih</th></tr></thead>
          <tbody id="deleted-tbody"></tbody>
        </table>
      </div>
    </div>

    <div id="tab-posts" style="display:none">
      <div class="toolbar">
        <input type="text" id="post-search" class="search-input" placeholder="Gönderi veya yorum ara..." oninput="filterPosts()">
      </div>
      <div id="posts-container"></div>
    </div>

    <div id="tab-moderation" style="display:none">
      <div class="card-panel">
        <h3>🛡️ Topluluk Şikayetleri (Raporlanan Gönderiler)</h3>
        <p style="color:var(--muted);font-size:13px;margin-bottom:14px">Kullanıcılar tarafından şikayet edilen gönderileri inceleyebilir, gönderiyi silebilir veya şikayetleri kapatabilirsiniz.</p>
        <div class="table-container">
          <table>
            <thead><tr><th>Yazar</th><th>Kategori</th><th>Gönderi İçeriği</th><th>Şikayet Sayısı</th><th>Nedenler</th><th>Tarih</th><th>İşlemler</th></tr></thead>
            <tbody id="reported-posts-tbody"></tbody>
          </table>
        </div>
      </div>

      <div class="card-panel" style="margin-top:20px">
        <h3>🤖 Yapay Zekâ Yanıt Şikayetleri (AI Sohbet)</h3>
        <p style="color:var(--muted);font-size:13px;margin-bottom:14px">Kullanıcılar tarafından bildirilen hatalı veya güvensiz yapay zekâ asistan yanıtları.</p>
        <div class="table-container">
          <table>
            <thead><tr><th>Tarih</th><th>Kullanıcı Sorusu</th><th>Asistan Yanıtı</th><th>Bildirim Nedeni</th><th>Açıklama</th><th>İşlemler</th></tr></thead>
            <tbody id="reported-ai-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="tab-notifs" style="display:none">
      <div class="card-panel">
        <h3>Hazır Şablonlar</h3>
        <div class="template-row">
          <button class="template-btn" onclick="applyTemplate('🌸 Regl Hatırlatması','Yarın regl döneminiz başlayabilir. Kendinize iyi bakın!','period','reminder','module','period')">Regl Hatırlatma</button>
          <button class="template-btn" onclick="applyTemplate('🤰 Gebelik İpucu','Bu hafta su tüketiminizi artırmayı unutmayın!','pregnancy','tip','module','pregnancy')">Gebelik İpucu</button>
          <button class="template-btn" onclick="applyTemplate('💕 Özel Gün','Yaklaşan özel gününüz var!','relationship','reminder','module','relationship')">İlişki</button>
          <button class="template-btn" onclick="applyTemplate('📢 Pusena Duyurusu','Yeni özellikler sizi bekliyor!','sistem','admin','all')">Genel Duyuru</button>
        </div>
      </div>
      <div class="grid-2">
        <div class="card-panel">
          <h3>Bildirim Gönder</h3>
          <div class="form-group"><label>Hedef</label>
            <select id="notif-target" class="form-control" onchange="toggleNotifTarget()">
              <option value="all">Tüm Kullanıcılar</option>
              <option value="module">Modül Bazlı</option>
              <option value="user">Belirli Kullanıcı</option>
            </select>
          </div>
          <div class="form-group" id="notif-module-wrap" style="display:none"><label>Modül</label>
            <select id="notif-module-target" class="form-control"><option value="pregnancy">Gebelik</option><option value="period">Regl</option><option value="relationship">İlişki</option></select>
          </div>
          <div class="form-group" id="notif-user-wrap" style="display:none"><label>Kullanıcı ID</label>
            <div class="input-row">
              <input id="notif-uid" class="form-control" placeholder="Kullanıcı UUID">
              <button class="btn btn-teal btn-icon" type="button" onclick="openUserPicker()" title="Kullanıcı Seç">📖</button>
            </div>
            <div id="notif-selected-user" class="selected-user-pill"></div>
          </div>
          <div class="form-group"><label>Kategori</label>
            <select id="notif-module" class="form-control"><option value="sistem">Sistem</option><option value="pregnancy">Gebelik</option><option value="period">Regl</option><option value="relationship">İlişki</option><option value="community">Topluluk</option></select>
          </div>
          <div class="form-group"><label>Tip</label>
            <select id="notif-type" class="form-control"><option value="admin">Duyuru</option><option value="tip">İpucu</option><option value="reminder">Hatırlatma</option></select>
          </div>
          <div class="form-group"><label>Başlık</label><input id="notif-title" class="form-control" maxlength="100"></div>
          <div class="form-group"><label>İçerik</label><textarea id="notif-body" class="form-control" rows="4" maxlength="500"></textarea></div>
          <button class="btn btn-primary" onclick="sendBroadcast()">📤 Bildirimi Gönder</button>
        </div>
        <div class="card-panel">
          <h3>Önizleme</h3>
          <div class="preview-box">
            <div style="font-size:10px;color:var(--muted);margin-bottom:6px">PUSENA · <span id="prev-mod">SISTEM</span></div>
            <div class="pt" id="prev-title">Bildirim Başlığı</div>
            <div class="pb" id="prev-body">Bildirim içeriği burada görünecek...</div>
            <div style="font-size:11px;color:var(--teal);margin-top:10px" id="prev-target">→ Tüm kullanıcılar</div>
          </div>
        </div>
      </div>
    </div>

    <div id="tab-content" style="display:none">
      <div class="toolbar">
        <input type="text" id="content-search" class="search-input" placeholder="Listede ara..." oninput="filterContentList()">
      </div>
      <div class="sub-tabs" id="content-subtabs">
        <span class="sub-tab active" data-sub="weeks" onclick="switchContentSub('weeks',this)">Gebelik Haftaları</span>
        <span class="sub-tab" data-sub="symptoms" onclick="switchContentSub('symptoms',this)">Semptom Tipleri</span>
        <span class="sub-tab" data-sub="names" onclick="switchContentSub('names',this)">Bebek İsimleri</span>
        <span class="sub-tab" data-sub="articles" onclick="switchContentSub('articles',this)">Makaleler</span>
        <span class="sub-tab" data-sub="faqs" onclick="switchContentSub('faqs',this)">SSS</span>
        <span class="sub-tab" data-sub="myths" onclick="switchContentSub('myths',this)">Mitler</span>
      </div>
      <div class="content-layout">
        <div class="content-list" id="content-list"></div>
        <div class="content-editor" id="content-editor"><div class="content-editor-empty">Düzenlemek için soldan bir öğe seçin</div></div>
      </div>
    </div>
  </main>

  <div id="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal wide" id="user-modal">
      <div class="modal-header">
        <div><h2 id="modal-name">Kullanıcı</h2><div id="modal-email" style="color:var(--muted);font-size:13px;margin-top:4px"></div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-accent btn-sm" id="modal-edit-btn" onclick="toggleEditMode()">✏️ Düzenle</button>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
      </div>
      <div id="modal-view"></div>
      <div id="modal-edit" style="display:none"></div>
      <div style="margin-top:16px;display:flex;gap:10px">
        <button class="btn btn-primary btn-sm" id="modal-save-btn" style="display:none" onclick="saveUser()">💾 Kaydet</button>
        <button class="btn btn-danger btn-sm" id="modal-delete-btn" onclick="deleteUserFromModal()">🗑 Kullanıcıyı Sil</button>
      </div>
    </div>
  </div>

  <div id="picker-overlay" onclick="if(event.target===this)closeUserPicker()">
    <div class="modal">
      <div class="modal-header">
        <h2>📖 Kullanıcı Seç</h2>
        <button class="btn btn-ghost btn-sm" onclick="closeUserPicker()">✕</button>
      </div>
      <div class="picker-search">
        <input type="text" id="picker-search" class="form-control" placeholder="İsim veya e-posta ile ara..." oninput="filterPickerList()">
      </div>
      <div class="picker-list" id="picker-list"></div>
    </div>
  </div>

  <div id="edit-overlay" onclick="if(event.target===this)closeEditModal()">
    <div class="modal">
      <div class="modal-header">
        <h2 id="edit-modal-title">Düzenle</h2>
        <button class="btn btn-ghost btn-sm" onclick="closeEditModal()">✕</button>
      </div>
      <div id="edit-modal-body"></div>
      <div style="margin-top:16px;display:flex;gap:10px">
        <button class="btn btn-primary btn-sm" onclick="saveEditModal()">💾 Kaydet</button>
        <button class="btn btn-ghost btn-sm" onclick="closeEditModal()">İptal</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const MODULE_LABELS = { pregnancy: 'Gebelik', period: 'Regl', relationship: 'İlişki', sistem: 'Sistem', community: 'Topluluk' };
    let TOKEN = localStorage.getItem('pusena_admin_token') || localStorage.getItem('bloom_admin_token') || '';
    let currentTab = localStorage.getItem('pusena_admin_tab') || localStorage.getItem('bloom_admin_tab') || 'dashboard';
    let contentSubTab = 'weeks';
    let allUsers = [];
    let pickerUsers = [];
    let userFilter = 'all';
    let searchTimeout;
    let currentUser = null;
    let editMode = false;
    let editModules = [];
    let contentCache = {};
    let selectedContentItem = null;
    let editModalState = null;
    let selectedNotifUser = null;
    let refreshing = null;

    function foldTr(s) {
      return String(s || '')
        .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
        .toLocaleLowerCase('tr-TR')
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebar-backdrop').classList.toggle('open');
    }
    function closeSidebar() {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-backdrop').classList.remove('open');
    }

    ['notif-title','notif-body','notif-module','notif-target','notif-module-target','notif-uid'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.addEventListener('input', updatePreview); el.addEventListener('change', updatePreview); }
    });

    if (TOKEN) { document.getElementById('login-overlay').style.display = 'none'; initApp(); }

    function esc(s) {
      return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function modLabel(m) { return MODULE_LABELS[m] || m; }

    function modBadges(mods) {
      if (!mods || !mods.length) return '-';
      return mods.map(function(m) {
        var cls = m === 'pregnancy' ? 'badge-primary' : m === 'period' ? 'badge-accent' : m === 'relationship' ? 'badge-teal' : 'badge-primary';
        return '<span class="badge ' + cls + '">' + esc(modLabel(m)) + '</span>';
      }).join(' ');
    }

    async function tryRefresh() {
      var rt = localStorage.getItem('pusena_admin_refresh') || localStorage.getItem('bloom_admin_refresh');
      if (!rt) return false;
      if (refreshing) return refreshing;
      refreshing = (async function() {
        try {
          var res = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rt })
          });
          var data = await res.json().catch(function() { return {}; });
          if (!res.ok || !data.token) return false;
          TOKEN = data.token;
          localStorage.setItem('pusena_admin_token', TOKEN);
          if (data.refreshToken) localStorage.setItem('pusena_admin_refresh', data.refreshToken);
          return true;
        } catch (e) { return false; }
      })();
      var ok = await refreshing;
      refreshing = null;
      return ok;
    }

    async function api(url, opts) {
      opts = opts || {};
      opts.headers = opts.headers || {};
      opts.headers['Content-Type'] = 'application/json';
      if (TOKEN) opts.headers['Authorization'] = 'Bearer ' + TOKEN;
      var res = await fetch(url, opts);
      if (res.status === 401) {
        var ok = await tryRefresh();
        if (ok) {
          opts.headers['Authorization'] = 'Bearer ' + TOKEN;
          res = await fetch(url, opts);
        } else {
          logout();
          throw new Error('Yetkisiz erişim');
        }
      }
      if (res.status === 403) { logout(); throw new Error('Yetkisiz erişim'); }
      var data = await res.json().catch(function() { return {}; });
      if (!res.ok) throw new Error(data.message || 'İstek başarısız');
      return data;
    }

    function toast(msg, ok) {
      if (ok === undefined) ok = true;
      var t = document.getElementById('toast');
      t.innerText = msg;
      t.style.background = ok ? 'var(--success)' : 'var(--danger)';
      t.style.display = 'block';
      setTimeout(function() { t.style.display = 'none'; }, 3000);
    }

    async function login() {
      var email = document.getElementById('login-user').value;
      var password = document.getElementById('login-pass').value;
      var err = document.getElementById('login-err');
      err.style.display = 'none';
      try {
        var res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:email,password:password}) });
        var data = await res.json();
        if (!res.ok || !data.token) { err.innerText = data.message || 'Giriş yapılamadı'; err.style.display = 'block'; return; }
        if (!data.user || !data.user.isAdmin) { err.innerText = 'Admin yetkisi gerekli'; err.style.display = 'block'; return; }
        TOKEN = data.token;
        localStorage.setItem('pusena_admin_token', TOKEN);
        if (data.refreshToken) localStorage.setItem('pusena_admin_refresh', data.refreshToken);
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-name').innerText = data.user.name;
        initApp();
      } catch (e) { err.innerText = 'Bağlantı hatası'; err.style.display = 'block'; }
    }

    function logout() {
      TOKEN = '';
      localStorage.removeItem('pusena_admin_token');
      localStorage.removeItem('pusena_admin_refresh');
      localStorage.removeItem('bloom_admin_token');
      localStorage.removeItem('bloom_admin_refresh');
      location.reload();
    }

    function initApp() {
      var saved = localStorage.getItem('pusena_admin_tab') || localStorage.getItem('bloom_admin_tab') || 'dashboard';
      var el = document.querySelector('.nav-item[data-tab="' + saved + '"]');
      switchTab(saved, el);
    }

    function switchTab(tab, el) {
      currentTab = tab;
      localStorage.setItem('pusena_admin_tab', tab);
      document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
      if (el) el.classList.add('active');
      closeSidebar();
      ['dashboard','users','deleted','posts','moderation','notifs','content'].forEach(function(t) {
        var el2 = document.getElementById('tab-' + t);
        if (el2) el2.style.display = tab === t ? 'block' : 'none';
      });
      var titles = { dashboard:'Genel Bakış', users:'Kullanıcı Yönetimi', deleted:'Silinen Hesaplar', posts:'Topluluk Yönetimi', moderation:'Topluluk ve AI Moderasyonu', notifs:'Bildirim Merkezi', content:'İçerik Yönetimi' };
      document.getElementById('page-title').innerText = titles[tab] || tab;
      if (tab === 'dashboard') loadStats();
      if (tab === 'users') loadUsers();
      if (tab === 'deleted') loadDeleted();
      if (tab === 'posts') loadPostsWithComments();
      if (tab === 'moderation') loadModeration();
      if (tab === 'content') loadContentSub();
    }

    function refreshCurrentTab() {
      switchTab(currentTab, document.querySelector('.nav-item.active'));
      toast('Yenilendi');
    }

    function fmt(d) { return d ? new Date(d).toLocaleDateString('tr-TR') : '-'; }
    function fmtDT(d) { return d ? new Date(d).toLocaleString('tr-TR') : '-'; }

    async function loadStats() {
      try {
        var s = await api('/api/admin/stats');
        var cards = [
          ['Toplam Üye', s.totalUsers], ['Aktif Kullanıcı', s.activeUsers], ['Admin', s.adminUsers],
          ['Bugün Kayıt', s.newUsersToday], ['7 Gün Kayıt', s.newUsersWeek],
          ['Gönderi', s.totalPosts], ['Yorum', s.totalComments], ['Silinen Hesap', s.deletedAccounts],
          ['Gebelik Modülü', s.pregnancyUsers], ['Regl Modülü', s.periodUsers], ['İlişki Modülü', s.relationshipUsers],
          ['Bildirim Gönderildi', s.notificationsSent], ['Kurulum Bekleyen', s.pendingSetup],
          ['Aktif Gebelik', s.activePregnancies], ['Kayıtlı Semptom', s.symptomsLogged],
          ['Semptom Tipi', s.symptomTypesCount], ['Bebek İsmi', s.babyNamesCount],
          ['Gebelik Haftası', s.pregnancyWeeksCount], ['Özel Gün', s.specialDatesCount],
          ['Okunmamış Bildirim', s.unreadNotifications],
          ['Eşleşmiş Çift', s.pairedCouples || 0], ['Açık İstek', s.openNudges || 0],
          ['Çift Mesajı', s.coupleMessages || 0]
        ];
        document.getElementById('dash-stats').innerHTML = cards.map(function(c) {
          return '<div class="stat-card"><div class="stat-title">' + c[0] + '</div><div class="stat-value">' + c[1] + '</div></div>';
        }).join('');

        var maxMod = Math.max(s.pregnancyUsers || 0, s.periodUsers || 0, s.relationshipUsers || 0, 1);
        var bars = [
          { key:'pregnancy', label:'Gebelik', val:s.pregnancyUsers || 0, cls:'pregnancy' },
          { key:'period', label:'Regl', val:s.periodUsers || 0, cls:'period' },
          { key:'relationship', label:'İlişki', val:s.relationshipUsers || 0, cls:'relationship' }
        ];
        document.getElementById('module-chart').innerHTML = bars.map(function(b) {
          var pct = Math.round((b.val / maxMod) * 100);
          return '<div class="bar-row"><div class="bar-label">' + b.label + '</div><div class="bar-track"><div class="bar-fill ' + b.cls + '" style="width:' + pct + '%">' + (pct > 15 ? b.val : '') + '</div></div><div class="bar-count">' + b.val + '</div></div>';
        }).join('');

        var setupRate = s.totalUsers ? Math.round((s.activeUsers / s.totalUsers) * 100) : 0;
        document.getElementById('dash-summary').innerHTML =
          '<div class="summary-card"><h4>Platform Özeti</h4><p>' + s.totalUsers + ' kullanıcı · ' + s.totalPosts + ' gönderi · ' + s.totalComments + ' yorum</p></div>' +
          '<div class="summary-card"><h4>Aktivasyon Oranı</h4><p>%' + setupRate + ' kurulum tamamlamış (' + s.activeUsers + '/' + s.totalUsers + ')</p></div>' +
          '<div class="summary-card"><h4>Modül Toplamı</h4><p>' + ((s.pregnancyUsers||0)+(s.periodUsers||0)+(s.relationshipUsers||0)) + ' aktif modül kaydı</p></div>' +
          '<div class="summary-card"><h4>İçerik Envanteri</h4><p>' + s.pregnancyWeeksCount + ' hafta · ' + s.symptomTypesCount + ' semptom · ' + s.babyNamesCount + ' isim</p></div>' +
          '<div class="summary-card"><h4>Çift Senkronu</h4><p>' + (s.pairedCouples || 0) + ' eşleşme · ' + (s.openNudges || 0) + ' açık istek · ' + (s.coupleMessages || 0) + ' mesaj</p></div>';
      } catch (e) { toast(e.message, false); }
    }

    function debounceSearch() { clearTimeout(searchTimeout); searchTimeout = setTimeout(loadUsers, 300); }
    function setFilter(f, el) {
      userFilter = f;
      document.querySelectorAll('#tab-users .chip').forEach(function(c) { c.classList.remove('active'); });
      el.classList.add('active');
      renderUsers();
    }

    async function loadUsers() {
      try {
        var q = (document.getElementById('user-search') && document.getElementById('user-search').value.trim()) || '';
        var url = '/api/admin/users?limit=200' + (q ? '&search=' + encodeURIComponent(q) : '');
        var data = await api(url);
        allUsers = data.items || [];
        renderUsers();
      } catch (e) { toast(e.message, false); }
    }

    function renderUsers() {
      var list = allUsers.slice();
      if (userFilter === 'active') list = list.filter(function(u) { return u.hasCompletedSetup; });
      if (userFilter === 'pending') list = list.filter(function(u) { return !u.hasCompletedSetup; });
      if (userFilter === 'admin') list = list.filter(function(u) { return u.isAdmin; });
      var tbody = document.getElementById('users-tbody');
      if (!list.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">Kullanıcı bulunamadı</td></tr>'; return; }
      tbody.innerHTML = list.map(function(u) {
        return '<tr>' +
          '<td><strong>' + esc(u.name) + '</strong>' + (u.isAdmin ? ' <span class="badge badge-primary">ADMIN</span>' : '') + '</td>' +
          '<td>' + esc(u.email) + '</td>' +
          '<td>' + modBadges(u.activeModules) + '</td>' +
          '<td>' + (u.hasCompletedSetup ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Bekliyor</span>') + '</td>' +
          '<td>' + fmt(u.createdAt) + '</td>' +
          '<td><div class="actions">' +
            '<button class="btn btn-teal btn-sm" onclick="viewUser(\\'' + u.id + '\\')">👁 Gör</button>' +
            '<button class="btn btn-accent btn-sm" onclick="viewUser(\\'' + u.id + '\\',true)">✏️ Düzenle</button>' +
            (!u.isAdmin ? '<button class="btn btn-danger btn-sm" onclick="deleteUser(\\'' + u.id + '\\')">🗑 Sil</button>' : '') +
          '</div></td></tr>';
      }).join('');
    }

    async function viewUser(id, edit) {
      try {
        currentUser = await api('/api/admin/users/' + id);
        editMode = !!edit;
        editModules = (currentUser.activeModules || []).slice();
        document.getElementById('modal-name').innerText = currentUser.name;
        document.getElementById('modal-email').innerText = currentUser.email;
        renderModalView();
        renderModalEdit();
        document.getElementById('modal-edit').style.display = editMode ? 'block' : 'none';
        document.getElementById('modal-view').style.display = editMode ? 'none' : 'block';
        document.getElementById('modal-save-btn').style.display = editMode ? 'inline-block' : 'none';
        document.getElementById('modal-edit-btn').innerText = editMode ? '👁 Görüntüle' : '✏️ Düzenle';
        document.getElementById('modal-overlay').style.display = 'flex';
      } catch (e) { toast(e.message, false); }
    }

    function statMini(l, v) {
      return '<div class="stat-card"><div class="stat-title">' + l + '</div><div class="stat-value sm">' + v + '</div></div>';
    }

    function infoSection(title, rows) {
      return '<div class="section-title">' + title + '</div><div class="info-grid">' +
        rows.map(function(r) { return '<div class="lbl">' + r[0] + '</div><div>' + esc(String(r[1])) + '</div>'; }).join('') +
        '</div>';
    }

    function renderListSection(title, items, cols) {
      if (!items || !items.length) return '';
      var head = cols.map(function(c) { return '<th>' + c.label + '</th>'; }).join('');
      var body = items.map(function(item) {
        return '<tr>' + cols.map(function(c) { return '<td>' + esc(String(c.val(item))) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return '<div class="section-title">' + title + '</div><div class="mini-list"><table class="data-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
    }

    function renderModalView() {
      var u = currentUser;
      var html = '<div class="stats-grid" style="margin-bottom:12px">' +
        statMini('Gönderi', u.postsCount) + statMini('Yorum', u.commentsCount) +
        statMini('Semptom', u.symptomsCount || 0) + statMini('Bildirim', u.notificationsCount || 0) +
        statMini('Döngü', u.periodCyclesCount || 0) + statMini('Engellenen', u.blockedUsersCount || 0) +
        statMini('Rapor', u.reportsCount || 0) + '</div>';

      html += infoSection('Hesap', [
        ['ID', u.id], ['Ad', u.name], ['Takma Ad', u.nickname || '-'], ['E-posta', u.email],
        ['Biyografi', u.biography || '-'], ['Partner Kodu', u.partnerCode || '-'],
        ['Google ID', u.googleId || '-'], ['Admin', u.isAdmin ? 'Evet' : 'Hayır'],
        ['Kurulum', u.hasCompletedSetup ? 'Tamamlandı' : 'Bekliyor'],
        ['Modüller', (u.activeModules || []).map(modLabel).join(', ') || '-'],
        ['Kayıt', fmtDT(u.createdAt)], ['Güncelleme', fmtDT(u.updatedAt)]
      ]);

      if (u.settings) {
        html += infoSection('Ayarlar', [
          ['Gebelik Haftalık', u.settings.pregnancyWeekly ? 'Açık' : 'Kapalı'],
          ['Gebelik İpuçları', u.settings.pregnancyTips ? 'Açık' : 'Kapalı'],
          ['Regl Hatırlatma', u.settings.periodReminder ? 'Açık' : 'Kapalı'],
          ['Doğurganlık Uyarı', u.settings.fertilityAlert ? 'Açık' : 'Kapalı'],
          ['Özel Gün Hatırlatma', u.settings.specialDateReminder ? 'Açık' : 'Kapalı'],
          ['Topluluk Beğeni', u.settings.communityLikes ? 'Açık' : 'Kapalı'],
          ['Topluluk Yorum', u.settings.communityComments ? 'Açık' : 'Kapalı'],
          ['Profil Herkese Açık', u.settings.profilePublic ? 'Evet' : 'Hayır'],
          ['Gönderiler Görünür', u.settings.showCommunityPosts ? 'Evet' : 'Hayır']
        ]);
      }

      if (u.pregnancy) {
        html += infoSection('Gebelik', [
          ['SAT', fmt(u.pregnancy.lastMenstrualPeriod)], ['Termin', fmt(u.pregnancy.dueDate)],
          ['Bebek Adı', u.pregnancy.babyName || '-'], ['Durum', u.pregnancy.isActive ? 'Aktif' : 'Pasif']
        ]);
      }

      if (u.period) {
        html += infoSection('Son Döngü', [
          ['Başlangıç', fmt(u.period.startDate)], ['Bitiş', fmt(u.period.endDate)],
          ['Döngü Uzunluğu', (u.period.cycleLength || '-') + ' gün'],
          ['Regl Süresi', (u.period.periodLength || '-') + ' gün']
        ]);
      }

      if (u.relationship) {
        html += infoSection('İlişki', [
          ['Partner', u.relationship.partnerName || '-'], ['Başlangıç', fmt(u.relationship.startDate)]
        ]);
      }

      if (u.pairedUser) {
        html += infoSection('Eşleşmiş Partner', [
          ['Ad', u.pairedUser.name], ['E-posta', u.pairedUser.email], ['Partner Kodu', u.pairedUser.partnerCode || '-']
        ]);
      }

      html += renderListSection('Son Semptomlar', u.recentSymptoms, [
        { label:'Tarih', val:function(i){ return fmt(i.date); } },
        { label:'Tip', val:function(i){ return i.type; } },
        { label:'Şiddet', val:function(i){ return i.severity; } },
        { label:'Not', val:function(i){ return i.notes || '-'; } }
      ]);

      html += renderListSection('Özel Günler', u.specialDates, [
        { label:'Tarih', val:function(i){ return fmt(i.date); } },
        { label:'Başlık', val:function(i){ return i.title || '-'; } },
        { label:'Açıklama', val:function(i){ return i.description || '-'; } }
      ]);

      html += renderListSection('Regl Döngüleri', u.periodCycles, [
        { label:'Başlangıç', val:function(i){ return fmt(i.startDate); } },
        { label:'Bitiş', val:function(i){ return fmt(i.endDate); } },
        { label:'Döngü', val:function(i){ return (i.cycleLength || '-') + ' gün'; } },
        { label:'Regl', val:function(i){ return (i.periodLength || '-') + ' gün'; } }
      ]);

      html += renderListSection('Son Bildirimler', u.recentNotifications, [
        { label:'Tarih', val:function(i){ return fmtDT(i.createdAt); } },
        { label:'Başlık', val:function(i){ return i.title; } },
        { label:'Modül', val:function(i){ return modLabel(i.module || 'sistem'); } },
        { label:'Okundu', val:function(i){ return i.isRead ? 'Evet' : 'Hayır'; } }
      ]);

      html += renderListSection('Son Gönderiler', u.recentPosts, [
        { label:'Tarih', val:function(i){ return fmtDT(i.createdAt); } },
        { label:'Kategori', val:function(i){ return i.category; } },
        { label:'İçerik', val:function(i){ return (i.content || '').slice(0, 80); } },
        { label:'❤️/💬', val:function(i){ return (i.likesCount||0) + '/' + (i.commentsCount||0); } }
      ]);

      document.getElementById('modal-view').innerHTML = html;
    }

    function renderModalEdit() {
      var u = currentUser;
      document.getElementById('modal-edit').innerHTML =
        '<div class="form-group"><label>Ad Soyad</label><input id="edit-name" class="form-control" value="' + esc(u.name) + '"></div>' +
        '<div class="form-group"><label>E-posta</label><input id="edit-email" class="form-control" value="' + esc(u.email) + '"></div>' +
        '<div class="form-group"><label>Takma Ad</label><input id="edit-nickname" class="form-control" value="' + esc(u.nickname || '') + '"></div>' +
        '<div class="form-group"><label>Biyografi</label><textarea id="edit-bio" class="form-control" rows="3">' + esc(u.biography || '') + '</textarea></div>' +
        '<div class="switch-row"><span>Admin</span><input type="checkbox" id="edit-admin" ' + (u.isAdmin ? 'checked' : '') + '></div>' +
        '<div class="switch-row"><span>Kurulum Tamamlandı</span><input type="checkbox" id="edit-setup" ' + (u.hasCompletedSetup ? 'checked' : '') + '></div>' +
        '<div class="form-group"><label>Aktif Modüller</label><div class="module-chips">' +
        ['pregnancy','period','relationship'].map(function(m) {
          return '<span class="module-chip ' + (editModules.indexOf(m) >= 0 ? 'sel' : '') + '" onclick="toggleMod(\\'' + m + '\\')">' + modLabel(m) + '</span>';
        }).join('') + '</div></div>';
    }

    function toggleMod(m) {
      editModules = editModules.indexOf(m) >= 0 ? editModules.filter(function(x){ return x !== m; }) : editModules.concat([m]);
      renderModalEdit();
    }

    function toggleEditMode() {
      editMode = !editMode;
      document.getElementById('modal-edit').style.display = editMode ? 'block' : 'none';
      document.getElementById('modal-view').style.display = editMode ? 'none' : 'block';
      document.getElementById('modal-save-btn').style.display = editMode ? 'inline-block' : 'none';
      document.getElementById('modal-edit-btn').innerText = editMode ? '👁 Görüntüle' : '✏️ Düzenle';
      if (editMode) renderModalEdit(); else renderModalView();
    }

    async function saveUser() {
      if (!currentUser) return;
      try {
        var body = {
          name: document.getElementById('edit-name').value.trim(),
          email: document.getElementById('edit-email').value.trim(),
          nickname: document.getElementById('edit-nickname').value.trim() || undefined,
          biography: document.getElementById('edit-bio').value.trim() || undefined,
          isAdmin: document.getElementById('edit-admin').checked,
          hasCompletedSetup: document.getElementById('edit-setup').checked,
          activeModules: editModules
        };
        currentUser = await api('/api/admin/users/' + currentUser.id, { method:'PATCH', body: JSON.stringify(body) });
        toast('Kullanıcı güncellendi');
        editMode = false;
        document.getElementById('modal-edit').style.display = 'none';
        document.getElementById('modal-view').style.display = 'block';
        document.getElementById('modal-save-btn').style.display = 'none';
        document.getElementById('modal-edit-btn').innerText = '✏️ Düzenle';
        renderModalView();
        loadUsers();
        loadStats();
      } catch (e) { toast(e.message, false); }
    }

    function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; currentUser = null; editMode = false; }

    async function deleteUser(id) {
      if (!confirm('Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?')) return;
      try {
        await api('/api/admin/users/' + id, { method:'DELETE' });
        toast('Kullanıcı silindi');
        closeModal();
        loadUsers();
        loadStats();
      } catch (e) { toast(e.message, false); }
    }

    function deleteUserFromModal() { if (currentUser) deleteUser(currentUser.id); }

    async function loadDeleted() {
      try {
        var data = await api('/api/admin/deleted-accounts?limit=100');
        var tbody = document.getElementById('deleted-tbody');
        if (!data.items || !data.items.length) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted)">Kayıt yok</td></tr>';
          return;
        }
        tbody.innerHTML = data.items.map(function(d) {
          return '<tr><td><strong>' + esc(d.name) + '</strong></td><td>' + esc(d.email) + '</td><td><span class="badge badge-danger">' + esc(d.reason) + '</span></td><td>' + esc(d.note || '-') + '</td><td>' + fmtDT(d.createdAt) + '</td></tr>';
        }).join('');
      } catch (e) { toast(e.message, false); }
    }

    async function loadPostsWithComments() {
      try {
        var data = await api('/api/admin/posts-with-comments?limit=100');
        var container = document.getElementById('posts-container');
        if (!data.items || !data.items.length) {
          container.innerHTML = '<div class="empty-state">Gönderi bulunamadı</div>';
          return;
        }
        container.innerHTML = data.items.map(function(p) {
          var commentsHtml = '';
          if (p.comments && p.comments.length) {
            commentsHtml = '<div class="comments-wrap">' + p.comments.map(function(c) {
              return '<div class="comment-item">' +
                '<div class="comment-header"><span class="comment-author">' + esc(c.authorName) + '</span><span class="comment-date">' + fmtDT(c.createdAt) + '</span></div>' +
                '<div class="comment-body">' + esc(c.content) + '</div>' +
                '<div class="actions" style="margin-top:8px">' +
                  '<button class="btn btn-accent btn-sm" onclick="openEditComment(\\'' + c.id + '\\')">✏️ Düzenle</button>' +
                  '<button class="btn btn-danger btn-sm" onclick="deleteComment(\\'' + c.id + '\\')">🗑 Sil</button>' +
                '</div></div>';
            }).join('') + '</div>';
          } else {
            commentsHtml = '<div class="comments-wrap"><div class="empty-state" style="padding:12px">Yorum yok</div></div>';
          }
          return '<div class="post-card">' +
            '<div class="post-header"><div><strong>' + esc(p.authorName) + '</strong> <span class="post-meta">· ' + esc(p.authorEmail || '') + '</span></div>' +
            '<span class="badge badge-primary">' + esc(p.category) + '</span></div>' +
            '<div class="post-content">' + esc(p.content) + '</div>' +
            '<div class="post-stats">❤️ ' + (p.likesCount||0) + ' · 💬 ' + (p.commentsCount||0) + ' · ' + fmtDT(p.createdAt) + (p.isEdited ? ' · düzenlendi' : '') + '</div>' +
            '<div class="actions">' +
              '<button class="btn btn-accent btn-sm" onclick="openEditPost(\\'' + p.id + '\\')">✏️ Düzenle</button>' +
              '<button class="btn btn-danger btn-sm" onclick="deletePost(\\'' + p.id + '\\')">🗑 Sil</button>' +
            '</div>' + commentsHtml + '</div>';
        }).join('');
        window._postsCache = data.items;
        filterPosts();
      } catch (e) { toast(e.message, false); }
    }

    function filterPosts() {
      var q = foldTr((document.getElementById('post-search') && document.getElementById('post-search').value) || '');
      document.querySelectorAll('#posts-container .post-card').forEach(function(el) {
        el.style.display = !q || foldTr(el.innerText).indexOf(q) >= 0 ? '' : 'none';
      });
    }

    function openEditPost(postId) {
      var post = (window._postsCache || []).find(function(p){ return p.id === postId; });
      if (!post) return;
      editModalState = { type:'post', id: postId };
      document.getElementById('edit-modal-title').innerText = 'Gönderi Düzenle';
      document.getElementById('edit-modal-body').innerHTML =
        '<div class="form-group"><label>Kategori</label><input id="edit-post-cat" class="form-control" value="' + esc(post.category) + '"></div>' +
        '<div class="form-group"><label>İçerik</label><textarea id="edit-post-content" class="form-control" rows="5">' + esc(post.content) + '</textarea></div>';
      document.getElementById('edit-overlay').style.display = 'flex';
    }

    function openEditComment(commentId) {
      var comment = null;
      (window._postsCache || []).forEach(function(p) {
        (p.comments || []).forEach(function(c) { if (c.id === commentId) comment = c; });
      });
      if (!comment) return;
      editModalState = { type:'comment', id: commentId };
      document.getElementById('edit-modal-title').innerText = 'Yorum Düzenle';
      document.getElementById('edit-modal-body').innerHTML =
        '<div class="form-group"><label>İçerik</label><textarea id="edit-comment-content" class="form-control" rows="4">' + esc(comment.content) + '</textarea></div>';
      document.getElementById('edit-overlay').style.display = 'flex';
    }

    function closeEditModal() { document.getElementById('edit-overlay').style.display = 'none'; editModalState = null; }

    async function saveEditModal() {
      if (!editModalState) return;
      try {
        if (editModalState.type === 'post') {
          var body = {
            category: document.getElementById('edit-post-cat').value.trim(),
            content: document.getElementById('edit-post-content').value.trim()
          };
          await api('/api/admin/posts/' + editModalState.id, { method:'PATCH', body: JSON.stringify(body) });
          toast('Gönderi güncellendi');
        } else if (editModalState.type === 'comment') {
          var content = document.getElementById('edit-comment-content').value.trim();
          await api('/api/admin/comments/' + editModalState.id, { method:'PATCH', body: JSON.stringify({ content: content }) });
          toast('Yorum güncellendi');
        }
        closeEditModal();
        loadPostsWithComments();
      } catch (e) { toast(e.message, false); }
    }

    async function deletePost(id) {
      if (!confirm('Gönderiyi silmek istediğinize emin misiniz?')) return;
      try {
        await api('/api/admin/posts/' + id, { method:'DELETE' });
        toast('Gönderi silindi');
        loadPostsWithComments();
      } catch (e) { toast(e.message, false); }
    }

    async function deleteComment(id) {
      if (!confirm('Yorumu silmek istediğinize emin misiniz?')) return;
      try {
        await api('/api/admin/comments/' + id, { method:'DELETE' });
        toast('Yorum silindi');
        loadPostsWithComments();
      } catch (e) { toast(e.message, false); }
    }

    async function loadModeration() {
      await Promise.all([loadReportedPosts(), loadReportedAi()]);
    }

    async function loadReportedPosts() {
      try {
        var data = await api('/api/admin/moderation/posts');
        var tbody = document.getElementById('reported-posts-tbody');
        if (!data.items || !data.items.length) {
          tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted)">Şikayet edilmiş gönderi bulunmuyor 🎉</td></tr>';
          return;
        }
        tbody.innerHTML = data.items.map(function(item) {
          var reasonsBadges = (item.reasons || []).map(function(r) {
            return '<span class="badge badge-danger">' + esc(r) + '</span>';
          }).join(' ');
          return '<tr>' +
            '<td><strong>' + esc(item.post ? item.post.authorName : 'Bilinmeyen') + '</strong><br><span style="font-size:11px;color:var(--muted)">' + esc(item.post ? (item.post.authorEmail || '') : '') + '</span></td>' +
            '<td><span class="badge badge-primary">' + esc(item.post ? item.post.category : '-') + '</span></td>' +
            '<td style="max-width:320px;word-break:break-word;font-size:12px">' + esc(item.post ? item.post.content : '(Silinmiş Gönderi)') + '</td>' +
            '<td><span class="badge badge-danger" style="font-size:12px;padding:4px 8px">' + item.reportCount + ' şikayet</span></td>' +
            '<td>' + (reasonsBadges || '-') + '</td>' +
            '<td>' + (item.post ? fmtDT(item.post.createdAt) : '-') + '</td>' +
            '<td><div class="actions">' +
              (item.post ? '<button class="btn btn-danger btn-sm" onclick="adminDeleteReportedPost(\\'' + item.postId + '\\')">🗑 Gönderiyi Sil</button>' : '') +
              '<button class="btn btn-ghost btn-sm" onclick="adminDismissPostReports(\\'' + item.postId + '\\')">✓ Kapat</button>' +
            '</div></td></tr>';
        }).join('');
      } catch (e) { toast(e.message, false); }
    }

    async function adminDeleteReportedPost(postId) {
      if (!confirm('Bu şikayet edilen gönderiyi ve tüm yorumlarını silmek istediğinize emin misiniz?')) return;
      try {
        await api('/api/admin/moderation/posts/' + postId, { method: 'DELETE' });
        toast('Gönderi ve şikayetler silindi');
        loadReportedPosts();
        loadStats();
      } catch (e) { toast(e.message, false); }
    }

    async function adminDismissPostReports(postId) {
      if (!confirm('Bu gönderiye ait şikayetleri kapatmak istediğinize emin misiniz? (Gönderi yayında kalır)')) return;
      try {
        await api('/api/admin/moderation/posts/' + postId + '/dismiss', { method: 'DELETE' });
        toast('Şikayetler kapatıldı');
        loadReportedPosts();
      } catch (e) { toast(e.message, false); }
    }

    async function loadReportedAi() {
      try {
        var data = await api('/api/admin/moderation/ai-responses');
        var tbody = document.getElementById('reported-ai-tbody');
        if (!data.items || !data.items.length) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">Bildirilen yapay zekâ yanıtı bulunmuyor ✨</td></tr>';
          return;
        }
        tbody.innerHTML = data.items.map(function(item) {
          return '<tr>' +
            '<td>' + fmtDT(item.createdAt) + '</td>' +
            '<td style="max-width:200px;word-break:break-word;font-size:12px">' + esc(item.question || '-') + '</td>' +
            '<td style="max-width:280px;word-break:break-word;font-size:12px">' + esc(item.response || '-') + '</td>' +
            '<td><span class="badge badge-danger">' + esc(item.reason) + '</span></td>' +
            '<td style="max-width:180px;word-break:break-word;font-size:12px;color:var(--muted)">' + esc(item.details || '-') + '</td>' +
            '<td><button class="btn btn-ghost btn-sm" onclick="adminDismissAiReport(\\'' + item.id + '\\')">✓ Kapat</button></td>' +
          '</tr>';
        }).join('');
      } catch (e) { toast(e.message, false); }
    }

    async function adminDismissAiReport(reportId) {
      if (!confirm('Bu AI şikayet kaydını kapatmak istediğinize emin misiniz?')) return;
      try {
        await api('/api/admin/moderation/ai-responses/' + reportId, { method: 'DELETE' });
        toast('AI şikayet kaydı kapatıldı');
        loadReportedAi();
      } catch (e) { toast(e.message, false); }
    }

    function toggleNotifTarget() {
      var t = document.getElementById('notif-target').value;
      document.getElementById('notif-module-wrap').style.display = t === 'module' ? 'block' : 'none';
      document.getElementById('notif-user-wrap').style.display = t === 'user' ? 'block' : 'none';
      updatePreview();
    }

    function applyTemplate(title, body, mod, type, target, modTarget) {
      document.getElementById('notif-title').value = title;
      document.getElementById('notif-body').value = body;
      document.getElementById('notif-module').value = mod;
      document.getElementById('notif-type').value = type;
      document.getElementById('notif-target').value = target === 'all' ? 'all' : target === 'module' ? 'module' : 'user';
      if (modTarget) document.getElementById('notif-module-target').value = modTarget;
      toggleNotifTarget();
      updatePreview();
    }

    function updatePreview() {
      document.getElementById('prev-title').innerText = document.getElementById('notif-title').value || 'Bildirim Başlığı';
      document.getElementById('prev-body').innerText = document.getElementById('notif-body').value || 'Bildirim içeriği...';
      document.getElementById('prev-mod').innerText = (document.getElementById('notif-module').value || 'sistem').toUpperCase();
      var t = document.getElementById('notif-target').value;
      var target = 'Tüm kullanıcılar';
      if (t === 'module') target = modLabel(document.getElementById('notif-module-target').value) + ' modülü kullanıcıları';
      if (t === 'user') {
        target = selectedNotifUser ? (selectedNotifUser.name + ' (' + selectedNotifUser.email + ')') : (document.getElementById('notif-uid').value || 'Kullanıcı seçilmedi');
      }
      document.getElementById('prev-target').innerText = '→ ' + target;
    }

    async function sendBroadcast() {
      var title = document.getElementById('notif-title').value.trim();
      var body = document.getElementById('notif-body').value.trim();
      if (!title || !body) return toast('Başlık ve içerik zorunlu', false);
      var payload = {
        title: title,
        body: body,
        module: document.getElementById('notif-module').value,
        type: document.getElementById('notif-type').value
      };
      var target = document.getElementById('notif-target').value;
      if (target === 'module') payload.targetModule = document.getElementById('notif-module-target').value;
      else if (target === 'user') {
        var uid = document.getElementById('notif-uid').value.trim();
        if (!uid) return toast('Kullanıcı ID gerekli', false);
        payload.userId = uid;
      }
      if (!confirm('Bildirim gönderilsin mi?')) return;
      try {
        var res = await api('/api/admin/notifications/send', { method:'POST', body: JSON.stringify(payload) });
        toast('Bildirim ' + res.sentCount + ' kişiye gönderildi');
        document.getElementById('notif-title').value = '';
        document.getElementById('notif-body').value = '';
        selectedNotifUser = null;
        document.getElementById('notif-selected-user').style.display = 'none';
        updatePreview();
      } catch (e) { toast(e.message, false); }
    }

    async function openUserPicker() {
      document.getElementById('picker-overlay').style.display = 'flex';
      document.getElementById('picker-search').value = '';
      try {
        var data = await api('/api/admin/users?limit=500');
        pickerUsers = data.items || [];
        renderPickerList(pickerUsers);
      } catch (e) { toast(e.message, false); }
    }

    function closeUserPicker() { document.getElementById('picker-overlay').style.display = 'none'; }

    function filterPickerList() {
      var q = foldTr(document.getElementById('picker-search').value.trim());
      if (!q) { renderPickerList(pickerUsers); return; }
      renderPickerList(pickerUsers.filter(function(u) {
        return (u.name && foldTr(u.name).indexOf(q) >= 0) || (u.email && foldTr(u.email).indexOf(q) >= 0);
      }));
    }

    function renderPickerList(list) {
      var el = document.getElementById('picker-list');
      if (!list.length) { el.innerHTML = '<div class="empty-state">Kullanıcı bulunamadı</div>'; return; }
      el.innerHTML = list.map(function(u) {
        return '<div class="picker-item" onclick="selectPickerUser(\\'' + u.id + '\\')">' +
          '<div class="pi-name">' + esc(u.name) + '</div><div class="pi-email">' + esc(u.email) + '</div></div>';
      }).join('');
    }

    function selectPickerUser(id) {
      var u = pickerUsers.find(function(x){ return x.id === id; });
      if (!u) return;
      selectedNotifUser = u;
      document.getElementById('notif-uid').value = u.id;
      var pill = document.getElementById('notif-selected-user');
      pill.innerText = '✓ Seçildi: ' + u.name + ' · ' + u.email;
      pill.style.display = 'block';
      closeUserPicker();
      updatePreview();
    }

    function switchContentSub(sub, el) {
      contentSubTab = sub;
      selectedContentItem = null;
      document.querySelectorAll('#content-subtabs .sub-tab').forEach(function(t){ t.classList.remove('active'); });
      if (el) el.classList.add('active');
      document.getElementById('content-editor').innerHTML = '<div class="content-editor-empty">Düzenlemek için soldan bir öğe seçin</div>';
      loadContentSub();
    }

    function loadContentSub() {
      if (contentSubTab === 'weeks') loadContentWeeks();
      else if (contentSubTab === 'symptoms') loadContentSymptoms();
      else if (contentSubTab === 'names') loadContentNames();
      else if (contentSubTab === 'articles' || contentSubTab === 'faqs' || contentSubTab === 'myths') loadContentArticlesBundle();
    }

    async function loadContentWeeks() {
      try {
        var items = await api('/api/admin/content/pregnancy-weeks');
        contentCache.weeks = items;
        document.getElementById('content-list').innerHTML = items.map(function(w) {
          return '<div class="content-list-item" onclick="selectWeek(' + w.weekNumber + ')">' +
            '<div class="cli-title">Hafta ' + w.weekNumber + ': ' + esc(w.title) + '</div>' +
            '<div class="cli-sub">' + esc(w.babySize) + ' · ' + esc(w.babyWeight) + '</div></div>';
        }).join('') || '<div class="empty-state">Hafta bulunamadı</div>';
        filterContentList();
      } catch (e) { toast(e.message, false); }
    }

    async function selectWeek(weekNumber) {
      try {
        var w = await api('/api/admin/content/pregnancy-weeks/' + weekNumber);
        selectedContentItem = { type:'week', data: w };
        document.querySelectorAll('#content-list .content-list-item').forEach(function(el, i) {
          el.classList.toggle('active', contentCache.weeks[i] && contentCache.weeks[i].weekNumber === weekNumber);
        });
        document.getElementById('content-editor').innerHTML =
          '<h3>Hafta ' + w.weekNumber + ' Düzenle</h3>' +
          '<div class="form-group"><label>Başlık</label><input id="cw-title" class="form-control" value="' + esc(w.title) + '"></div>' +
          '<div class="form-group"><label>Bebek Gelişimi</label><textarea id="cw-babyDev" class="form-control" rows="3">' + esc(w.babyDevelopment) + '</textarea></div>' +
          '<div class="grid-2"><div class="form-group"><label>Bebek Boyutu</label><input id="cw-size" class="form-control" value="' + esc(w.babySize) + '"></div>' +
          '<div class="form-group"><label>Bebek Ağırlığı</label><input id="cw-weight" class="form-control" value="' + esc(w.babyWeight) + '"></div></div>' +
          '<div class="form-group"><label>Organ Gelişimi</label><textarea id="cw-organ" class="form-control" rows="2">' + esc(w.organDevelopment) + '</textarea></div>' +
          '<div class="form-group"><label>Anne Değişimleri</label><textarea id="cw-mother" class="form-control" rows="2">' + esc(w.motherChanges) + '</textarea></div>' +
          '<div class="form-group"><label>Bebekten Mektup</label><textarea id="cw-letter" class="form-control" rows="2">' + esc(w.letterFromBaby || '') + '</textarea></div>' +
          '<div class="form-group"><label>Yaygın Semptomlar (virgülle)</label><input id="cw-symptoms" class="form-control" value="' + esc((w.commonSymptoms||[]).join(', ')) + '"></div>' +
          '<div class="form-group"><label>İpuçları (virgülle)</label><input id="cw-tips" class="form-control" value="' + esc((w.tips||[]).join(', ')) + '"></div>' +
          '<div class="form-group"><label>Uyarılar (virgülle)</label><input id="cw-warnings" class="form-control" value="' + esc((w.warnings||[]).join(', ')) + '"></div>' +
          '<button class="btn btn-primary" onclick="saveWeek(' + w.weekNumber + ')">💾 Kaydet</button>';
      } catch (e) { toast(e.message, false); }
    }

    function splitList(val) {
      return val.split(',').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
    }

    async function saveWeek(weekNumber) {
      try {
        var body = {
          title: document.getElementById('cw-title').value.trim(),
          babyDevelopment: document.getElementById('cw-babyDev').value.trim(),
          babySize: document.getElementById('cw-size').value.trim(),
          babyWeight: document.getElementById('cw-weight').value.trim(),
          organDevelopment: document.getElementById('cw-organ').value.trim(),
          motherChanges: document.getElementById('cw-mother').value.trim(),
          letterFromBaby: document.getElementById('cw-letter').value.trim() || null,
          commonSymptoms: splitList(document.getElementById('cw-symptoms').value),
          tips: splitList(document.getElementById('cw-tips').value),
          warnings: splitList(document.getElementById('cw-warnings').value)
        };
        await api('/api/admin/pregnancy/weeks/' + weekNumber, { method:'PATCH', body: JSON.stringify(body) });
        toast('Hafta içeriği güncellendi');
        loadContentWeeks();
      } catch (e) { toast(e.message, false); }
    }

    async function loadContentSymptoms() {
      try {
        var items = await api('/api/admin/content/symptom-types');
        contentCache.symptoms = items;
        document.getElementById('content-list').innerHTML = items.map(function(s, idx) {
          return '<div class="content-list-item" onclick="selectSymptom(' + idx + ')">' +
            '<div class="cli-title">' + esc(s.name) + '</div><div class="cli-sub">' + esc(s.category) + ' · Sıra: ' + s.displayOrder + '</div></div>';
        }).join('') || '<div class="empty-state">Semptom tipi yok</div>';
        filterContentList();
      } catch (e) { toast(e.message, false); }
    }

    function selectSymptom(idx) {
      var s = contentCache.symptoms[idx];
      selectedContentItem = { type:'symptom', data: s, idx: idx };
      document.querySelectorAll('#content-list .content-list-item').forEach(function(el, i){ el.classList.toggle('active', i === idx); });
      document.getElementById('content-editor').innerHTML =
        '<h3>Semptom Tipi Düzenle</h3>' +
        '<div class="form-group"><label>Kategori</label><input id="cs-cat" class="form-control" value="' + esc(s.category) + '"></div>' +
        '<div class="form-group"><label>Ad</label><input id="cs-name" class="form-control" value="' + esc(s.name) + '"></div>' +
        '<div class="form-group"><label>Sıra</label><input id="cs-order" type="number" class="form-control" value="' + s.displayOrder + '"></div>' +
        '<button class="btn btn-primary" onclick="saveSymptom(\\'' + s.id + '\\')">💾 Kaydet</button>';
    }

    async function saveSymptom(id) {
      try {
        var body = {
          category: document.getElementById('cs-cat').value.trim(),
          name: document.getElementById('cs-name').value.trim(),
          displayOrder: parseInt(document.getElementById('cs-order').value, 10)
        };
        await api('/api/admin/content/symptom-types/' + id, { method:'PATCH', body: JSON.stringify(body) });
        toast('Semptom tipi güncellendi');
        loadContentSymptoms();
      } catch (e) { toast(e.message, false); }
    }

    async function loadContentNames() {
      try {
        var data = await api('/api/admin/content/baby-names?limit=500');
        contentCache.names = data.items || [];
        document.getElementById('content-list').innerHTML = contentCache.names.map(function(n, idx) {
          return '<div class="content-list-item" onclick="selectBabyName(' + idx + ')">' +
            '<div class="cli-title">' + esc(n.name) + '</div><div class="cli-sub">' + esc(n.gender) + ' · ' + esc(n.origin) + '</div></div>';
        }).join('') || '<div class="empty-state">Bebek ismi yok</div>';
        filterContentList();
      } catch (e) { toast(e.message, false); }
    }

    function selectBabyName(idx) {
      var n = contentCache.names[idx];
      selectedContentItem = { type:'name', data: n, idx: idx };
      document.querySelectorAll('#content-list .content-list-item').forEach(function(el, i){ el.classList.toggle('active', i === idx); });
      document.getElementById('content-editor').innerHTML =
        '<h3>Bebek İsmi Düzenle</h3>' +
        '<div class="form-group"><label>İsim</label><input id="cn-name" class="form-control" value="' + esc(n.name) + '"></div>' +
        '<div class="form-group"><label>Cinsiyet</label><select id="cn-gender" class="form-control"><option value="girl"' + (n.gender==='girl'?' selected':'') + '>Kız</option><option value="boy"' + (n.gender==='boy'?' selected':'') + '>Erkek</option><option value="unisex"' + (n.gender==='unisex'?' selected':'') + '>Unisex</option></select></div>' +
        '<div class="form-group"><label>Anlam</label><input id="cn-meaning" class="form-control" value="' + esc(n.meaning) + '"></div>' +
        '<div class="form-group"><label>Köken</label><input id="cn-origin" class="form-control" value="' + esc(n.origin) + '"></div>' +
        '<div class="switch-row"><span>Popüler</span><input type="checkbox" id="cn-popular" ' + (n.isPopular?'checked':'') + '></div>' +
        '<button class="btn btn-primary" onclick="saveBabyName(\\'' + n.id + '\\')">💾 Kaydet</button>';
    }

    async function saveBabyName(id) {
      try {
        var body = {
          name: document.getElementById('cn-name').value.trim(),
          gender: document.getElementById('cn-gender').value,
          meaning: document.getElementById('cn-meaning').value.trim(),
          origin: document.getElementById('cn-origin').value.trim(),
          isPopular: document.getElementById('cn-popular').checked
        };
        await api('/api/admin/content/baby-names/' + id, { method:'PATCH', body: JSON.stringify(body) });
        toast('Bebek ismi güncellendi');
        loadContentNames();
      } catch (e) { toast(e.message, false); }
    }

    async function loadContentArticlesBundle() {
      try {
        if (!contentCache.articlesBundle) {
          contentCache.articlesBundle = await api('/api/admin/content/articles');
        }
        var bundle = contentCache.articlesBundle;
        var items = contentSubTab === 'articles' ? bundle.articles : contentSubTab === 'faqs' ? bundle.faqs : bundle.myths;
        contentCache.currentItems = items;
        document.getElementById('content-list').innerHTML = items.map(function(item, idx) {
          var title = contentSubTab === 'articles' ? item.title : contentSubTab === 'faqs' ? item.question : item.statement;
          var sub = contentSubTab === 'articles' ? item.categoryName : contentSubTab === 'faqs' ? item.categoryName : (item.isTrue ? 'Doğru' : 'Yanlış');
          return '<div class="content-list-item" onclick="selectArticleItem(' + idx + ')">' +
            '<div class="cli-title">' + esc(title) + '</div><div class="cli-sub">' + esc(sub) + '</div></div>';
        }).join('') || '<div class="empty-state">İçerik bulunamadı</div>';
        filterContentList();
      } catch (e) { toast(e.message, false); }
    }

    function selectArticleItem(idx) {
      var item = contentCache.currentItems[idx];
      selectedContentItem = { type: contentSubTab, data: item, idx: idx };
      document.querySelectorAll('#content-list .content-list-item').forEach(function(el, i){ el.classList.toggle('active', i === idx); });
      var html = '';
      if (contentSubTab === 'articles') {
        html = '<h3>Makale Düzenle</h3>' +
          '<div class="form-group"><label>Başlık</label><input id="ca-title" class="form-control" value="' + esc(item.title) + '"></div>' +
          '<div class="form-group"><label>Özet</label><textarea id="ca-summary" class="form-control" rows="3">' + esc(item.summary) + '</textarea></div>' +
          '<div class="form-group"><label>İçerik (paragraflar, satır satır)</label><textarea id="ca-content" class="form-control" rows="10">' + esc((item.content||[]).join('\\n')) + '</textarea></div>' +
          '<button class="btn btn-primary" onclick="saveArticle(\\'' + item.id + '\\')">💾 Kaydet</button>';
      } else if (contentSubTab === 'faqs') {
        html = '<h3>SSS Düzenle</h3>' +
          '<div class="form-group"><label>Soru</label><textarea id="cf-question" class="form-control" rows="2">' + esc(item.question) + '</textarea></div>' +
          '<div class="form-group"><label>Cevap</label><textarea id="cf-answer" class="form-control" rows="6">' + esc(item.answer) + '</textarea></div>' +
          '<button class="btn btn-primary" onclick="saveFaq(\\'' + item.id + '\\')">💾 Kaydet</button>';
      } else {
        html = '<h3>Mit Düzenle</h3>' +
          '<div class="form-group"><label>İfade</label><textarea id="cm-statement" class="form-control" rows="2">' + esc(item.statement) + '</textarea></div>' +
          '<div class="form-group"><label>Açıklama</label><textarea id="cm-explanation" class="form-control" rows="6">' + esc(item.explanation) + '</textarea></div>' +
          '<button class="btn btn-primary" onclick="saveMyth(\\'' + item.id + '\\')">💾 Kaydet</button>';
      }
      document.getElementById('content-editor').innerHTML = html;
    }

    function filterContentList() {
      var q = foldTr((document.getElementById('content-search') && document.getElementById('content-search').value) || '');
      document.querySelectorAll('#content-list .content-list-item').forEach(function(el) {
        el.style.display = !q || foldTr(el.innerText).indexOf(q) >= 0 ? '' : 'none';
      });
    }

    async function saveArticle(id) {
      try {
        var body = {
          title: document.getElementById('ca-title').value.trim(),
          summary: document.getElementById('ca-summary').value.trim(),
          content: document.getElementById('ca-content').value.split('\\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; })
        };
        await api('/api/admin/content/articles/' + id, { method:'PATCH', body: JSON.stringify(body) });
        toast('Makale güncellendi');
        contentCache.articlesBundle = null;
        loadContentArticlesBundle();
      } catch (e) { toast(e.message, false); }
    }

    async function saveFaq(id) {
      try {
        var body = {
          question: document.getElementById('cf-question').value.trim(),
          answer: document.getElementById('cf-answer').value.trim()
        };
        await api('/api/admin/content/faqs/' + id, { method:'PATCH', body: JSON.stringify(body) });
        toast('SSS güncellendi');
        contentCache.articlesBundle = null;
        loadContentArticlesBundle();
      } catch (e) { toast(e.message, false); }
    }

    async function saveMyth(id) {
      try {
        var body = {
          statement: document.getElementById('cm-statement').value.trim(),
          explanation: document.getElementById('cm-explanation').value.trim()
        };
        await api('/api/admin/content/myths/' + id, { method:'PATCH', body: JSON.stringify(body) });
        toast('Mit güncellendi');
        contentCache.articlesBundle = null;
        loadContentArticlesBundle();
      } catch (e) { toast(e.message, false); }
    }
  </script>
</body>
</html>`;
