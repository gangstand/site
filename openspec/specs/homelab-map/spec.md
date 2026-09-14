# homelab-map Specification

## Purpose

Describes how a visitor reaches the interactive map of the personal homelab infrastructure, and what that map reports about the live reachability of the hosted sites.

## Requirements

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

### Requirement: Selectable zones on the map

Every zone on the map — the external proxy host as well as each virtual machine — SHALL be selectable by activating its background, and SHALL be deselectable by activating it again. A zone's hit area SHALL cover the zone's own background only: the cards drawn inside a zone keep their own hit areas and take precedence over the zone beneath them. Selection SHALL remain single: selecting a zone replaces any other selected node or connection.

#### Scenario: Selecting the proxy host zone

- **WHEN** a visitor activates the background of the Proxy zone
- **THEN** the Proxy zone becomes the selected node, is visually marked as selected, and the map highlights what it connects to

#### Scenario: Deselecting by activating again

- **WHEN** the Proxy zone is selected and the visitor activates its background again
- **THEN** nothing is selected and the map returns to its unfiltered view

#### Scenario: Activating a card that sits inside a zone

- **WHEN** a visitor activates a card drawn inside a zone, such as the Traefik card inside the Proxy zone
- **THEN** that card becomes the selection and the surrounding zone does not

#### Scenario: Selecting a zone while something else is selected

- **WHEN** a connection or another node is selected and the visitor activates a zone's background
- **THEN** that zone becomes the only selection, replacing the previous one

#### Scenario: Clearing the selection

- **WHEN** a zone is selected and the visitor presses Escape or clears the selection from the canvas
- **THEN** nothing is selected

### Requirement: Zone hit areas describe the zone they select

Each zone's hit area SHALL carry an accessible name that identifies the zone by its title and by what it is — a host or a virtual machine — and SHALL report whether that zone is currently selected.

#### Scenario: Reading the proxy host zone's hit area

- **WHEN** assistive technology reads the Proxy zone's hit area
- **THEN** it is announced as selecting the Proxy host, not a virtual machine, and reports whether Proxy is currently selected

#### Scenario: Reading a virtual machine zone's hit area

- **WHEN** assistive technology reads a virtual machine zone's hit area, such as Docker
- **THEN** it is announced as selecting that virtual machine and reports whether it is currently selected

### Requirement: Edge ingress is drawn only to publicly reachable zones

The map SHALL draw an HTTP ingress connection from the edge reverse proxy to a zone only when that zone is one whose public reachability the map reports. A zone the map presents as a private service — one whose availability it declares it does not check — SHALL NOT be drawn with any HTTP ingress from the edge reverse proxy, in any view. Such a zone's remaining connections are unaffected: it keeps its WireGuard tunnel to the proxy host and its monitoring link.

#### Scenario: Private-service zone has no HTTP ingress

- **WHEN** a visitor opens the map on the traffic view, or on the view showing all connections, and looks at the RabbitMQ virtual machine
- **THEN** no HTTP ingress line runs to it from the edge reverse proxy, and the only lines touching it are its WireGuard tunnel to the proxy host and its monitoring link to Zabbix

#### Scenario: Publicly reachable zone keeps its HTTP ingress

- **WHEN** a visitor looks at a zone whose reachability the map reports, such as Jenkins, Harbor, or Zabbix
- **THEN** its HTTP ingress line from the edge reverse proxy is still drawn

#### Scenario: Selecting a private-service zone

- **WHEN** a visitor selects the RabbitMQ zone
- **THEN** the map highlights it together with the proxy host and Zabbix only, and the edge reverse proxy is not highlighted as a neighbour

#### Scenario: Selecting the edge reverse proxy

- **WHEN** a visitor selects the edge reverse proxy card
- **THEN** the zones highlighted as its HTTP ingress destinations are exactly those the map reports reachability for, and no private-service zone is among them
