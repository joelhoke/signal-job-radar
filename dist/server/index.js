const PAGE = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta name=\"theme-color\" content=\"#f5f2eb\">\n  <meta name=\"mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"description\" content=\"Signal is a calmer way to sort strong-fit and stretch roles across product, design, and experience architecture.\">\n  <meta property=\"og:title\" content=\"Signal — Job Radar\">\n  <meta property=\"og:description\" content=\"A focused job radar for design-led product, PM, and experience architecture roles.\">\n  <title>Signal — Job Radar</title>\n  <link rel=\"manifest\" href=\"manifest.json\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap\" rel=\"stylesheet\">\n  <style>\n    :root {\n      --ink: #202321;\n      --muted: #6f766f;\n      --paper: #f5f2eb;\n      --card: #fffdf8;\n      --line: #d9d6cc;\n      --blue: #1857d5;\n      --blue-soft: #e8eefc;\n      --orange: #f06b3d;\n      --yellow: #f3c84b;\n      --green: #477d5f;\n      --lavender: #dcd9ff;\n      --shadow: 0 18px 50px rgba(32, 35, 33, .08);\n      --sans: \"DM Sans\", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n      --mono: \"DM Mono\", ui-monospace, SFMono-Regular, Menlo, monospace;\n      --serif: Fraunces, Georgia, serif;\n    }\n\n    * { box-sizing: border-box; }\n    html { scroll-behavior: smooth; }\n    body {\n      margin: 0;\n      color: var(--ink);\n      background: var(--paper);\n      font-family: var(--sans);\n      -webkit-font-smoothing: antialiased;\n    }\n    a { color: inherit; }\n    button, input { font: inherit; }\n    button { cursor: pointer; }\n\n    .shell { max-width: 1240px; margin: 0 auto; padding: 0 28px; }\n    .topbar {\n      display: flex; align-items: center; justify-content: space-between;\n      padding: 24px 0 18px; border-bottom: 1px solid var(--line);\n      position: sticky; top: 0; z-index: 5; background: rgba(245,242,235,.94); backdrop-filter: blur(12px);\n    }\n    .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }\n    .brand-mark {\n      width: 28px; height: 28px; border: 2px solid var(--ink); border-radius: 50%;\n      display: grid; place-items: center; position: relative;\n    }\n    .brand-mark::after { content: \"\"; width: 8px; height: 8px; background: var(--orange); border-radius: 50%; }\n    .brand-word { font-weight: 700; letter-spacing: -.04em; font-size: 18px; }\n    .brand-code { color: var(--muted); font: 11px var(--mono); letter-spacing: .08em; margin-left: 2px; }\n    .nav { display: flex; align-items: center; gap: 24px; }\n    .nav a { color: var(--muted); text-decoration: none; font-size: 13px; }\n    .nav a:hover { color: var(--ink); }\n    .nav .nav-share { color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: 3px; }\n\n    .hero { display: grid; grid-template-columns: minmax(0, 1.18fr) minmax(300px, .82fr); gap: 70px; padding: 88px 0 76px; align-items: center; }\n    .eyebrow { color: var(--blue); font: 500 11px var(--mono); letter-spacing: .13em; text-transform: uppercase; }\n    h1 { font: 600 clamp(48px, 7vw, 92px)/.94 var(--serif); letter-spacing: -.06em; margin: 18px 0 24px; max-width: 760px; }\n    .hero-copy { max-width: 620px; color: #505650; font-size: 18px; line-height: 1.55; }\n    .hero-actions { display: flex; align-items: center; gap: 14px; margin-top: 30px; flex-wrap: wrap; }\n    .button {\n      border: 1px solid var(--ink); border-radius: 999px; padding: 12px 17px;\n      background: var(--ink); color: #fff; font-size: 13px; font-weight: 600; transition: transform .15s ease, box-shadow .15s ease, background .15s ease;\n    }\n    .button:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(32,35,33,.14); }\n    .button.secondary { background: transparent; color: var(--ink); }\n    .button.secondary:hover { background: #fffdf8; }\n    .hero-note { color: var(--muted); font: 11px var(--mono); margin-top: 17px; }\n\n    .orbit-card { min-height: 330px; position: relative; overflow: hidden; background: var(--blue); color: white; border-radius: 22px; padding: 26px; box-shadow: var(--shadow); }\n    .orbit-card::before, .orbit-card::after { content: \"\"; position: absolute; border: 1px solid rgba(255,255,255,.28); border-radius: 50%; }\n    .orbit-card::before { width: 300px; height: 300px; right: -72px; top: 20px; }\n    .orbit-card::after { width: 190px; height: 190px; right: -17px; top: 74px; }\n    .orbit-dot { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: var(--yellow); right: 110px; top: 59px; box-shadow: 0 0 0 8px rgba(243,200,75,.16); }\n    .orbit-dot.two { width: 9px; height: 9px; background: var(--orange); right: 66px; top: 220px; box-shadow: none; }\n    .orbit-title { position: relative; z-index: 1; font: 500 23px/1.1 var(--serif); max-width: 190px; }\n    .orbit-meta { position: absolute; z-index: 1; left: 26px; bottom: 27px; font: 11px/1.7 var(--mono); color: rgba(255,255,255,.75); }\n    .orbit-score { position: absolute; z-index: 1; right: 28px; bottom: 27px; text-align: right; }\n    .orbit-score strong { display: block; font: 600 54px/.9 var(--serif); letter-spacing: -.07em; }\n    .orbit-score span { font: 10px var(--mono); color: rgba(255,255,255,.75); }\n\n    .status-strip { display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 15px 0; color: var(--muted); font-size: 12px; }\n    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 4px rgba(71,125,95,.12); }\n    .status-strip span:last-child { margin-left: auto; font: 11px var(--mono); }\n\n    .radar-section { padding: 76px 0 90px; }\n    .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 25px; margin-bottom: 27px; }\n    .section-heading h2 { font: 500 42px/1 var(--serif); letter-spacing: -.05em; margin: 9px 0 0; }\n    .section-heading p { color: var(--muted); font-size: 13px; line-height: 1.5; max-width: 320px; margin: 0; }\n    .radar-layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 24px; align-items: start; }\n\n    .profile-card { background: var(--ink); color: #fff; border-radius: 18px; padding: 22px; position: sticky; top: 20px; }\n    .profile-card .label { color: #aeb4ae; font: 10px var(--mono); letter-spacing: .1em; text-transform: uppercase; }\n    .profile-card h3 { margin: 14px 0 22px; font: 500 25px/1.05 var(--serif); letter-spacing: -.04em; }\n    .profile-row { border-top: 1px solid rgba(255,255,255,.16); padding: 14px 0 3px; }\n    .profile-row span { display: block; color: #aeb4ae; font-size: 11px; margin-bottom: 5px; }\n    .profile-row strong { font-size: 13px; font-weight: 500; }\n    .profile-row em { font-style: normal; color: var(--yellow); }\n    .profile-foot { color: #aeb4ae; border-top: 1px solid rgba(255,255,255,.16); margin-top: 16px; padding-top: 15px; font-size: 11px; line-height: 1.5; }\n\n    .workspace { min-width: 0; }\n    .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }\n    .segmented { display: flex; gap: 4px; flex-wrap: wrap; }\n    .segmented button { border: 1px solid transparent; background: transparent; color: var(--muted); border-radius: 999px; padding: 8px 12px; font-size: 12px; }\n    .segmented button:hover { color: var(--ink); }\n    .segmented button.active { background: var(--card); border-color: var(--line); color: var(--ink); box-shadow: 0 3px 10px rgba(32,35,33,.05); }\n    .search-box { display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--ink); padding: 7px 0; min-width: 180px; }\n    .search-box svg { width: 15px; height: 15px; }\n    .search-box input { width: 100%; border: 0; outline: 0; background: transparent; font-size: 12px; color: var(--ink); }\n    .search-box input::placeholder { color: #939991; }\n\n    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 23px; }\n    .stat { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }\n    .stat-button { width: 100%; text-align: left; color: var(--ink); transition: transform .15s ease, box-shadow .15s ease, outline .15s ease; }\n    .stat-button:hover { transform: translateY(-2px); box-shadow: 0 7px 16px rgba(32,35,33,.08); }\n    .stat-button.active { outline: 2px solid var(--ink); outline-offset: 2px; }\n    .stat strong { display: block; font: 500 28px/.95 var(--serif); letter-spacing: -.05em; }\n    .stat span { display: block; color: var(--muted); font-size: 10px; margin-top: 6px; }\n    .stat:first-child { background: var(--yellow); border-color: var(--yellow); }\n    .stat:nth-child(2) { background: var(--blue-soft); border-color: #cbd8f7; }\n    .stat:nth-child(3) { background: #edf3eb; border-color: #d4e4d4; }\n    .stat:nth-child(4) { background: #fbe9e2; border-color: #f1cbbb; }\n    .fit-hint { color: var(--muted); font: 10px var(--mono); margin: -10px 0 16px; }\n\n    .job-list { display: grid; gap: 10px; }\n    .job-card { background: var(--card); border: 1px solid var(--line); border-radius: 15px; padding: 19px 20px; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; }\n    .job-card:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(32,35,33,.07); border-color: #bcbfb7; }\n    .job-top { display: flex; align-items: start; justify-content: space-between; gap: 16px; }\n    .job-company { color: var(--muted); font: 11px var(--mono); letter-spacing: .02em; }\n    .job-card h3 { font-size: 17px; line-height: 1.25; margin: 6px 0 8px; letter-spacing: -.02em; }\n    .job-meta { display: flex; flex-wrap: wrap; gap: 7px 14px; color: var(--muted); font-size: 11px; }\n    .job-meta span { display: inline-flex; align-items: center; gap: 5px; }\n    .job-meta span::before { content: \"\"; width: 4px; height: 4px; border-radius: 50%; background: #afb5ae; }\n    .job-meta span:first-child::before { background: var(--blue); }\n    .fit { border-radius: 999px; padding: 6px 9px; font: 10px var(--mono); white-space: nowrap; }\n    .fit.strong { color: #2e6748; background: #e4f0e3; }\n    .fit.good { color: #31569b; background: #e6edfc; }\n    .fit.reach { color: #8a5a18; background: #fff0c8; }\n    .fit.stretch { color: #984a2d; background: #fbe3da; }\n    .job-bottom { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-top: 18px; }\n    .job-why { color: #5f675f; font-size: 12px; line-height: 1.45; max-width: 570px; }\n    .job-why strong { color: var(--ink); font-weight: 600; }\n    .job-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }\n    .text-button { border: 0; background: transparent; color: var(--muted); font-size: 11px; padding: 4px 0; }\n    .text-button:hover { color: var(--ink); }\n    .text-button.saved { color: var(--blue); }\n    .view-link { display: inline-flex; align-items: center; gap: 5px; background: var(--ink); color: white; border-radius: 999px; text-decoration: none; padding: 8px 11px; font-size: 11px; }\n    .view-link:hover { background: var(--blue); }\n    .empty { padding: 50px 20px; border: 1px dashed var(--line); border-radius: 15px; color: var(--muted); text-align: center; font-size: 13px; }\n\n    .how-section { border-top: 1px solid var(--line); padding: 78px 0 90px; }\n    .how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: start; }\n    .how-grid h2 { font: 500 43px/1 var(--serif); letter-spacing: -.055em; margin: 10px 0 18px; max-width: 450px; }\n    .how-grid > div > p { color: var(--muted); line-height: 1.6; max-width: 430px; font-size: 15px; }\n    .steps { border-top: 1px solid var(--line); }\n    .step { display: grid; grid-template-columns: 38px 1fr; gap: 12px; padding: 17px 0; border-bottom: 1px solid var(--line); }\n    .step-num { color: var(--blue); font: 11px var(--mono); }\n    .step strong { font-size: 13px; }\n    .step p { color: var(--muted); font-size: 12px; line-height: 1.5; margin: 5px 0 0; }\n\n    footer { border-top: 1px solid var(--line); padding: 22px 0 35px; color: var(--muted); display: flex; justify-content: space-between; gap: 20px; font-size: 11px; }\n    footer span:last-child { font-family: var(--mono); }\n    .toast { position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 20px); background: var(--ink); color: #fff; border-radius: 999px; padding: 11px 16px; font-size: 12px; opacity: 0; pointer-events: none; transition: opacity .2s ease, transform .2s ease; z-index: 20; box-shadow: var(--shadow); }\n    .toast.show { opacity: 1; transform: translate(-50%, 0); }\n    .refresh-spin { display: inline-block; }\n    .refreshing .refresh-spin { animation: spin .8s linear infinite; }\n    @keyframes spin { to { transform: rotate(360deg); } }\n\n    /* Keep the public version useful as a compact widget as well as a shareable page. */\n    .hero, .how-section, footer { display: none; }\n    .radar-section { padding-top: 36px; }\n    .section-heading h2 { font-size: 35px; }\n    .section-heading p { max-width: 290px; }\n    .status-strip { margin-top: 8px; }\n\n    @media (max-width: 860px) {\n      .hero { grid-template-columns: 1fr; gap: 36px; padding: 62px 0 60px; }\n      .orbit-card { min-height: 260px; }\n      .radar-layout { grid-template-columns: 1fr; }\n      .profile-card { position: static; }\n      .profile-card h3 { max-width: 300px; }\n      .profile-row { display: inline-block; width: 48%; vertical-align: top; border-top: 0; padding-top: 0; }\n      .profile-foot { margin-top: 12px; }\n      .how-grid { grid-template-columns: 1fr; gap: 40px; }\n    }\n    @media (max-width: 560px) {\n      .shell { padding: 0 18px; }\n      .topbar { padding-top: 18px; }\n      .nav a:not(.nav-share) { display: none; }\n      h1 { font-size: 53px; }\n      .hero-copy { font-size: 16px; }\n      .section-heading { display: block; }\n      .section-heading p { margin-top: 15px; }\n      .stats { grid-template-columns: 1fr 1fr; }\n      .job-top, .job-bottom { display: block; }\n      .fit { display: inline-block; margin-top: 12px; }\n      .job-actions { margin-top: 15px; justify-content: space-between; }\n      .search-box { width: 100%; }\n      footer { display: block; }\n      footer span { display: block; margin-bottom: 8px; }\n    }\n  </style>\n</head>\n<body>\n  <div class=\"shell\">\n    <header class=\"topbar\">\n      <a class=\"brand\" href=\"#top\" aria-label=\"Signal home\">\n        <span class=\"brand-mark\" aria-hidden=\"true\"></span>\n        <span class=\"brand-word\">signal</span>\n        <span class=\"brand-code\">/ JOB RADAR</span>\n      </a>\n      <nav class=\"nav\" aria-label=\"Main navigation\">\n        <a href=\"#radar\">The radar</a>\n        <a href=\"#how-it-works\">How it works</a>\n        <a class=\"nav-share\" href=\"#\" id=\"navShare\">Share this</a>\n      </nav>\n    </header>\n\n    <main id=\"top\">\n      <section class=\"hero\" aria-labelledby=\"hero-title\">\n        <div>\n          <div class=\"eyebrow\">A calmer way to search</div>\n          <h1 id=\"hero-title\">Reach higher. Apply sharper.</h1>\n          <p class=\"hero-copy\">Signal sorts a job search into the roles that make sense now, the roles worth reaching for, and the roles that need a little more evidence.</p>\n          <div class=\"hero-actions\">\n            <a class=\"button\" href=\"#radar\">Open the radar <span aria-hidden=\"true\">↘</span></a>\n            <button class=\"button secondary\" id=\"heroShare\">Share this radar</button>\n            <button class=\"button secondary\" id=\"linkedinShare\">Share on LinkedIn ↗</button>\n          </div>\n          <div class=\"hero-note\">Built for design-led product, PM, and experience architecture searches.</div>\n        </div>\n        <div class=\"orbit-card\" aria-label=\"Radar summary\">\n          <div class=\"orbit-title\">A signal is more useful than a pile of tabs.</div>\n          <div class=\"orbit-dot\" aria-hidden=\"true\"></div>\n          <div class=\"orbit-dot two\" aria-hidden=\"true\"></div>\n          <div class=\"orbit-meta\">SEATTLE + REMOTE<br>DESIGN / PRODUCT / ARCHITECTURE</div>\n          <div class=\"orbit-score\"><strong id=\"orbitStrong\">4</strong><span>STRONG SIGNALS</span></div>\n        </div>\n      </section>\n\n      <div class=\"status-strip\">\n        <span class=\"status-dot\" aria-hidden=\"true\"></span>\n        <span id=\"snapshotStatus\">Curated snapshot ready to explore</span>\n        <span>Last reviewed · Oct 13, 2026</span>\n      </div>\n\n      <section class=\"radar-section\" id=\"radar\" aria-labelledby=\"radar-title\">\n        <div class=\"section-heading\">\n          <div>\n            <div class=\"eyebrow\">01 / Your radar</div>\n            <h2 id=\"radar-title\">Job radar</h2>\n          </div>\n          <p>Use the fit labels as a prioritization tool—not a verdict. The right stretch role is still worth the reach.</p>\n        </div>\n\n        <div class=\"radar-layout\">\n          <aside class=\"profile-card\" aria-label=\"Search profile\">\n            <div class=\"label\">Profile signal</div>\n            <h3>Design-led product builder</h3>\n            <div class=\"profile-row\"><span>Primary lane</span><strong>Senior PM</strong></div>\n            <div class=\"profile-row\"><span>Design lane</span><strong>Senior → <em>Principal</em></strong></div>\n            <div class=\"profile-row\"><span>Architecture</span><strong>Product / UX</strong></div>\n            <div class=\"profile-row\"><span>Market</span><strong>Seattle + remote</strong></div>\n            <div class=\"profile-foot\">Calibrated for strong near-term matches with a deliberate reach lane.</div>\n          </aside>\n\n          <div class=\"workspace\">\n            <div class=\"toolbar\">\n              <div class=\"segmented\" role=\"group\" aria-label=\"Market filter\">\n                <button class=\"active\" data-filter-group=\"market\" data-filter-value=\"all\">All roles</button>\n                <button data-filter-group=\"market\" data-filter-value=\"seattle\">Seattle hybrid</button>\n                <button data-filter-group=\"market\" data-filter-value=\"remote\">Remote US</button>\n              </div>\n              <div class=\"search-box\">\n                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"6.5\"></circle><path d=\"m16 16 4 4\"></path></svg>\n                <input id=\"searchInput\" type=\"search\" placeholder=\"Search roles or companies\" aria-label=\"Search roles or companies\">\n              </div>\n            </div>\n            <div class=\"toolbar\" style=\"margin-top:-5px;\">\n              <div class=\"segmented\" role=\"group\" aria-label=\"Role type filter\">\n                <button class=\"active\" data-filter-group=\"category\" data-filter-value=\"all\">Everything</button>\n                <button data-filter-group=\"category\" data-filter-value=\"design\">Design</button>\n                <button data-filter-group=\"category\" data-filter-value=\"pm\">Product</button>\n              </div>\n              <button class=\"text-button\" id=\"refreshButton\"><span class=\"refresh-spin\" aria-hidden=\"true\">↻</span> Review snapshot</button>\n            </div>\n\n            <div class=\"stats\" aria-label=\"Radar totals and fit filters\">\n              <button class=\"stat stat-button active\" data-fit-filter=\"all\" aria-pressed=\"true\"><strong id=\"statTotal\">8</strong><span>total roles</span></button>\n              <button class=\"stat stat-button\" data-fit-filter=\"strong\" aria-pressed=\"false\"><strong id=\"statStrong\">4</strong><span>strong signals</span></button>\n              <button class=\"stat stat-button\" data-fit-filter=\"reach\" aria-pressed=\"false\"><strong id=\"statReach\">2</strong><span>worth a reach</span></button>\n              <button class=\"stat stat-button\" data-fit-filter=\"stretch\" aria-pressed=\"false\"><strong id=\"statStretch\">2</strong><span>stretch signals</span></button>\n            </div>\n            <div class=\"fit-hint\" id=\"fitHint\">Tap a signal card to filter the roles below.</div>\n\n            <div class=\"job-list\" id=\"jobList\" aria-live=\"polite\"></div>\n          </div>\n        </div>\n      </section>\n\n      <section class=\"how-section\" id=\"how-it-works\" aria-labelledby=\"how-title\">\n        <div class=\"how-grid\">\n          <div>\n            <div class=\"eyebrow\">02 / The method</div>\n            <h2 id=\"how-title\">Ambition works better with a map.</h2>\n            <p>Signal keeps a search honest without making it small. The fit model starts with what you can credibly do now, then creates room for the roles that ask you to grow.</p>\n            <div class=\"hero-actions\"><button class=\"button\" id=\"methodShare\">Share the method <span aria-hidden=\"true\">↗</span></button></div>\n          </div>\n          <div class=\"steps\">\n            <div class=\"step\"><div class=\"step-num\">01</div><div><strong>Find the through-line</strong><p>Group roles by the work underneath the title: designing complex systems, shaping AI experiences, or owning product direction.</p></div></div>\n            <div class=\"step\"><div class=\"step-num\">02</div><div><strong>Separate now from next</strong><p>Strong-fit roles deserve the bulk of your time. Reach roles get a thoughtful application—not your whole week.</p></div></div>\n            <div class=\"step\"><div class=\"step-num\">03</div><div><strong>Make every tab actionable</strong><p>Save the role, open the source listing, or hide it. A search should end in a decision, not another browser window.</p></div></div>\n          </div>\n        </div>\n      </section>\n    </main>\n\n    <footer>\n      <span>Signal is a focused search layer for ambitious generalists.</span>\n      <span>PUBLIC PREVIEW · DAILY ROLE RADAR</span>\n    </footer>\n  </div>\n  <div class=\"toast\" id=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n\n  <script>\n    const roles = __ROLE_DATA__;\n\n    const state = { market: 'all', category: 'all', fit: 'all', query: '', saved: new Set(), hidden: new Set() };\n    const jobList = document.getElementById('jobList');\n    const toast = document.getElementById('toast');\n\n    function showToast(message) {\n      toast.textContent = message;\n      toast.classList.add('show');\n      window.clearTimeout(showToast.timeout);\n      showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);\n    }\n\n    function baseRoles() {\n      return roles.filter(role => {\n        if (state.hidden.has(role.id)) return false;\n        if (state.category !== 'all' && role.category !== state.category) return false;\n        if (state.market === 'seattle' && role.mode !== 'Hybrid') return false;\n        if (state.market === 'remote' && role.mode !== 'Remote') return false;\n        if (state.query) {\n          const haystack = `${role.company} ${role.title} ${role.city} ${role.why}`.toLowerCase();\n          if (!haystack.includes(state.query.toLowerCase())) return false;\n        }\n        return true;\n      });\n    }\n\n    function visibleRoles() {\n      return baseRoles().filter(role => state.fit === 'all' || (state.fit === 'strong' ? ['strong', 'good'].includes(role.fit) : role.fit === state.fit));\n    }\n\n    function render() {\n      const visible = visibleRoles();\n      jobList.innerHTML = visible.length ? visible.map(role => `\n        <article class=\"job-card\">\n          <div class=\"job-top\">\n            <div>\n              <div class=\"job-company\">${role.company} · ${role.level}</div>\n              <h3>${role.title}</h3>\n              <div class=\"job-meta\"><span>${role.city}</span><span>${role.mode}</span><span>${role.salary}</span><span>${role.posted}</span></div>\n            </div>\n            <span class=\"fit ${role.fit}\">${role.fitLabel}</span>\n          </div>\n          <div class=\"job-bottom\">\n            <div class=\"job-why\"><strong>Why it surfaced:</strong> ${role.why}</div>\n            <div class=\"job-actions\">\n              <button class=\"text-button ${state.saved.has(role.id) ? 'saved' : ''}\" data-save=\"${role.id}\">${state.saved.has(role.id) ? 'Saved' : 'Save'}</button>\n              <button class=\"text-button\" data-hide=\"${role.id}\">Hide</button>\n              <a class=\"view-link\" href=\"${role.url}\" target=\"_blank\" rel=\"noopener\">View role ↗</a>\n            </div>\n          </div>\n        </article>`).join('') : '<div class=\"empty\">No roles match this view yet. Try widening the market or clearing the search.</div>';\n\n      const base = baseRoles();\n      const counts = base.reduce((acc, role) => { acc[role.fit] += 1; return acc; }, { strong: 0, good: 0, reach: 0, stretch: 0 });\n      document.getElementById('statTotal').textContent = visible.length;\n      document.getElementById('statStrong').textContent = counts.strong + counts.good;\n      document.getElementById('statReach').textContent = counts.reach;\n      document.getElementById('statStretch').textContent = counts.stretch;\n      document.getElementById('orbitStrong').textContent = counts.strong + counts.good;\n      document.querySelectorAll('[data-fit-filter]').forEach(button => {\n        const active = button.dataset.fitFilter === state.fit;\n        button.classList.toggle('active', active);\n        button.setAttribute('aria-pressed', active ? 'true' : 'false');\n      });\n      document.getElementById('fitHint').textContent = state.fit === 'all' ? 'Tap a signal card to filter the roles below.' : `Showing ${state.fit === 'strong' ? 'strong signals' : state.fit === 'reach' ? 'roles worth a reach' : 'stretch signals'} · tap the card again to clear.`;\n    }\n\n    document.querySelectorAll('[data-filter-group]').forEach(button => {\n      button.addEventListener('click', () => {\n        state[button.dataset.filterGroup] = button.dataset.filterValue;\n        document.querySelectorAll(`[data-filter-group=\"${button.dataset.filterGroup}\"]`).forEach(item => item.classList.toggle('active', item === button));\n        render();\n      });\n    });\n\n    document.querySelectorAll('[data-fit-filter]').forEach(button => {\n      button.addEventListener('click', () => {\n        const next = button.dataset.fitFilter;\n        state.fit = next === state.fit && next !== 'all' ? 'all' : next;\n        render();\n      });\n    });\n\n    document.getElementById('searchInput').addEventListener('input', event => { state.query = event.target.value.trim(); render(); });\n    jobList.addEventListener('click', event => {\n      const save = event.target.closest('[data-save]');\n      const hide = event.target.closest('[data-hide]');\n      if (save) { state.saved.has(save.dataset.save) ? state.saved.delete(save.dataset.save) : state.saved.add(save.dataset.save); render(); showToast(state.saved.has(save.dataset.save) ? 'Role saved to your radar.' : 'Role removed from saved.'); }\n      if (hide) { state.hidden.add(hide.dataset.hide); render(); showToast('Role hidden. You can widen the search to find more.'); }\n    });\n\n    document.getElementById('refreshButton').addEventListener('click', event => {\n      const button = event.currentTarget;\n      button.classList.add('refreshing');\n      window.setTimeout(() => { window.location.reload(); }, 250);\n    });\n\n    function shareRadar() {\n      const url = new URL(window.location.href);\n      if (state.market !== 'all') url.searchParams.set('market', state.market); else url.searchParams.delete('market');\n      if (state.category !== 'all') url.searchParams.set('category', state.category); else url.searchParams.delete('category');\n      if (state.fit !== 'all') url.searchParams.set('fit', state.fit); else url.searchParams.delete('fit');\n      if (state.query) url.searchParams.set('q', state.query); else url.searchParams.delete('q');\n      const shareUrl = url.toString();\n      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(shareUrl).then(() => showToast('Share link copied — paste it into LinkedIn.'));\n      else showToast('Copy this page URL to share your radar.');\n    }\n\n    ['navShare', 'heroShare', 'methodShare'].forEach(id => document.getElementById(id).addEventListener('click', event => { event.preventDefault(); shareRadar(); }));\n    document.getElementById('linkedinShare').addEventListener('click', () => {\n      const url = encodeURIComponent(window.location.href);\n      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');\n    });\n\n    const params = new URLSearchParams(window.location.search);\n    if (['all', 'seattle', 'remote'].includes(params.get('market'))) { state.market = params.get('market'); document.querySelector(`[data-filter-group=\"market\"][data-filter-value=\"${state.market}\"]`).click(); }\n    if (['all', 'design', 'pm'].includes(params.get('category'))) { state.category = params.get('category'); document.querySelector(`[data-filter-group=\"category\"][data-filter-value=\"${state.category}\"]`).click(); }\n    if (['all', 'strong', 'reach', 'stretch'].includes(params.get('fit'))) { state.fit = params.get('fit'); document.querySelector(`[data-fit-filter=\"${state.fit}\"]`).click(); }\n    if (params.get('q')) { state.query = params.get('q'); document.getElementById('searchInput').value = state.query; }\n    render();\n  </script>\n</body>\n</html>\n";
const DEFAULT_FEED = {
  "updated": "Oct 13, 2026",
  "roles": [
    {
      "id": "amazon-ux-ai",
      "company": "Amazon",
      "title": "UX Designer, AI/ML",
      "city": "Seattle, WA",
      "mode": "Hybrid",
      "category": "design",
      "level": "Senior",
      "fit": "strong",
      "fitLabel": "Strong fit",
      "salary": "$117.8k–$160k",
      "posted": "Today",
      "why": "Customer-centered AI/ML product design",
      "url": "https://www.amazon.jobs/en/jobs/10577202/ux-designer-ai-ml"
    },
    {
      "id": "remitly-conversational",
      "company": "Remitly",
      "title": "Senior Product Designer, Conversational AI Platform",
      "city": "Seattle, WA",
      "mode": "Hybrid",
      "category": "design",
      "level": "Senior",
      "fit": "strong",
      "fitLabel": "Strong fit",
      "salary": "$144k–$180k",
      "posted": "Snapshot",
      "why": "Agentic AI product design",
      "url": "https://remitly.wd5.myworkdayjobs.com/Remitly_Careers/job/Seattle-Washington-United-States/Senior-Product-Designer_R_106913-1"
    },
    {
      "id": "okta-ai-agents",
      "company": "Okta",
      "title": "Senior Product Designer — Okta for AI Agents",
      "city": "Bellevue, WA",
      "mode": "Hybrid",
      "category": "design",
      "level": "Senior",
      "fit": "strong",
      "fitLabel": "Strong fit",
      "salary": "$136k–$187k",
      "posted": "Oct 2",
      "why": "Agent lifecycle, authorization, and policy enforcement",
      "url": "https://www.okta.com/company/careers/opportunity/8248278?gh_jid=8248278"
    },
    {
      "id": "okta-governance",
      "company": "Okta",
      "title": "Staff Product Designer — Identity Governance",
      "city": "Bellevue, WA",
      "mode": "Hybrid",
      "category": "design",
      "level": "Staff",
      "fit": "good",
      "fitLabel": "Strong design fit",
      "salary": "$156k–$215k",
      "posted": "Oct 1",
      "why": "Design strategy, standards, and portfolio influence",
      "url": "https://www.okta.com/company/careers/opportunity/8247059?gh_jid=8247059"
    },
    {
      "id": "zillow-design-systems",
      "company": "Zillow",
      "title": "Principal Product Manager, Design Systems & Accessibility",
      "city": "United States",
      "mode": "Remote",
      "category": "pm",
      "level": "Principal",
      "fit": "reach",
      "fitLabel": "Worth a reach",
      "salary": "$182.1k–$290.9k",
      "posted": "Oct 9",
      "why": "Design systems PM, adoption, and internal customer discovery",
      "url": "https://zillow.wd5.myworkdayjobs.com/Zillow_Group_External/job/Remote-USA/Principal-Product-Manager---Design-Systems---Accessibility_P751336-1"
    },
    {
      "id": "digitalocean-compute",
      "company": "DigitalOcean",
      "title": "Staff Product Manager, Compute Platform",
      "city": "Seattle, WA",
      "mode": "Hybrid",
      "category": "pm",
      "level": "Staff",
      "fit": "reach",
      "fitLabel": "Worth a reach",
      "salary": "$186.4k–$279.6k",
      "posted": "Oct 9",
      "why": "Platform strategy with a technical infrastructure stretch",
      "url": "https://www.digitalocean.com/careers/position/apply/?gh_jid=8192977"
    },
    {
      "id": "cisco-knowledge-graph",
      "company": "Cisco",
      "title": "Senior Staff Product Manager, AI Knowledge Graph & Intelligence",
      "city": "Seattle, WA",
      "mode": "Remote",
      "category": "pm",
      "level": "Staff",
      "fit": "stretch",
      "fitLabel": "Stretch signal",
      "salary": "Not listed",
      "posted": "Today",
      "why": "Knowledge graphs, RAG, and agentic workflows",
      "url": "https://cisco.wd5.myworkdayjobs.com/Cisco_Careers/job/Seattle-Washington-US/Senior-Staff-Product-Manager--AI-Knowledge-Graph---Intelligence_2019172-1"
    },
    {
      "id": "servicenow-cloud-platform",
      "company": "ServiceNow",
      "title": "Principal Product Manager, Cloud Platform",
      "city": "Kirkland, WA",
      "mode": "Hybrid",
      "category": "pm",
      "level": "Principal",
      "fit": "stretch",
      "fitLabel": "Stretch signal",
      "salary": "$166.5k–$291.4k",
      "posted": "Oct 9",
      "why": "Platform strategy with heavier cloud expectations",
      "url": "https://jobs.smartrecruiters.com/ServiceNow/744000154770367-principal-product-manager-servicenow-cloud-platform?oga=true"
    }
  ]
};
const MANIFEST = {
  "name": "Signal — Job Radar",
  "short_name": "Signal",
  "description": "A compact job radar for design-led product and PM roles.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f2eb",
  "theme_color": "#f5f2eb"
};

const ROLE_KEY = "roles.json";
const MAX_FEED_BYTES = 512 * 1024;
const MCP_VERSION = "2026-07-28";
const REQUIRED_FIELDS = [
  "id",
  "company",
  "title",
  "city",
  "mode",
  "category",
  "level",
  "fit",
  "fitLabel",
  "salary",
  "posted",
  "why",
  "url"
];

const TEXT_LIMITS = {
  id: 120,
  company: 120,
  title: 240,
  city: 120,
  mode: 80,
  category: 40,
  level: 80,
  fit: 40,
  fitLabel: 80,
  salary: 120,
  posted: 80,
  why: 420
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function textResponse(body, status = 200, contentType = "text/plain; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store"
    }
  });
}

function rpcResult(id, result) {
  return jsonResponse({ jsonrpc: "2.0", id, result });
}

function rpcError(id, code, message) {
  return jsonResponse({ jsonrpc: "2.0", id, error: { code, message } }, 400);
}

function toolFailure(message) {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

function cleanText(value, field) {
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  const text = value.trim();
  const limit = TEXT_LIMITS[field] || 500;
  if (!text || text.length > limit) throw new Error(`${field} is empty or too long`);
  if (/[<>]/.test(text)) throw new Error(`${field} contains unsupported markup`);
  return text;
}

function cleanUrl(value) {
  if (typeof value !== "string" || value.length > 2000 || /[<>"'`]/.test(value)) {
    throw new Error("url must be a valid direct HTTPS URL");
  }
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("url must use HTTPS");
  if (url.hostname === "dreamworkhq.com" || url.hostname.endsWith(".dreamworkhq.com")) {
    throw new Error("url must point directly to the employer or ATS listing");
  }
  return url.toString();
}

function normalizeFeed(input) {
  const source = Array.isArray(input) ? { roles: input } : input;
  if (!source || !Array.isArray(source.roles)) throw new Error("feed.roles must be an array");
  if (source.roles.length > 200) throw new Error("feed.roles cannot contain more than 200 roles");

  const ids = new Set();
  const roles = source.roles.map((role, index) => {
    if (!role || typeof role !== "object") throw new Error(`role ${index + 1} is invalid`);
    const normalized = {};
    for (const field of REQUIRED_FIELDS) {
      normalized[field] = field === "url" ? cleanUrl(role[field]) : cleanText(role[field], field);
    }
    if (ids.has(normalized.id)) throw new Error(`duplicate role id: ${normalized.id}`);
    ids.add(normalized.id);
    if (!["design", "pm", "architecture"].includes(normalized.category)) {
      throw new Error(`unsupported category for ${normalized.id}`);
    }
    if (!["strong", "good", "reach", "stretch"].includes(normalized.fit)) {
      throw new Error(`unsupported fit for ${normalized.id}`);
    }
    return normalized;
  });

  const updated = typeof source.updated === "string" && source.updated.trim()
    ? cleanText(source.updated, "updated")
    : new Date().toISOString().slice(0, 10);
  return { updated, roles };
}

async function loadFeed(env) {
  if (!env.BUCKET) return normalizeFeed(DEFAULT_FEED);
  const object = await env.BUCKET.get(ROLE_KEY);
  if (!object) return normalizeFeed(DEFAULT_FEED);
  if (object.size > MAX_FEED_BYTES) throw new Error("stored feed is too large");
  return normalizeFeed(JSON.parse(await object.text()));
}

function rolesJson(feed) {
  return JSON.stringify(feed);
}

async function saveFeed(env, feed) {
  if (!env.BUCKET) throw new Error("persistent feed storage is not configured");
  const body = rolesJson(feed);
  await env.BUCKET.put(ROLE_KEY, body, {
    httpMetadata: {
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-store"
    }
  });
  return feed;
}

function toolDefinitions() {
  return [
    {
      name: "get_roles",
      description: "Read the current Signal Job Radar feed.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }
    },
    {
      name: "update_roles",
      description: "Replace the Signal Job Radar feed with validated roles. Use direct employer or ATS URLs, never Dreamwork listing URLs.",
      inputSchema: {
        type: "object",
        properties: {
          feed: {
            type: "object",
            description: "A feed object with an updated label and a roles array.",
            properties: {
              updated: { type: "string" },
              roles: { type: "array", items: { type: "object" } }
            },
            required: ["roles"],
            additionalProperties: true
          }
        },
        required: ["feed"],
        additionalProperties: false
      }
    }
  ];
}

async function handleMcp(request, env) {
  if (request.method !== "POST") return textResponse("Method Not Allowed", 405);
  if (!request.headers.get("oai-authenticated-user-id")) {
    return jsonResponse({ error: "MCP authentication required" }, 401);
  }

  const raw = await request.text();
  if (raw.length > MAX_FEED_BYTES * 2) return jsonResponse({ error: "Request too large" }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return rpcError(null, -32700, "Invalid JSON");
  }

  const id = body.id ?? null;
  if (body.method === "server/discover") {
    return rpcResult(id, {
      supportedVersions: [MCP_VERSION],
      capabilities: { tools: {} }
    });
  }
  if (body.method === "tools/list") {
    return rpcResult(id, { tools: toolDefinitions() });
  }
  if (body.method !== "tools/call") return rpcError(id, -32601, "Method not found");

  const name = body.params?.name;
  try {
    if (name === "get_roles") {
      const feed = await loadFeed(env);
      return rpcResult(id, {
        content: [{ type: "text", text: JSON.stringify(feed) }],
        structuredContent: feed
      });
    }
    if (name === "update_roles") {
      const feed = normalizeFeed(body.params?.arguments?.feed);
      const saved = await saveFeed(env, feed);
      return rpcResult(id, {
        content: [{ type: "text", text: `Updated ${saved.roles.length} roles.` }],
        structuredContent: saved
      });
    }
    return rpcResult(id, toolFailure(`Unknown tool: ${name || "(missing name)"}`));
  } catch (error) {
    return rpcResult(id, toolFailure(error instanceof Error ? error.message : "Tool failed"));
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/mcp") return handleMcp(request, env);
  if (request.method !== "GET") return textResponse("Method Not Allowed", 405);

  if (url.pathname === "/roles.json") {
    const feed = await loadFeed(env);
    return textResponse(rolesJson(feed), 200, "application/json; charset=utf-8");
  }
  if (url.pathname === "/manifest.json") {
    return textResponse(JSON.stringify(MANIFEST), 200, "application/manifest+json; charset=utf-8");
  }
  if (url.pathname !== "/" && url.pathname !== "/index.html") return textResponse("Not Found", 404);

  const feed = await loadFeed(env);
  const rendered = PAGE.replace("const roles = __ROLE_DATA__;", `const roles = ${rolesJson(feed)};`);
  if (rendered === PAGE) throw new Error("dashboard role injection marker is missing");
  return textResponse(rendered, 200, "text/html; charset=utf-8");
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error(error);
      return textResponse("Signal Job Radar is temporarily unavailable.", 500);
    }
  }
};
