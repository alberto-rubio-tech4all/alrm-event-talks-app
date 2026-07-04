document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btn-text');
    const container = document.getElementById('releases-container');
    const searchInput = document.getElementById('search-input');
    const backToTop = document.getElementById('back-to-top');
    const header = document.querySelector('header');
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    let currentReleases = [];

    // --- Theme Management ---
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') toggleSwitch.checked = true;

    toggleSwitch.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        showToast(`Switched to ${theme} mode`);
    });

    // --- UX Enhancements ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✨</span> ${message}`;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const showSkeletons = () => {
        container.innerHTML = Array(3).fill('<div class="skeleton"></div>').join('');
    };

    // --- Search Logic ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = currentReleases.filter(rel => 
            rel.title.toLowerCase().includes(term) || 
            rel.summary.toLowerCase().includes(term)
        );
        renderReleases(filtered);
    });

    // --- Core Logic ---
    const fetchReleases = async () => {
        showSkeletons();
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
            showToast('Releases updated successfully!');
        } catch (error) {
            container.innerHTML = `<div class="error">Failed to connect to server.</div>`;
            showToast('Failed to fetch updates.');
        } finally {
            spinner.style.display = 'none';
            refreshBtn.disabled = false;
            btnText.textContent = 'Refresh Updates';
        }
    };

    const isNew = (dateStr) => {
        try {
            const pubDate = new Date(dateStr);
            const now = new Date();
            const diffDays = (now - pubDate) / (1000 * 60 * 60 * 24);
            return diffDays < 7; // Consider "new" if published within 7 days
        } catch (e) { return false; }
    };

    const renderReleases = (releases) => {
        container.innerHTML = '';
        if (releases.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">No releases found matching your search.</div>';
            return;
        }

        releases.forEach((release, index) => {
            const card = document.createElement('div');
            card.className = 'release-card';
            card.style.animationDelay = `${index * 0.05}s`;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = release.summary;
            const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";
            
            const tweetText = encodeURIComponent(`BigQuery Update: ${release.title}\n\nCheck it out: ${release.link}`);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
            
            const newBadge = isNew(release.published) ? '<span class="badge-new">New</span>' : '';

            card.innerHTML = `
                <div class="release-date">${release.published} ${newBadge}</div>
                <div class="release-title">${release.title}</div>
                <div class="release-summary">${release.summary}</div>
                <div class="actions">
                    <a href="${tweetUrl}" target="_blank" class="tweet-btn">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                        </svg>
                        Tweet
                    </a>
                    <button class="copy-btn">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            `;
            
            card.querySelector('.copy-btn').addEventListener('click', (e) => {
                const textToCopy = `${release.title}\n${release.link}\n\n${cleanSummary}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('Copied to clipboard!');
                });
            });

            container.appendChild(card);
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
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bigquery_releases.csv';
        a.click();
        showToast('Exported to CSV successfully!');
    };

    refreshBtn.addEventListener('click', fetchReleases);
    exportCsvBtn.addEventListener('click', exportToCSV);

    fetchReleases();
});
