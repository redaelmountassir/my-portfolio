# Project YAML Format

This document explains how to format project YAML files. It is intended as a reference for anyone creating or editing project entries.

## Example

A complete project file can look like this:

```yaml
loc:
  text: Philadelphia, PA
  link: https://example.com/locations/philadelphia

org: Acme Corporation

roles:
  - Software Engineer
  - Open Source Contributor

date: 2026-09-12

categories:
  - Technology
  - Open Source

tags:
  - TypeScript
  - Web Development
  - Open Source

description: A short description of the project and what it is about.

showcases:
  - project-alpha
  - project-beta

logo: ./logos/acme.png

parent:
  name: Acme Group
```

## Fields

### `loc`

The project's location.

This is optional. If included, provide both a display name and a link.

```yaml
loc:
  text: Philadelphia, PA
  link: https://example.com/locations/philadelphia
```

- `text` — The location as it should be displayed.
- `link` — A URL for the location.

If the project does not have a relevant location, leave out `loc`.

---

### `org`

The organization associated with the project.

This is optional.

```yaml
org: Acme Corporation
```

If there is no associated organization, leave out `org`.

---

### `roles`

A list of roles associated with the project.

This is required and should always be a list, even when there is only one role.

```yaml
roles:
  - Software Engineer
  - Designer
```

Do not write:

```yaml
roles: Software Engineer
```

---

### `date`

The date associated with the project.

This is required.

Use the format:

```yaml
date: YYYY-MM-DD
```

For example:

```yaml
date: 2026-09-12
```

---

### `categories`

A list of broad categories that describe the project.

This is required.

```yaml
categories:
  - Technology
  - Open Source
```

Use categories for broad classification rather than highly specific keywords.

---

### `tags`

A list of keywords that describe the project in more detail.

This is required.

```yaml
tags:
  - TypeScript
  - Web Development
  - Open Source
```

Tags can be more specific than categories.

---

### `description`

A description of the project.

This is required.

```yaml
description: A short description of the project and what it is about.
```

Keep the description clear and concise. It should give someone enough context to understand what the project is.

For longer descriptions, YAML's multiline format can be used:

```yaml
description: >
  This is a longer project description that can span
  multiple lines while remaining a single piece of text.
```

---

### `showcases`

A list of projects, examples, or other items associated with the project.

This is required and should always be a list.

```yaml
showcases:
  - project-alpha
  - project-beta
```

If there is only one item, it should still be written as a list:

```yaml
showcases:
  - project-alpha
```

---

### `logo`

The project's logo.

This is required.

The value should point to the project's logo asset.

For example:

```yaml
logo: ./logos/acme.png
```

Use the path or value expected by the project's file structure.

---

### `parent`

An optional parent project, organization, or grouping.

```yaml
parent:
  name: Acme Group
```

The `name` is optional, so an empty parent object is also possible:

```yaml
parent: {}
```

If there is no parent, leave out `parent` entirely.

---

## Required vs. Optional

| Field | Required | Format |
|---|---|---|
| `loc` | No | Object containing `text` and `link` |
| `org` | No | Text |
| `roles` | Yes | List of text values |
| `date` | Yes | `YYYY-MM-DD` |
| `categories` | Yes | List of text values |
| `tags` | Yes | List of text values |
| `description` | Yes | Text |
| `showcases` | Yes | List of text values |
| `logo` | Yes | Logo path/value |
| `parent` | No | Object containing optional `name` |

## YAML Formatting Rules

### Lists

Fields such as `roles`, `categories`, `tags`, and `showcases` use YAML lists:

```yaml
tags:
  - Tag One
  - Tag Two
  - Tag Three
```

### Text containing special characters

If a value contains characters that could be interpreted as YAML syntax, wrap it in quotes:

```yaml
description: "A project: focused on data visualization."
```

Quoting is also useful when a value could otherwise be interpreted as a number, date, or other special YAML value.

### URLs

URLs can be written directly:

```yaml
link: https://example.com/project
```

### Empty optional fields

For optional fields, it is generally better to omit the field when it does not apply rather than adding an empty value.

Prefer:

```yaml
org: Acme Corporation
```

or omit it entirely.

Avoid:

```yaml
org:
```

## Minimal Example

The smallest valid project file contains all required fields:

```yaml
roles:
  - Software Engineer

date: 2026-09-12

categories:
  - Technology

tags:
  - TypeScript

description: A short description of the project.

showcases:
  - project-alpha

logo: ./logos/project-alpha.png
```

Optional fields such as `loc`, `org`, and `parent` can be added when relevant.

## Full Example

```yaml
loc:
  text: Philadelphia, PA
  link: https://example.com/locations/philadelphia

org: Acme Corporation

roles:
  - Software Engineer
  - Designer

date: 2026-09-12

categories:
  - Technology
  - Open Source

tags:
  - TypeScript
  - Web Development
  - Open Source

description: >
  An open-source project focused on building accessible
  tools for web developers.

showcases:
  - project-alpha
  - project-beta

logo: ./logos/acme.png

parent:
  name: Acme Group
```
