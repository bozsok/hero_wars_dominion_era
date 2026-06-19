import React, { useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HeroesList from './components/HeroesList';
import { HeroProvider, HeroContext } from './context/HeroContext';
import DataSyncModal from './components/DataSyncModal';
const ParticlesBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.y -= this.speed;
        if (this.y < 0) this.reset();
      }
      draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="particle-canvas" />;
};

function AppContent() {
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const { importBulkData } = React.useContext(HeroContext);

  return (
    <div className="layout-app">
      <ParticlesBackground />
      <Header 
        onOpenImport={() => setIsImportOpen(true)} 
      />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Dashboard' && <Dashboard />}
      {activeTab === 'Heroes' && <HeroesList />}
      {activeTab !== 'Dashboard' && activeTab !== 'Heroes' && (
        <main className="layout-main">
          <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>{activeTab} menüpont hamarosan...</h2>
          </div>
        </main>
      )}
      <DataSyncModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={(data) => {
          importBulkData(data);
        }} 
      />
    </div>
  );
}

function App() {
  return (
    <HeroProvider>
      <AppContent />
    </HeroProvider>
  );
}

export default App;
