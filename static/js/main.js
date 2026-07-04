document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btn-text');
    const container = document.getElementById('releases-container');

    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    
    const switchTheme = (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }    
    };

    toggleSwitch.addEventListener('change', switchTheme, false);

    let currentReleases = [];

    const fetchReleases = async () => {
        spinner.style.display = 'block';
        refreshBtn.disabled = true;
        btnText.textContent = 'Fetching...';

        try {
            const response = await fetch('/api/releases');
            const data = await response.json();

            if (data.error) {
                container.innerHTML = `<div class="error">Error: ${data.error}</div>`;
                return;
            }

            currentReleases = data;
            renderReleases(data);
        } catch (error) {
            container.innerHTML = `<div class="error">Failed to connect to server.</div>`;
        } finally {
            spinner.style.display = 'none';
            refreshBtn.disabled = false;
            btnText.textContent = 'Refresh Updates';
        }
    };

    const copyToClipboard = (text, btn) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.innerHTML;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    };

    const exportToCSV = () => {
        if (currentReleases.length === 0) return;

        const headers = ['Title', 'Date', 'Link', 'Summary'];
        const csvRows = [headers.join(',')];

        currentReleases.forEach(rel => {
            const row = [
                `"${rel.title.replace(/"/g, '""')}"`,
                `"${rel.published.replace(/"/g, '""')}"`,
                `"${rel.link.replace(/"/g, '""')}"`,
                `"${rel.summary.replace(/<[^>]*>/g, '').replace(/"/g, '""').substring(0, 500)}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'bigquery_releases.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderReleases = (releases) => {
        container.innerHTML = '';
        releases.forEach((release, index) => {
            const card = document.createElement('div');
            card.className = 'release-card';
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = release.summary;
            const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";
            
            const tweetText = encodeURIComponent(`BigQuery Update: ${release.title}\n\nCheck it out: ${release.link}`);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

            card.innerHTML = `
                <div class="release-date">${release.published}</div>
                <div class="release-title">${release.title}</div>
                <div class="release-summary">${release.summary}</div>
                <div class="actions">
                    <a href="${tweetUrl}" target="_blank" class="tweet-btn">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                        </svg>
                        Tweet
                    </a>
                    <button class="copy-btn" data-index="${index}">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            `;
            
            card.querySelector('.copy-btn').addEventListener('click', (e) => {
                const textToCopy = `${release.title}\n${release.link}\n\n${cleanSummary}`;
                copyToClipboard(textToCopy, e.currentTarget);
            });

            container.appendChild(card);
        });
    };

    refreshBtn.addEventListener('click', fetchReleases);
    exportCsvBtn.addEventListener('click', exportToCSV);

    fetchReleases();
});
