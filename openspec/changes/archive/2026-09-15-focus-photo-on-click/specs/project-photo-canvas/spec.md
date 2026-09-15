## ADDED Requirements

### Requirement: Activating a tile brings that tile into view

Activating a tile on a project's photo canvas SHALL move the canvas to that tile: the canvas zooms so the tile fills the viewport as far as the canvas's own zoom ceiling allows, and positions the tile in the centre of the viewport. Activation SHALL always recompute that position from the tile and the current viewport size, so a tile can be brought back after the visitor has panned or zoomed away from it. Activation SHALL NOT be the way back to the whole set: returning to the fitted view stays the job of the canvas's own "fit all" control and its keyboard equivalent, and the project dialog keeps its own meaning for `Escape`.

#### Scenario: Activating a tile from the fitted view

- **WHEN** a visitor opens a project, the canvas is fitted to the whole set, and the visitor activates one tile
- **THEN** the canvas moves so that tile is centred and drawn as large as the canvas's zoom ceiling permits, with the rest of the set left around it

#### Scenario: Activating a different tile

- **WHEN** the canvas is sitting on one tile and the visitor activates a different tile
- **THEN** the canvas moves to the newly activated tile, centred and enlarged the same way

#### Scenario: Activating the tile already in view

- **WHEN** the canvas is already sitting on a tile and the visitor activates that same tile again
- **THEN** the view stays where it is rather than zooming further or snapping back to the whole set

#### Scenario: Activating a tile the visitor has panned away from

- **WHEN** a visitor activates a tile, pans or zooms the canvas by hand, and then activates that same tile again
- **THEN** the canvas returns to that tile, centred and enlarged as on the first activation

#### Scenario: Returning to the whole set

- **WHEN** the canvas is sitting on a tile and the visitor uses the canvas's "fit all" control or its keyboard equivalent
- **THEN** the whole set is fitted into view again, and activating any tile afterwards still brings that tile into view

#### Scenario: A tile larger than the canvas's zoom ceiling allows

- **WHEN** the scale needed to fill the viewport with the activated tile is above the canvas's maximum zoom
- **THEN** the canvas zooms to its maximum and still centres the tile, rather than refusing to move or exceeding its zoom limit

#### Scenario: Escape while the canvas sits on a tile

- **WHEN** a visitor presses `Escape` while the canvas is sitting on a tile
- **THEN** the project dialog closes, as it does from the fitted view

### Requirement: A tile is activatable by pointer and by keyboard

Each tile SHALL be a control that a visitor can activate with a pointer and from the keyboard: reachable in the page's tab order, activated by the keys that activate a button, and announced as an activatable control carrying the tile's own description. A tile's keyboard activation SHALL NOT be swallowed by the canvas's own panning and zooming keys.

#### Scenario: Reaching a tile with the keyboard

- **WHEN** a visitor moves focus through the canvas with the tab key
- **THEN** each tile takes focus in turn with a visible focus indicator, and pressing enter or space on the focused tile brings that tile into view

#### Scenario: Canvas keys while a tile has focus

- **WHEN** a tile has keyboard focus and the visitor presses the canvas's own pan or zoom keys
- **THEN** those keys do not fight with the tile's activation: the tile responds only to its activation keys, and the canvas's keys keep working when the canvas itself has focus

#### Scenario: Reading a tile with assistive technology

- **WHEN** assistive technology reaches a tile
- **THEN** it announces the tile as an activatable control described by what that screen shows, in the language the site is currently displaying, without announcing the same description twice

### Requirement: Dragging across a tile pans the canvas instead of activating it

A pointer gesture that moves across the canvas SHALL be treated as panning, even when it starts or ends on a tile, and SHALL NOT bring the tile under it into view. Only a gesture that stays put SHALL count as activating a tile.

#### Scenario: Dragging from a tile

- **WHEN** a visitor presses the pointer down on a tile, drags across the canvas, and releases
- **THEN** the canvas has panned by the drag and no tile has been brought into view

#### Scenario: Pinching over a tile

- **WHEN** a visitor pinches to zoom with both fingers starting on a tile
- **THEN** the pinch zooms the canvas and no tile is brought into view when the fingers lift

### Requirement: The move to a tile is animated unless reduced motion is asked for

The canvas SHALL animate its move to an activated tile, over a short eased transition, so the visitor can see where the tile came from. A visitor whose system asks for reduced motion SHALL get the same destination immediately, with no animation. Hand-driven panning, wheel zoom and pinch SHALL remain unanimated, and starting one of them SHALL stop an animation already in flight and hand control straight to the gesture.

#### Scenario: Activating a tile with motion allowed

- **WHEN** a visitor activates a tile and their system does not ask for reduced motion
- **THEN** the canvas glides to the tile over a short eased transition rather than jumping to it

#### Scenario: Activating a tile with reduced motion asked for

- **WHEN** a visitor whose system asks for reduced motion activates a tile
- **THEN** the canvas is already at the tile with no animation

#### Scenario: Panning while the canvas is animating

- **WHEN** a visitor starts dragging or zooms with the wheel while the canvas is still animating towards a tile
- **THEN** the animation stops where it is and the canvas follows the gesture directly, with no lag behind the pointer

## MODIFIED Requirements

### Requirement: A tile is legible at full zoom and described in the visitor's language

A tile SHALL be captured at enough pixel detail that its text is legible when the canvas is zoomed to its maximum, and SHALL carry a description of what that screen shows in each language the site offers. That description SHALL be the accessible name of the control the tile is activated through, so the description is what assistive technology announces when it reaches the tile.

#### Scenario: Zooming a dense screen

- **WHEN** a visitor zooms the canvas to its maximum on a tile showing a dense table or chart
- **THEN** the figures and labels on it are readable rather than blurred by upscaling

#### Scenario: Reading the canvas with assistive technology

- **WHEN** assistive technology moves through the tiles on a project's canvas
- **THEN** each tile is announced by a description of the screen it shows, in the language the site is currently displaying
