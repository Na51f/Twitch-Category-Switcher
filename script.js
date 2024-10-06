// Load saved entries when the page loads
document.addEventListener('DOMContentLoaded', loadEntries);

function addEntry() {
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    
    if (category && title) {
        addRowToTable(category, title);
        
        // Clear input fields
        document.getElementById('category').value = '';
        document.getElementById('title').value = '';

        // Save entries after adding a new one
        saveEntries();
    } else {
        alert('Please enter values for both category and title');
    }
}

function addRowToTable(category, title) {
    const table = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    
    cell1.textContent = category;
    cell2.textContent = title;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = '×';
    removeButton.className = 'remove-btn';
    removeButton.onclick = function() {
        removeRow(this);
    };
    cell3.appendChild(removeButton);
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveEntries();
}

function saveEntries() {
    const table = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];
    const entries = [];

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        entries.push({
            category: row.cells[0].textContent,
            title: row.cells[1].textContent
        });
    }

    localStorage.setItem('categoryEntries', JSON.stringify(entries));
}

function loadEntries() {
    const savedEntries = localStorage.getItem('categoryEntries');
    if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        entries.forEach(entry => {
            addRowToTable(entry.category, entry.title);
        });
    }
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// Check for saved dark mode preference and apply it immediately
if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.documentElement.classList.add('dark-mode');
}

// Remove the no-transition class after a short delay
window.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        document.documentElement.classList.remove('no-transition');
    }, 100);
});