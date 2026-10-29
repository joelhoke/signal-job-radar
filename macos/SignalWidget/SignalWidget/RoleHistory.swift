import Foundation

struct RadarRole: Codable, Identifiable {
    let id: String
    let company: String
    let title: String
    let city: String
    let mode: String
    let category: String
    let level: String
    let fit: String
    let fitLabel: String
    let salary: String
    let posted: String
    let why: String
    let url: String

    var isStrong: Bool { fit == "strong" || fit == "good" }
}

enum RoleStatus: String, Codable, CaseIterable, Identifiable {
    case new, applied, dismissed
    var id: String { rawValue }
    var title: String { rawValue.capitalized }
}

struct SavedRole: Codable {
    let role: RadarRole
    let status: RoleStatus
    let date: Date
    let aliases: Set<String>
}

struct RoleHistory {
    private(set) var records: [SavedRole] = []
    let fileURL: URL

    init(fileURL: URL) throws {
        self.fileURL = fileURL
        if FileManager.default.fileExists(atPath: fileURL.path) {
            records = try JSONDecoder().decode([SavedRole].self, from: Data(contentsOf: fileURL))
        }
    }

    // Keep job-identifying query parameters; discard only known attribution parameters.
    static func canonicalURL(_ value: String) -> String {
        guard var url = URLComponents(string: value) else { return value }
        url.scheme = url.scheme?.lowercased()
        url.host = url.host?.lowercased()
        url.fragment = nil
        while url.path.hasSuffix("/") { url.path.removeLast() }
        let tracking = Set(["gh_src", "source", "ref", "referrer", "fbclid", "gclid"])
        let items = (url.queryItems ?? []).filter {
            !$0.name.lowercased().hasPrefix("utm_") && !tracking.contains($0.name.lowercased())
        }.sorted { ($0.name, $0.value ?? "") < ($1.name, $1.value ?? "") }
        url.queryItems = items.isEmpty ? nil : items
        return url.string ?? value
    }

    static func aliases(for role: RadarRole) -> Set<String> {
        ["id:" + role.id, "url:" + canonicalURL(role.url)]
    }

    func record(for role: RadarRole) -> SavedRole? {
        let keys = Self.aliases(for: role)
        return records.first { !$0.aliases.isDisjoint(with: keys) }
    }

    func roles(for status: RoleStatus, feed: [RadarRole]) -> [RadarRole] {
        if status != .new {
            return records.filter { $0.status == status }.sorted { $0.date > $1.date }.map(\.role)
        }
        var seen = Set<String>()
        return feed.filter { role in
            let keys = Self.aliases(for: role)
            guard record(for: role) == nil, seen.isDisjoint(with: keys) else { return false }
            seen.formUnion(keys)
            return true
        }
    }

    mutating func set(_ status: RoleStatus, for role: RadarRole, date: Date = Date()) throws {
        var keys = Self.aliases(for: role)
        // Retain aliases across subsequent status changes and refreshed IDs.
        var matching: [SavedRole] = []
        repeat {
            let previous = keys
            matching = records.filter { !$0.aliases.isDisjoint(with: keys) }
            matching.forEach { keys.formUnion($0.aliases) }
            if previous == keys { break }
        } while true
        var next = records.filter { $0.aliases.isDisjoint(with: keys) }
        if status != .new {
            next.append(SavedRole(role: role, status: status, date: date, aliases: keys))
        }
        let data = try JSONEncoder().encode(next)
        try FileManager.default.createDirectory(at: fileURL.deletingLastPathComponent(), withIntermediateDirectories: true)
        try data.write(to: fileURL, options: .atomic)
        records = next
    }
}
