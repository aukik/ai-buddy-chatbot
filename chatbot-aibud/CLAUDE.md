# Claude Agent Working Guidelines

## ⚠️ Start Here: Read Context Files First

Before starting any task, Claude must read all project context documentation **in full**:

1. **Project Overview / Architecture Docs** - Understand the system structure
2. **Technical Reference Docs** - Detailed component breakdowns
3. **README.md** - High-level usage and goals

This ensures you have full context before implementing features or fixing bugs.

---

## Core Principles

### 1. Always Use Context7 MCP for Documentation
- **MANDATORY**: Use Context7 MCP to get up-to-date documentation for every library/framework used
- **DO NOT SKIP**: This step is critical to ensure we're using the latest APIs and best practices
- Before implementing any feature that uses external libraries, first query Context7 for:
  - Latest API documentation
  - Code examples and patterns
  - Best practices and conventions
  - Version-specific features

### 2. Ask Questions Strategically (Not Always)
- **Philosophy**: "Show, don't ask" for straightforward implementations. Ask questions only for genuinely ambiguous or high-stakes decisions.

**When to Ask**:
- Requirements are unclear or ambiguous
- Multiple valid implementation approaches exist
- High-risk decisions that would require significant rework if wrong
- User's intent needs clarification
- Changes might affect existing functionality

**When NOT to Ask**:
- Requirements are explicit and unambiguous
- Standard patterns apply (e.g., "add error handling" → just add it)
- Easy to iterate/fix later (build first, adjust if wrong)
- User can easily course-correct by seeing the code
- Reversible decisions with reasonable defaults

### 3. Keep Code Lean and Simple
- **Avoid Over-Engineering**: Write only what's needed
- **No Unnecessary Code**: Don't add features that aren't requested
- **KISS Principle**: Keep It Simple, Stupid
- **YAGNI Principle**: You Aren't Gonna Need It

**Examples of Over-Engineering to Avoid**:
- Adding complex error handling for simple operations
- Creating abstractions before they're needed
- Implementing features "for future use"
- Adding dependencies when simple code would suffice

### 4. Break Tasks into Smaller Chunks
- **Task Management**: Break large tasks into smaller, manageable pieces
- **Execute Incrementally**: Complete one sub-task at a time
- **Validate Progress**: Test each sub-task before moving to the next
- **Track Progress**: Mark tasks as completed only when fully verified

### 5. Prioritize Functionality and Iteration Speed Over Upfront Perfection
- **Core Philosophy**: Get working code fast, then iterate based on feedback

**First Pass Priority**:
1. Make it work (functionality first)
2. Make it right (iterate based on feedback)
3. Make it fast (optimize only if needed)

**Iteration-First Approach**:
- ✅ Build minimal working version quickly
- ✅ Ship working code and iterate based on user feedback
- ✅ Add reasonable defaults for common patterns
- ✅ Show progress early and often
- ❌ Over-plan before writing code
- ❌ Build comprehensive solutions for edge cases that may never occur
- ❌ Wait for perfect understanding before starting

**Autonomous Decision-Making for Standard Patterns**:
When standard solutions exist, apply them without asking:
- **Error Handling**: Use try-catch with meaningful error messages
- **Configuration**: Default to environment variables for secrets/API keys
- **Validation**: Add basic input validation by default
- **Logging**: Add console logs for debugging (can be removed later)
- **Code Structure**: Create helper functions when logic exceeds ~20 lines
- **Async Operations**: Use async/await for API calls and I/O operations

---

## Code Quality Standards

### Code Comments
- **Be Verbose**: Comments should be detailed and explanatory
- **Explain Reasoning**: Focus on WHY decisions were made, not WHAT the code does
- **Document Decisions**: Explain alternatives considered and why this approach was chosen

**Good Comment Examples**:
```javascript
// ✅ GOOD: Explains reasoning and context
// Using regex instead of string methods because the API sometimes returns
// data wrapped in inconsistent formatting. Tried indexOf() first but it
// failed when there were multiple matches.
const cleaned = rawOutput.replace(/pattern/g, '');

// ✅ GOOD: Documents decision-making
// Defaulting to 30s timeout because:
// 1. API typically responds in 5-10s
// 2. Long-running queries can take up to 25s
// 3. Matches server-side timeout configuration
const DEFAULT_TIMEOUT = 30000;
```

**Bad Comment Examples**:
```javascript
// ❌ BAD: States the obvious
// Remove pattern
const cleaned = rawOutput.replace(/pattern/g, '');

// ❌ BAD: No reasoning
// Set timeout
const DEFAULT_TIMEOUT = 30000;
```

**Comment Structure for Complex Sections**:
```javascript
/**
 * [What this section does - one line summary]
 *
 * Context: [Why this exists, what problem it solves]
 * Approach: [Why this approach was chosen over alternatives]
 * Trade-offs: [What was sacrificed, what was gained]
 * Future: [Known limitations or potential improvements]
 */
```

### Documentation Philosophy
- **Primary Reference**: Code comments and documentation within source files
- **Comments in code should be the primary source of truth** - they live with the code and stay in sync
- **NO STANDALONE DOCUMENTATION FILES** for things that belong in code comments

**Documentation Priority Order**:
1. Source code comments (JSDoc, function explanations) - **PRIMARY**
2. README.md (high-level usage and overview)
3. CLAUDE.md (working guidelines)

**Forbidden Documentation Files** (DO NOT CREATE):
- ❌ REFACTORING_SUMMARY.md - Put module descriptions in header comments
- ❌ Any *_SUMMARY.md, *_GUIDE.md files - Use code comments
- ❌ Process/workflow documentation separate from CLAUDE.md
- ❌ Junk context files that describe what you did (these become stale immediately)

### 🚫 CRITICAL: No Junk Context Documents

**DO NOT CREATE** process documentation, refinement reports, or analysis markdown files that:
- Describe what you did (outdated immediately)
- Explain reasoning for changes (belongs in code comments)
- Document testing processes (use structured logs if needed)
- Create "summaries" or "guides" (add comments to actual code instead)

**Why**: These documents become stale instantly, duplicate info that should be in code, and clutter the project.

**What to do instead**:
1. Add detailed comments directly in the code being modified
2. Use existing files (CLAUDE.md, README.md) for documentation
3. Track testing/refinement in structured logs (JSON) if needed

---

## Testing Standards

### Test File Organization
- **ALL test files MUST be in `/tests` folder** - NO EXCEPTIONS
- **DO NOT create test files in root directory**
- Use consistent naming: `test-{feature}.js` or `{feature}.test.js`

### Testing Strategy
- Test with realistic inputs and parameters
- Validate edge cases only when relevant
- Use default/production values in tests, not arbitrary ones
- All tests must pass before shipping

---

## Error Handling

### When Things Go Wrong
1. **Identify the Issue**: Clearly state what went wrong
2. **Ask for Help**: If stuck, ask user for guidance
3. **Propose Solutions**: Suggest 2-3 potential fixes
4. **Implement Fix**: After user approval, implement the solution
5. **Verify Resolution**: Test to ensure issue is resolved

---

## Communication Style

### With Users
- Be clear and concise
- Explain technical decisions in simple terms
- Acknowledge uncertainties and limitations
- Provide progress updates for long-running tasks

### In Code
- Use descriptive function and variable names
- Add JSDoc comments for public APIs
- Keep code comments focused on "why" not "what"

---

## Workflow Summary

```
START OF SESSION:
1. 🔍 READ all project context/architecture docs
2. ✓ YOU NOW HAVE FULL CONTEXT - Ready to work

FOR EACH TASK:
3. 📝 Read and understand user request
4. 📚 Check source code comments for implementation details
5. 🔗 Use Context7 MCP for external library documentation
6. ❓ Ask clarifying questions ONLY if genuinely uncertain
7. 🎯 Break task into smaller sub-tasks
8. 💻 Implement minimal working version quickly
9. 🧪 Test with real inputs and validate
10. 🔄 Iterate based on user feedback
11. 📝 Update code comments if needed
```

---

## Key Reminders

- **Velocity with iteration beats slow perfection**
- **Build working code fast, get feedback, improve based on actual needs**
- **Ask questions only when truly uncertain - otherwise, show your work and iterate**
- **Always start sessions by reading project context documentation**
- **Comments explain WHY, not WHAT**
- **No junk documentation files - put it in code comments**
