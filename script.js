let data = [];
let filtered = [];
let displayData = []; // チェックボックスで絞り込まれた表示対象
let currentPage = 1;
let sortAsc = true; // 昇順かどうか
const resultsPerPage = 10;

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
  });

function searchJinja() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  currentPage = 1;

  if (query === '') {
    displayMessage('🔍 検索ワードを入力してください');
    return;
  }

  filtered = data.filter(item =>
    item['町域・字名']?.toLowerCase().includes(query) ||
    item['市町村名(支部)']?.toLowerCase().includes(query)
  );

  sortResults();

  if (filtered.length === 0) {
    displayMessage('😢 該当する神社が見つかりませんでした');
    return;
  }

  applyFilter(); // チェックボックスで絞り込みしてから表示

  renderResults();
}

function sortResults() {
  filtered.sort((a, b) => {
    const cityA = a['市町村名(支部)'] || '';
    const cityB = b['市町村名(支部)'] || '';
    const townA = a['町域・字名'] || '';
    const townB = b['町域・字名'] || '';

    if (cityA < cityB) return sortAsc ? -1 : 1;
    if (cityA > cityB) return sortAsc ? 1 : -1;
    return sortAsc ? townA.localeCompare(townB) : townB.localeCompare(townA);
  });
}

function renderResults() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const pageItems = displayData.slice(startIndex, endIndex); // ← 修正ポイント

  const info = document.createElement('div');
  info.innerHTML = `✅ 全 ${displayData.length} 件ヒット（ページ ${currentPage} / ${Math.ceil(displayData.length / resultsPerPage)}）`;
  resultsDiv.appendChild(info);

  pageItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      🏠 <strong>${item['町域・字名']}</strong><br>
      🗾 <strong>${item['市町村名(支部)']}</strong><br>
      ⛩️ <strong>${item['神社名']}</strong><br>
      🏠 ${item['所在地']}<br>
      🙋‍♂️ ${item['宮司名']}<br>
      📞 ${item['電話番号']}
    `;
    resultsDiv.appendChild(div);
  });

  renderPagination();
}


function renderPagination() {
  const resultsDiv = document.getElementById('results');
  const totalPages = Math.ceil(displayData.length / resultsPerPage); // ← 修正

  if (totalPages <= 1) return;

  const nav = document.createElement('div');
  nav.style.marginTop = '20px';

  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← 前へ';
    prevBtn.onclick = () => {
      currentPage--;
      renderResults();
    };
    nav.appendChild(prevBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '次へ →';
    nextBtn.style.marginLeft = '10px';
    nextBtn.onclick = () => {
      currentPage++;
      renderResults();
    };
    nav.appendChild(nextBtn);
  }

  resultsDiv.appendChild(nav);
}


function displayMessage(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p>${message}</p>`;
}

function applyFilter() {
  const checkCity = document.getElementById('filterCity').checked;
  const checkTown = document.getElementById('filterTown').checked;

  displayData = filtered.filter(item => {
    const town = item['町域・字名']?.toLowerCase() || '';
    const city = item['市町村名(支部)']?.toLowerCase() || '';
    const query = document.getElementById('searchInput').value.trim().toLowerCase();

    const matchTown = checkTown && town.includes(query);
    const matchCity = checkCity && city.includes(query);

    return matchTown || matchCity;
  });

  sortResults();
  renderResults();
}


document.getElementById('searchBtn').addEventListener('click', searchJinja);
document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchJinja();
  }
});

document.getElementById('sortBtn').addEventListener('click', () => {
  if (filtered.length === 0) return;

  sortAsc = !sortAsc;
  sortResults();
  renderResults();

  const icon = sortAsc ? '🔼' : '🔽';
  document.getElementById('sortBtn').textContent = `市町村名順 ${icon}`;
});

document.getElementById('filterCity').addEventListener('change', applyFilter);
document.getElementById('filterTown').addEventListener('change', applyFilter);

