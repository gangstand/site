## MODIFIED Requirements

### Requirement: The move to a tile is animated unless reduced motion is asked for

The canvas SHALL animate its move to an activated tile, over a short eased transition, so the visitor can see where the tile came from. A visitor whose system asks for reduced motion SHALL get the same destination immediately, with no animation. Hand-driven panning, wheel zoom and pinch SHALL remain unanimated, and starting one of them SHALL stop an animation already in flight and hand control straight to the gesture. The animated transition SHALL NOT show a visible rendering artifact — a flash, tear, or a stale or blurred frame of the canvas's content — at any point during the glide, regardless of the scale the canvas was sitting at when the tile was activated, including a scale well below the fitted view.

#### Scenario: Activating a tile with motion allowed

- **WHEN** a visitor activates a tile and their system does not ask for reduced motion
- **THEN** the canvas glides to the tile over a short eased transition rather than jumping to it

#### Scenario: Activating a tile with reduced motion asked for

- **WHEN** a visitor whose system asks for reduced motion activates a tile
- **THEN** the canvas is already at the tile with no animation

#### Scenario: Panning while the canvas is animating

- **WHEN** a visitor starts dragging or zooms with the wheel while the canvas is still animating towards a tile
- **THEN** the animation stops where it is and the canvas follows the gesture directly, with no lag behind the pointer

#### Scenario: Activating a tile from a heavily zoomed-out view

- **WHEN** a visitor zooms the canvas out well below the fitted view and then activates a tile
- **THEN** the canvas glides smoothly to that tile with no visible flash, tear, or stale frame at any point during the transition, the same as when activating a tile from the fitted view
