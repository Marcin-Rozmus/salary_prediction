let salaryChart;

function drawSalaryBar() {
    const canvas = document.getElementById('salaryChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const min = parseFloat(document.getElementById('min').value) || 0;
    const minMid = parseFloat(document.getElementById('min-mid').value) || 0;
    const mid = parseFloat(document.getElementById('mid').value) || 0;
    const midMax = parseFloat(document.getElementById('mid-max').value) || 0;
    const max = parseFloat(document.getElementById('max').value) || 0;
    const currentSalary = parseFloat(document.getElementById('current-salary').value) || 0;

    const margin = 40;
    const barHeight = 30;
    const barY = height / 2;

    const chartWidth = width - 2 * margin;

    const scaleX = (value) => {
        return margin + (value - min) * chartWidth / (max - min);
    }

    const gradient = ctx.createLinearGradient(margin, 0, width - margin, 0);
    gradient.addColorStop(0, 'rgba(255, 59, 48, 0.2)');
    gradient.addColorStop(1, 'rgba(52, 199, 89, 0.2)');

    ctx.fillStyle = gradient;
    ctx.fillRect(margin, barY - barHeight/2, chartWidth, barHeight);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, barY - barHeight/2, chartWidth, barHeight);

    const thresholds = [
        { value: min, label: 'MIN' },
        { value: minMid, label: 'MIN MID' },
        { value: mid, label: 'MID' },
        { value: midMax, label: 'MID MAX' },
        { value: max, label: 'MAX' }
    ];

    thresholds.forEach(threshold => {
        const x = scaleX(threshold.value);
        
        ctx.beginPath();
        ctx.moveTo(x, barY - barHeight/2 - 5);
        ctx.lineTo(x, barY + barHeight/2 + 5);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(threshold.label, x, barY + barHeight/2 + 20);
        ctx.fillText(threshold.value.toLocaleString('en-US') + ' PLN', x, barY + barHeight/2 + 35);
    });

    if (currentSalary >= min && currentSalary <= max) {
        const x = scaleX(currentSalary);
        
        ctx.beginPath();
        ctx.arc(x, barY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, barY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#007AFF';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#007AFF';
        ctx.textAlign = 'center';
        ctx.fillText('Current', x, barY - 20);
        ctx.fillText(currentSalary.toLocaleString('en-US') + ' PLN', x, barY - 40);
    }
}

document.querySelectorAll('.range-input input, #current-salary').forEach(input => {
    input.addEventListener('input', drawSalaryBar);
});

function createMiniChart(min, minMid, mid, midMax, max, currentSalary) {
    const canvas = document.createElement('canvas');
    canvas.className = 'mini-chart';
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(255, 59, 48, 0.2)');
    gradient.addColorStop(1, 'rgba(52, 199, 89, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const scaleX = (value) => (value - min) * width / (max - min);
    
    const thresholds = [
        { value: min, color: '#FF3B30' },
        { value: minMid, color: '#FF9500' },
        { value: mid, color: '#FFCC00' },
        { value: midMax, color: '#34C759' },
        { value: max, color: '#007AFF' }
    ];
    
    thresholds.forEach(threshold => {
        const x = scaleX(threshold.value);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = threshold.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    
    if (currentSalary >= min && currentSalary <= max) {
        const x = scaleX(currentSalary);
        ctx.beginPath();
        ctx.arc(x, height/2, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#007AFF';
        ctx.fill();
    }
    
    return canvas;
}

document.getElementById('predict-button').addEventListener('click', async () => {
    const data = {
        currentSalary: parseFloat(document.getElementById('current-salary').value),
        marketGrowth: parseFloat(document.getElementById('market-growth').value),
        raise: parseFloat(document.getElementById('raise').value),
        min: parseFloat(document.getElementById('min').value),
        minMid: parseFloat(document.getElementById('min-mid').value),
        mid: parseFloat(document.getElementById('mid').value),
        midMax: parseFloat(document.getElementById('mid-max').value),
        max: parseFloat(document.getElementById('max').value)
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        const resultsDiv = document.getElementById('prediction-results');
        resultsDiv.style.display = 'block';
        
        const tbody = document.getElementById('prediction-table-body');
        tbody.innerHTML = '';
        
        result.predictions.forEach(prediction => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${prediction.year}</td>
                <td>${Math.round(prediction.current_salary).toLocaleString('en-US')} PLN</td>
                <td>${Math.round(prediction.min).toLocaleString('en-US')} PLN</td>
                <td>${Math.round(prediction.min_mid).toLocaleString('en-US')} PLN</td>
                <td>${Math.round(prediction.mid).toLocaleString('en-US')} PLN</td>
                <td>${Math.round(prediction.mid_max).toLocaleString('en-US')} PLN</td>
                <td>${Math.round(prediction.max).toLocaleString('en-US')} PLN</td>
                <td></td>
            `;
            
            const chartCell = row.lastElementChild;
            const miniChart = createMiniChart(
                prediction.min,
                prediction.min_mid,
                prediction.mid,
                prediction.mid_max,
                prediction.max,
                prediction.current_salary
            );
            chartCell.appendChild(miniChart);
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('salaryChart');
    canvas.width = 800;
    canvas.height = 200;
    drawSalaryBar();
}); 