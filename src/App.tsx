// src/App.tsx
import React, { useState, useEffect, createContext } from 'react';
import { IonApp } from '@ionic/react';
import Tab1 from './pages/Tab1';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

export const BrandingContext = createContext<any>(null);

const API_EXEC_URL = "https://script.google.com/macros/s/AKfycbwm0nO0XRsJD2gqWTbfZvRHdKTN0ylbJrWkJt66TcCCiBkX8l7aaV2lF5saHEBwwqeUoA/exec";
const KUNDEN_ID = 'V046';

function initOneSignal(appId: string) {
  if (!appId) return;
  (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
  (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
    await OneSignal.init({ appId });
  });
}

const App: React.FC = () => {
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  const loadBranding = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_EXEC_URL}?action=get_branding&kundenId=${KUNDEN_ID}`);
      const data = await res.json();
      if (data.success) {
        setBranding(data.branding);
        const vereinName = data.branding?.Verein_Name || 'SG Gierath';
        const themaFarbe = data.branding?.Thema_Farbe || '#C4161C';
        const logoUrl = data.branding?.Logo_Verein || data.branding?.Logo_verein || '/logo.png';
        document.title = vereinName;
        const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (appleMeta) appleMeta.setAttribute('content', vereinName);
        let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (themeColorMeta) { themeColorMeta.setAttribute('content', themaFarbe); }
        else { themeColorMeta = document.createElement('meta'); themeColorMeta.name = 'theme-color'; themeColorMeta.content = themaFarbe; document.head.appendChild(themeColorMeta); }
        if (logoUrl) {
          const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          const appleFavicon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
          if (favicon) favicon.href = logoUrl;
          if (appleFavicon) appleFavicon.href = logoUrl;
        }
        const osAppId = data.branding?.OneSignal_App_ID || '';
        if (osAppId) initOneSignal(osAppId);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { loadBranding(); }, []); // eslint-disable-line

  const reload = () => loadBranding();

  const handleLogin = async () => {
    try {
      setError('');
      const res = await fetch(`${API_EXEC_URL}?kundenId=${encodeURIComponent(KUNDEN_ID)}&password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (data.success) { setIsAuthenticated(true); setShowLogin(false); setPassword(''); }
      else { setError(data.error || 'Falsches Passwort!'); }
    } catch { setError('Login Fehler'); }
  };

  const isAdmin = !!(branding as any)?.Passwort;
  const themaFarbe = branding?.Thema_Farbe || '#C4161C';
  const logoUrl = branding?.Logo_verein || branding?.Logo_Verein || '/logo.png';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#C4161C' }}>
        <div style={{ color: 'white', fontSize: 18 }}>Laden...</div>
      </div>
    );
  }

  if (isAdmin && showLogin && !isAuthenticated) {
    return (
      <IonApp>
        <div style={{ minHeight: '100vh', background: themaFarbe, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'contain', background: 'rgba(255,255,255,0.15)', padding: 8 }} />}
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: 28, margin: 0, textAlign: 'center' }}>{branding?.Verein_Name || 'SG Gierath'}</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: 14 }}>Admin Login</p>
            <input type="password" placeholder="Passwort eingeben" value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              onKeyDown={(e: any) => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            {error && <p style={{ color: '#ffcccc', margin: 0, fontSize: 14 }}>{error}</p>}
            <button onClick={handleLogin} style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: 'white', color: themaFarbe, fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>Einloggen</button>
            <button onClick={() => { setShowLogin(false); setPassword(''); setError(''); }} style={{ width: '100%', padding: 11, borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>← Zurück zur App</button>
          </div>
        </div>
      </IonApp>
    );
  }

  return (
    <BrandingContext.Provider value={{ branding, loading, reload, isAuthenticated }}>
      <IonApp>
        <Tab1 onAdminClick={isAdmin ? () => setShowLogin(true) : undefined} />
      </IonApp>
    </BrandingContext.Provider>
  );
};

export default App;
