# project-showcase Specification

## Purpose

Describes how the home page project list presents each project before a visitor opens it — the thumbnail that stands for the project, what it is allowed to be, and how it is announced to assistive technology.

## Requirements

### Requirement: Every project entry is represented by a thumbnail image

Every project in the home page list SHALL be represented by a thumbnail image served from the project's own asset path. No entry SHALL fall back to an empty coloured block standing in for a missing image, and the list SHALL NOT offer a placeholder representation at all.

#### Scenario: Opening the home page

- **WHEN** a visitor loads the home page
- **THEN** each entry in the project list shows its own thumbnail image, HomeLab included, and none of them shows a blank filled rectangle

#### Scenario: A project without an image asset

- **WHEN** a project is declared without a usable thumbnail image
- **THEN** that is a defect in the project's declaration rather than a supported state the list renders around

### Requirement: A thumbnail's declared size matches the image it serves

Each project SHALL declare its thumbnail's pixel width and height, and those values SHALL match the image file actually served for that project. The list SHALL reserve space from the declared size so that the entry occupies its final height before the image finishes loading.

#### Scenario: Layout before the image arrives

- **WHEN** the home page renders and a thumbnail image has not yet loaded
- **THEN** the entry already occupies the height its declared proportions imply, and the entries below it do not move once the image appears

#### Scenario: Declared size disagreeing with the file

- **WHEN** a project's declared thumbnail width or height differs from the dimensions of the file at its asset path
- **THEN** the declaration is wrong and must be corrected to the file's real dimensions

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

### Requirement: The thumbnail is decorative and the entry carries the name

A thumbnail SHALL be exposed as decorative, and the control that opens the project SHALL carry the project's localized name as its accessible name and SHALL report whether its dialog is currently open.

#### Scenario: Reading the project list with assistive technology

- **WHEN** assistive technology moves through the project list
- **THEN** each entry is announced by its project name in the active language, not by a description of the image, and the image itself contributes no separate announcement

#### Scenario: Announcing an open project

- **WHEN** a project's detail dialog is open
- **THEN** the control that opened it reports itself as expanded
