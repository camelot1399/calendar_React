import './App.css';
import { Calendar } from './components/calendar/Calendar';

function App() {
  return (
    <div className="App">
		<div style={{width: 500}}>
			<Calendar rangeMode/>
		</div>
    </div>
  );
}

export default App;
