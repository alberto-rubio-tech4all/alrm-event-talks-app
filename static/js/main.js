document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btn-text');
    const container = document.getElementById('releases-container');

    const fetchReleases = async () => {
        // UI Feedback
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

            renderReleases(data);
        } catch (error) {
            container.innerHTML = `<div class="error">Failed to connect to server.</div>`;
        } finally {
            spinner.style.display = 'none';
            refreshBtn.disabled = false;
            btnText.textContent = 'Refresh Updates';
        }
    };

    const renderReleases = (releases) => {
        container.innerHTML = '';
        releases.forEach(release => {
            const card = document.createElement('div');
            card.className = 'release-card';
            
            // Clean up summary (it often contains HTML)
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
                        Tweet this
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    };

    refreshBtn.addEventListener('click', fetchReleases);

    // Initial load
    fetchReleases();
});
