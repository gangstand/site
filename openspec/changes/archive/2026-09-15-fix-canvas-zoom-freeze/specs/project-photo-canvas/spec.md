## ADDED Requirements

### Requirement: A tile out of view stops drawing its screenshot

The canvas SHALL draw a tile's screenshot only while that tile is inside the region the visitor can see, extended by a margin around it so a tile is drawn before it scrolls into view rather than as it arrives. A tile outside that region SHALL keep its place, its size and its frame on the canvas — the set's layout and the canvas's overall extent SHALL NOT change with the camera — but need not carry its picture. When the whole set fits inside the viewport, as it does when a project is opened, every tile SHALL show its screenshot.

#### Scenario: The fitted view

- **WHEN** a visitor opens a project and the canvas fits the whole set into view
- **THEN** every tile shows its screenshot, none of them blank

#### Scenario: Zoomed in on one corner of the set

- **WHEN** a visitor zooms in far enough that most of the set is off screen
- **THEN** the tiles in view and those just beyond its edges carry their screenshots, and the far-off ones need not

#### Scenario: Panning towards tiles that were off screen

- **WHEN** a visitor pans the canvas towards a part of the set that was off screen
- **THEN** those tiles arrive already showing their screenshots rather than filling in after they appear

#### Scenario: Layout is unaffected by what is drawn

- **WHEN** the camera moves so that a tile stops or starts being drawn
- **THEN** no tile changes position or size, and the canvas's "fit all" view frames exactly the same region as before

#### Scenario: A screenshot that fails to load

- **WHEN** a tile's image cannot be loaded
- **THEN** the tile stays in place as an empty frame and the canvas keeps responding to panning, zooming and tile activation

#### Scenario: Rapid repeated movement

- **WHEN** a visitor activates several tiles in quick succession, or pans back and forth quickly, so that preparation started for one camera position finishes after the camera has moved on
- **THEN** the tiles drawn match where the camera actually is, with no stale tile left blank and no tile drawn from an abandoned position

## MODIFIED Requirements

### Requirement: A tile is activatable by pointer and by keyboard

Each tile SHALL be a control that a visitor can activate with a pointer and from the keyboard: reachable in the page's tab order, activated by the keys that activate a button, and announced as an activatable control carrying the tile's own description. A tile's keyboard activation SHALL NOT be swallowed by the canvas's own panning and zooming keys. Reach, activation and announcement SHALL NOT depend on where the camera is sitting: a tile that is off screen is reachable and activatable on the same terms as one in view. A tile that holds keyboard focus, or that a pointer gesture is in progress on, SHALL keep both while the camera moves, however far it moves.

#### Scenario: Reaching a tile with the keyboard

- **WHEN** a visitor moves focus through the canvas with the tab key
- **THEN** each tile takes focus in turn with a visible focus indicator, and pressing enter or space on the focused tile brings that tile into view

#### Scenario: Reaching a tile that is off screen

- **WHEN** a visitor is zoomed in on part of the set and tabs onwards to a tile that is outside the viewport
- **THEN** that tile takes focus and activating it brings it into view, exactly as for a tile that was already on screen

#### Scenario: Focus held while the camera moves

- **WHEN** a visitor activates a focused tile and the canvas glides to it, or pans the canvas while a tile has focus
- **THEN** focus stays on that tile throughout and afterwards, and a pointer gesture in progress on a tile keeps following the pointer until it is released

#### Scenario: Canvas keys while a tile has focus

- **WHEN** a tile has keyboard focus and the visitor presses the canvas's own pan or zoom keys
- **THEN** those keys do not fight with the tile's activation: the tile responds only to its activation keys, and the canvas's keys keep working when the canvas itself has focus

#### Scenario: Reading a tile with assistive technology

- **WHEN** assistive technology reaches a tile
- **THEN** it announces the tile as an activatable control described by what that screen shows, in the language the site is currently displaying, without announcing the same description twice

### Requirement: The move to a tile is animated unless reduced motion is asked for

The canvas SHALL animate its move to an activated tile, over a short eased transition, so the visitor can see where the tile came from. A visitor whose system asks for reduced motion SHALL get the same destination immediately, with no animation. Hand-driven panning, wheel zoom and pinch SHALL remain unanimated, and starting one of them SHALL stop an animation already in flight and hand control straight to the gesture. The animated transition SHALL NOT show a visible rendering artifact — a flash, tear, or a stale or blurred frame of the canvas's content — at any point during the glide, regardless of the scale the canvas was sitting at when the tile was activated, including a scale well below the fitted view. The glide SHALL begin as soon as the tile is activated and SHALL run without a stall — no frozen or skipped stretch where the canvas stops responding — on a canvas carrying a project's full set of tiles; hand-driven panning and zooming on such a canvas SHALL likewise follow the gesture without stalling.

#### Scenario: Activating a tile with motion allowed

- **WHEN** a visitor activates a tile and their system does not ask for reduced motion
- **THEN** the canvas glides to the tile over a short eased transition rather than jumping to it

#### Scenario: Activating a tile on a full project canvas

- **WHEN** a visitor activates a tile on a project canvas carrying its full set of tiles
- **THEN** the canvas begins moving immediately on activation and glides the whole way without a frozen or stuttering stretch

#### Scenario: Panning and zooming a full project canvas

- **WHEN** a visitor drags, wheel-zooms or pinch-zooms a project canvas carrying its full set of tiles, at any zoom level
- **THEN** the canvas follows the gesture continuously, with the content staying under the pointer and no stall

#### Scenario: Activating a tile with reduced motion asked for

- **WHEN** a visitor whose system asks for reduced motion activates a tile
- **THEN** the canvas is already at the tile with no animation

#### Scenario: Panning while the canvas is animating

- **WHEN** a visitor starts dragging or zooms with the wheel while the canvas is still animating towards a tile
- **THEN** the animation stops where it is and the canvas follows the gesture directly, with no lag behind the pointer and no jump to or from the animation's destination

#### Scenario: The canvas's first appearance

- **WHEN** a project's canvas is opened
- **THEN** it appears already at its opening camera, never briefly at some intermediate position or scale

#### Scenario: Activating a tile from a heavily zoomed-out view

- **WHEN** a visitor zooms the canvas out well below the fitted view and then activates a tile
- **THEN** the canvas glides smoothly to that tile with no visible flash, tear, or stale frame at any point during the transition, the same as when activating a tile from the fitted view
