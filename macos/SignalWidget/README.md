# Signal Job Radar Widget

Native macOS WidgetKit companion for the public Signal dashboard.

## Install

1. Unzip `SignalWidget.zip`.
2. Move `SignalWidget.app` to Applications and open it once.
3. On the desktop, open the widget picker and search for **Signal Job Radar**.
4. Add the small or medium widget.

The widget refreshes from the public `roles.json` feed. Tap it to open the native radar app with the full role list, search, and fit filters. Individual role rows open the source listing directly in your browser. The public dashboard remains available here:

https://signal-job-radar.sage-dog-3724.chatgpt.site

## Track applications on this Mac

Use **Mark applied** after submitting an application, or **Dismiss** to clear a listing from New. Neither action submits an application. The **Applied** and **Dismissed** tabs preserve the listing and the date you marked it, including after it leaves the public feed. **Restore to New** clears the saved status; the listing appears in New only if it is still in the current feed.

Status survives app restarts and feed refreshes. Matching uses the feed ID and normalized listing URL, ignoring common tracking parameters while preserving job IDs in query strings. Status is stored privately in the app’s sandboxed Application Support directory (`Signal/role-history.json`). It does not sync to other Macs, the website, or widgets, which continue to show the public feed.

If history cannot be read, the app displays an error and does not overwrite it or show potentially applied roles as new. If saving fails, the action is not applied and an error appears.

### Verify saved-status behavior

From the repository root:

```bash
swiftc macos/SignalWidget/SignalWidget/RoleHistory.swift tests/RoleHistoryTests.swift -o /tmp/signal-history-tests
/tmp/signal-history-tests
```
