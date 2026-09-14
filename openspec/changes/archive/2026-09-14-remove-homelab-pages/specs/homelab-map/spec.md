## Purpose

Describes how a visitor reaches the interactive map of the personal homelab infrastructure, and what that map reports about the live reachability of the hosted sites.

## ADDED Requirements

### Requirement: Single entry point through the home page

The homelab map SHALL be reachable only from the HomeLab entry in the home page project list, opened as the project's detail dialog. The site SHALL NOT serve a dedicated homelab page at its own URL.

#### Scenario: Opening the map from the project list

- **WHEN** a visitor activates the HomeLab entry in the home page project list
- **THEN** the project detail dialog opens with the interactive infrastructure map as its canvas

#### Scenario: Requesting the retired homelab URL

- **WHEN** a visitor requests `/homelab` directly
- **THEN** the site responds with its standard not-found page, not the map

#### Scenario: No outbound link for the HomeLab entry

- **WHEN** the HomeLab detail dialog is open
- **THEN** no "Visit website" link is offered, because the entry has no destination outside the site

### Requirement: Live reachability of the mapped sites

While the map is open, it SHALL report each mapped site as reachable, unreachable, or unknown, refreshing periodically, and SHALL report every site as unknown rather than failing when the status source cannot be read.

#### Scenario: Statuses arrive

- **WHEN** the status source returns a well-formed snapshot covering every known site
- **THEN** the map shows each site's reported state alongside the time it was checked

#### Scenario: Status source unavailable or malformed

- **WHEN** the status request fails, times out, or returns a snapshot missing or misreporting a site
- **THEN** the map shows every site as unknown, timestamped at the moment of the failed check, and stays interactive

#### Scenario: Background tab

- **WHEN** the page holding the map is hidden
- **THEN** refreshing pauses, and it resumes when the page becomes visible again
