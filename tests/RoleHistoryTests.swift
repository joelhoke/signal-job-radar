import Foundation

@main
struct RoleHistoryTests {
    static func role(_ id: String = "job-1", _ url: String = "https://jobs.example.com/apply?gh_jid=123") -> RadarRole {
        RadarRole(id: id, company: "Example", title: "Product Designer", city: "Seattle", mode: "Hybrid",
                  category: "design", level: "Senior", fit: "strong", fitLabel: "Strong fit",
                  salary: "Not listed", posted: "Oct 29", why: "Example", url: url)
    }

    static func expect(_ condition: @autoclosure () -> Bool, _ message: String) {
        precondition(condition(), message)
    }

    static func main() throws {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent("SignalHistoryTests-" + UUID().uuidString)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let file = directory.appendingPathComponent("history.json")
        var history = try RoleHistory(fileURL: file)
        let original = role()
        expect(history.roles(for: .new, feed: [original]).count == 1, "New feed appears")
        try history.set(.applied, for: original, date: Date(timeIntervalSince1970: 100))
        expect(history.roles(for: .new, feed: [original]).isEmpty, "Applied role leaves New")
        history = try RoleHistory(fileURL: file)
        expect(history.record(for: original)?.status == .applied, "Applied status survives relaunch")
        expect(history.roles(for: .applied, feed: []).first?.id == original.id, "History survives removal from the feed")
        let refreshed = role("new-feed-id", "https://JOBS.example.com/apply/?utm_source=chatgpt.com&gh_jid=123#details")
        expect(history.roles(for: .new, feed: [refreshed]).isEmpty, "Changed IDs and tracking links do not resurrect applied jobs")
        expect(history.roles(for: .new, feed: [role("job-2", "https://jobs.example.com/apply?gh_jid=456")]).count == 1,
               "Distinct query-based job IDs stay separate")
        expect(history.record(for: role("job-1", "https://jobs.example.com/alternate"))?.status == .applied,
               "Stable ID matches an updated link")
        try history.set(.dismissed, for: refreshed)
        expect(history.records.count == 1 && history.record(for: original)?.status == .dismissed, "Transitions preserve aliases")
        history = try RoleHistory(fileURL: file)
        expect(history.roles(for: .dismissed, feed: []).count == 1, "Dismissed history survives relaunch")
        try history.set(.new, for: original)
        expect(history.roles(for: .new, feed: [original, refreshed]).count == 1, "Restoring deduplicates the current feed")
        expect(history.roles(for: .dismissed, feed: []).isEmpty, "Restore clears dismissal")
        expect(history.roles(for: .new, feed: []).isEmpty, "Restore does not resurrect expired feed entries")
        let badFile = directory.appendingPathComponent("corrupt.json")
        let badData = Data("not json".utf8)
        try badData.write(to: badFile)
        do {
            _ = try RoleHistory(fileURL: badFile)
            fatalError("Corrupt history must surface an error")
        } catch { }
        let preserved = try Data(contentsOf: badFile)
        expect(preserved == badData, "Corrupt history is preserved")
        let blockingFile = directory.appendingPathComponent("not-a-directory")
        var unwritable = try RoleHistory(fileURL: blockingFile.appendingPathComponent("history.json"))
        try Data().write(to: blockingFile)
        do {
            try unwritable.set(.applied, for: original)
            fatalError("Failed persistence must surface an error")
        } catch { }
        expect(unwritable.records.isEmpty, "Failed writes do not falsely mark a job applied")
        print("PASS: persistence, applied/dismissed transitions, archived history, duplicate identity, restore, corrupt data, and write failures")
    }
}
