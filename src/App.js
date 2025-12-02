import logo from './logo.svg';
import './App.css';
import { React, useState } from 'react';
import Header from './components/header.jsx';
import Admin from './pages/admin.jsx'
import User from './pages/user.jsx';

function App() {
  const [role, setRole] = useState(0);

  if (role === 1) {
    return (
      <div className="App">
        <Header role={role} setRole={setRole} />
        <Admin role={role} />
      </div>
    );
  }
  return (
    <div className="App">
      <Header role={role} setRole={setRole} />
      <User role={role} />
    </div>
  );
}

export default App;
