## Purpose

Describes what the photo canvas inside a project's detail dialog presents once a visitor opens a project — which screens of the product appear there, what state each of those screens is caught in, and how they are arranged and described so the canvas reads as a tour of the product rather than a pile of empty or half-loaded pictures.

## ADDED Requirements

### Requirement: A tile is captured at the project's shared fixed size

Every tile on one project's photo canvas SHALL be captured at the same declared width and height, so the set reads as one uniform grid. A screen whose populated content is taller than that frame SHALL be captured from its top, so the screen's header and primary content are in frame; a screen shorter than the frame SHALL be padded below with the app's own background rather than left as an odd-sized tile.

#### Scenario: A screen taller than the tile frame

- **WHEN** a product screen renders more content than fits the project's fixed tile height
- **THEN** the tile shows that screen from the top, with its header and primary panels in frame, and the remainder is cropped rather than shrunk to fit

#### Scenario: A screen shorter than the tile frame

- **WHEN** a product screen's populated content is shorter than the project's fixed tile height
- **THEN** the space below it is filled with the app's own background color, not left blank or stretched

### Requirement: A tile catches a screen doing its job

Each tile SHALL show its screen populated with data. A screen that withholds its content until a control is pressed, or until a row is chosen in a list that feeds a detail pane, SHALL be driven into its loaded and selected state before it is captured. No tile SHALL show an instruction to press a button, a prompt to pick an item, or an otherwise empty region where the screen's substance belongs.

#### Scenario: A report screen that defers its work

- **WHEN** a screen renders nothing but a date range and a control that builds the report
- **THEN** its tile shows the built report, not the invitation to build one

#### Scenario: A master–detail screen

- **WHEN** a screen pairs a list with a detail pane that fills in only after a row is picked
- **THEN** its tile shows a row picked and the detail pane populated from it, not the placeholder inviting the visitor to choose

#### Scenario: A period with sparse data

- **WHEN** the reporting period a tile is captured under would leave charts and tables nearly empty
- **THEN** a period with representative data is chosen instead, so the tile demonstrates the screen rather than its empty state

### Requirement: The canvas covers what the product's navigation reaches

The set of tiles for a project SHALL cover every screen reachable from the product's own navigation, and additionally every tab or revealed view that a screen holds behind its own controls. A view SHALL NOT be omitted because it takes extra interaction to reach.

#### Scenario: A screen split into tabs

- **WHEN** a screen presents several analyses as tabs within itself
- **THEN** each tab appears as its own tile, in its populated state

#### Scenario: A view gated behind extra input

- **WHEN** a view only renders after the visitor supplies a selection beyond a date range
- **THEN** that selection is supplied and the view is captured, rather than left out of the set

### Requirement: Tiles are placed from their shared size without overlap or dead space

Each tile's declared width and height SHALL match the image file actually served for it, and the canvas SHALL place tiles in a grid so that no two overlap and no tile is separated from the set by a band of empty canvas wider than the gap between neighbours.

#### Scenario: Declared size disagreeing with the file

- **WHEN** a tile's declared width or height differs from the dimensions of the image file it points at
- **THEN** the declaration is wrong and must be corrected to the file's real dimensions

#### Scenario: Fitting the canvas on open

- **WHEN** a visitor opens the project and the canvas fits the whole set into view
- **THEN** the set fills the canvas area rather than sitting as a small island inside it

### Requirement: A tile is legible at full zoom and described in the visitor's language

A tile SHALL be captured at enough pixel detail that its text is legible when the canvas is zoomed to its maximum, and SHALL carry a description of what that screen shows in each language the site offers.

#### Scenario: Zooming a dense screen

- **WHEN** a visitor zooms the canvas to its maximum on a tile showing a dense table or chart
- **THEN** the figures and labels on it are readable rather than blurred by upscaling

#### Scenario: Reading the canvas with assistive technology

- **WHEN** assistive technology moves through the tiles on a project's canvas
- **THEN** each tile is announced by a description of the screen it shows, in the language the site is currently displaying
