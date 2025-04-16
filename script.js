let data = [];
let filtered = [];
let currentPage = 1;
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
  
  if (filtered.length === 0) {
    displayMessage('😢 該当する神社が見つかりませんでした');
    return;
  }

  renderResults();
}

function renderResults() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);

  const info = document.createElement('div');
  info.innerHTML = `✅ 全 ${filtered.length} 件ヒット（ページ ${currentPage} / ${Math.ceil(filtered.length / resultsPerPage)}）`;
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
  const totalPages = Math.ceil(filtered.length / resultsPerPage);

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

document.getElementById('searchBtn').addEventListener('click', searchJinja);
document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchJinja();
  }
});
