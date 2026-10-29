import Foundation
import SwiftUI
import WidgetKit

private let feedURL = URL(string: "https://signal-job-radar.sage-dog-3724.chatgpt.site/roles.json")!

private enum RadarColors {
    static let background = Color(red: 0.05, green: 0.17, blue: 0.23)
    static let panel = Color(red: 0.08, green: 0.22, blue: 0.29)
    static let tile = Color(red: 0.17, green: 0.29, blue: 0.35)
    static let text = Color(red: 0.88, green: 0.91, blue: 0.92)
    static let secondary = Color(red: 0.65, green: 0.72, blue: 0.75)
    static let yellow = Color(red: 0.90, green: 0.73, blue: 0.28)
    static let green = Color(red: 0.47, green: 0.70, blue: 0.50)
    static let orange = Color(red: 0.88, green: 0.54, blue: 0.30)
    static let red = Color(red: 0.84, green: 0.45, blue: 0.40)
}

private struct RadarFeed: Codable {
    let updated: String
    let roles: [RadarRole]
}

@MainActor
final class RadarStore: ObservableObject {
    @Published var roles: [RadarRole] = []
    @Published var updated = ""
    @Published var isLoading = false
    @Published var errorMessage: String?

    @Published private(set) var history: RoleHistory?
    @Published var historyError: String?

    init() {
        do {
            let directory = try FileManager.default.url(for: .applicationSupportDirectory,
                in: .userDomainMask, appropriateFor: nil, create: true)
            history = try RoleHistory(fileURL: directory.appendingPathComponent("Signal/role-history.json"))
        } catch {
            historyError = "Saved status could not be loaded. Your history has not been overwritten. " + error.localizedDescription
        }
    }

    func roles(for status: RoleStatus) -> [RadarRole] {
        // Never show potentially applied jobs as new if saved history could not be read.
        history?.roles(for: status, feed: roles) ?? []
    }

    func setStatus(_ status: RoleStatus, for role: RadarRole) {
        guard var next = history else { return }
        do {
            try next.set(status, for: role)
            history = next
            historyError = nil
        } catch {
            historyError = "Status was not saved. Please try again. " + error.localizedDescription
        }
    }

    private var didLoad = false

    func load(force: Bool = false) {
        guard !didLoad || force else { return }
        didLoad = true
        isLoading = true
        errorMessage = nil

        URLSession.shared.dataTask(with: feedURL) { [weak self] data, _, error in
            let result: Result<RadarFeed, Error>
            if let error {
                result = .failure(error)
            } else if let data, let feed = try? JSONDecoder().decode(RadarFeed.self, from: data) {
                result = .success(feed)
            } else {
                result = .failure(NSError(domain: "SignalRadar", code: 1, userInfo: [NSLocalizedDescriptionKey: "The role feed could not be read."]))
            }

            DispatchQueue.main.async {
                guard let self else { return }
                self.isLoading = false
                switch result {
                case .success(let feed):
                    self.roles = feed.roles
                    self.updated = feed.updated
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                }
            }
        }.resume()
    }
}

private enum RadarFilter: String, CaseIterable, Identifiable {
    case all
    case strong
    case reach
    case stretch

    var id: String { rawValue }

    var title: String {
        switch self {
        case .all: return "Total roles"
        case .strong: return "Strong"
        case .reach: return "Reach"
        case .stretch: return "Stretch"
        }
    }

    var color: Color {
        switch self {
        case .all: return RadarColors.text
        case .strong: return RadarColors.green
        case .reach: return RadarColors.orange
        case .stretch: return RadarColors.red
        }
    }

    func includes(_ role: RadarRole) -> Bool {
        switch self {
        case .all: return true
        case .strong: return role.isStrong
        case .reach: return role.fit == "reach"
        case .stretch: return role.fit == "stretch"
        }
    }
}

@main
struct SignalWidgetApp: App {
    @StateObject private var store = RadarStore()

    var body: some Scene {
        WindowGroup {
            ContentView(store: store)
        }
        .windowResizability(.contentSize)
    }
}

struct ContentView: View {
    @ObservedObject var store: RadarStore
    @State private var filter: RadarFilter = .all
    @State private var searchText = ""
    @State private var status: RoleStatus = .new

    private var filteredRoles: [RadarRole] {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return store.roles(for: status).filter { role in
            guard filter.includes(role) else { return false }
            guard !query.isEmpty else { return true }
            return [role.company, role.title, role.city, role.mode, role.level, role.fitLabel]
                .joined(separator: " ")
                .lowercased()
                .contains(query)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(alignment: .firstTextBaseline, spacing: 10) {
                        Text("signal")
                            .font(.system(size: 30, weight: .bold, design: .rounded))
                            .foregroundStyle(RadarColors.text)
                        Text("/ JOB RADAR")
                            .font(.system(size: 10, weight: .medium, design: .monospaced))
                            .foregroundStyle(RadarColors.secondary)
                    }
                    Text("A clearer view of your next move")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(RadarColors.secondary)
                }

                Spacer()

                Button {
                    store.load(force: true)
                } label: {
                    Label("Refresh", systemImage: "arrow.clockwise")
                }
                .buttonStyle(.bordered)
                .tint(RadarColors.text)
            }

            Picker("Listing status", selection: $status) {
                ForEach(RoleStatus.allCases) { option in
                    Text("\(option.title) (\(store.roles(for: option).count))").tag(option)
                }
            }
            .pickerStyle(.segmented)
            .padding(.top, 20)
            .onChange(of: status) { _, _ in filter = .all }

            Text("Status is saved on this Mac. Applied and dismissed roles stay out of New.")
                .font(.system(size: 11))
                .foregroundStyle(RadarColors.secondary)
                .padding(.top, 8)

            HStack(spacing: 8) {
                ForEach(RadarFilter.allCases) { option in
                    FilterButton(
                        filter: option,
                        count: count(for: option),
                        isSelected: filter == option
                    ) {
                        filter = option
                    }
                }
            }
            .padding(.top, 24)

            HStack(spacing: 9) {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(RadarColors.secondary)
                TextField("Search roles or companies", text: $searchText)
                    .textFieldStyle(.plain)
                    .foregroundStyle(RadarColors.text)
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 11)
            .background(RadarColors.tile, in: RoundedRectangle(cornerRadius: 10))
            .padding(.top, 16)

            HStack {
                Text("\(filteredRoles.count) roles in view")
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundStyle(RadarColors.secondary)
                Spacer()
                if !store.updated.isEmpty {
                    Text("Updated \(store.updated)")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundStyle(RadarColors.secondary)
                }
            }
            .padding(.vertical, 14)

            if let historyError = store.historyError {
                Text(historyError)
                    .foregroundStyle(RadarColors.yellow)
                    .font(.callout)
                    .padding(.bottom, 12)
            }
            if let error = store.errorMessage, status != .new || !store.roles.isEmpty {
                Text("Feed refresh failed: " + error)
                    .font(.callout)
                    .foregroundStyle(RadarColors.yellow)
                    .padding(.bottom, 12)
            }

            if store.isLoading && store.roles.isEmpty && status == .new {
                VStack {
                    Spacer()
                    ProgressView("Loading roles…")
                        .tint(RadarColors.text)
                        .foregroundStyle(RadarColors.secondary)
                    Spacer()
                }
            } else if let errorMessage = store.errorMessage, store.roles.isEmpty, status == .new {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Couldn’t load the role feed")
                        .font(.headline)
                        .foregroundStyle(RadarColors.text)
                    Text(errorMessage)
                        .foregroundStyle(RadarColors.secondary)
                    Button("Try again") { store.load(force: true) }
                        .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            } else if filteredRoles.isEmpty {
                VStack(spacing: 10) {
                    Text(status == .new ? "No new roles in this view" : "No \(status.title.lowercased()) roles in this view")
                        .font(.headline)
                    Text(status == .new ? "Try another fit filter or search. Saved listings are in Applied and Dismissed." : "Your saved listings will appear here, even after they leave the feed.")
                        .font(.callout)
                        .foregroundStyle(RadarColors.secondary)
                }
                .foregroundStyle(RadarColors.text)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 10) {
                        ForEach(filteredRoles) { role in
                            RoleCard(role: role, saved: store.history?.record(for: role)) { next in
                                store.setStatus(next, for: role)
                            }
                        }
                    }
                }
                .scrollIndicators(.visible)
            }
        }
        .padding(28)
        .frame(minWidth: 760, maxWidth: .infinity, minHeight: 620, maxHeight: .infinity, alignment: .topLeading)
        .background(RadarColors.background)
        .onAppear {
            store.load()
            WidgetCenter.shared.reloadTimelines(ofKind: "SignalWidget")
        }
        .onOpenURL { url in
            guard url.scheme == "signalwidget" else { return }
            status = .new
            let requestedFilter = URLComponents(url: url, resolvingAgainstBaseURL: false)?
                .queryItems?
                .first(where: { $0.name == "fit" })?.value
            if let requestedFilter, let nextFilter = RadarFilter(rawValue: requestedFilter) {
                filter = nextFilter
            } else {
                filter = .all
            }
        }
    }

    private func count(for filter: RadarFilter) -> Int {
        store.roles(for: status).filter(filter.includes).count
    }
}

private struct FilterButton: View {
    let filter: RadarFilter
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 7) {
                Text(filter.title)
                Text("\(count)")
                    .font(.system(size: 12, weight: .bold, design: .serif))
            }
            .foregroundStyle(isSelected ? RadarColors.background : RadarColors.text)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? filter.color : RadarColors.tile, in: Capsule())
        }
        .buttonStyle(.plain)
    }
}

private struct RoleCard: View {
    let role: RadarRole
    let saved: SavedRole?
    let setStatus: (RoleStatus) -> Void

    private var fitColor: Color {
        switch role.fit {
        case "strong", "good": return RadarColors.green
        case "reach": return RadarColors.orange
        case "stretch": return RadarColors.red
        default: return RadarColors.secondary
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 11) {
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 5) {
                        HStack(spacing: 7) {
                            Text(role.company)
                                .font(.system(size: 11, weight: .medium, design: .monospaced))
                            Text("·")
                            Text(role.level)
                                .font(.system(size: 11, weight: .medium, design: .monospaced))
                        }
                        .foregroundStyle(RadarColors.secondary)

                        Text(role.title)
                            .font(.system(size: 20, weight: .semibold, design: .rounded))
                            .foregroundStyle(RadarColors.text)
                            .multilineTextAlignment(.leading)
                    }

                    Spacer()

                    Text(role.fitLabel)
                        .font(.system(size: 11, weight: .semibold, design: .rounded))
                        .foregroundStyle(RadarColors.background)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(fitColor, in: Capsule())
                }

                HStack(spacing: 8) {
                    Text(role.city)
                    Text("·")
                    Text(role.mode)
                    Text("·")
                    Text(role.salary)
                    Text("·")
                    Text(role.posted)
                }
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundStyle(RadarColors.secondary)

                if !role.why.isEmpty {
                    Text(role.why)
                        .font(.system(size: 13, weight: .regular, design: .rounded))
                        .foregroundStyle(RadarColors.text.opacity(0.86))
                        .lineLimit(2)
                }

                if let saved {
                    Label("\(saved.status.title) · \(saved.date.formatted(date: .abbreviated, time: .omitted))",
                          systemImage: saved.status == .applied ? "checkmark.circle.fill" : "archivebox")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(saved.status == .applied ? RadarColors.green : RadarColors.secondary)
                }

                HStack(spacing: 10) {
                    if saved?.status != .applied {
                        Button { setStatus(.applied) } label: {
                            Label("Mark applied", systemImage: "checkmark.circle")
                        }
                        .help("Record that you applied and move this role out of New")
                    }
                    if saved == nil {
                        Button { setStatus(.dismissed) } label: {
                            Label("Dismiss", systemImage: "archivebox")
                        }
                        .help("Clear this listing from New; restore it from Dismissed")
                    } else {
                        Button("Restore to New") { setStatus(.new) }
                            .help("Clear the saved status. The role returns to New if it is still in the current feed.")
                    }
                    Spacer()
                    if let url = URL(string: role.url), ["https", "http"].contains(url.scheme) {
                        Link("Open role ↗", destination: url)
                    }
                }
                .buttonStyle(.bordered)
                .tint(RadarColors.text)
                .font(.system(size: 12, weight: .semibold))
            }
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RadarColors.panel, in: RoundedRectangle(cornerRadius: 14))
            .overlay {
                RoundedRectangle(cornerRadius: 14)
                    .stroke(RadarColors.tile, lineWidth: 1)
            }
    }
}
