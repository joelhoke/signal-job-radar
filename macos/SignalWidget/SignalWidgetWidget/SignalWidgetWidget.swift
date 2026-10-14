import Foundation
import SwiftUI
import WidgetKit

private let dashboardURL = URL(string: "https://signal-job-radar.sage-dog-3724.chatgpt.site")!
private let appURL = URL(string: "signalwidget://radar")!
private let feedURL = URL(string: "https://signal-job-radar.sage-dog-3724.chatgpt.site/roles.json")!

private enum SignalPalette {
    static let background = Color(red: 0.05, green: 0.17, blue: 0.23)
    static let tile = Color(red: 0.17, green: 0.29, blue: 0.35)
    static let text = Color(red: 0.84, green: 0.88, blue: 0.90)
    static let secondary = Color(red: 0.64, green: 0.70, blue: 0.73)
    static let yellow = Color(red: 0.90, green: 0.73, blue: 0.28)
    static let green = Color(red: 0.47, green: 0.70, blue: 0.50)
    static let orange = Color(red: 0.88, green: 0.54, blue: 0.30)
    static let red = Color(red: 0.84, green: 0.45, blue: 0.40)
}

struct SignalRole: Codable, Identifiable {
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

struct SignalFeed: Codable {
    let updated: String
    let roles: [SignalRole]
}

struct SignalEntry: TimelineEntry {
    let date: Date
    let roles: [SignalRole]
    let sourceUpdated: String

    static let sample = SignalEntry(
        date: Date(),
        roles: [
            SignalRole(id: "sample-1", company: "Amazon", title: "UX Designer, AI/ML", city: "Seattle, WA", mode: "Hybrid", category: "design", level: "Senior", fit: "strong", fitLabel: "Strong fit", salary: "$117.8k–$160k", posted: "Today", why: "AI/ML product design", url: "https://www.amazon.jobs/en/jobs/10577202/ux-designer-ai-ml"),
            SignalRole(id: "sample-2", company: "Remitly", title: "Senior Product Designer, Conversational AI Platform", city: "Seattle, WA", mode: "Hybrid", category: "design", level: "Senior", fit: "strong", fitLabel: "Strong fit", salary: "$144k–$180k", posted: "Snapshot", why: "Agentic AI product design", url: "https://remitly.wd5.myworkdayjobs.com/Remitly_Careers/job/Seattle-Washington-United-States/Senior-Product-Designer_R_106913-1"),
            SignalRole(id: "sample-3", company: "Zillow", title: "Principal Product Manager, Design Systems & Accessibility", city: "United States", mode: "Remote", category: "pm", level: "Principal", fit: "reach", fitLabel: "Worth a reach", salary: "$182.1k–$290.9k", posted: "Oct 9", why: "Design systems PM", url: "https://zillow.wd5.myworkdayjobs.com/Zillow_Group_External/job/Remote-USA/Principal-Product-Manager---Design-Systems---Accessibility_P751336-1"),
            SignalRole(id: "sample-4", company: "Cisco", title: "Senior Staff Product Manager, AI Knowledge Graph & Intelligence", city: "Seattle, WA", mode: "Remote", category: "pm", level: "Staff", fit: "stretch", fitLabel: "Stretch signal", salary: "Not listed", posted: "Today", why: "Technical AI PM reach", url: "https://cisco.wd5.myworkdayjobs.com/Cisco_Careers/job/Seattle-Washington-US/Senior-Staff-Product-Manager--AI-Knowledge-Graph---Intelligence_2019172-1")
        ],
        sourceUpdated: "Oct 13, 2026"
    )

    var strongCount: Int { roles.filter(\.isStrong).count }
    var reachCount: Int { roles.filter { $0.fit == "reach" }.count }
    var stretchCount: Int { roles.filter { $0.fit == "stretch" }.count }
    var topRole: SignalRole? { roles.first(where: \.isStrong) ?? roles.first }
}

struct SignalProvider: TimelineProvider {
    func placeholder(in context: Context) -> SignalEntry { .sample }

    func getSnapshot(in context: Context, completion: @escaping (SignalEntry) -> Void) {
        if context.isPreview {
            completion(.sample)
        } else {
            load(completion: completion)
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SignalEntry>) -> Void) {
        load { entry in
            let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date().addingTimeInterval(1_800)
            completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
        }
    }

    private func load(completion: @escaping (SignalEntry) -> Void) {
        URLSession.shared.dataTask(with: feedURL) { data, _, _ in
            guard let data, let feed = try? JSONDecoder().decode(SignalFeed.self, from: data) else {
                completion(.sample)
                return
            }
            completion(SignalEntry(date: Date(), roles: feed.roles, sourceUpdated: feed.updated))
        }.resume()
    }
}

struct SignalWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: SignalEntry

    var body: some View {
        Group {
            if family == .systemSmall {
                SmallSignalView(entry: entry)
            } else {
                MediumSignalView(entry: entry)
            }
        }
        .containerBackground(for: .widget) {
            SignalPalette.background
        }
        // A widget-level URL captures taps before row-level Links can handle
        // them. Keep the app fallback on the compact summary widget, while
        // allowing the larger role list to open each job directly.
        .modifier(SignalWidgetFallbackURL(family: family))
    }
}

private struct SignalWidgetFallbackURL: ViewModifier {
    let family: WidgetFamily

    @ViewBuilder
    func body(content: Content) -> some View {
        if family == .systemSmall {
            content.widgetURL(appURL)
        } else {
            content
        }
    }
}

struct SmallSignalView: View {
    let entry: SignalEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            WidgetHeader()
            Link(destination: appFilterURL("strong")) {
                VStack(alignment: .leading, spacing: 1) {
                    Text("\(entry.strongCount)")
                        .font(.system(size: 42, weight: .bold, design: .serif))
                        .foregroundStyle(SignalPalette.text)
                    Text("strong signals")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundStyle(SignalPalette.secondary)
                }
            }
            Spacer(minLength: 0)
            HStack(spacing: 9) {
                MiniCount(label: "reach", value: entry.reachCount, color: SignalPalette.orange, url: appFilterURL("reach"))
                MiniCount(label: "stretch", value: entry.stretchCount, color: SignalPalette.red, url: appFilterURL("stretch"))
            }
        }
        .padding(16)
    }
}

struct MediumSignalView: View {
    let entry: SignalEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            WidgetHeader()
            VStack(alignment: .leading, spacing: 4) {
                ForEach(Array(entry.roles.prefix(3))) { role in
                    RoleRow(role: role)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }
}

struct WidgetHeader: View {
    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text("signal")
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundStyle(SignalPalette.text)
            Spacer()
            Text("JOB RADAR")
                .font(.system(size: 7, weight: .medium, design: .monospaced))
                .foregroundStyle(SignalPalette.secondary)
        }
    }
}

struct StatLink: View {
    let value: Int
    let label: String
    let url: URL
    let tint: Color

    var body: some View {
        Link(destination: url) {
            VStack(alignment: .leading, spacing: 2) {
                Text("\(value)")
                    .font(.system(size: 22, weight: .bold, design: .serif))
                    .foregroundStyle(SignalPalette.text)
                Text(label)
                    .font(.system(size: 9, weight: .medium, design: .rounded))
                    .foregroundStyle(SignalPalette.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(8)
            .background(SignalPalette.tile, in: RoundedRectangle(cornerRadius: 9))
            .overlay(alignment: .topLeading) {
                Circle()
                    .fill(tint)
                    .frame(width: 5, height: 5)
                    .padding(7)
            }
        }
    }
}

struct RoleRow: View {
    let role: SignalRole

    private var fitColor: Color {
        switch role.fit {
        case "strong", "good": return SignalPalette.green
        case "reach": return SignalPalette.orange
        case "stretch": return SignalPalette.red
        default: return SignalPalette.secondary
        }
    }

    var body: some View {
        Group {
            if let roleURL = URL(string: role.url) {
                Link(destination: roleURL) {
                    rowContent
                }
            } else {
                rowContent
            }
        }
    }

    private var rowContent: some View {
        HStack(alignment: .top, spacing: 5) {
            Circle()
                .fill(fitColor)
                .frame(width: 5, height: 5)
                .padding(.top, 3)

            VStack(alignment: .leading, spacing: 0) {
                HStack(spacing: 4) {
                    Text(role.company)
                        .font(.system(size: 8, weight: .medium, design: .monospaced))
                        .foregroundStyle(SignalPalette.secondary)
                    Text("·")
                        .foregroundStyle(SignalPalette.secondary)
                    Text(role.level)
                        .font(.system(size: 8, weight: .medium, design: .monospaced))
                        .foregroundStyle(SignalPalette.secondary)
                }
                Text(role.title)
                    .font(.system(size: 10.5, weight: .semibold, design: .rounded))
                    .foregroundStyle(SignalPalette.text)
                    .lineLimit(1)
                Text("\(role.city) · \(role.mode) · \(role.fitLabel)")
                    .font(.system(size: 8, weight: .medium, design: .rounded))
                    .foregroundStyle(SignalPalette.secondary)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

struct MiniCount: View {
    let label: String
    let value: Int
    let color: Color
    let url: URL

    var body: some View {
        Link(destination: url) {
            HStack(spacing: 4) {
                Text("\(value)")
                    .font(.system(size: 15, weight: .bold, design: .serif))
                    .foregroundStyle(color)
                Text(label)
                    .font(.system(size: 9, weight: .medium, design: .rounded))
                    .foregroundStyle(SignalPalette.secondary)
            }
        }
    }
}

private func fitURL(_ fit: String) -> URL {
    var components = URLComponents(url: dashboardURL, resolvingAgainstBaseURL: false)!
    components.queryItems = [URLQueryItem(name: "fit", value: fit)]
    return components.url!
}

private func appFilterURL(_ fit: String) -> URL {
    var components = URLComponents(url: appURL, resolvingAgainstBaseURL: false)!
    components.queryItems = [URLQueryItem(name: "fit", value: fit)]
    return components.url!
}

@main
struct SignalWidgetBundle: WidgetBundle {
    var body: some Widget {
        SignalWidget()
    }
}

struct SignalWidget: Widget {
    let kind = "SignalWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SignalProvider()) { entry in
            SignalWidgetView(entry: entry)
        }
        .configurationDisplayName("Signal Job Radar")
        .description("See fit counts and your top role at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
