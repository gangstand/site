## ADDED Requirements

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
