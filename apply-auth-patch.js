#!/usr/bin/env node
/**
 * apply-auth-patch.js
 * Run: node apply-auth-patch.js
 * This patches src/App.js in-place to add the login/auth feature.
 */
const fs = require("fs");
const path = require("path");

const appPath = path.join(__dirname, "src", "App.js");
let code = fs.readFileSync(appPath, "utf8");

// ─── 1. Insert AUTH block before "─── MAIN APP ───" ─────────────
const AUTH_BLOCK = `
// ─── AUTH CONFIG ──────────────────────────────────────────────────
const USERS = [
  { username: "owner",  password: "cookies2026", role: "owner", displayName: "Owner" },
  { username: "staff",  password: "staff123",    role: "staff", displayName: "Staff" },
];

// ─── LOGIN SCREEN ─────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password
    );
    if (user) { setError(""); onLogin(user); }
    else setError("Incorrect username or password. Please try again.");
  };
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex",
      alignItems:"center", justifyContent:"center", padding:16,
      fontFamily:"'DM Sans','Helvetica Neue',Arial,sans-serif", color:T.text }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:28, fontWeight:900, color:T.accent, letterSpacing:-0.5, marginBottom:4 }}>
            Cookies Bites
          </div>
          <div style={{ fontSize:12, color:T.textMuted }}>Business Tracker \\u00b7 Sign in to continue</div>
        </div>
        <div style={{ background:T.card, border:\`1px solid \${T.border}\`, borderRadius:14, padding:28 }}>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:20, color:T.text }}>\\ud83d\\udd10 Sign In</div>
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Username</label>
            <input style={S.input} type="text" value={username}
              onChange={(e)=>setUsername(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==="Enter") handleLogin(); }}
              placeholder="Enter your username" autoComplete="username" autoCapitalize="none" />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={S.label}>Password</label>
            <div style={{ position:"relative" }}>
              <input style={{ ...S.input, paddingRight:40 }}
                type={showPass?"text":"password"} value={password}
                onChange={(e)=>setPassword(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter") handleLogin(); }}
                placeholder="Enter your password" autoComplete="current-password" />
              <button style={{ position:"absolute", right:10, top:"50%",
                transform:"translateY(-50%)", background:"none", border:"none",
                color:T.textMuted, cursor:"pointer", fontSize:13, padding:0, minHeight:"auto" }}
                onClick={()=>setShowPass(!showPass)} tabIndex={-1}>
                {showPass ? "\\ud83d\\ude48" : "\\ud83d\\udc41\\ufe0f"}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background:\`\${T.danger}15\`, border:\`1px solid \${T.danger}40\`,
              borderRadius:7, padding:"8px 12px", fontSize:12, color:T.danger, marginBottom:14 }}>
              \\u26a0\\ufe0f {error}
            </div>
          )}
          <button style={{ ...S.btn("primary"), width:"100%", padding:"10px 16px", fontSize:14, fontWeight:700 }}
            onClick={handleLogin}>
            Sign In \\u2192
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:T.textDim }}>
          \\u00a9 {new Date().getFullYear()} Cookies Bites \\u00b7 Internal Use Only
        </div>
      </div>
    </div>
  );
}

`;

const MAIN_APP_MARKER = "// \u2500\u2500\u2500 MAIN APP \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500";
if (!code.includes(MAIN_APP_MARKER)) {
  console.error("ERROR: Could not find '─── MAIN APP ───' marker in App.js");
  process.exit(1);
}
code = code.replace(MAIN_APP_MARKER, AUTH_BLOCK + MAIN_APP_MARKER);
console.log("✓ Auth block inserted");

// ─── 2. Replace TABS with ALL_TABS ──────────────────────────────
const OLD_TABS = `const TABS = [
  { id: "dashboard", label: "\ud83d\udcca Dashboard" },
  { id: "catering", label: "\ud83c\udf89 Catering" },
  { id: "proposals", label: "\ud83d\udccb Proposals" },
  { id: "catalog", label: "\ud83d\udce6 Catalog" },
  { id: "restaurant", label: "\ud83c\udf7d\ufe0f Restaurant & Delivery" },
  { id: "invoices", label: "\ud83e\uddfe Invoices & AR" },
  { id: "overheads", label: "\ud83c\udfe2 Overheads" },
  { id: "reports", label: "\ud83d\udcd1 Reports" },
];`;

const NEW_TABS = `const ALL_TABS = [
  { id: "dashboard",  label: "\ud83d\udcca Dashboard",              ownerOnly: true  },
  { id: "catering",   label: "\ud83c\udf89 Catering",               ownerOnly: false },
  { id: "proposals",  label: "\ud83d\udccb Proposals",              ownerOnly: false },
  { id: "catalog",    label: "\ud83d\udce6 Catalog",                ownerOnly: false },
  { id: "restaurant", label: "\ud83c\udf7d\ufe0f Restaurant & Delivery",  ownerOnly: false },
  { id: "invoices",   label: "\ud83e\uddfe Invoices & AR",          ownerOnly: true  },
  { id: "overheads",  label: "\ud83c\udfe2 Overheads",              ownerOnly: true  },
  { id: "reports",    label: "\ud83d\udcd1 Reports",                ownerOnly: true  },
];`;

if (!code.includes('{ id: "dashboard", label: "')) {
  console.error("ERROR: Could not find TABS array");
  process.exit(1);
}
code = code.replace(/const TABS = \[[\s\S]*?\];/, NEW_TABS);
console.log("\u2713 ALL_TABS with ownerOnly flags added");

// ─── 3. App() state + login gate ────────────────────────────────
code = code.replace(
  `export default function App() {`,
  `export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const isOwner = currentUser?.role === "owner";
  const TABS = ALL_TABS.filter((t) => !t.ownerOnly || isOwner);`
);

code = code.replace(
  `  const [tab, setTab] = useState("dashboard");`,
  `  const [tab, setTab] = useState("catering"); // safe default for staff`
);
console.log("\u2713 App() state patched");

// ─── 4. Login gate ───────────────────────────────────────────────
const OLD_RETURN = `  return (
    <div style={S.app}>
      <style>{\``;
const NEW_RETURN = `  if (!currentUser) {
    return <LoginScreen onLogin={(user) => {
      setCurrentUser(user);
      setTab(user.role === "owner" ? "dashboard" : "catering");
    }} />;
  }

  return (
    <div style={S.app}>
      <style>{\``;
code = code.replace(OLD_RETURN, NEW_RETURN);
console.log("\u2713 Login gate added");

// ─── 5. Desktop topbar: user badge + logout ──────────────────────
const OLD_CITY = `          <div
            style={{
              fontSize: 10,
              color: T.textMuted,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            \ud83d\udccd{biz.city} \u00b7 {TODAY_LABEL}
          </div>
        </div>
      ) : (`;
const NEW_CITY = `          <div
            style={{
              fontSize: 10,
              color: T.textMuted,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            \ud83d\udccd{biz.city} \u00b7 {TODAY_LABEL}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{
              background: isOwner ? \`\${T.accent}18\` : \`\${T.info}18\`,
              border: \`1px solid \${isOwner ? T.accent : T.info}40\`,
              borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700,
              color: isOwner ? T.accent : T.info,
            }}>
              {isOwner ? "\ud83d\udc51" : "\ud83d\udc64"} {currentUser.displayName}
            </div>
            <button
              style={{ ...S.btn("ghost"), fontSize:11, padding:"4px 10px" }}
              onClick={()=>{ setCurrentUser(null); setTab("catering"); }}
            >
              \ud83d\udeaa Logout
            </button>
          </div>
        </div>
      ) : (`;
code = code.replace(OLD_CITY, NEW_CITY);
console.log("\u2713 Desktop logout added");

// ─── 6. Mobile topbar: user badge + logout ───────────────────────
const OLD_MOB = `          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: T.textMuted }}>
              {TODAY_LABEL}
            </span>
            <button
              style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 8px" }}
              onClick={() => setShowSettings(true)}
            >
              \u2699\ufe0f
            </button>
          </div>`;
const NEW_MOB = `          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{
              background: isOwner ? \`\${T.accent}18\` : \`\${T.info}18\`,
              border: \`1px solid \${isOwner ? T.accent : T.info}40\`,
              borderRadius:20, padding:"2px 8px", fontSize:9, fontWeight:700,
              color: isOwner ? T.accent : T.info,
            }}>
              {isOwner ? "\ud83d\udc51" : "\ud83d\udc64"} {currentUser.displayName}
            </div>
            {isOwner && (
              <button style={{ ...S.btn("ghost"), fontSize:11, padding:"4px 8px" }}
                onClick={()=>setShowSettings(true)}>
                \u2699\ufe0f
              </button>
            )}
            <button
              style={{ ...S.btn("ghost"), fontSize:11, padding:"4px 8px", color:T.danger }}
              onClick={()=>{ setCurrentUser(null); setTab("catering"); }}>
              \ud83d\udeaa
            </button>
          </div>`;
code = code.replace(OLD_MOB, NEW_MOB);
console.log("\u2713 Mobile logout added");

// ─── 7. Guard Settings modal ─────────────────────────────────────
code = code.replace(
  `{showSettings && (
        <SettingsModal`,
  `{showSettings && isOwner && (
        <SettingsModal`
);
console.log("\u2713 Settings modal guarded");

// ─── 8. CateringPage: add isOwner prop ───────────────────────────
code = code.replace(
  `function CateringPage({ events, setEvents, logo, biz }) {`,
  `function CateringPage({ events, setEvents, logo, biz, isOwner = true }) {`
);
// Guard profit line in event cards
code = code.replace(
  `                  <div
                    style={{
                      fontSize: 10,
                      color: profit >= 0 ? T.success : T.danger,
                    }}
                  >
                    Profit: {fmt(profit)} ({margin}%)
                  </div>`,
  `                  {isOwner && <div
                    style={{
                      fontSize: 10,
                      color: profit >= 0 ? T.success : T.danger,
                    }}
                  >
                    Profit: {fmt(profit)} ({margin}%)
                  </div>}`
);
// Guard COGS label
code = code.replace(
  `            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                marginTop: 9,
                marginBottom: 5,
              }}
            >
              COSTS (COGS)
            </div>`,
  `            {isOwner && <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                marginTop: 9,
                marginBottom: 5,
              }}
            >
              COSTS (COGS)
            </div>}`
);
console.log("\u2713 CateringPage patched");

// ─── 9. RestaurantPage: add isOwner prop ─────────────────────────
code = code.replace(
  `function RestaurantPage({
  sales,
  setSales,
  inventory,
  setInventory,
  catalogItems,
  meals,
  setMeals,
  logo,
  biz,
}) {`,
  `function RestaurantPage({
  sales,
  setSales,
  inventory,
  setInventory,
  catalogItems,
  meals,
  setMeals,
  logo,
  biz,
  isOwner = true,
}) {`
);
console.log("\u2713 RestaurantPage signature updated");

// ─── 10. Pass isOwner to page components ─────────────────────────
code = code.replace(
  `          <CateringPage
            events={events}
            setEvents={setEvents}
            logo={logo}
            biz={biz}
          />`,
  `          <CateringPage
            events={events}
            setEvents={setEvents}
            logo={logo}
            biz={biz}
            isOwner={isOwner}
          />`
);
code = code.replace(
  `          <RestaurantPage
            sales={sales}
            setSales={setSales}
            inventory={inventory}
            setInventory={setInventory}
            catalogItems={catalogItems}
            meals={meals}
            setMeals={setMeals}
            logo={logo}
            biz={biz}
          />`,
  `          <RestaurantPage
            sales={sales}
            setSales={setSales}
            inventory={inventory}
            setInventory={setInventory}
            catalogItems={catalogItems}
            meals={meals}
            setMeals={setMeals}
            logo={logo}
            biz={biz}
            isOwner={isOwner}
          />`
);
console.log("\u2713 isOwner passed to page components");

// Write output
fs.writeFileSync(appPath, code, "utf8");
console.log("\\n\u2705 App.js successfully patched!");
console.log("\\nCredentials:");
console.log("  Owner: username=owner    password=cookies2026");
console.log("  Staff: username=staff    password=staff123");
