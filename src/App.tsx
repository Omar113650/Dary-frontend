import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocaleContext } from './utils/LocaleContext';
import { translations, getDirection } from './utils/i18n';
import type { Locale } from './utils/i18n';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [locale, setLocale] = useState<Locale>('ar');
  const direction = getDirection(locale);
  const t = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, direction }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocaleContext.Provider>
  );
}
