chrome.commands.onCommand.addListener(async (command) => {
    if (command === "promote-bookmark") {
        try {
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url) return;

            // Find the bookmark associated with this URL
            const results = await chrome.bookmarks.search({ url: tab.url });
            if (!results || results.length === 0) {
                console.log("Bookmark not found.");
                return;
            }

            // Pick the first matching bookmark (assuming URL is unique)
            const bookmark = results[0];
            const parentId = bookmark.parentId;

            // Move the bookmark to the top of its folder
            const siblings = await chrome.bookmarks.getChildren(parentId);
            if (siblings.length > 1 && siblings[0].id !== bookmark.id) {
                await chrome.bookmarks.move(bookmark.id, { parentId: parentId, index: 0 });
                console.log(`Promoted bookmark "${bookmark.title}" to the top of its folder.`);
            } else {
                console.log("Bookmark already at the top.");
            }
        } catch (err) {
            console.error("Error promoting bookmark:", err);
        }
    }
});
