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

    private var filteredRoles: [RadarRole] {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return store.roles.filter { role in
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

            if store.isLoading && store.roles.isEmpty {
                VStack {
                    Spacer()
                    ProgressView("Loading roles…")
                        .tint(RadarColors.text)
                        .foregroundStyle(RadarColors.secondary)
                    Spacer()
                }
            } else if let errorMessage = store.errorMessage, store.roles.isEmpty {
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
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 10) {
                        ForEach(filteredRoles) { role in
                            RoleCard(role: role)
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
        store.roles.filter(filter.includes).count
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

    private var fitColor: Color {
        switch role.fit {
        case "strong", "good": return RadarColors.green
        case "reach": return RadarColors.orange
        case "stretch": return RadarColors.red
        default: return RadarColors.secondary
        }
    }

    var body: some View {
        Link(destination: URL(string: role.url)!) {
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

                HStack {
                    Spacer()
                    Text("Open role ↗")
                        .font(.system(size: 12, weight: .semibold, design: .rounded))
                        .foregroundStyle(RadarColors.text)
                }
            }
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RadarColors.panel, in: RoundedRectangle(cornerRadius: 14))
            .overlay {
                RoundedRectangle(cornerRadius: 14)
                    .stroke(RadarColors.tile, lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
    }
}
