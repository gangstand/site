## ADDED Requirements

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
