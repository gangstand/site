## MODIFIED Requirements

### Requirement: The HomeLab thumbnail depicts its own infrastructure map

The HomeLab entry's thumbnail SHALL depict the infrastructure map that the entry opens, rendered in the site's default dark palette, and SHALL be composed the way the other entries' thumbnails are composed: a Russian headline and supporting line above a framed still of the product itself.

The two lines SHALL divide the work between them: the headline SHALL name what the estate *is*, and the supporting line SHALL name what it *runs*, describing the estate's parts by the job each one does rather than by the product that fills the slot. Neither line SHALL restate the information already carried by the entry's list description rendered beneath the thumbnail.

The supporting line SHALL survive the downscale the list applies to it: the thumbnail is rendered at roughly 0.60 of its natural width on desktop and 0.45 on a phone, and both lines SHALL remain readable at both of those sizes. Nothing in the composition SHALL depend on the map's own node labels being legible.

The thumbnail's proportions are not required to match the range spanned by the other entries' thumbnails — it MAY be shorter, so long as it still reads as one set with them in the single-column list.

#### Scenario: Recognising the project from the list

- **WHEN** a visitor looks at the HomeLab entry without opening it
- **THEN** the thumbnail shows the hypervisor and the virtual machines drawn on it, so the entry reads as a piece of infrastructure rather than an unlabelled block

#### Scenario: Reading the two lines of copy

- **WHEN** a visitor reads the headline and the supporting line baked into the HomeLab thumbnail
- **THEN** the headline tells them what the estate is, and the supporting line tells them which kinds of workload it carries — containers, delivery pipelines, databases, monitoring, and the private network that encloses them — without requiring them to recognise any vendor or product name

#### Scenario: Reading the thumbnail at the size the list renders it

- **WHEN** the HomeLab thumbnail is displayed in the project list on a desktop viewport and on a phone viewport
- **THEN** both the headline and the supporting line are readable at both sizes, and the composition does not rely on any text inside the framed map still

#### Scenario: Opening the entry after seeing its thumbnail

- **WHEN** a visitor activates the HomeLab entry
- **THEN** the interactive map in the detail dialog is recognisably the same picture the thumbnail showed, so the still reads as a preview and not as unrelated artwork

#### Scenario: Sitting in the stack beside the other entries

- **WHEN** the HomeLab thumbnail is displayed above the other project thumbnails in the single-column list
- **THEN** it reads as one set with them — a shorter entry is acceptable, but not a blank block or a jump in the stack's visual rhythm
