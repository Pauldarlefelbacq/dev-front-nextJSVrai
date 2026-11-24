# AGENTS.md

Instructions for AI coding agents working on this repository. Read this fully before making changes.

## 1. Project

**Drops** (school project, BUT MMI Montbéliard, module R505): students post **drops**, geolocated messages that others can **like** and **comment on**.

- A drop has a category: `note`, `photo`, `tip` or `riddle`.
- Drops can be reported. After enough reports a drop is hidden automatically.
- All data comes from an **external REST API** (no database in this repo).
  - Base URL: `https://drops-api-production.up.railway.app`
  - Interactive docs: `/docs` · OpenAPI spec: `/openapi.json` · compact contract: `/contract.md`
  - **The API is the source of truth.** If this file and `/openapi.json` disagree, follow `/openapi.json` and fix this file.

**Keep it simple.** This is a school project: choose the most straightforward solution. No over-engineering, no extra abstractions, no new dependencies unless really needed.

## 2. Stack

Next.js (App Router) + TypeScript (strict) + Tailwind CSS. Source in `src/`, routes in `src/app/`.

## 3. Commands

```bash
npm run dev        # dev server
npm run lint       # must pass
npm run build      # must pass before finishing a task
```

## 4. Environment

`.env.local` (never committed; keep):

```
API_URL=https://drops-api-production.up.railway.app
```

Demo accounts for testing: `demo` / `drops2026` (any other first name, e.g. `lea`, has the same password: use a second account to test 403 cases).

## 5. Structure

```
src/
├── app/                        # Pages and layouts (routing)
│   ├── layout.tsx              # Root layout (navbar, auth provider)
│   ├── globals.css             # Tailwind
│   ├── page.tsx                # Home: list / map of drops, search, filters
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── drops/
│   │   ├── new/page.tsx        # Create a drop
│   │   └── [id]/
│   │       ├── page.tsx        # Drop details + comments
│   │       └── edit/page.tsx   # Edit my drop
│   ├── users/[username]/page.tsx   # Public profile + its drops
│   └── me/page.tsx             # My account (view / edit)
│
├── components/                 # Reusable UI (DropCard, DropForm, CommentList, LikeButton, Navbar, AuthProvider…)
│
├── api.ts                      # ALL calls to the REST API, in this one file
└── types.ts                    # Shared TypeScript types
```

### Rules

- **All API calls live in `src/api.ts`.** Pages and components import functions from it and never write `fetch(...)` to the API themselves.
- **All shared types live in `src/types.ts`.**
- A component used by a single page may stay next to that page; otherwise it goes in `src/components/`.
- One component per file, PascalCase file names (`DropCard.tsx`).
- Use the `@/` alias for imports (`@/components/DropCard`, `@/api`).
- Named exports for components and functions; default exports only where Next.js requires them (`page.tsx`, `layout.tsx`).
- There is no admin UI: `/admin/*` routes are for the teacher (see section 10).

## 6. API contract (v1.0.0)

Conventions:

- JSON only, **camelCase**, dates ISO 8601 UTC, **integer ids**.
- Auth: header `Authorization: Bearer <token>`. **The API sets no cookie.**
- **Strict bodies**: an unknown field gives `422`, and types are never converted (`"47.4"` is not a number: send real numbers for `lat`/`lng`).
- A token that is present but invalid, expired or revoked gives **`401` on every route, even public ones**.
- Every response has `Cache-Control: no-store` and an `X-Request-Id` header.
- Pagination: `?page=1` (≥ 1), `?pageSize=20` (1 to 50). A page beyond the end returns `200` with `items: []`.

### Routes

Access: **public**, **token?** (token optional: fills `likedByMe`, `isMine`…), **token** (required).

| Method & path | Access | Success | Notes |
|---|---|---|---|
| `POST /auth/register` | public | 201 `AuthResponse` | `409` if username/email taken |
| `POST /auth/login` | public | 200 `AuthResponse` | body `{ login, password }`, `login` = email **or** username |
| `POST /auth/logout` | token | 204 | revokes the token |
| `GET /auth/me` | token | 200 `PrivateUser` | |
| `PATCH /auth/me` | token | 200 `PrivateUser` | at least one of `displayName`, `bio`, `avatarUrl` |
| `GET /users/{username}` | token? | 200 `Profile` | username lowercase |
| `GET /categories` | public | 200 `CategoryItem[]` | not paginated |
| `GET /drops` | token? | 200 `Page<Drop>` | filters below; hidden drops excluded |
| `POST /drops` | token | 201 `Drop` | `Location` header = `/drops/{id}` |
| `GET /drops/{id}` | token? | 200 `Drop` | `404` if missing, or hidden and not yours |
| `PATCH /drops/{id}` | token | 200 `Drop` | author only (`403` otherwise) |
| `DELETE /drops/{id}` | token | 204 | author only |
| `POST`, `DELETE /drops/{id}/like` | token | 200 `LikeState` | idempotent; removes an opposite dislike |
| `POST`, `DELETE /drops/{id}/dislike` | token | 200 `LikeState` | idempotent; removes an opposite like |
| `GET /drops/{id}/comments` | token? | 200 `Page<Comment>` | oldest first |
| `POST /drops/{id}/comments` | token | 201 `Comment` | content 1 to 500 chars; optional root `parentId` |
| `GET /comments/{id}/replies` | token? | 200 `Page<Comment>` | root comments only; oldest first |
| `POST`, `DELETE /comments/{id}/like` | token | 200 `CommentReactionState` | idempotent |
| `POST`, `DELETE /comments/{id}/dislike` | token | 200 `CommentReactionState` | idempotent |
| `DELETE /comments/{id}` | token | 204 | comment author only |
| `POST /drops/{id}/report` | token | 202 `{ reported: true }` | `403` on your own drop |

`GET /drops` query params: `page`, `pageSize`, `q` (search in title, content and author username, accent-insensitive, max 100 chars), `category`, `author` (username), `sort` (`recent` default, or `popular`). A user's drops = `GET /drops?author=<username>`.

### Request bodies and limits

| Request | Fields |
|---|---|
| Register | `username` (3 to 20, `^[a-z0-9_]+$`; `admin` and `me` are reserved), `email` (max 254), `password` (8 to 72), `displayName` (1 to 40), `bio?` (≤ 280, nullable) |
| Login | `login`, `password`. Optional query `?ttl=<seconds>` (10 to 28800) for a short-lived token |
| Update account | `displayName?` (1 to 40), `bio?` (≤ 280, nullable), `avatarUrl?` (≤ 500, nullable) |
| Create drop | `title` (3 to 80), `content` (1 to 1000), `category`, `imageUrl?` (≤ 500, nullable), `lat` (-90..90), `lng` (-180..180) |
| Update drop | same fields, all optional, at least one. **`lat` and `lng` must be sent together** |
| Comment | `content` (1 to 500), `parentId?` (root comment ID) |
| Report | `reason` (`spam` \| `offensive` \| `personal_info` \| `other`), `details?` (≤ 300) |

Business rules:

- A drop of category **`photo` requires `imageUrl`**. There is no upload endpoint: the user provides an image URL.
- **Location**: there is no zone restriction. Latitude must be between -90 and 90 and longitude between -180 and 180. Coordinate errors are returned under **`location`** in `fields`.
- Username and email are lowercased by the API.
- Send only the fields that exist: extra fields cause a `422`.

### Errors

One format for every error (`fields` is always present, empty if not a field error):

```json
{ "error": { "status": 422, "code": "validation_failed", "message": "…", "fields": { "title": ["…"] }, "requestId": "req_…", "simulated": false } }
```

| Status | Codes |
|---|---|
| 400 | `bad_request` (unreadable JSON) |
| 401 | `unauthorized`, `invalid_token`, `token_expired`, `token_revoked`, `invalid_credentials` |
| 403 | `forbidden` |
| 404 | `not_found` |
| 409 | `conflict` |
| 422 | `validation_failed` (details in `fields`, key = body field or query param) |
| 429 | `rate_limited` (header `Retry-After`, seconds) |
| 500 | `internal_error` |
| 503 | `service_unavailable` |

### Testing tools (add to the URL while developing)

- `?delay=<ms>` (0 to 10000): slows any request, to test loading states.
- `?fail=<status>` (400, 401, 403, 404, 409, 422, 429, 500, 503): the request is **not executed** and a simulated error is returned (`simulated: true`, header `X-Simulated: true`). `fail=422` puts "Erreur simulée sur ce champ." under every body field. `fail=429` adds `Retry-After: 5`. Use it to test error UI.
- They can be combined: `?delay=2000&fail=500`.
- **Never commit code that leaves `?delay` or `?fail` in a real request.**

## 7. Types (`src/types.ts`)

```ts
export type Category = "note" | "photo" | "tip" | "riddle";
export type ReportReason = "spam" | "offensive" | "personal_info" | "other";

export interface PublicUser { id: number; username: string; displayName: string; avatarUrl: string | null }
export interface PrivateUser extends PublicUser { email: string; bio: string | null; createdAt: string }
export interface Profile extends PublicUser {
  bio: string | null;
  createdAt: string;
  stats: { dropsCount: number; likesReceived: number; commentsCount: number };
}

export interface Drop {
  id: number;
  title: string;
  content: string | null;
  category: Category;
  imageUrl: string | null;
  location: { lat: number; lng: number };
  hidden: boolean;                   // true only for the author of a hidden drop
  author: PublicUser;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  likedByMe: boolean;                // false without token
  dislikedByMe: boolean;             // false without token
  isMine: boolean;                   // false without token
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number; dropId: number; parentId: number | null; content: string;
  author: PublicUser; isMine: boolean; deleted: boolean; repliesCount: number;
  likesCount: number; dislikesCount: number; likedByMe: boolean;
  dislikedByMe: boolean; createdAt: string;
}
export interface CategoryItem { id: Category; label: string }   // label is French, e.g. "Une énigme"
export interface LikeState { liked: boolean; disliked: boolean; likesCount: number; dislikesCount: number }
export interface Page<T> { items: T[]; page: number; pageSize: number; total: number; totalPages: number }
export interface AuthResponse { user: PrivateUser; token: string; expiresAt: string }

export interface ApiErrorBody {
  error: {
    status: number; code: string; message: string;
    fields: Record<string, string[]>;
    requestId: string; simulated: boolean;
  };
}
```

Example drop (`GET /drops/{id}`):

```json
{
  "id": 42,
  "title": "Le banc le plus calme du coin",
  "content": "Derrière le bâtiment, à l'ombre. Idéal pour réviser.",
  "category": "tip",
  "imageUrl": null,
  "location": { "lat": 47.49561, "lng": 6.80544 },
  "hidden": false,
  "author": { "id": 3, "username": "lea", "displayName": "Léa", "avatarUrl": null },
  "likesCount": 4,
  "dislikesCount": 0,
  "commentsCount": 2,
  "likedByMe": false,
  "dislikedByMe": false,
  "isMine": false,
  "createdAt": "2026-11-16T09:12:00.000Z",
  "updatedAt": "2026-11-16T09:12:00.000Z"
}
```

### Field notes

- **IDs are numbers.** Route params are strings: convert with `Number(id)` and handle `NaN`.
- Location is nested: `drop.location.lat` / `drop.location.lng` when reading, but flat `lat` / `lng` when creating or updating.
- `imageUrl`, `avatarUrl`, `bio` and `content` can be `null`: always handle it and show a fallback.
- `isMine` decides whether to show edit/delete buttons. The API still enforces permissions.
- `hidden` is only `true` for the author viewing their own hidden drop (others get a 404). Show a clear "this drop is hidden" notice to the author.
- Display `author.displayName`; use `author.username` for links to `/users/{username}`.
- Format dates with `Intl.DateTimeFormat("fr-FR", ...)`.

## 8. API client (`src/api.ts`)

Keep one small helper that every function uses. It must:

1. Prefix paths with `API_URL`.
2. Send `Content-Type: application/json` when there is a body, and `Authorization: Bearer <token>` when a token is stored.
3. Handle `204` (no body, do not call `res.json()`).
4. On a non-2xx response, throw an `ApiError` carrying `status`, `code`, `message`, `fields`.

```ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields: Record<string, string[]> = {},
  ) { super(message); }
}
```

Every exported function is typed (parameters and return type). No `any`.

### Authentication

- Login/register return `{ user, token, expiresAt }`. Store the **token** (and optionally `expiresAt`) in `localStorage`. This is accepted here because the API is Bearer-only; it also means **auth-dependent data is fetched in the browser** (see section 9).
- Keep the logged-in user in a small `AuthProvider` context (in `src/components/`) loaded from `GET /auth/me` at startup.
- Logout: call `POST /auth/logout`, then remove the token whatever the result.
- **Any `401` means the session is over**: remove the token, update the auth state and send the user to `/login`. This also applies to public routes, because a stale token breaks them too.
- Protect pages that need a login (`/drops/new`, `/me`, edit page) by redirecting to `/login` when there is no user.

### Error handling by status

| Status | What the UI does |
|---|---|
| 401 | Clear session, go to `/login` |
| 403 | "Vous n'avez pas le droit d'effectuer cette action." |
| 404 | "Introuvable" page / message |
| 409 | Show the message and the conflicting field (`fields.username`, `fields.email`) |
| 422 | Show each message from `fields` next to the matching input (`location` errors near the map/coordinates) |
| 429 | Tell the user to wait `Retry-After` seconds |
| 5xx / network | Friendly message with a "Réessayer" button |

Never show raw stack traces. Use the API `message` (already in French) when it is user-friendly.

## 9. Next.js

- Because the token lives in `localStorage`, **pages that depend on the logged-in user must be Client Components** (`"use client"`) and call `src/api.ts` from `useEffect` or event handlers. This covers `likedByMe`, `isMine`, comments with delete buttons, `/me`, creation and edit forms.
- Truly public content that does not use the token (e.g. `GET /categories`) can be fetched in a Server Component.
- Always add loading, empty and error states.
- Use `next/link` for navigation. For `imageUrl` (arbitrary external hosts), use a plain `<img>` with `alt`, or configure `images.remotePatterns` first. Do not guess hostnames.
- Use `notFound()` or a clear "introuvable" message for 404s.
- The API already sends `Cache-Control: no-store`; do not add caching to API requests.

## 10. Features

- **Home**: paginated list of drops (`page`, `pageSize`) with search `q`, `category` filter and `sort` (`recent` / `popular`). Categories come from `GET /categories` (do not hardcode labels). Show a pager from `totalPages`.
- **Map / geolocation**: use `navigator.geolocation` in a client component. Handle denied permission, timeout and unavailable with a clear message; the app must still work (fallback: drops list, or a default point near the MMI department). Ask for permission after a user action, not silently.
- **Create drop**: form with title, content, category, optional image URL (required for `photo`) and a position. Validate the obvious rules client-side (lengths, `photo` needs `imageUrl`), but always display the API `fields` errors. Send `lat` and `lng` as **numbers**. There is no geographic zone restriction.
- **Edit drop**: only for `isMine`. Send only changed fields, and `lat`+`lng` together.
- **Delete drop / comment**: ask for confirmation. Drop: author only. Comment: author only.
- **Reactions**: one like or dislike per user on a drop or comment; choosing one removes the other. All reaction routes are idempotent.
- **Comments**: paginated, oldest first, 1 to 500 chars. Support one-level replies using the root comment ID as `parentId`; a reply to a reply attaches to the root. A deleted root with replies remains as an anonymized trace until its last reply is removed.
- **Report**: logged-in users only, never on their own drop (the API returns 403). Ask a reason (`spam`, `offensive`, `personal_info`, `other`) and optional details (≤ 300), then confirm with a message ("Merci, signalement envoyé").
- **Profile** (`/users/[username]`): `Profile` info and stats, plus their drops via `GET /drops?author=<username>`.
- **My account** (`/me`): show `PrivateUser`; edit `displayName`, `bio`, `avatarUrl`. Username and email cannot be changed.
- **Admin / teacher routes** (`POST /admin/reset`, `GET /admin/reports`, `POST /admin/drops/{id}/unhide`, `DELETE /drops/{id}` with admin key): they need the secret header `X-Admin-Key` and are **for the teacher only**. Do **not** build UI for them, never hardcode or commit the key, and never call `/admin/reset` unless the user explicitly asks.
- **User content** (titles, comments, names, bios) is text only. Never use `dangerouslySetInnerHTML`.

## 11. Code style

- TypeScript `strict`. No `any`, no `@ts-ignore`.
- Tailwind only, mobile-first (`sm:`, `md:` for larger screens). No inline styles, no extra CSS files.
- Small components, descriptive names. Comments explain *why*, not *what*.
- Remove unused code and `console.log` before finishing.
- Keep changes small and focused on the task. No unrequested refactors.

## 12. UX

- UI text is in **French**.
- Every page handles loading, empty and error states.
- Forms disable the submit button while sending and show per-field errors from the API.
- Semantic HTML (`button`, `nav`, `main`, `form`, `label`), `alt` on images, `aria-label` on icon-only buttons, visible focus.

## 13. Security

- Never commit `.env.local*` files or any key/token.
- Do not log tokens or passwords.
- Hiding a button is not security: the API is the authority (it answers 401/403 anyway).

## 14. Workflow

1. Read the relevant code and `/openapi.json` (or `/contract.md`) before writing.
2. Reuse existing components and types before creating new ones.
3. Implement in small steps.
4. Run `npm run lint` and `npm run build`.
5. Summarize what changed and anything you assumed.

**Ask before**: adding a dependency, changing the structure, changing how authentication/token storage works, assuming an API behaviour that is not in the contract, or calling any admin route.

**Never**: call the API outside `src/api.ts`, use `any`, invent endpoints or fields (including an "open drop" action), send unknown fields in a body, send `lat`/`lng` as strings, render user content as HTML, commit `?fail=` / `?delay=` leftovers.
