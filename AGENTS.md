# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Project Biome Overrides

The `biome.jsonc` in this project overrides several Ultracite defaults. **All code must comply with these overrides.**

### Formatting Overrides

| Rule | Ultracite Default | Project Override | What it means |
|------|------------------|-----------------|---------------|
| `javascript.formatter.quoteStyle` | `"double"` | **`"single"`** | Use single quotes (`'`) in `.ts` / `.vue` |
| `formatter.attributePosition` (all) | `"auto"` | **`"multiline"`** | Attributes go on separate lines when multiple |
| `html.formatter.indentScriptAndStyle` | `true` | **`false`** | Do NOT indent `<script>` / `<style>` block contents |
| `json.formatter.indentWidth` | `2` | **`4`** | JSON files use 4-space indentation |

### Linting Overrides (Rules Turned OFF)

The following Ultracite `"error"` rules are **disabled** in this project:

| Rule | Effect |
|------|--------|
| `complexity.noForEach` | ✅ `.forEach()` is **allowed** |
| `performance.noBarrelFile` | ✅ Barrel files (`index.ts` re-exports) are **allowed** |
| `style.noParameterProperties` | ✅ TypeScript parameter properties are **allowed** |
| `style.useConsistentTypeDefinitions` | ✅ Both `type` and `interface` are acceptable |
| `style.useFilenamingConvention` | ✅ No file naming convention enforced |
| `a11y.noSvgWithoutTitle` | ✅ SVGs without `<title>` are allowed |
| `a11y.useAnchorContent` | ✅ Empty anchors are allowed |
| `a11y.useAltText` | ✅ Images without `alt` are allowed |
| `assist.source.useSortedInterfaceMembers` | ✅ Interface member auto-sorting is off |

### Linting Overrides (Rules Tightened)

| Rule | Ultracite Default | Project Override | Effect |
|------|------------------|-----------------|--------|
| `suspicious.noConsole` | `"off"` | **`"error"`** | ❌ `console.log` is **forbidden** in app code |

### Vue-Specific Overrides

| Rule | Effect |
|------|--------|
| `correctness.noUndeclaredVariables` | `"off"` — `vue-tsc` handles this |
| `correctness.noUnknownPseudoClass` | `"error"` with `:deep` ignored — Vue's `:deep()` combinator is whitelisted |

### Config File Overrides (`*.config.ts`, `*.config.js`)

| Rule | Effect |
|------|--------|
| `performance.useTopLevelRegex` | `"off"` — Regex inside functions is fine |
| `suspicious.noConsole` | `"off"` — `console.log` allowed in config files |

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names
- Both `type` and `interface` are acceptable (Biome rule is off)

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Both `for...of` and `.forEach()` are acceptable (Biome `noForEach` is off)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`
- Use single quotes (`'`), not double quotes — enforced by Biome formatter

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- ❌ `console.log` is **forbidden** in application code (Biome `noConsole: error`). Remove or use a proper logger.
- `debugger` and `alert` are also forbidden (enforced by Biome).
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Barrel files are allowed (Biome `noBarrelFile` is off), but use them judiciously
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.
