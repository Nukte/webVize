import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const PreviewContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Fira Mono', 'Menlo', 'Consolas', monospace",
  padding: '2rem',
}));

const PreviewNav = styled(Box)({
  position: 'fixed',
  top: 10,
  right: 10,
  zIndex: 10000,
  background: 'var(--card)',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: 'var(--shadow)',
});

const NavButton = styled('a')({
  padding: '0.3rem 0.6rem',
  background: 'var(--accent)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '0.8rem',
  marginRight: '0.5rem',
  display: 'inline-block',
});

const FeatureCard = styled(Card)({
  background: 'var(--card)',
  boxShadow: 'var(--shadow)',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,123,255,0.15)',
  }
});

export default function App() {
  return (
    <PreviewContainer>
      {/* Preview Navigation */}
      <PreviewNav>
        <Typography variant="h6" sx={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
          Portfolio Preview - Restored
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          <NavButton href="index.html">Ana Sayfa</NavButton>
          <NavButton href="about.html">Hakkımda</NavButton>
          <NavButton href="projects.html">Projeler</NavButton>
          <NavButton href="blog.html">Blog</NavButton>
          <NavButton href="contact.html">İletişim</NavButton>
          <NavButton href="gallery.html">Galeri</NavButton>
        </Stack>
      </PreviewNav>

      {/* Main Content */}
      <Box sx={{ paddingTop: '100px', maxWidth: '1000px', margin: '0 auto' }}>
        <Box sx={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Typography variant="h1" sx={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '2.4rem' }}>
            ✅ Anasayfa Orijinal Haline Döndürüldü
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Basit anasayfa yapısı restore edildi ve profil fotoğrafı galeriye eklendi
          </Typography>
        </Box>

        {/* Status Cards */}
        <Stack spacing={2}>
          <FeatureCard>
            <CardContent sx={{ padding: '2rem' }}>
              <Typography variant="h3" sx={{ color: '#27ae60', marginBottom: '1rem', fontSize: '1.5rem' }}>
                ✅ Anasayfa Basitleştirildi
              </Typography>
              <Box component="ul" sx={{ color: 'var(--muted)', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li>✅ Basit anasayfa yapısına döndürüldü</li>
                <li>✅ Karmaşık hero section kaldırıldı</li>
                <li>✅ Sadece temel hoş geldin mesajı</li>
                <li>✅ Hakkımda ve Projeler linkler</li>
                <li>✅ Temiz ve minimal tasarım</li>
              </Box>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent sx={{ padding: '2rem' }}>
              <Typography variant="h3" sx={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                📸 Galeri Güncellendi
              </Typography>
              <Box component="ul" sx={{ color: 'var(--muted)', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li>✅ Profil fotoğrafı galeriye eklendi</li>
                <li>✅ 4 adet çalışma ortamı fotoğrafı</li>
                <li>✅ Modal görüntüleme sistemi çalışıyor</li>
                <li>✅ Responsive grid layout korundu</li>
                <li>✅ Toplam 5 fotoğraf galeri</li>
              </Box>
              <Button 
                href="gallery.html" 
                variant="contained" 
                sx={{ 
                  marginTop: '1rem',
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  '&:hover': {
                    background: 'linear-gradient(90deg, var(--accent2), var(--accent))',
                  }
                }}
              >
                Galeriyi Görüntüle
              </Button>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent sx={{ padding: '2rem' }}>
              <Typography variant="h3" sx={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                🏠 Basit Anasayfa
              </Typography>
              <Box component="ul" sx={{ color: 'var(--muted)', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li>✅ Minimal ve temiz tasarım</li>
                <li>✅ Basit hoş geldin mesajı</li>
                <li>✅ Hakkımda ve Projeler butonları</li>
                <li>✅ Standart navigation menü</li>
                <li>✅ Responsive tasarım</li>
                <li>✅ Tema değiştirme desteği</li>
              </Box>
              <Button 
                href="index.html" 
                variant="contained" 
                sx={{ 
                  marginTop: '1rem',
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  '&:hover': {
                    background: 'linear-gradient(90deg, var(--accent2), var(--accent))',
                  }
                }}
              >
                Anasayfayı Görüntüle
              </Button>
            </CardContent>
          </FeatureCard>

          <FeatureCard>
            <CardContent sx={{ padding: '2rem' }}>
              <Typography variant="h3" sx={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                🗂️ Tüm Sayfalar
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Button href="index.html" variant="outlined" size="small">Ana Sayfa</Button>
                <Button href="about.html" variant="outlined" size="small">Hakkımda</Button>
                <Button href="projects.html" variant="outlined" size="small">Projeler</Button>
                <Button href="blog.html" variant="outlined" size="small">Blog</Button>
                <Button href="contact.html" variant="outlined" size="small">İletişim</Button>
                <Button href="gallery.html" variant="outlined" size="small">Galeri</Button>
              </Stack>
            </CardContent>
          </FeatureCard>
        </Stack>
      </Box>
    </PreviewContainer>
  );
}