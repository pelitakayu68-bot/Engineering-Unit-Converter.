// Units configuration object [cite: 28]
const units = {
    length: { meters: 1, km: 1000, miles: 1609.34, feet: 0.3048, inches: 0.0254 },
    mass: { kg: 1, grams: 0.001, pounds: 0.453592, ounces: 0.0283495 },
    temp: "formula"
};

// Data Persistence [cite: 35]
let history = JSON.parse(localStorage.getItem('unit_logs')) || [];

function updateUnits() {
    const type = document.getElementById('unitType').value;
    const from = document.getElementById('fromUnit');
    const to = document.getElementById('toUnit');
    
    from.innerHTML = ""; to.innerHTML = "";
    const options = type === 'temp' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(units[type]);
    
    options.forEach(opt => {
        from.add(new Option(opt.toUpperCase(), opt));
        to.add(new Option(opt.toUpperCase(), opt));
    });
    convert();
}

/** * Main calculation function using Selection and Math [cite: 33]
 */
function convert() {
    const type = document.getElementById('unitType').value;
    const val = parseFloat(document.getElementById('inputValue').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    const display = document.getElementById('outputValue');

    // Input Validation [cite: 32, 36]
    if (isNaN(val)) { display.innerText = "0.0000"; return; }

    let result;
    // Selection Logic for temperature [cite: 28]
    if (type === 'temp') {
        result = thermalCalculation(val, from, to);
    } else {
        const base = val * units[type][from];
        result = base / units[type][to];
    }
    display.innerText = result.toFixed(4); // Output Formatting [cite: 34]
}

function thermalCalculation(v, f, t) {
    let c;
    if (f === "Celsius") c = v;
    else if (f === "Fahrenheit") c = (v - 32) * 5/9;
    else c = v - 273.15;

    if (t === "Celsius") return c;
    if (t === "Fahrenheit") return (c * 9/5) + 32;
    return c + 273.15;
}

function saveConversion() {
    const entry = {
        time: new Date().toLocaleTimeString(),
        input: `${document.getElementById('inputValue').value} ${document.getElementById('fromUnit').value}`,
        output: `${document.getElementById('outputValue').innerText} ${document.getElementById('toUnit').value}`
    };
    history.unshift(entry);
    if(history.length > 8) history.pop();
    
    localStorage.setItem('unit_logs', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyBody');
    container.innerHTML = history.map(h => `
        <tr>
            <td>${h.time}</td>
            <td>${h.input.toUpperCase()}</td>
            <td style="color: var(--accent)">${h.output.toUpperCase()}</td>
        </tr>
    `).join('');
}

function clearHistory() {
    if(confirm("Confirm system data purge?")) {
        history = [];
        localStorage.removeItem('unit_logs');
        renderHistory();
    }
}

// Initial System Boot
updateUnits();
renderHistory();
