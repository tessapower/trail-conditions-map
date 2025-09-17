import TrailMap from './components/TrailMap';
import './App.css';

function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TrailMap />
      </div>
    </div>
  );
}

export default App;
